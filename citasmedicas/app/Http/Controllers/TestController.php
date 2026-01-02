<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class TestController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/test",
     *     tags={"Prueba"},
     *     summary="Endpoint de prueba",
     *     @OA\Response(
     *         response=200,
     *         description="Swagger está leyendo este controlador"
     *     )
     * )
     */
    public function index()
    {
        return response()->json(['message' => 'Swagger detecta este endpoint'], 200);
    }
}
