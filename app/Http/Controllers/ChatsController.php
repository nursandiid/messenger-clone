<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
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
            $chats = $this->chats();

            return Inertia::render('chats/Index', [
                'chats' => $chats
            ]);
        } catch (\Exception $e) {
            dd($e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $user = User::find($id);
            if (!$user) {
                throw new \Exception('User not found');
            }

            $user->chat_type = ChatMessage::CHAT_TYPE;

            $chats = $this->chats();

            return Inertia::render('chats/Show', [
                'user' => $user,
                'chats' => $chats,
                'messages' => $this->messages($id)
            ]);
        } catch (\Exception $e) {
            dd($e->getMessage());
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

    public function loadMessages(string $id) 
    {
        try {
            $messages = $this->messages($id);

            return $this->ok($messages);
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

            /**
             * @var ChatMessage $chat
             */
            $chat = ChatMessage::create([
                'from_id' => auth()->id(),
                'to_id' => $request->to_id,
                'to_type' => User::class,
                'body' => $request->body
            ]);

            $chat->attachments()->createMany($attachments);

            $chat->attachments = $chat->attachments;

            DB::commit();

            return $this->ok(data: $chat, code: 201);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return $this->oops($e->getMessage());
        }
    }
}
