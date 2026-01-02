<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\AppointmentsExport;

class ReportController extends Controller
{
    private function baseQuery(Request $request)
    {
        $q = Appointment::with(['user:id,name,email', 'doctor:id,name', 'service:id,name']);
        $q->orderBy('appointment_date', 'desc');

        if ($request->filled('from')) {
            $q->where('appointment_date', '>=', $request->query('from'));
        }
        if ($request->filled('to')) {
            $q->where('appointment_date', '<=', $request->query('to'));
        }
        if ($request->filled('status')) {
            $q->where('status', $request->query('status'));
        }
        if ($request->filled('specialty')) {
            $q->where('specialty', $request->query('specialty'));
        }

        return $q;
    }

    /**
     * 📄 Exportar citas a PDF
     */
    public function AppointmentsPDF(Request $request)
    {
        $appointments = $this->baseQuery($request)->get();

        $pdf = Pdf::loadView('reports.appointments', compact('appointments'))
                  ->setPaper('a4', 'landscape');

        return $pdf->download('Citas.pdf');
    }

    /**
     * 📊 Exportar citas a Excel
     */
    public function AppointmentsExcel()
    {
        return Excel::download(new AppointmentsExport, 'Citas.xlsx');
    }
}
