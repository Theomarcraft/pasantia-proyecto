<table border="1" cellspacing="0" cellpadding="5">
  <thead>
    <tr style="background-color:#f1f5f9; font-weight:bold;">
      <th>ID</th>
      <th>Paciente</th>
      <th>Doctor</th>
      <th>Fecha</th>
      <th>Especialidad</th>
      <th>Estado</th>
    </tr>
  </thead>
  <tbody>
    @foreach($rows as $a)
      <tr>
        <td>{{ $a->id }}</td>
        <td>{{ $a->user->name ?? '—' }}</td>
        <td>{{ $a->doctor->name ?? '—' }}</td>
        <td>{{ \Carbon\Carbon::parse($a->appointment_date)->format('d/m/Y H:i') }}</td>
        <td>{{ $a->specialty ?? ($a->service->name ?? '—') }}</td>
        <td>{{ ucfirst($a->status) }}</td>
      </tr>
    @endforeach
  </tbody>
</table>
