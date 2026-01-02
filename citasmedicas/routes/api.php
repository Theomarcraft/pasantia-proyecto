<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| 📢 Rutas públicas (sin autenticación)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);

/*
|--------------------------------------------------------------------------
| 🔐 Rutas protegidas (usuarios autenticados con Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    /*
    |--------------------------------------------------------------------------
    | Perfil del usuario autenticado
    |--------------------------------------------------------------------------
    */
    Route::get('/user', [UserController::class, 'showProfile']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--------------------------------------------------------------------------
    | Citas médicas (Appointments)
    |--------------------------------------------------------------------------
    |
    | Estas rutas permiten CRUD completo de citas, con acciones
    | personalizadas para confirmar, cancelar y asignar doctores.
    |
    */
    Route::apiResource('appointments', AppointmentController::class);

    // Acciones adicionales de citas
    Route::put('/appointments/{id}/confirm', [AppointmentController::class, 'confirm']);
    Route::put('/appointments/{id}/cancel', [AppointmentController::class, 'cancel']);
    Route::put('/appointments/{id}/assign', [AppointmentController::class, 'assign']);

    /*
    |--------------------------------------------------------------------------
    | Doctores (solo para admin o usuarios con permisos especiales)
    |--------------------------------------------------------------------------
    */
    Route::apiResource('doctors', DoctorController::class);
});

/*
|--------------------------------------------------------------------------
| 🧭 Rutas exclusivas del Administrador
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/users', [UserController::class, 'index']);
    Route::put('/users/{id}', [UserController::class, 'updateUser']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::get('/reports/appointments/pdf', [ReportController::class, 'AppointmentsPDF']);
    Route::get('/reports/appointments/excel', [ReportController::class, 'AppointmentsExcel']);
    Route::apiResource('services', ServiceController::class)->except(['index', 'show']);
});
/*
|--------------------------------------------------------------------------
| Rutas exclusivas del Doctor
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:doctor'])->group(function () {
    Route::get('/doctor/appointments', [AppointmentController::class, 'getBySpecialty']);
    Route::get('/doctor/appointments/confirmed', [AppointmentController::class, 'getConfirmedAppointments']);
    Route::put('/doctor/appointments/{id}/complete', [AppointmentController::class, 'complete']);
    Route::put('/doctor/appointments/{id}/accept', [AppointmentController::class, 'accept']);
    Route::put('/doctor/appointments/{id}/reject', [AppointmentController::class, 'reject']);
});
