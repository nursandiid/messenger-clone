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
    Route::post('/chats', [ChatsController::class, 'store'])->name('chats.store');
    Route::delete('/chats/{id}', [ChatsController::class, 'destroy'])->name('chats.destroy');
    Route::delete('/chats/{id}/file/{file_name}', [ChatsController::class, 'deleteSelectedFile'])->name('chats.delete_file');

    Route::get('/chats/users', [ChatsController::class, 'loadChats'])->name('chats.users');

    Route::get('/chats/{id}', [ChatsController::class, 'show'])->name('chats.show');
    Route::get('/chats/{id}/messages', [ChatsController::class, 'loadMessages'])->name('chats.messages');

    Route::get('/contacts', [ChatsController::class, 'index'])->name('contacts.index');
    Route::get('/archived_chats', [ChatsController::class, 'index'])->name('archived_chats.index');
});

require __DIR__.'/auth.php';
