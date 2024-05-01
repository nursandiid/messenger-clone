<?php

namespace App\Http\Controllers;

use App\Models\ChatGroup;
use App\Models\ChatMessage;
use App\Models\User;
use App\Traits\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Request as FacadesRequest;
use Inertia\Inertia;


class ArchivedChatsController extends Controller
{
    use Chat;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            FacadesRequest::merge(['archived_chats' => true]);

            return Inertia::render('archived-chats/Index', [
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
            FacadesRequest::merge(['archived_chats' => true]);

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

            return Inertia::render('archived-chats/Show', [
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
}
