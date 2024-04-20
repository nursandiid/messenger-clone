<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            return Inertia::render('chats/Index');
        } catch (\Exception $e) {
            dd($e->getMessage());
        }
    }
}
