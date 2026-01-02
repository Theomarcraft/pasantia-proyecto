<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin (sin Hash::make, el mutator lo hará)
        User::create([
            'name'     => 'Administrador',
            'email'    => 'admin@example.com',
            'password' => 'admin1234',
            'role'     => 'admin',
        ]);

        // Usuario de prueba
        User::create([
            'name'     => 'Omar Test',
            'email'    => 'omar.test1@example.com',
            'password' => 'clave1234',
            'role'     => 'user',
        ]);
    }
}
