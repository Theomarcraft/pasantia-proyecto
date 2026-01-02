<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Laravel CORS Configuration
    |--------------------------------------------------------------------------
    |
    | Aquí defines qué dominios pueden consumir tu API.
    | En desarrollo usamos localhost/127.0.0.1 con Vite (puerto 5173).
    | En producción añade la URL real de tu frontend.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // Métodos permitidos
    'allowed_methods' => ['*'],

    // Orígenes permitidos (añade aquí tu dominio en producción)
    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],

    // Patrones de origen permitidos
    'allowed_origins_patterns' => [],

    // Headers permitidos
    'allowed_headers' => ['*'],

    // Headers expuestos al frontend
    'exposed_headers' => [],

    // Tiempo máximo en cache (en segundos)
    'max_age' => 0,

    // Si se permiten credenciales (cookies, tokens)
    'supports_credentials' => true,
];
