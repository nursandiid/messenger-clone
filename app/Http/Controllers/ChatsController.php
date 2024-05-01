<?php

namespace App\Http\Controllers;

use App\Models\ArchivedChat;
use App\Models\ChatContact;
use App\Models\ChatGroup;
use App\Models\ChatMessage;
use App\Models\ChatMessageColor;
use App\Models\User;
use App\Traits\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChatsController extends Controller
{
    use Chat;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            return Inertia::render('chats/Index', [
                'chats' => fn () => $this->chats()
            ]);
        } catch (\Exception $e) {
            return back()->with([
                'error_msg' => $e->getMessage()
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $user = User::find($id);
            $group = ChatGroup::find($id);

            if (!$user && !$group) {
                throw new \Exception('User or group not found');
            }

            if ($user) {
                $user->is_contact_saved = auth()->user()->is_contact_saved($id);
                $user->is_contact_blocked = auth()->user()->is_contact_blocked($id);
                $user->chat_type = ChatMessage::CHAT_TYPE;
            } else if ($group) {
                $user = $group;
                $user->creator = $group->creator;
                $user->chat_type = ChatMessage::CHAT_GROUP_TYPE;
                $user->members_count = $group->group_members->count();
            }

            $user->message_color = auth()->user()->message_color($id);

            return Inertia::render('chats/Show', [
                'user' => fn () => $user,
                'chats' => fn () => $this->chats(),
                'messages' => fn () => $this->messages($id),
                'media' => fn () => $this->media($id),
                'files' => fn () => $this->files($id),
                'links' => fn () => $this->links($id),
            ]);
        } catch (\Exception $e) {
            return back()->with([
                'error_msg' => $e->getMessage()
            ]);
        }
    }

    public function loadChats() 
    {
        try {
            $chats = $this->chats();

            return $this->ok($chats);
        } catch (\Exception $e) {
            return $this->oops($e->getMessage());
        }
    }

    public function loadNotification() 
    {
        try {
            $notificationCount = $this->notificationCount();

            return $this->ok(['notification_count' => $notificationCount]);
        } catch (\Exception $e) {
            return $this->oops($e->getMessage());
        }
    }

    public function loadMessages(string $id) 
    {
        try {
            $messages = $this->messages($id);

            return $this->ok($messages);
        } catch (\Exception $e) {
            return $this->oops($e->getMessage());
        }
    }

    public function loadMedia(string $id) 
    {
        try {
            $media = $this->media($id);

            return $this->ok($media);
        } catch (\Exception $e) {
            return $this->oops($e->getMessage());
        }
    }

    public function loadFiles(string $id) 
    {
        try {
            $files = $this->files($id);

            return $this->ok($files);
        } catch (\Exception $e) {
            return $this->oops($e->getMessage());
        }
    }

    public function loadLinks(string $id) 
    {
        try {
            $links = $this->links($id);

            return $this->ok($links);
        } catch (\Exception $e) {
            return $this->oops($e->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $attachments = [];
            if ($request->hasFile('attachments')) {
                /**
                 * @var \Illuminate\Http\UploadedFile $attachment
                 */
                foreach ($request->file('attachments') as $attachment) {
                    $extension = $attachment->getClientOriginalExtension();
                    $fileName = \Str::uuid() . '.' . $extension;

                    array_push($attachments, [
                        'original_name' => $attachment->getClientOriginalName(),
                        'file_name' => $fileName,
                        'file_path' => '/storage/chats/' . auth()->id(),
                        'file_size' => $attachment->getSize(),
                        'file_type' => in_array($extension, $this->validImageExtensions) ? 'media' : 'files',
                        'sent_by_id' => auth()->id()
                    ]);

                    Storage::disk('public')->putFileAs('/chats/'. auth()->id(), $attachment, $fileName);
                }
            }

            $blockedUser = ChatContact::where('user_id', $request->to_id)
                ->where('contact_id', auth()->id())
                ->first();

            /**
             * @var ChatMessage $chat
             */
            $chat = ChatMessage::create([
                'from_id' => auth()->id(),
                'to_id' => $request->to_id,
                'to_type' => User::find($request->to_id) ? User::class : ChatGroup::class,
                'body' => $request->filled('body') ? markdown_template(htmlspecialchars($request->body)) : null,
                'deleted_in_id' => $blockedUser?->is_contact_blocked ? json_encode([['id' => $blockedUser->user_id]]) : null
            ]);

            $chat->attachments()->createMany($attachments);

            $links = [];
            $result = preg_match_all($this->linkPattern, $chat->body, $matches);
            if ($result > 0) {
                $links[] = $matches[0];
            }

            $chat->attachments = $chat->attachments;
            $chat->links = $links;

            $from = auth()->user();
            if ($chat->to instanceof User) {
                $to = User::find($request->to_id);

                if (!$blockedUser || !$blockedUser->is_contact_blocked) {
                    event(new \App\Events\SendMessage($from, $to, $chat));
                }
            } else {
                // TODO: send notification to group members
                $memberIds = $chat->to->group_members()
                    ->whereNot('member_id', auth()->id())
                    ->pluck('member_id')
                    ->toArray();
                $toMembers = User::whereIn('id', $memberIds)->get();

                foreach ($toMembers as $to) {
                    event(new \App\Events\SendMessage($from, $to, $chat));
                }

                event(new \App\Events\SendGroupMessage($request->to_id, $chat));
            }

            DB::commit();

            return $this->ok(data: $chat, code: 201);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return $this->oops($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $messageId)
    {
        DB::beginTransaction();
        try {
            $chat = ChatMessage::find($messageId);
            if (!$chat) {
                throw new \Exception('Chat not found');
            }

            $deletedInId = collect(json_decode($chat->deleted_in_id) ?? []);
            if ($chat->to instanceof User && $deletedInId->count() > 0) {
                $chat->delete();

                foreach ($chat->attachments as $attachment) {
                    $filePath = $attachment->file_path . DIRECTORY_SEPARATOR . $attachment->file_name;
                    remove_file($filePath);
                }
            } else {
                $chat->update([
                    'deleted_in_id' => json_encode($deletedInId->push(['id' => auth()->id()])->toArray())
                ]);

                foreach ($chat->attachments as $attachment) {
                    $deletedAttachmentInId = collect(json_decode($attachment->deleted_in_id) ?? []);
                    $attachment->update([
                        'deleted_in_id' => json_encode($deletedAttachmentInId->push(['id' => auth()->id()])->toArray())
                    ]);
                }
            }
    
            DB::commit();

            return $this->ok(code: 204);
        } catch (\Exception $e) {
            DB::rollBack();

            return $this->oops($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function deleteSelectedFile(string $messageId, string $fileName)
    {
        DB::beginTransaction();
        try {
            $chat = ChatMessage::find($messageId);
            if (!$chat) {
                throw new \Exception('Chat not found');
            }

            $attachment = $chat->attachments->where('file_name', $fileName)->first();
            if ($attachment) {
                $deletedAttachmentInId = collect(json_decode($attachment->deleted_in_id) ?? []);
                $attachment->update([
                    'deleted_in_id' => json_encode($deletedAttachmentInId->push(['id' => auth()->id()])->toArray())
                ]);
            }
    
            DB::commit();

            return $this->ok(code: 204);
        } catch (\Exception $e) {
            DB::rollBack();

            return $this->oops($e->getMessage());
        }
    }

    public function destroyAll(string $id)
    {
        DB::beginTransaction();
        try {
            ChatMessage::forUserOrGroup($id)
                ->get()
                ->each(function ($chat) {
                    $deletedInId = collect(json_decode($chat->deleted_in_id) ?? []);

                    if ($chat->to instanceof User && $deletedInId->count() > 0) {
                        $chat->delete();
        
                        foreach ($chat->attachments as $attachment) {
                            $filePath = $attachment->file_path . DIRECTORY_SEPARATOR . $attachment->file_name;
                            remove_file($filePath);
                        }
                    } else {
                        $chat->update([
                            'deleted_in_id' => json_encode($deletedInId->push(['id' => auth()->id()])->toArray())
                        ]);
        
                        foreach ($chat->attachments as $attachment) {
                            $deletedAttachmentInId = collect(json_decode($attachment->deleted_in_id) ?? []);
                            $attachment->update([
                                'deleted_in_id' => json_encode($deletedAttachmentInId->push(['id' => auth()->id()])->toArray())
                            ]);
                        }
                    }
                });
    
            DB::commit();

            return $this->ok(code: 204);
        } catch (\Exception $e) {
            DB::rollBack();

            return $this->oops($e->getMessage());
        }
    }

    public function markAsRead(string $id) 
    {
        DB::beginTransaction();
        try {
            ChatMessage::forUserOrGroup($id)
                ->notSeen()
                ->select('id', 'seen_in_id')
                ->get()
                ->each(function ($chat) {
                    $seenInId = collect(json_decode($chat->seen_in_id));
                    $seenInId = json_encode($seenInId->push(['id' => auth()->id(), 'seen_at' => now()])->toArray());

                    $chat->update([
                        'seen_in_id' => $seenInId
                    ]);
                });

            $latestMessage = ChatMessage::forUserOrGroup($id)
                ->latest()
                ->first();

            DB::commit();

            return $this->ok($latestMessage);
        } catch (\Exception $e) {
            DB::rollBack();

            return $this->oops($e->getMessage());
        }
    }

    public function markAsUnread(string $id) 
    {
        DB::beginTransaction();
        try {
            $latestMessage = ChatMessage::forUserOrGroup($id)
                ->deletedInIds()
                ->latest()
                ->first();

            $seenInId = collect(json_decode($latestMessage->seen_in_id))
                ->filter(fn ($item) => $item->id !== auth()->id())
                ->toArray();
            $seenInId = json_encode($seenInId);

            $latestMessage->update([
                'seen_in_id' => $seenInId
            ]);

            DB::commit();

            return $this->ok($latestMessage);
        } catch (\Exception $e) {
            DB::rollBack();

            return $this->oops($e->getMessage());
        }
    }

    public function archiveChat(string $id) 
    {
        DB::beginTransaction();
        try {
            $chat = ChatMessage::forUserOrGroup($id)
                ->latest()
                ->first();

            if (!$chat) {
                throw new \Exception('Chat not found');
            }

            ArchivedChat::create([
                'from_id' => $id,
                'from_type' => User::find($id) ? User::class : ChatGroup::class,
                'archived_by' => auth()->id()
            ]);

            DB::commit();

            return $this->ok($chat);
        } catch (\Exception $e) {
            DB::rollBack();

            return $this->oops($e->getMessage());
        }
    }

    public function unarchiveChat(string $id) 
    {
        DB::beginTransaction();
        try {
            $archivedChat = ArchivedChat::where('from_id', $id)
                ->where('archived_by', auth()->id())
                ->first();

            if (!$archivedChat) {
                throw new \Exception('Archived chat not found');
            }

            $archivedChat->delete();

            DB::commit();

            return $this->ok($archivedChat);
        } catch (\Exception $e) {
            DB::rollBack();

            return $this->oops($e->getMessage());
        }
    }

    public function customizeChat(Request $request, string $id) 
    {
        DB::beginTransaction();
        try {
            $chat = ChatMessageColor::where('from_id', auth()->id())
                ->where('to_id', $id)
                ->first();

            if (!$chat) {
                ChatMessageColor::create([
                    'from_id' => auth()->id(),
                    'to_id' => $id,
                    'to_type' => User::find($id) ? User::class : ChatGroup::class,
                    'message_color' => $request->message_color
                ]);
            } else {
                $chat->update($request->only('message_color'));
            }

            DB::commit();

            return $this->ok($chat);
        } catch (\Exception $e) {
            DB::rollBack();

            return $this->oops($e->getMessage());
        }
    }
}
