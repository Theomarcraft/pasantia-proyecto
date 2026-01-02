<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Http\Request;
use App\Mail\AppointmentNotification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    /** Listar citas del usuario autenticado */
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        $query = Appointment::with(['user:id,name,email', 'doctor:id,name', 'service']);

        if ($user->role === 'doctor') {
            $query->where('doctor_id', $user->id);
        } elseif ($user->role === 'user') {
            $query->where('user_id', $user->id);
        }

        $appointments = $query->orderBy('appointment_date', 'desc')->get();
        return response()->json($appointments, 200);
    }

    /** Crear cita */
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        $validated = $request->validate([
            'appointment_date' => 'required|date',
            'description'      => 'required|string|max:255',
        ]);

        try {
            $appointment = Appointment::create([
                'user_id'          => $user->id,
                'doctor_id'        => null,
                'appointment_date' => $validated['appointment_date'],
                'description'      => $validated['description'],
                'specialty'        => $request->input('especialidad', 'Medicina General'),
                'status'           => 'pending',
            ]);

            $appointment->load('user:id,name');

            return response()->json([
                'id'               => $appointment->id,
                'user'             => ['name' => $appointment->user->name],
                'appointment_date' => $appointment->appointment_date,
                'description'      => $appointment->description,
                'status'           => $appointment->status,
            ], 201);
        } catch (\Throwable $e) {
            Log::error('Error al guardar cita: '.$e->getMessage());
            return response()->json(['message' => 'Error al guardar cita'], 500);
        }
    }

    /** Actualizar cita */
    public function update(Request $request, $id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        $validated = $request->validate([
            'appointment_date' => 'nullable|date',
            'description'      => 'nullable|string|max:255',
            'especialidad'     => 'nullable|string|max:255',
            'status'           => 'sometimes|string|in:pending,confirmed,cancelled,completed',
        ]);

        $appointment->update([
            'appointment_date' => $validated['appointment_date'] ?? $appointment->appointment_date,
            'description'      => $validated['description'] ?? $validated['especialidad'] ?? $appointment->description,
            'status'           => $validated['status'] ?? $appointment->status,
        ]);

        $appointment->load('user:id,name');

        return response()->json([
            'id'               => $appointment->id,
            'user'             => ['name' => $appointment->user->name],
            'appointment_date' => $appointment->appointment_date,
            'description'      => $appointment->description,
            'status'           => $appointment->status,
        ], 200);
    }

    /** Eliminar cita */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $app = Appointment::find($id);

        if (!$app) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        if ($user->role === 'user' && $app->user_id !== $user->id) {
            return response()->json(['message' => 'No tienes permiso para eliminar esta cita'], 403);
        }

        $app->delete();
        return response()->json(['message' => 'Cita eliminada correctamente'], 200);
    }

    /** Confirmar cita (general) */
    public function confirm($id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        $appointment->status = 'confirmed';
        $appointment->save();

        return response()->json(['message' => 'Cita confirmada correctamente'], 200);
    }

    /** Cancelar cita (general) */
    public function cancel($id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        $appointment->status = 'cancelled';
        $appointment->save();

        return response()->json(['message' => 'Cita cancelada correctamente'], 200);
    }

    /** Aceptar cita (doctor) */
    public function accept(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'doctor') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $appointment = Appointment::with('user')->find($id);
        if (!$appointment) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }
        if ($appointment->status !== 'pending') {
            return response()->json(['message' => 'Solo se pueden aceptar citas pendientes'], 422);
        }

        $appointment->doctor_id = $user->id;
        $appointment->status = 'confirmed';
        $appointment->save();

        // Enviar correo (no romper flujo si falla)
        try {
            if ($appointment->user && $appointment->user->email) {
                $appointment->load('user', 'doctor');
                Mail::to($appointment->user->email)
                    ->send(new AppointmentNotification($appointment, 'confirmada'));
            }
        } catch (\Throwable $e) {
            Log::warning('Error enviando correo (aceptar): '.$e->getMessage());
        }

        $appointment->load('user:id,name', 'doctor:id,name');

        return response()->json([
            'message'     => 'Cita aceptada correctamente',
            'appointment' => $appointment,
        ], 200);
    }

    /** Citas confirmadas por el doctor autenticado */
    public function getConfirmedAppointments(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'doctor') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $appointments = Appointment::with(['user:id,name,email', 'service'])
            ->where('doctor_id', $user->id)
            ->where('status', 'confirmed')
            ->orderBy('appointment_date', 'desc')
            ->get();

        return response()->json($appointments, 200);
    }

    /** Rechazar cita (doctor) */
    public function reject(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'doctor') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $appointment = Appointment::with('user')->find($id);
        if (!$appointment) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }
        if ($appointment->status !== 'pending') {
            return response()->json(['message' => 'Solo se pueden rechazar citas pendientes'], 422);
        }

        // Aviso por correo (no romper si falla)
        try {
            if ($appointment->user && $appointment->user->email) {
                $appointment->load('user', 'doctor');
                Mail::to($appointment->user->email)
                    ->send(new AppointmentNotification($appointment, 'rechazada'));
            }
        } catch (\Throwable $e) {
            Log::warning('Error enviando correo (rechazar): '.$e->getMessage());
        }

        $appointment->delete();

        return response()->json(['message' => 'Cita rechazada y eliminada correctamente'], 200);
    }

    /** Finalizar cita (doctor) */
    public function complete(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'doctor') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $appointment = Appointment::with('user')->find($id);
        if (!$appointment) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }
        if ($appointment->status !== 'confirmed') {
            return response()->json(['message' => 'Solo se pueden finalizar citas confirmadas'], 422);
        }

        $appointment->status = 'completed';
        $appointment->save();

        // Aviso por correo (no romper si falla)
        try {
            if ($appointment->user && $appointment->user->email) {
                Mail::to($appointment->user->email)
                    ->send(new AppointmentNotification($appointment, 'finalizada'));
            }
        } catch (\Throwable $e) {
            Log::warning('Error enviando correo (finalizar): '.$e->getMessage());
        }

        return response()->json([
            'message'     => 'Cita finalizada correctamente',
            'appointment' => $appointment,
        ], 200);
    }

    /** Asignar doctor (admin u otra lógica) */
    public function assign(Request $request, $id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['message' => 'Cita no encontrada'], 404);
        }

        $request->validate([
            'doctor_id' => 'required|exists:users,id',
        ]);

        $doctor = User::find($request->doctor_id);
        if (!$doctor || $doctor->role !== 'doctor') {
            return response()->json(['message' => 'El usuario seleccionado no es un doctor válido'], 400);
        }

        $appointment->doctor_id = $doctor->id;
        $appointment->save();

        return response()->json(['message' => 'Doctor asignado correctamente'], 200);
    }

    /** Citas por especialidad (pendientes) */
    public function getBySpecialty(Request $request)
    {
        try {
            $specialty = $request->query('specialty');
            if (!$specialty) {
                return response()->json(['message' => 'Debe especificar una especialidad'], 400);
            }

            $appointments = Appointment::with(['user'])
                ->where('specialty', $specialty)
                ->where('status', 'pending')
                ->orderBy('appointment_date', 'asc')
                ->get();

            return response()->json($appointments, 200);
        } catch (\Throwable $e) {
            Log::error('Error obteniendo citas por especialidad: '.$e->getMessage());
            return response()->json(['message' => 'Error al intentar obtener las citas por especialidad'], 500);
        }
    }
}
