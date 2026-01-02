import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const { setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);

  // 🔹 Obtener perfil actual del usuario autenticado (una sola vez)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/user");
        setUser(data);

        // ⚙️ Solo establecer los datos si los campos están vacíos (evita que borre lo que escribes)
        setFormData((prev) => ({
          name: prev.name || data.name || "",
          email: prev.email || data.email || "",
          password: prev.password || "",
        }));
      } catch (error) {
        console.error("⚠️ Error cargando perfil:", error);
        if (error.response?.status === 401) {
          alert("⚠️ Sesión expirada. Por favor inicia sesión de nuevo.");
          logout();
          navigate("/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // 👈 se ejecuta solo una vez

  // 🔹 Manejar cambios de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Enviar actualización al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.put("/user/profile", formData);
      setUser(data.user);
      alert("✅ Perfil actualizado correctamente");
      setFormData({
        name: data.user.name,
        email: data.user.email,
        password: "",
      });
    } catch (error) {
      console.error("⚠️ Error actualizando perfil:", error);
      alert("❌ No se pudo actualizar el perfil.");
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
            Mi Perfil
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nueva contraseña
              </label>
              <input
                type="password"
                name="password"
                placeholder="Deja vacío si no deseas cambiarla"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Guardar Cambios
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
