<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Campos asignables masivamente
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'specialty',
        'service_id',
        'phone',
        'active',
    ];

    /**
     * Campos ocultos al serializar
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Conversión de tipos de atributos
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'active' => 'boolean',
    ];

    /**
     * Mutator: hashear automáticamente la contraseña
     */
    public function setPasswordAttribute($value)
    {
        // Evita doble hash
        if (!empty($value) && !str_starts_with($value, '$2y$')) {
            $this->attributes['password'] = bcrypt($value);
        }
    }

    /**
     * 🔹 Un usuario puede tener muchas citas como paciente
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'user_id');
    }

    /**
     * 🔹 Un doctor puede tener muchas citas asignadas
     */
    public function doctorAppointments()
    {
        return $this->hasMany(Appointment::class, 'doctor_id');
    }

    /**
     * 🔹 Si el usuario está vinculado a un servicio (especialidad médica)
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * 🔹 Verifica si el usuario tiene un rol específico
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }
}
