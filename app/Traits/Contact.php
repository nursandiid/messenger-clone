<?php

namespace App\Traits;

use App\Models\User;

trait Contact
{
    public function contacts() 
    {
        $contacts = User::join('chat_contacts as cc', 'users.id', 'cc.contact_id')
            ->where('user_id', auth()->id())
            ->when(request()->filled('query'), function ($query) {
                $query->where('name', 'LIKE', '%'. request('query') .'%');
            })
            ->select('users.*', 'cc.is_contact_blocked')
            ->paginate(15)
            ->withQueryString();

        return $contacts;
    }
}