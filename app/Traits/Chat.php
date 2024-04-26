<?php

namespace App\Traits;

use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\MorphTo;

trait Chat
{
    public function chats() 
    {
        $chats = ChatMessage::with('from', 'to')
            ->paginate(25);

            foreach ($chats as $key => $message) {
                $mapped = new \stdClass;
                $mapped->id = $message->to->id;
                $mapped->name = $message->to->name;
                $mapped->avatar = $message->to->avatar;
                $mapped->from_id = $message->from_id;
                $mapped->body = $message->body;
                $mapped->is_read = true;
                $mapped->is_reply = false;
                $mapped->is_online = true;
                $mapped->chat_type = ChatMessage::CHAT_TYPE;
                $mapped->created_at = $message->created_at;

                $chats[$key] = $mapped;
            }

        return $chats;
    }

    public function messages(string $id) 
    {
        $chats = ChatMessage::with([
                'from',
                'to',
                'attachments'
            ])
            ->where(function (Builder $query) use ($id) {
                $query->where('from_id', auth()->id())
                      ->where('to_id', $id);
            })
            ->orWhere(function (Builder $query) use ($id) {
                $query->where('from_id', $id)
                      ->where('to_id', auth()->id());
            })
            ->selectRaw('id, from_id, to_id, to_type, IF (to_type = ?, ?, ?) as chat_type, body, seen_in_id, sort_id, created_at', [
                User::class,
                ChatMessage::CHAT_TYPE,
                ChatMessage::CHAT_GROUP_TYPE
            ])
            ->orderBy('sort_id')
            ->paginate(25)
            ->setPath(route('chats.messages', $id));
            
        return $chats;
    }
}
