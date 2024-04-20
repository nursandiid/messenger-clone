<?php

namespace App\Http\Middleware;

use App\Providers\AppServiceProvider;
use Illuminate\Auth\Middleware\RedirectIfAuthenticated as MiddlewareRedirectIfAuthenticated;
use Illuminate\Support\Facades\Route;

class RedirectIfAuthenticated extends MiddlewareRedirectIfAuthenticated
{
    /**
     * Get the default URI the user should be redirected to when they are authenticated.
     */
    protected function defaultRedirectUri(): string
    {
        foreach ([AppServiceProvider::HOME] as $uri) {
            if (Route::has($uri)) {
                return route($uri);
            }
        }

        $routes = Route::getRoutes()->get('GET');

        foreach ([AppServiceProvider::HOME] as $uri) {
            if (isset($routes[$uri])) {
                return '/'.$uri;
            }
        }

        return '/';
    }
}
