<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * 📋 Listar usuarios (solo admin)
     */
    public function index()
    {
        $users = User::paginate(10);
        return response()->json($users, 200);
    }

    /**
     * ➕ Crear un nuevo usuario (solo admin)
     */
    public function store(Request $request)
{
    $request->validate([
        'name'     => 'required|string|max:255',
        'email'    => 'required|email|unique:users,email',
        'password' => 'required|string|min:6',
        'role'     => 'nullable|string|in:user,doctor,admin',
    ]);

    $user = User::create([
        'name'     => $request->name,
        'email'    => $request->email,
        'password' => Hash::make($request->password),
        'role'     => $request->role ?? 'user',
    ]);

    return response()->json([
        'message' => 'Usuario creado correctamente',
        'user'    => $user
    ], 201);
}
    /**
     * 🔍 Mostrar un usuario por ID
     */
    public function show($id)
    {
        if (!is_numeric($id)) {
            return response()->json(['message' => 'ID inválido'], 400);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        return response()->json($user, 200);
    }

    /**
     * 👤 Mostrar perfil del usuario autenticado
     */
    public function showProfile(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        return response()->json($user, 200);
    }

    /**
     * ✏️ Actualizar perfil del usuario autenticado
     */
    public function updateProfile(Request $request)
{
    $user = $request->user();

    // ✅ Validación de los campos
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,' . $user->id,
        'password' => 'nullable|string|min:6',
    ]);

    // ✅ Actualización de datos
    $user->name = $request->name;
    $user->email = $request->email;

    if (!empty($request->password)) {
        // ⚠️ No usar Hash::make() — el mutator en el modelo User ya lo hace
        $user->password = $request->password;
    }

    $user->save();

    return response()->json([
        'message' => 'Perfil actualizado correctamente',
        'user' => $user->fresh(),
    ], 200);
}
    /**
     * 🗑️ Eliminar usuario por ID (solo admin)
     */
    public function destroy($id)
    {
        if (!is_numeric($id)) {
            return response()->json(['message' => 'ID inválido'], 400);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente'], 200);
    }

    public function updateUser(Request $request, $id)
{
    $admin = $request->user();

    // Solo los administradores pueden acceder
    if ($admin->role !== 'admin') {
        return response()->json(['message' => 'No autorizado'], 403);
    }

    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'Usuario no encontrado'], 404);
    }

    // Validación de campos editables
    $request->validate([
        'name'     => 'sometimes|required|string|max:255',
        'email'    => 'sometimes|required|email|unique:users,email,' . $id,
        'password' => 'nullable|string|min:6',
        'role'     => 'nullable|string|in:user,doctor,admin',
    ]);

    // Actualización
    if ($request->filled('name')) $user->name = $request->name;
    if ($request->filled('email')) $user->email = $request->email;
    if ($request->filled('role')) $user->role = $request->role;
    if ($request->filled('password')) $user->password = $request->password; // Mutator lo cifra

    $user->save();

    return response()->json([
        'message' => 'Usuario actualizado correctamente',
        'user' => $user->fresh(),
    ], 200);
}
}
