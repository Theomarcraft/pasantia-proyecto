<?php

use Illuminate\Support\Facades\Route;

// 👇 Solo deja la prueba temporal si quieres verificar conexión
Route::get('/prueba-env', function () {
    return dd(env('DB_DATABASE')); // debería mostrar "citasmedicas"
});

// ❌ NO agregues rutas de login aquí porque React maneja todo.
// ❌ Nada de AuthController ni name('login').
