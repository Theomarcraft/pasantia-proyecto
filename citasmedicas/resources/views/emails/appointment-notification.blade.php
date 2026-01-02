<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Notificación de Cita</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; padding: 20px;">
        <h2 style="color: #0d6efd;">📅 Hola {{ $appointment->user->name ?? 'Paciente' }}</h2>

        @if ($type === 'confirmada')
            <p>Tu cita ha sido <strong style="color: green;">confirmada</strong>.</p>
        @elseif ($type === 'rechazada')
            <p>Tu cita ha sido <strong style="color: red;">rechazada</strong>.</p>
        @elseif ($type === 'finalizada')
            <p>Tu cita ha sido <strong style="color: blue;">finalizada</strong>.</p>
        @else
            <p>Tu cita ha cambiado de estado a: <strong>{{ ucfirst($type) }}</strong>.</p>
        @endif

        <p><b>Fecha:</b> {{ $appointment->appointment_date ?? 'Sin fecha' }}</p>
        <p><b>Doctor:</b> {{ $appointment->doctor->name ?? 'Por asignar' }}</p>
        <p><b>Descripción:</b> {{ $appointment->description ?? 'Sin descripción' }}</p>

        <p style="margin-top: 25px;">Gracias por usar nuestro sistema de citas médicas 🩺</p>
    </div>
</body>
</html>
