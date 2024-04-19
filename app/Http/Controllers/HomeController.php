<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index() 
    {
        return Inertia::render('welcome/Index', [
            'canResetPassword' => Route::has('password.request'),
            'appName' => config('app.name')
        ]);
    }
}
