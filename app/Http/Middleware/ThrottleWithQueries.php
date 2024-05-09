<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Symfony\Component\HttpFoundation\Response;

class ThrottleWithQueries extends ThrottleRequests
{
    protected function resolveRequestSignature($request)
    {
        return sha1($request->method().$request->ip().$request->path().json_encode($request->query()));
    }
}
