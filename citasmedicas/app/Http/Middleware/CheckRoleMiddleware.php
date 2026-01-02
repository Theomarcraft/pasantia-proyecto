<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, $role)
    {
        // Verifica si el usuario está autenticado
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'No autenticado.'], 401);
        }

        // Verifica el rol del usuario
        if ($user->role !== $role) {
            return response()->json(['message' => 'Acceso denegado.'], 403);
        }

        // Si pasa las validaciones, continúa la petición
        return $next($request);
    }
}
