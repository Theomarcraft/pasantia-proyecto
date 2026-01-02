import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // viene del AuthProvider
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 🔹 Función principal de inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      const data = res.data;
      console.log("📩 Respuesta del backend:", data);

      // 🔸 Token recibido
      const token =
        data.token?.plainTextToken || data.token || data.access_token || null;

      if (token && data.user) {
        // ✅ Guardar sesión global con AuthContext
        login({ user: data.user, token });

        // ✅ Guardar info extra en localStorage
        localStorage.setItem("userRole", data.user.role || "user");
        localStorage.setItem("userName", data.user.name || "");
        localStorage.setItem("userEmail", data.user.email || "");

        // ✅ Redirigir según el rol
        if (data.user.role === "admin") {
          navigate("/admin");
        } else if (data.user.role === "doctor") {
          navigate("/dashboard/doctor");
        } else {
          navigate("/citas");
        }
      } else {
        console.error("⚠️ El backend no devolvió token o usuario válido:", data);
        setErrorMessage("El servidor no devolvió credenciales válidas.");
      }
    } catch (error) {
      console.error("⚠️ Error en login:", error);
      setErrorMessage(
        error.response?.data?.message || "No se pudo conectar con el servidor."
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-gray-900 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg w-full max-w-md border border-gray-300 shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Iniciar Sesión
        </h2>

        {/* Mensaje de error */}
        {errorMessage && (
          <p className="text-red-500 text-center text-sm mb-4">
            {errorMessage}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm mb-1">Correo electrónico</label>
            <input
              type="email"
              placeholder="usuario@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Contraseña</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
