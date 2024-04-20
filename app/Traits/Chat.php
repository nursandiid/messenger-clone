<?php

namespace App\Traits;

use App\Models\ChatMessage;

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
}
