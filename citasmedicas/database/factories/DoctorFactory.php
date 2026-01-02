<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DoctorFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'specialty' => $this->faker->randomElement(['Medicina General', 'Pediatría', 'Dermatología']),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => bcrypt('password'), // si tu tabla lo requiere
        ];
    }
}
