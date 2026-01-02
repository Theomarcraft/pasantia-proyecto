import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user , logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout()
    navigate("/login");
  };

  // Detectar ruta de "Citas" según rol
  const citasLink =
  user?.role === "doctor"
  ? "/dashboard/doctor"
  : "/citas";

  return (
    <header className="bg-gray-900 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.8)]">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo / Título */}
        <Link
        to={citasLink}
        className="text-xl font-bold text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.7)]"
        >
          Citas Médicas
        </Link>

        {/* Navegación */}
        <nav className="flex gap-6 items-center">
          {user && (
            <>
              {/* Rutas comunes a todos los usuarios autenticados */}
              {user.role !== "doctor" && (
                <Link to="/citas" className="hover:text-blue-300 transition">
                  Citas
                </Link>
              )}

              <Link to="/perfil" className="hover:text-blue-300 transition">
                Perfil
              </Link>

              {/* 🔹 Rutas según rol */}
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="font-semibold text-blue-400 hover:text-blue-300 transition drop-shadow-[0_0_5px_rgba(59,130,246,0.7)]"
                >
                  Dashboard
                </Link>
              )}

              {user.role === "doctor" && (
                <Link
                  to="/dashboard/doctor"
                  className="font-semibold text-blue-400 hover:text-blue-300 transition drop-shadow-[0_0_5px_rgba(59,130,246,0.7)]"
                >
                  Panel Doctor
                </Link>
              )}
            </>
          )}

          {/* 🔹 Sección de sesión */}
          {user ? (
            <>
              <span className="font-semibold text-white">
                {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-white transition"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-300 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-300 transition">
                Registro
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
