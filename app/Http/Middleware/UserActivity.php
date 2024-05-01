<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class UserActivity
{
    protected $except = [
        'chats.users',
        'chats.message',
        'chats.media',
        'chats.files',
        'chats.links',
        'chats.notification',
        'contacts.data',
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check() && !in_array($request->route()->getName(), $this->except)) {
            Auth::user()->update([
                'last_seen' => now(),
                'is_online' => true
            ]);

            $expiresAt = now()->addSeconds(30);
            $key = 'user-online' . Auth::id();

            if (!Cache::has($key)) {
                Cache::put($key, true, $expiresAt);

                event(new \App\Events\UserActivity(Auth::user()));
            } else {
                Cache::put($key, true, $expiresAt);
            }
        }

        return $next($request);
    }
}
