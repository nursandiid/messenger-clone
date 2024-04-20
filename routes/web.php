<?php

use App\Http\Controllers\ChatsController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->middleware('guest');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::patch('/users/{id}', [UsersController::class, 'update'])->name('users.update');

    Route::get('/chats', [ChatsController::class, 'index'])->name('chats.index');
    Route::get('/chats/{userId}', [ChatsController::class, 'show'])->name('chats.show');

    Route::get('/chats/users', [ChatsController::class, 'loadChats'])->name('chats.users');

    Route::get('/contacts', [ChatsController::class, 'index'])->name('contacts.index');
    Route::get('/archived_chats', [ChatsController::class, 'index'])->name('archived_chats.index');
});

require __DIR__.'/auth.php';
