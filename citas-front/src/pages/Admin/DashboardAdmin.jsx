import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

export default function DashboardAdmin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("stats"); // "stats" o "users"
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
  });
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [loading, setLoading] = useState(true);

  // 🔹 Obtener lista de usuarios
  const fetchUsers = async () => {
    try {
      const res = await api.get("admin/users");
      setUsers(res.data.data || res.data);
    } catch (error) {
      console.error("❌ Error al obtener usuarios:", error);
    }
  };

  // 🔹 Edición de usuarios
  const handleEdit = (u) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      role: u.role,
      password: "",
    });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/admin/users/${editingUser.id}`, formData);
      alert(data.message || "✅ Usuario actualizado correctamente");
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
      alert("Error al actualizar usuario");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      const { data } = await api.delete(`/admin/users/${id}`);
      alert(data.message || "🗑️ Usuario eliminado correctamente");
      fetchUsers();
    } catch (error) {
      console.error("❌ Error al eliminar usuario:", error);
    }
  };

  // 🔹 Cargar estadísticas
  const fetchStats = async (month = "all") => {
    try {
      const res = await api.get(
        `/admin/dashboard/stats${month !== "all" ? `?month=${month}` : ""}`
      );
      setStats(res.data);
    } catch (error) {
      console.error("❌ Error cargando métricas:", error);
    }
  };

  // 🔹 Cargar citas
  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments");
      setAppointments(res.data);
    } catch (error) {
      console.error("❌ Error cargando citas:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cargar datos al iniciar
  useEffect(() => {
    fetchStats();
    fetchAppointments();
    fetchUsers();
  }, []);

  // 🚫 Solo admin puede acceder
  if (!user || user.role !== "admin") {
    return <Navigate to="/citas" replace />;
  }

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 text-lg">
        Cargando datos del panel...
      </div>
    );
  }

  // 📊 Configuración de gráficos
  const citasChart = {
    labels: Object.keys(stats.appointmentsByMonth || {}).map((m) => `Mes ${m}`),
    datasets: [
      {
        label: "Citas por mes",
        data: Object.values(stats.appointmentsByMonth || {}),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const generalChart = {
    labels: ["Usuarios", "Servicios"],
    datasets: [
      {
        data: [stats.totalUsers, stats.totalServices],
        backgroundColor: [
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
        borderWidth: 2,
      },
    ],
  };

  // 🔹 Descargar PDF/Excel
  const download = (url) => {
    const token = localStorage.getItem("token");

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = url.endsWith("excel")
          ? "Citas.xlsx"
          : "Citas.pdf";
        link.click();
        alert("✅ Reporte generado correctamente");
      })
      .catch(() => alert("❌ Error al generar el reporte"));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-blue-100">
      <Navbar />

      <div className="p-8">
        {/* 🔸 Tabs de navegación */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "stats"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-blue-300 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("stats")}
          >
            📊 Estadísticas
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "users"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-blue-300 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("users")}
          >
            👥 Usuarios
          </button>
        </div>

        {/* ==================== VISTA ESTADÍSTICAS ==================== */}
        {activeTab === "stats" && (
          <>
            {/* Selector de mes */}
            <div className="flex justify-center mb-10">
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  fetchStats(e.target.value);
                }}
                className="px-4 py-2 rounded-md bg-gray-800 border border-blue-500 text-blue-300 focus:ring-2 focus:ring-blue-400"
              >
                <option value="all">Todos los meses</option>
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("es-ES", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
            </div>

            {/* Tarjetas estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 mb-8 gap-4">
              <div className="rounded-2xl p-5 bg-blue-600 text-white shadow text-center">
                <h3 className="text-lg font-semibold">Citas totales</h3>
                <p className="text-3xl font-bold">{stats.totalAppointments}</p>
              </div>
              <div className="rounded-2xl p-5 bg-green-600 text-white shadow text-center">
                <h3 className="text-lg font-semibold">Usuarios</h3>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="rounded-2xl p-5 bg-fuchsia-600 text-white shadow text-center">
                <h3 className="text-lg font-semibold">Servicios</h3>
                <p className="text-3xl font-bold">{stats.totalServices}</p>
              </div>
            </div>

            {/* Gráficos */}
            <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-2">
              <div className="rounded-2xl p-5 bg-slate-900 border border-slate-800 shadow">
                <h4 className="text-center text-blue-300 mb-4">Citas por mes</h4>
                <Bar data={citasChart} />
              </div>
              <div className="rounded-2xl p-5 bg-gray-900 border border-slate-800 shadow-md">
                <h4 className="text-center text-blue-300 mb-4">
                  Usuarios vs Servicios
                </h4>
                <Doughnut data={generalChart} />
              </div>
            </div>

            {/* Tabla de citas */}
            <div className="rounded-2xl p-5 bg-slate-900 border border-slate-800 shadow mt-10">
              <h4 className="text-center text-blue-300 mb-4">
                📅 Citas Registradas
              </h4>

              {/*Filtros de reporte*/}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300">Desde</label>
                  <input type="date" className="w-full mt-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2"/>
                </div>
                <div>
                  <label className="text-sm text-slate-300">Hasta</label>
                  <input type="date" className="w-full mt-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2"/>
                </div>
                <div>
                  <label className="text-sm text-slate-300">Estado</label>
                  <select className="w-full mt-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2">
                    <option value="">Todos</option>
                    <option>pending</option>
                    <option>confirmed</option>
                    <option>completed</option>
                    <option>cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300">Especialidad</label>
                  <select className="w-full mt-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2">
                    <option value="">Todas</option>
                    <option>Medicina General</option>
                    <option>Pediatría</option>
                    <option>Dermatología</option>
                    <option>Cardiología</option>
                  </select>
                </div>
              </div>

              {/* Botones de descarga */}
              {/*EXCEL*/}
              <div className="flex justify-end gap-3 mt-6 mb-6 px-2">
                <button
                  onClick={() =>
                    download(`http://127.0.0.1:8000/api/reports/appointments/excel`)
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium shadow-md transition-all duration-200 text-sm sm:text-base"
                >
                  <span role="img" aria-label="excel">📗</span>
                  <span className="hidden sm:inline">Descargar Excel</span>
                  <span className="inline sm:hidden">Excel</span>
                </button>

                {/*PDF*/}
                <button
                  onClick={() =>
                    download(`http://127.0.0.1:8000/api/reports/appointments/pdf`)
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow transition-all duration-200 text-sm sm:text-base"
                >
                  <span role="img" aria-label="PDF">📕</span>
                  <span className="hidden sm:inline">Descargar PDF</span>
                  <span className="inline sm:hidden">PDF</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="min-w-full border text-sm text-slate-200 text-center">
                  <thead className="bg-blue-700">
                    <tr>
                      <th className="p-2 border border-slate-800">Paciente</th>
                      <th className="p-2 border border-slate-800">Doctor</th>
                      <th className="p-2 border border-slate-800">Fecha</th>
                      <th className="p-2 border border-slate-800">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-800">
                        <td className="p-2 border border-slate-800">
                          {a.user?.name}
                        </td>
                        <td className="p-2 border border-slate-800">
                          {a.doctor?.name || "Sin asignar"}
                        </td>
                        <td className="p-2 border border-slate-800">
                          {new Date(a.appointment_date).toLocaleString("es-ES", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </td>
                        <td
                          className={`p-2 border border-slate-800 font-semibold ${
                            a.status === "confirmed"
                              ? "text-green-400"
                              : a.status === "cancelled"
                              ? "text-red-400"
                              : a.status === "completed"
                              ? "text-amber-300"
                              : "text-yellow-400"
                          }`}
                        >
                          {a.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ==================== VISTA USUARIOS ==================== */}
        {activeTab === "users" && (
          <div className="bg-gray-900 p-6 rounded-xl shadow-md">
            <h4 className="text-center text-blue-300 mb-6">
              👥 Gestión de Usuarios
            </h4>

            {/* Tabla de usuarios */}
            <div className="overflow-x-auto rounded-1xl border border-slate-800">
              <table className="min-w-full border text-sm text-blue-100 text-center">
                <thead className="bg-blue-800">
                  <tr>
                    <th className="p-2 border border-gray-700">ID</th>
                    <th className="p-2 border border-gray-700">Nombre</th>
                    <th className="p-2 border border-gray-700">Email</th>
                    <th className="p-2 border border-gray-700">Rol</th>
                    <th className="p-2 border border-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-800">
                      <td className="p-2 border border-gray-700">{u.id}</td>
                      <td className="p-2 border border-gray-700">{u.name}</td>
                      <td className="p-2 border border-gray-700">{u.email}</td>
                      <td className="p-2 border border-gray-700 capitalize">
                        {u.role}
                      </td>
                      <td className="p-2 border border-gray-700 space-x-2">
                        <button
                          onClick={() => handleEdit(u)}
                          className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Formulario de edición */}
            {editingUser && (
              <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
                <h4 className="text-lg font-semibold mb-4 text-blue-400 text-center">
                  ✏️ Editar Usuario #{editingUser.id}
                </h4>
                <form onSubmit={handleSave} className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">Nombre</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded bg-gray-900 text-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded bg-gray-900 text-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Rol</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded bg-gray-900 text-blue-100"
                    >
                      <option value="user">Usuario</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Nueva Contraseña (opcional)
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded bg-gray-900 text-blue-100"
                    />
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
