import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }) => {
  const { user, token } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Espera breve para que AuthProvider cargue user/token desde localStorage
    const timer = setTimeout(() => setChecking(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // 🔄 Mostrar pantalla de carga mientras se verifica la sesión
  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Cargando sesión...
      </div>
    );
  }

  // 🚫 Si no hay token o usuario, redirige al login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Si la sesión está activa, permite acceso
  return children;
};

export default PrivateRoute;
