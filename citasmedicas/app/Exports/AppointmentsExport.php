<?php

namespace App\Exports;

use App\Models\Appointment;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithMapping;

class AppointmentsExport implements FromCollection, WithHeadings, ShouldAutoSize, WithMapping
{
    protected $request;

    public function __construct($request = null)
    {
        $this->request = $request;
    }

    public function collection()
    {
        $query = Appointment::with(['user', 'doctor', 'service'])
            ->orderBy('appointment_date', 'desc');

        // 🔹 Aplicar filtros opcionales
        if ($this->request) {
            if ($this->request->filled('status')) {
                $query->where('status', $this->request->status);
            }

            if ($this->request->filled('specialty')) {
                $query->where('specialty', $this->request->specialty);
            }

            if ($this->request->filled('from') && $this->request->filled('to')) {
                $query->whereBetween('appointment_date', [
                    $this->request->from,
                    $this->request->to,
                ]);
            }
        }

        return $query->get();
    }

    // 🔹 Mapeo de columnas para Excel
    public function map($a): array
    {
        return [
            $a->id,
            $a->user->name ?? 'N/A',
            $a->doctor->name ?? 'Por asignar',
            $a->service->name ?? 'Sin especificar',
            \Carbon\Carbon::parse($a->appointment_date)->format('d/m/Y H:i'),
            $a->specialty ?? 'General',
            ucfirst($a->status),
        ];
    }

    // 🔹 Encabezados de columna
    public function headings(): array
    {
        return [
            'ID',
            'Paciente',
            'Doctor',
            'Servicio',
            'Fecha',
            'Especialidad',
            'Estado',
        ];
    }
}
