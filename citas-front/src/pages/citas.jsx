import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function Citas() {
  const [formData, setFormData] = useState({
    fecha: "",
    hora: "",
    especialidad: "Medicina General",
  });

  const [citas, setCitas] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // 🔹 Cargar citas del usuario autenticado
  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:8000/api/appointments", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setCitas(data);
        } else if (data.appointments) {
          setCitas(data.appointments);
        } else {
          console.warn("⚠️ Respuesta inesperada:", data);
        }
      } catch (error) {
        console.error("⚠️ Error al obtener citas:", error);
      }
    };

    fetchCitas();
  }, []);

  // 🔹 Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Crear o actualizar cita
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Combinar fecha y hora sin UTC
    const appointment_date = `${formData.fecha} ${formData.hora}`;

    const body = {
      appointment_date,
      description: formData.especialidad,
      especialidad: formData.especialidad,
    };

    try {
      const url = editingId
        ? `http://127.0.0.1:8000/api/appointments/${editingId}`
        : "http://127.0.0.1:8000/api/appointments";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("📩 Respuesta del servidor:", data);

      if (!res.ok) {
        alert("❌ Error: " + (data.message || "No se pudo guardar la cita"));
        return;
      }

      const citaNormalizada = {
        id: data.id || data.appointment?.id,
        user: data.user || { name: "Tú" },
        description: data.description || formData.especialidad,
        appointment_date: data.appointment_date || appointment_date,
        status: data.status || "pendiente",
      };

      if (editingId) {
        setCitas((prev) =>
          prev.map((cita) =>
            cita.id === editingId ? citaNormalizada : cita
          )
        );
        alert("✅ Cita actualizada correctamente");
      } else {
        setCitas((prev) => [...prev, citaNormalizada]);
        alert("✅ Cita registrada correctamente");
      }

      setFormData({
        fecha: "",
        hora: "",
        especialidad: "Medicina General",
      });
      setEditingId(null);
    } catch (error) {
      console.error("⚠️ Error en handleSubmit:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  // 🔹 Precargar datos en el formulario al editar
  const handleEdit = (cita) => {
    try {
      const dateObj = new Date(cita.appointment_date);
      const fecha = dateObj.toISOString().split("T")[0];
      const hora = dateObj.toTimeString().slice(0, 5);

      setFormData({
        fecha,
        hora,
        especialidad: cita.description,
      });
      setEditingId(cita.id);
    } catch (error) {
      console.error("⚠️ Error al cargar cita en edición:", error);
    }
  };

  // 🔹 Eliminar cita
  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/api/appointments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        setCitas((prev) => prev.filter((cita) => cita.id !== id));
        alert("🗑️ Cita eliminada correctamente");
      } else {
        const data = await res.json();
        alert("❌ No se pudo eliminar: " + (data.message || "Error desconocido"));
      }
    } catch (error) {
      console.error("⚠️ Error al eliminar cita:", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="relative z-20">
        <Navbar />
      </header>

      <main className="flex flex-col flex-1 items-center justify-start p-6 relative z-10">
        {/* Formulario de citas */}
        <div className="bg-white p-8 rounded-lg w-full max-w-md border border-gray-300 shadow-md mb-10">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
            {editingId ? "Editar Cita" : "Agendar Cita"}
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-1">Fecha</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Hora</label>
              <input
                type="time"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Especialidad</label>
              <select
                name="especialidad"
                value={formData.especialidad}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option>Medicina General</option>
                <option>Pediatría</option>
                <option>Dermatología</option>
                <option>Cardiología</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              {editingId ? "Actualizar Cita" : "Guardar Cita"}
            </button>
          </form>
        </div>

        {/* Tabla de citas */}
        <div className="w-full max-w-3xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Citas Agendadas
          </h3>

          {citas.length === 0 ? (
            <p className="text-gray-500 text-center">No hay citas registradas</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300 text-sm shadow-md">
              <thead>
                <tr className="bg-blue-100 text-left">
                  <th className="border border-gray-300 px-3 py-2">Paciente</th>
                  <th className="border border-gray-300 px-3 py-2">Fecha</th>
                  <th className="border border-gray-300 px-3 py-2">Hora</th>
                  <th className="border border-gray-300 px-3 py-2">Especialidad</th>
                  <th className="border border-gray-300 px-3 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((cita) => {
                  const fechaCompleta = cita.appointment_date;
                  let fecha = "Sin fecha";
                  let hora = "Sin hora";

                  if (fechaCompleta) {
                    const dateObj = new Date(fechaCompleta.replace(" ", "T"));
                    fecha = dateObj.toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    });
                    hora = dateObj.toLocaleTimeString("es-CO", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });
                  }

                  return (
                  <tr key={cita.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2">
                      {cita.user?.name || "Tú"}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">{fecha}</td>
                    <td className="border border-gray-300 px-3 py-2">{hora}</td>
                    <td className="border border-gray-300 px-3 py-2">
                      {cita.description || "Sin especialidad"}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(cita)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleCancel(cita.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
