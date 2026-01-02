<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * 🧾 Listar todos los servicios
     * GET /api/services
     */
    public function index()
    {
        $services = Service::orderBy('id', 'asc')->get();

        return response()->json([
            'message'  => 'Lista de servicios obtenida correctamente',
            'services' => $services,
        ], 200);
    }

    /**
     * 🆕 Crear un nuevo servicio
     * POST /api/services
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|numeric|min:0',
        ]);

        $service = Service::create($validated);

        return response()->json([
            'message' => '✅ Servicio creado correctamente',
            'service' => $service,
        ], 201);
    }

    /**
     * 🔍 Mostrar un servicio específico
     * GET /api/services/{id}
     */
    public function show($id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json([
                'message' => '❌ Servicio no encontrado',
            ], 404);
        }

        return response()->json([
            'message' => 'Servicio encontrado correctamente',
            'service' => $service,
        ], 200);
    }

    /**
     * ✏️ Actualizar un servicio existente
     * PUT /api/services/{id}
     */
    public function update(Request $request, $id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json([
                'message' => '❌ Servicio no encontrado',
            ], 404);
        }

        $validated = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price'       => 'sometimes|required|numeric|min:0',
        ]);

        $service->update($validated);

        return response()->json([
            'message' => '✅ Servicio actualizado correctamente',
            'service' => $service,
        ], 200);
    }

    /**
     * 🗑️ Eliminar un servicio
     * DELETE /api/services/{id}
     */
    public function destroy($id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json([
                'message' => '❌ Servicio no encontrado',
            ], 404);
        }

        $service->delete();

        return response()->json([
            'message' => '🗑️ Servicio eliminado correctamente',
        ], 200);
    }
}
