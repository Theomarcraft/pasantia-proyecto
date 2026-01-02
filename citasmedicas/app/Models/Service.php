<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    /**
     * 🧾 Campos que pueden asignarse en masa
     */
    protected $fillable = [
        'name',
        'description',
        'price',
    ];

    /**
     * 🎯 Casts automáticos para atributos
     */
    protected $casts = [
        'price' => 'float', // asegura que se devuelva como número decimal
    ];

    /**
     * 🔗 Relación con las citas (appointments)
     * Un servicio puede tener muchas citas
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
