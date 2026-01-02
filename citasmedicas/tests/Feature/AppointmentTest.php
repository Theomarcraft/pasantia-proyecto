<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Appointment;
use App\Models\User;
use App\Models\Doctor;

class AppointmentTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: Listar citas
     */
    public function test_listar_citas()
    {
        // Crear citas de ejemplo
        Appointment::factory()->count(3)->create();

        $response = $this->get('/api/appointments');

        $response->assertStatus(200)
                 ->assertJsonCount(3); // Debe devolver 3 registros
    }

    /**
     * Test: Crear una cita correctamente
     */
    public function test_crear_cita_correctamente()
    {
        $user = User::factory()->create();
        $doctor = Doctor::factory()->create();

        $payload = [
            'user_id' => $user->id,
            'doctor_id' => $doctor->id,
            'appointment_date' => now()->addDays(2)->toDateTimeString(),
            'description' => 'Chequeo general',
        ];

        $response = $this->postJson('/api/appointments', $payload);

        $response->assertStatus(201)
                 ->assertJsonFragment(['description' => 'Chequeo general']);
    }

    /**
     * Test: Error al crear cita sin campos obligatorios
     */
    public function test_error_al_crear_cita_sin_campos()
    {
        $response = $this->postJson('/api/appointments', []);

        $response->assertStatus(422)
                 ->assertJsonStructure(['errors']);
    }

    /**
     * Test: Mostrar una cita específica
     */
    public function test_mostrar_cita()
    {
        $appointment = Appointment::factory()->create();

        $response = $this->get("/api/appointments/{$appointment->id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['id' => $appointment->id]);
    }

    /**
     * Test: Error al buscar cita inexistente
     */
    public function test_error_cita_inexistente()
    {
        $response = $this->get("/api/appointments/9999");

        $response->assertStatus(404);
    }
}
