<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        Appointment::insert([
            [
                'user_id' => 1,
                'doctor_id' => 1,
                'appointment_date' => '2026-01-01 10:00:00',
                'status' => 'pendiente',
                'description' => 'Consulta general de revisión anual',
            ],
            [
                'user_id' => 1,
                'doctor_id' => 2,
                'appointment_date' => '2026-01-05 15:30:00',
                'status' => 'confirmada',
                'description' => 'Cita pediátrica de control',
            ],
            [
                'user_id' => 1,
                'doctor_id' => 3,
                'appointment_date' => '2026-01-10 09:00:00',
                'status' => 'cancelada',
                'description' => 'Consulta dermatológica',
            ],
        ]);
    }
}
