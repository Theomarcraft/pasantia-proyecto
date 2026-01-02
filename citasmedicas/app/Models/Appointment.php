<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    use HasFactory;

    protected $table = 'appointments';

    protected $fillable = [
        'user_id',
        'doctor_id',
        'service_id',
        'appointment_date',
        'description',
        'status',
        'specialty',
    ];

    protected $attributes = [
        'status' => 'pending',
    ];

    /**
     * 🔹 Guardar y leer fecha exactamente como viene (sin UTC ni conversión)
     */
    public function setAppointmentDateAttribute($value)
    {
        // Guarda tal cual la fecha enviada desde el frontend
        $this->attributes['appointment_date'] = $value;
    }

    public function getAppointmentDateAttribute($value)
    {
        // Devuelve la fecha sin modificarla
        return $value;
    }

    /**
     * 🔹 Relación: la cita pertenece a un usuario (paciente)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'service_id');
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'pending'   => 'Pendiente',
            'confirmed' => 'Confirmada',
            'cancelled' => 'Cancelada',
            default     => ucfirst($this->status),
        };
    }
}
