import axios from "axios";

// 🌍 Configuración base del cliente Axios
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // ⏱️ Evita esperas infinitas (10 segundos)
});

// 🔐 Interceptor de solicitud: agrega el token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ⚠️ Interceptor de respuesta: maneja errores comunes del backend
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // 🚫 Si el token es inválido o expiró → limpiar sesión
      if (status === 401) {
        console.warn("⚠️ Sesión expirada o token inválido. Cerrando sesión...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login"; // Redirige automáticamente
      }

      // 🔒 Acceso denegado
      if (status === 403) {
        alert("No tienes permisos para realizar esta acción.");
      }

      // 💥 Error interno del servidor
      if (status >= 500) {
        console.error("Error del servidor:", error.response.data);
        alert("Error interno del servidor. Intenta nuevamente más tarde.");
      }
    } else {
      console.error("❌ Error de conexión o tiempo de espera:", error.message);
      alert("No se pudo conectar con el servidor. Verifica tu conexión.");
    }

    return Promise.reject(error);
  }
);

export default api;
