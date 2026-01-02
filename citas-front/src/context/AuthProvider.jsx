import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

/**
 * 🔹 Proveedor del contexto de autenticación
 * Maneja: inicio, cierre de sesión y persistencia con localStorage
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  /**
   * 🔸 Cargar sesión guardada al iniciar la app
   */
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      }
      if (storedToken && storedToken !== "undefined") {
        setToken(storedToken);
      }
    } catch (error) {
      console.error("⚠️ Error cargando datos de sesión:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🔹 Verificar usuario en el backend (opcional)
   * — Esto valida el token con Laravel cada vez que recargas
   */
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        } else {
          console.warn("Token inválido o expirado, cerrando sesión");
          logout();
        }
      } catch (error) {
        console.error("⚠️ Error al validar sesión:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  /**
   * 🔹 Iniciar sesión
   */
  const login = (data) => {
    const user = data.user || data?.data?.user;
    const token = data.token || data?.data?.token;

    if (user && token) {
      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } else {
      console.error("⚠️ Login fallido: datos inválidos del servidor");
    }
  };

  /**
   * 🔹 Registrar usuario
   */
  const register = (data) => {
    const user = data.user || data?.data?.user;
    const token = data.token || data?.data?.token;

    if (user && token) {
      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } else {
      console.error("⚠️ Registro fallido: datos inválidos del servidor");
    }
  };

  /**
   * 🔹 Cerrar sesión
   */
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  /**
   * 🔹 Indicador de carga mientras se valida sesión
   */
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.5rem",
          color: "#555",
        }}
      >
        🔄 Verificando sesión...
      </div>
    );
  }

  /**
   * 🔹 Proveer valores globales
   */
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setUser,
        setToken,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
