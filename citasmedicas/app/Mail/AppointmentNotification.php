<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AppointmentNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;
    public $type;

    public function __construct(Appointment $appointment, $type)
    {
        $this->appointment = $appointment;
        $this->type = $type;
    }

    public function build()
    {
        return $this->subject("Tu cita ha sido {$this->type}")
            ->view('emails.appointment-notification');
    }
}
