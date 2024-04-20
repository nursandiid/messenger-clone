<?php

namespace App\Http\Controllers;

abstract class Controller
{
    public function ok($data = null, $message = 'success', $code = 200) 
    {
        return response()->json([
            'message' => $message,
            'data' => $data
        ], $code);
    }

    public function oops($message = '', $code = 400) 
    {
        if ($code === 0) $code = 400;

        return response()->json([
            'message' => $message
        ], $code);
    }
}
