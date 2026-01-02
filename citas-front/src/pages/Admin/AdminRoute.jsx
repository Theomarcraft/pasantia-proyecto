import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, token } = useAuth();
  const [checking, setChecking] = useState(true);

  // ⏳ Esperar a que AuthProvider cargue usuario/token
  useEffect(() => {
    const timer = setTimeout(() => setChecking(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // 🔄 Mostrar pantalla de carga mientras se verifica la sesión
  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Verificando acceso...
      </div>
    );
  }

  // 🚫 Si no hay sesión activa, redirige al login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Si el usuario no es administrador, redirige a citas
  if (user.role !== "admin") {
    return <Navigate to="/citas" replace />;
  }

  // ✅ Si pasa todas las validaciones, renderiza el contenido protegido
  return children;
};

export default AdminRoute;
