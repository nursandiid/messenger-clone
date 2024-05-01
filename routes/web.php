<?php

use App\Http\Controllers\ArchivedChatsController;
use App\Http\Controllers\ChatsController;
use App\Http\Controllers\ContactsController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PreferencesController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->middleware('guest');

Route::middleware('auth')->group(function () {
    Route::group(['prefix' => 'profile', 'as' => 'profile.'], function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });

    Route::group(['prefix' => 'users', 'as' => 'users.'], function () {
        Route::get('/', [UsersController::class, 'index'])->name('index');
        Route::patch('/{id}', [UsersController::class, 'update'])->name('update');
    });

    Route::group(['prefix' => 'chats', 'as' => 'chats.'], function () {
        Route::get('/', [ChatsController::class, 'index'])->name('index');
        Route::post('/', [ChatsController::class, 'store'])->name('store');
        
        Route::get('/users', [ChatsController::class, 'loadChats'])->name('users');
        Route::get('/notification', [ChatsController::class, 'loadNotification'])->name('notification');
        Route::get('/{id}/messages', [ChatsController::class, 'loadMessages'])->name('messages');
        Route::get('/{id}/media', [ChatsController::class, 'loadMedia'])->name('media');
        Route::get('/{id}/files', [ChatsController::class, 'loadFiles'])->name('files');
        Route::get('/{id}/links', [ChatsController::class, 'loadLinks'])->name('links');

        Route::post('/{id}/read', [ChatsController::class, 'markAsRead'])->name('mark_as_read');
        Route::post('/{id}/unread', [ChatsController::class, 'markAsUnread'])->name('mark_as_unread');
        Route::post('/{id}/archive', [ChatsController::class, 'archiveChat'])->name('archive');
        Route::post('/{id}/unarchive', [ChatsController::class, 'unarchiveChat'])->name('unarchive');
        Route::delete('/{id}/delete', [ChatsController::class, 'destroyAll'])->name('destroy_all');
        
        Route::get('/{id}', [ChatsController::class, 'show'])->name('show');
        Route::post('/{id}/customize', [ChatsController::class, 'customizeChat'])->name('customize_chat');
        Route::delete('/{id}', [ChatsController::class, 'destroy'])->name('destroy');
        Route::delete('/{id}/file/{file_name}', [ChatsController::class, 'deleteSelectedFile'])->name('delete_file');
    });
    
    Route::group(['prefix' => 'group', 'as' => 'group.'], function () {
        Route::post('/', [GroupController::class, 'store'])->name('store');
        Route::get('/{id}', [GroupController::class, 'members'])->name('members');
        Route::patch('/{id}', [GroupController::class, 'update'])->name('update');
        Route::delete('/{id}', [GroupController::class, 'exit'])->name('exit');
    });

    Route::group(['prefix' => 'contacts', 'as' => 'contacts.'], function () {
        Route::get('/', [ContactsController::class, 'index'])->name('index');
        Route::get('/data', [ContactsController::class, 'loadData'])->name('data');
        Route::post('/{id}/save', [ContactsController::class, 'saveContact'])->name('save');
        Route::post('/{id}/block', [ContactsController::class, 'blockContact'])->name('block');
        Route::post('/{id}/unblock', [ContactsController::class, 'unblockContact'])->name('unblock');
        Route::delete('/{id}', [ContactsController::class, 'destroy'])->name('destroy');
    });
    
    Route::group(['prefix' => 'archived', 'as' => 'archived_chats.'], function () {
        Route::get('/', [ArchivedChatsController::class, 'index'])->name('index');
        Route::get('/{id}', [ArchivedChatsController::class, 'show'])->name('show');
    });

    Route::get('/preferences', [PreferencesController::class, 'index'])->name('preferences.index');
});

require __DIR__.'/auth.php';
