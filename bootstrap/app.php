<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\UserActivity::class
        ]);

        $middleware->alias([
            'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
            'throttle.withqueries' => \App\Http\Middleware\ThrottleWithQueries::class
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
