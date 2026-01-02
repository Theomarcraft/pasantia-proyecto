import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import "../../styles/calendar-dark.css";

const localizer = momentLocalizer(moment);

export default function DashboardDoctor() {
  const [specialty, setSpecialty] = useState("Medicina General");
  const [appointments, setAppointments] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");

  // 🔹 Cargar citas por especialidad
  const fetchAppointments = async (esp) => {
    try {
      const res = await api.get(`/doctor/appointments?specialty=${esp}`);
      setAppointments(
        res.data.map((a) => ({
          id: a.id,
          title: `${a.user?.name || "Paciente"} - ${a.specialty}`,
          start: new Date(a.appointment_date),
          end: moment(a.appointment_date).add(30, "minutes").toDate(),
          data: a,
        }))
      );
    } catch (err) {
      console.error("Error al obtener citas:", err);
    }
  };

  // 🔹 Cargar citas confirmadas (aceptadas)
  const fetchConfirmedAppointments = async () => {
    try {
      const res = await api.get("/doctor/appointments/confirmed");
      setConfirmedAppointments(res.data);
    } catch (err) {
      console.error("Error al obtener citas confirmadas:", err);
    }
  };

  useEffect(() => {
    fetchAppointments(specialty);
    fetchConfirmedAppointments();
  }, [specialty]);

  // 🔹 Aceptar cita
  const handleAccept = async (id) => {
    try {
      await api.put(`/doctor/appointments/${id}/accept`);
      alert("✅ Cita aceptada");

      // 🔁 Actualizar ambas listas
      await Promise.all([
        fetchAppointments(specialty),
        fetchConfirmedAppointments(),
      ]);

      setSelectedEvent(null);
    } catch (e) {
      console.error(e);
      alert("Error interno del servidor, intenta nuevamente más tarde.");
    }
  };

  // 🔹 Rechazar cita
  const handleReject = async (id) => {
    try {
      await api.put(`/doctor/appointments/${id}/reject`);
      alert("❌ Cita rechazada");

      // 🔁 Actualizar ambas listas
      await Promise.all([
        fetchAppointments(specialty),
        fetchConfirmedAppointments(),
      ]);

      setSelectedEvent(null);
    } catch (e) {
      console.error(e);
      alert("Error interno del servidor, intenta nuevamente más tarde.");
    }
  };

  // 🔹 Finalizar cita (cambia status a "completed")
  const handleComplete = async (id) => {
    if (!window.confirm("¿Deseas marcar esta cita como finalizada?")) return;

    try {
      await api.put(`/doctor/appointments/${id}/complete`);
      alert("✅ Cita finalizada correctamente");

      await fetchConfirmedAppointments();
    } catch (e) {
      console.error(e);
      alert("Error al finalizar la cita. Intenta nuevamente más tarde.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-blue-100">
      <Navbar />
      <div className="p-8">
        <h2 className="text-center text-2xl font-bold mb-6">
          👨‍⚕️ Panel del Doctor
        </h2>

        {/* Selector de especialidad */}
        <div className="flex justify-center mb-6">
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="px-4 py-2 rounded-md bg-gray-800 border border-blue-500 text-blue-300"
          >
            <option value="Medicina General">Medicina General</option>
            <option value="Pediatría">Pediatría</option>
            <option value="Dermatología">Dermatología</option>
            <option value="Cardiología">Cardiología</option>
          </select>
        </div>

        {/* Tabs para cambiar entre citas pendientes y aceptadas */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "pending"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-blue-200"
            }`}
          >
            Citas Pendientes
          </button>
          <button
            onClick={() => setActiveTab("confirmed")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "confirmed"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-blue-200"
            }`}
          >
            Citas Aceptadas
          </button>
        </div>

        {/* Contenido dinámico */}
        {activeTab === "pending" ? (
          <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
            {appointments.length > 0 ? (
              <Calendar
                localizer={localizer}
                events={appointments}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onSelectEvent={(event) => setSelectedEvent(event)}
                messages={{
                  next: "Sig.",
                  previous: "Ant.",
                  today: "Hoy",
                  month: "Mes",
                  week: "Semana",
                  day: "Día",
                }}
              />
            ) : (
              <div className="text-center text-blue-300 py-32 text-lg font-semibold">
                🩺 No hay citas pendientes para esta especialidad.
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
            {confirmedAppointments.length > 0 ? (
              <table className="w-full text-blue-100 text-sm">
                <thead>
                  <tr className="border-b border-blue-700 text-left">
                    <th className="py-2">Paciente</th>
                    <th>Fecha</th>
                    <th>Especialidad</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {confirmedAppointments.map((a) => (
                    <tr key={a.id} className="border-b border-gray-700">
                      <td className="py-2">{a.user?.name}</td>
                      <td>
                        {moment(a.appointment_date).format("DD/MM/YYYY HH:mm")}
                      </td>
                      <td>{a.specialty}</td>
                      <td>
                        <button
                          onClick={() => handleComplete(a.id)}
                          className="bg-green-600 px-3 py-1 rounded text-white hover:bg-green-700"
                        >
                          Finalizar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-blue-300 py-20 text-lg font-semibold">
                ✅ No tienes citas aceptadas por ahora.
              </div>
            )}
          </div>
        )}

        {/* Modal de detalles */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-zinc-950 bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold text-center mb-3">
                🩺 Detalles de la cita
              </h3>
              <p>
                <b>Paciente:</b> {selectedEvent.data.user?.name}
              </p>
              <p>
                <b>Fecha:</b>{" "}
                {moment(selectedEvent.data.appointment_date).format(
                  "DD/MM/YYYY HH:mm"
                )}
              </p>
              <p>
                <b>Estado:</b> {selectedEvent.data.status}
              </p>

              <div className="flex justify-between mt-5">
                <button
                  onClick={() => handleAccept(selectedEvent.id)}
                  className="bg-green-600 px-3 py-2 rounded text-white hover:bg-green-700"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => handleReject(selectedEvent.id)}
                  className="bg-red-600 px-3 py-2 rounded text-white hover:bg-red-700"
                >
                  Rechazar
                </button>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="bg-gray-500 px-3 py-2 rounded text-white hover:bg-gray-600"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
