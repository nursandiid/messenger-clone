<?php

namespace App\Traits;

use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;

trait Chat
{
    protected $validImageExtensions = ["jpg", "jpeg", "png", "gif", "svg", "bmp", "webp"];

    public function chats() 
    {
        if (request()->filled('query')) {
            $chats = User::where('name', 'LIKE', '%'. request('query') .'%')
                ->selectRaw('
                    id,
                    name,
                    avatar,
                    NULL as message_id,
                    NULL as body,
                    1 as is_read,
                    0 as is_reply,
                    IF (is_online = 1 AND active_status = 1, 1, 0) as is_online,
                    active_status,
                    NULL as created_at,
                    ? as chat_type
                ', 
                [ChatMessage::CHAT_TYPE])
                ->paginate(15)
                ->withQueryString()
                ->setPath(route('chats.users'));
        } else {
            $latestMessage = ChatMessage::where('from_id', auth()->id())
                ->orWhere('to_id', auth()->id())
                ->selectRaw("
                    MAX(sort_id) as sort_id,
                    CASE
                        WHEN from_id = '". auth()->id() ."' THEN to_id
                        ELSE from_id
                    END as another_user_id
                ")
                ->groupBy('another_user_id');

            $chats = ChatMessage::with('another_user', 'to', 'from', 'attachments')
                ->joinSub($latestMessage, 'lm', function (JoinClause $join) {
                    $join->on('chat_messages.sort_id', 'lm.sort_id')
                         ->on(function (JoinClause $join) {
                            $join->on('chat_messages.from_id', 'lm.another_user_id')
                                 ->orOn('chat_messages.to_id', 'lm.another_user_id');
                         });
                })
                ->where('chat_messages.from_id', auth()->id())
                ->orWhere('chat_messages.to_id', auth()->id())
                ->select('chat_messages.*', 'lm.another_user_id')
                ->orderByDesc('sort_id')
                ->paginate(15)
                ->setPath(route('chats.users'));

            foreach ($chats as $key => $chat) {
                $mapped = new \stdClass;
                $mapped->id = $chat->another_user->id;
                $mapped->name = $chat->another_user->name . ($chat->another_user->id === auth()->id() ? ' (You)' : '');
                $mapped->avatar = $chat->another_user->avatar;
                $mapped->from_id = $chat->from_id;
                $mapped->body = $chat->body;
                $mapped->is_read = true;
                $mapped->is_reply = false;
                $mapped->is_online = true;
                $mapped->chat_type = ChatMessage::CHAT_TYPE;
                $mapped->created_at = $chat->created_at;

                $chats[$key] = $mapped;
            }
        }

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
            
        return $chats;
    }
}
