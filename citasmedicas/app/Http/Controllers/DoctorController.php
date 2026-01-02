<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class DoctorController extends Controller
{
    /**
     * 📋 Listar todos los doctores
     * GET /api/doctors
     */
    public function index()
    {
        $doctors = User::where('role', 'doctor')->paginate(10);

        return response()->json([
            'message' => 'Lista de doctores obtenida correctamente',
            'doctors' => $doctors,
        ], 200);
    }

    /**
     * ➕ Crear un nuevo doctor
     * POST /api/doctors
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|string|min:6',
            'service_id' => 'nullable|exists:services,id',
            'phone'      => 'nullable|string|max:20',
            'active'     => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['name', 'email', 'password', 'service_id', 'phone', 'active']);
        $data['password'] = Hash::make($data['password']);
        $data['role'] = 'doctor'; // 👩‍⚕️ asignar rol automáticamente

        $doctor = User::create($data);

        return response()->json([
            'message' => 'Doctor creado correctamente',
            'doctor'  => $doctor,
        ], 201);
    }

    /**
     * 👀 Mostrar un doctor específico
     * GET /api/doctors/{id}
     */
    public function show($id)
    {
        $doctor = User::where('role', 'doctor')->find($id);

        if (!$doctor) {
            return response()->json(['message' => 'Doctor no encontrado'], 404);
        }

        return response()->json([
            'message' => 'Doctor encontrado correctamente',
            'doctor'  => $doctor,
        ], 200);
    }

    /**
     * ✏️ Actualizar un doctor
     * PUT /api/doctors/{id}
     */
    public function update(Request $request, $id)
    {
        $doctor = User::where('role', 'doctor')->find($id);

        if (!$doctor) {
            return response()->json(['message' => 'Doctor no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'       => 'sometimes|required|string|max:255',
            'email'      => 'sometimes|required|email|unique:users,email,' . $id,
            'password'   => 'nullable|string|min:6',
            'service_id' => 'nullable|exists:services,id',
            'phone'      => 'nullable|string|max:20',
            'active'     => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['name', 'email', 'password', 'service_id', 'phone', 'active']);

        // 🔒 Solo actualizar la contraseña si se envía
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $doctor->update($data);

        return response()->json([
            'message' => 'Doctor actualizado correctamente',
            'doctor'  => $doctor->fresh(),
        ], 200);
    }

    /**
     * 🗑️ Eliminar un doctor
     * DELETE /api/doctors/{id}
     */
    public function destroy($id)
    {
        $doctor = User::where('role', 'doctor')->find($id);

        if (!$doctor) {
            return response()->json(['message' => 'Doctor no encontrado'], 404);
        }

        $doctor->delete();

        return response()->json(['message' => 'Doctor eliminado correctamente'], 200);
    }
}
