import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const DoctorRoute = ({ children }) => {
  const { user, token } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Esperar a que AuthProvider cargue los datos del usuario (evita falsos redirects)
    const timer = setTimeout(() => setChecking(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // 🌀 Mientras AuthProvider aún carga
  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Verificando permisos...
      </div>
    );
  }

  // ❌ Si no hay sesión activa
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Si el rol no es doctor
  if (user.role !== "doctor") {
    return <Navigate to="/citas" replace />;
  }

  // ✅ Si todo está bien, renderiza la ruta del doctor
  return children;
};

export default DoctorRoute;
