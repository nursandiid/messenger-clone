<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('user-typing-{fromId}-to-{toId}', function (User $user, $fromId, $toId) {
    return $user->id === $fromId || $user->id === $toId;
});