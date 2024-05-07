<?php

namespace App\Traits;

use App\Models\ChatContact;
use App\Models\ChatGroup;
use App\Models\ChatMessage;
use App\Models\ChatMessageFile;
use App\Models\GroupMember;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;

trait Chat
{
    protected $validImageExtensions = ["jpg", "jpeg", "png", "gif", "svg", "bmp", "webp"];
    protected $linkPattern = "/(https?:\/\/[^\s]+)/";

    public function chats() 
    {
        $group = GroupMember::where('member_id', auth()->id())
            ->select('member_id', 'group_id')
            ->groupBy('member_id', 'group_id');

        if (request()->filled('query')) {
            $chatGroup = ChatGroup::joinSub($group, 'g', function (JoinClause $join) {
                    $join->on('chat_groups.id', 'g.group_id');
                })
                ->where('name', 'LIKE', '%'. request('query') .'%')
                ->select('id', 'name', 'avatar', 'member_id');

            $contacts = ChatContact::where('user_id', auth()->id())
                ->select('contact_id', 'is_contact_blocked')
                ->groupBy('contact_id', 'is_contact_blocked');

            $chats = User::leftJoinSub($chatGroup, 'cg', function (JoinClause $join) {
                    $join->on('cg.member_id', 'users.id')  ;
                })
                ->leftJoinSub($contacts, 'c', function (JoinClause $join) {
                    $join->on('c.contact_id', 'users.id');
                })
                ->where('users.name', 'LIKE', '%'. request('query') .'%')
                ->orWhere('cg.name', 'LIKE', '%'. request('query') .'%')
                ->selectRaw('
                    IFNULL (cg.id, users.id) as id,
                    IFNULL (cg.name, users.name) as name,
                    IFNULL (cg.avatar, users.avatar) as avatar,
                    NULL as message_id,
                    NULL as body,
                    1 as is_read,
                    0 as is_reply,
                    IF (cg.id IS NULL AND users.is_online = 1 AND users.active_status = 1, 1, 0) as is_online,
                    IF (cg.id IS NULL, active_status, 0) as active_status,
                    c.is_contact_blocked,
                    NULL as created_at,
                    ? as chat_type
                ', 
                [ChatMessage::CHAT_TYPE])
                ->paginate(15)
                ->withQueryString()
                ->setPath(route('chats.users'));
        } else {
            $latestMessage = $this->latestMessageForEachChat($group);

            $chats = ChatMessage::with('another_user', 'to', 'from', 'attachments')
                ->joinSub($latestMessage, 'lm', function (JoinClause $join) {
                    $join->on('chat_messages.sort_id', 'lm.sort_id')
                         ->on(function (JoinClause $join) {
                            $join->on('chat_messages.from_id', 'lm.another_user_id')
                                 ->orOn('chat_messages.to_id', 'lm.another_user_id');
                         });
                })
                ->leftJoin('archived_chats as ac', function (JoinClause $join) {
                    $join->on('ac.from_id', 'lm.another_user_id')
                         ->where('ac.archived_by', auth()->id());
                })
                ->when(request()->filled('archived_chats'), 
                    fn ($query) => $query->whereNotNull('ac.id'),
                    fn ($query) => $query->whereNull('ac.id')
                )
                ->select('chat_messages.*', 'lm.another_user_id')
                ->orderByDesc('sort_id')
                ->paginate(15)
                ->setPath(route('chats.users'));

            foreach ($chats as $key => $chat) {
                $from = $chat->from_id === auth()->id() ? 'You: ' : '';
                $attachment = '';
                if (!$chat->body && $chat->attachments) {
                    $fileName = $chat->attachments->first()?->original_name;
                    if (in_array(pathinfo($fileName, PATHINFO_EXTENSION), $this->validImageExtensions)) {
                        $attachment = '<div class="flex items-center gap-1">'. $from . ChatMessage::SVG_IMAGE_ATTACHMENT .' Photo</div>';
                    } else {
                        $attachment = '<div class="flex items-center gap-1">'. $from . ChatMessage::SVG_FILE_ATTACHMENT .' File</div>';
                    }
                }

                $mapped = new \stdClass;
                $seenInId = collect(json_decode($chat->seen_in_id));

                if ($chat->to instanceof User) {
                    $mapped->id = $chat->another_user->id;
                    $mapped->name = $chat->another_user->name . ($chat->another_user->id === auth()->id() ? ' (You)' : '');
                    $mapped->avatar = $chat->another_user->avatar;
                    $mapped->from_id = $chat->from_id;
                    $mapped->is_read = $seenInId->filter(fn ($item) => $item->id === auth()->id())->count() > 0;
                    $mapped->is_reply = $chat->another_user->id === $chat->from_id;
                    $mapped->is_online = $chat->another_user->is_online == true;
                    $mapped->is_contact_blocked = auth()->user()->is_contact_blocked($chat->another_user->id);
                    $mapped->chat_type = ChatMessage::CHAT_TYPE;
                    $mapped->created_at = $chat->created_at;

                    $mapped->body = $chat->body
                    ? $from . \Str::limit(strip_tags($chat->body), 100)
                    : $attachment;
                } else {
                    $mapped->id = $chat->to->id;
                    $mapped->name = $chat->to->name;
                    $mapped->avatar = $chat->to->avatar;
                    $mapped->from_id = $chat->from_id;
                    $mapped->is_read = $seenInId->filter(fn ($item) => $item->id === auth()->id())->count() > 0;
                    $mapped->is_reply = $chat->from_id !== auth()->id();
                    $mapped->is_online = false;
                    $mapped->is_contact_blocked = false;
                    $mapped->chat_type = ChatMessage::CHAT_GROUP_TYPE;
                    $mapped->created_at = $chat->created_at;

                    if (str_contains($chat->body, 'created group "'. $chat->to->name .'"') && $chat->to->creator_id !== auth()->id()) {
                        $mapped->body = 'You: invited by ' . $chat->to?->creator?->name;
                    } else {
                        $mapped->body = $chat->body
                        ? $from . \Str::limit(strip_tags($chat->body), 100)
                        : $attachment;
                    }
                }

                $chats[$key] = $mapped;
            }
        }

        return $chats;
    }

    public function latestMessageForEachChat($group) 
    {
        $latestMessage = ChatMessage::leftJoinSub($group, 'g', function (JoinClause $join) {
                $join->on('chat_messages.to_id', 'g.group_id');
            })
            ->where(function (Builder $query) use ($group) {
                $query->where(function (Builder $query) {
                        $query->where('from_id', auth()->id())
                              ->whereNot('to_id', auth()->id());
                    })
                    ->orWhere(function (Builder $query) {
                        $query->where('to_id', auth()->id())
                              ->whereNot('from_id', auth()->id());
                    })
                    ->orWhere(function (Builder $query) { // chat to self
                        $query->where('from_id', auth()->id())
                              ->where('to_id', auth()->id());
                    })
                    ->orWhereIn('to_id', $group->pluck('group_id')->toArray()); // chat to group
            })
            ->deletedInIds()
            ->selectRaw("
                MAX(sort_id) as sort_id,
                CASE
                    WHEN g.group_id IS NOT NULL THEN chat_messages.to_id
                    WHEN from_id = '". auth()->id() ."' THEN to_id
                    ELSE from_id
                END as another_user_id
            ")
            ->groupBy('another_user_id');

        return $latestMessage;
    }

    public function notificationCount() 
    {
        if (!auth()->check()) return 0;

        $group = GroupMember::where('member_id', auth()->id())
            ->select('member_id', 'group_id')
            ->groupBy('member_id', 'group_id');

        $latestMessage = $this->latestMessageForEachChat($group);

        $chats = ChatMessage::with('another_user', 'to', 'from', 'attachments')
            ->joinSub($latestMessage, 'lm', function (JoinClause $join) {
                $join->on('chat_messages.sort_id', 'lm.sort_id')
                     ->on(function (JoinClause $join) {
                            $join->on('chat_messages.from_id', 'lm.another_user_id')
                                 ->orOn('chat_messages.to_id', 'lm.another_user_id');
                     });
            })
            ->leftJoin('archived_chats as ac', function (JoinClause $join) {
                 $join->on('ac.from_id', 'lm.another_user_id')
                      ->where('ac.archived_by', auth()->id());
            })
            ->where(function (Builder $query) use ($group) {
                $query->where('chat_messages.from_id', auth()->id())
                      ->orWhere('chat_messages.to_id', auth()->id())
                      ->orWhereIn('to_id', $group->pluck('group_id')->toArray());
            })
            ->notSeen()
            ->whereNull('ac.id')
            ->select('1')
            ->count();
            
        return $chats;
    }

    public function messages(string $id) 
    {
        $chats = ChatMessage::with([
                'from',
                'to',
                'attachments' => fn ($query) => $query->with('sent_by')->deletedInIds()
            ])
            ->forUserOrGroup($id)
            ->deletedInIds()
            ->selectRaw('
                id, 
                from_id, 
                to_id, 
                to_type, 
                IF (to_type = ?, ?, ?) as chat_type, 
                body, 
                seen_in_id, 
                sort_id, 
                created_at', 
                [
                    User::class,
                    ChatMessage::CHAT_TYPE,
                    ChatMessage::CHAT_GROUP_TYPE
                ]
            )
            ->orderByDesc('sort_id')
            ->paginate(25)
            ->setPath(route('chats.messages', $id));

        foreach ($chats as $key => $chat) {
            $result = preg_match_all($this->linkPattern, $chat->body, $matches);
    
            if ($result > 0) {
                $chat->links = $matches[0];
            } else {
                $chat->links = [];
            }

            $chats[$key] = $chat;
        }
            
        return $chats;
    }

    public function media(string $id, $type = 'media') 
    {
        $chatIds = ChatMessage::forUserOrGroup($id)
            ->deletedInIds()
            ->pluck('id')
            ->toArray();

        $files = ChatMessageFile::with('sent_by')
            ->deletedInIds()
            ->whereIn('chat_id', $chatIds)
            ->where('file_type', $type)
            ->get();

        return $files;
    }

    public function files(string $id) 
    {
        return $this->media($id, 'files');
    }

    public function links(string $id) 
    {
        $chats = ChatMessage::forUserOrGroup($id)
            ->deletedInIds()
            ->whereRaw("body REGEXP 'https?:\/\/[^\\s]+'")
            ->orderByDesc('sort_id')
            ->pluck('body');

        foreach ($chats as $key => $link) {
            $result = preg_match_all($this->linkPattern, $link, $matches);

            if ($result > 0) {
                $chats[$key] = $matches[0];
            }
        }

        return $chats->flatten();
    }
}
