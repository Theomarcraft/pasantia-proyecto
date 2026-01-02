<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'specialty', // especialidad del doctor
        'password',
    ];

    protected $hidden = [
        'password',
    ];

    /**
     * Relación: un doctor puede tener muchas citas
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
