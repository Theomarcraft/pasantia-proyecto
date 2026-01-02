<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    protected function redirectTo($request): ?string
    {
        // Si no es JSON devolvemos null para que responda 401 en vez de redirigir
        if (! $request->expectsJson()) {
            return null;
        }

        return null;
    }
}
