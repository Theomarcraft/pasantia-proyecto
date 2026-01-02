<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Dra. Laura Sánchez',
            'email' => 'laura.sanchez@clinica.com',
            'password' => Hash::make('password'),
            'role' => 'doctor',
            'specialty' => 'Medicina General',
        ]);

        User::create([
            'name' => 'Dr. Carlos Pérez',
            'email' => 'carlos.perez@salud.com',
            'password' => Hash::make('password'),
            'role' => 'doctor',
            'specialty' => 'Pediatría',
        ]);

        User::create([
            'name' => 'Dra. Andrea Gómez',
            'email' => 'andrea.gomez@hospital.org',
            'password' => Hash::make('password'),
            'role' => 'doctor',
            'specialty' => 'Dermatología',
        ]);
    }
}
