<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class UserActivity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            Auth::user()->update([
                'last_seen' => now(),
                'is_online' => true
            ]);

            $expiresAt = now()->addMinutes(1);
            $key = 'user-online' . Auth::id();

            if (!Cache::has($key)) {
                Cache::put($key, true, $expiresAt);

                // TODO: send user activity event
            } else {
                Cache::put($key, true, $expiresAt);
            }
        }

        return $next($request);
    }
}
