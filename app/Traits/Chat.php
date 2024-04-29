<?php

namespace App\Traits;

use App\Models\ChatMessage;
use App\Models\ChatMessageFile;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Arr;

trait Chat
{
    protected $validImageExtensions = ["jpg", "jpeg", "png", "gif", "svg", "bmp", "webp"];
    protected $linkPattern = "/(https?:\/\/[^\s]+)/";

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
            $latestMessage = ChatMessage::where(function (Builder $query) {
                $query->where('from_id', auth()->id())
                      ->orWhere('to_id', auth()->id());
                })
                ->deletedInIds()
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
                ->leftJoin('archived_chats as ac', function (JoinClause $join) {
                    $join->on('ac.from_id', 'lm.another_user_id')
                         ->where('ac.archived_by', auth()->id());
                })
                ->where(function (Builder $query) {
                    $query->where('chat_messages.from_id', auth()->id())
                          ->orWhere('chat_messages.to_id', auth()->id());
                })
                ->whereNull('ac.id')
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
            ->whereNotNull('body')
            ->select('body as links');

        $links = [];
        foreach ($chats->pluck('links') as $link) {
            $result = preg_match_all($this->linkPattern, $link, $matches);

            if ($result > 0) {
                $links[] = $matches[0];
            }
        }

        $chats = $chats
            ->when(count($links) > 0, 
                function (Builder $query) use ($links) {
                    $query->where(function (Builder $query) use ($links) {
                        foreach (Arr::flatten($links) as $link) {
                            $query->orWhere('body', 'LIKE', "%$link%");
                        }
                    });
                },
                function (Builder $query) use ($links) {
                    $query->whereIn('body', $links);
                }
            )
            ->orderByDesc('sort_id')
            ->get();

        foreach ($chats->pluck('links') as $key => $link) {
            $result = preg_match_all($this->linkPattern, $link, $matches);

            if ($result > 0) {
                $chats[$key] = $matches[0];
            }
        }

        return $chats->flatten();
    }
}
