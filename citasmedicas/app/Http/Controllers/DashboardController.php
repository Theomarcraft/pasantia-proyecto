<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * 📊 Obtener estadísticas generales para el panel del administrador
     * Endpoint: GET /api/dashboard/stats
     */
    public function stats(Request $request)
    {
        $month = $request->query('month', 'all'); // valor por defecto: "all"

        // 🔹 Base de consulta
        $appointmentsQuery = Appointment::query();

        // 🔸 Filtro por mes (opcional)
        if ($month !== 'all' && is_numeric($month)) {
            $appointmentsQuery->whereMonth('created_at', $month);
        } else {
            // Por defecto, los últimos 6 meses
            $appointmentsQuery->where('created_at', '>=', Carbon::now()->subMonths(6));
        }

        // 🧾 Métricas principales
        $totalAppointments = $appointmentsQuery->count();
        $totalUsers = User::count();

        // ✅ Ahora los "Servicios" reflejan las citas finalizadas
        $totalServices = Appointment::where('status', 'completed')->count();

        // 📆 Citas agrupadas por mes (últimos 6 meses)
        $appointmentsByMonth = Appointment::selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->pluck('total', 'month');

        // 🧩 Relación usuarios vs servicios (para el gráfico tipo donut)
        $userServiceRatio = [
            'users' => $totalUsers,
            'services' => $totalServices, // también actualizado
        ];

        // ✅ Respuesta unificada
        return response()->json([
            'totalAppointments'   => $totalAppointments ?? 0,
            'totalUsers'          => $totalUsers ?? 0,
            'totalServices'       => $totalServices ?? 0,
            'appointmentsByMonth' => $appointmentsByMonth ?? [],
            'userServiceRatio'    => $userServiceRatio ?? [],
            'message'             => '📊 Estadísticas obtenidas correctamente',
        ], 200);
    }
}
