<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Reporte de Citas Médicas</title>
  <style>
    body { font-family: DejaVu Sans, sans-serif; font-size: 12px; margin: 20px; color: #333; }
    .title { font-size: 18px; font-weight: bold; margin-bottom: 8px; text-align: center; }
    .muted { color:#555; font-size: 11px; text-align: right; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin-top:12px; }
    th, td { border: 1px solid #ddd; padding:6px; }
    th { background-color: #f1f5f9; text-align: left; }
    tr:nth-child(even) { background-color: #fafafa; }
  </style>
</head>
<body>
  <div class="title">Reporte de Citas Médicas</div>

  <div class="muted">
    Generado el {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}
  </div>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Paciente</th>
        <th>Doctor</th>
        <th>Fecha</th>
        <th>Especialidad</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      @forelse($appointments as $a)
        <tr>
          <td>{{ $a->id }}</td>
          <td>{{ $a->user->name ?? '—'}}</td>
          <td>{{ $a->doctor->name ?? '—'}}</td>
          <td>{{ \Carbon\Carbon::parse($a->appointment_date)->format('d/m/Y H:i') }}</td>
          <td>{{ $a->specialty ?? ($a->service->name ?? '—') }}</td>
          <td>{{ ucfirst($a->status) }}</td>
        </tr>
      @empty
        <tr><td colspan="6" style="text-align:center;">Sin registros disponibles</td></tr>
      @endforelse
    </tbody>
  </table>
</body>
</html>
