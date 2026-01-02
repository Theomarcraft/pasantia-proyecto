import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // usamos login() del AuthProvider
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 🔹 Función principal para registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/register", {
        name,
        email,
        password,
      });

      const data = res.data;
      console.log("📩 Respuesta del backend:", data);

      // Laravel devuelve user + token
      const token =
        data.token?.plainTextToken || data.token || data.access_token || null;

      if (token && data.user) {
        // ✅ Guardar sesión global usando AuthContext
        login({ user: data.user, token });

        // ✅ Guardar datos en localStorage
        localStorage.setItem("userRole", data.user.role || "user");
        localStorage.setItem("userName", data.user.name || "");
        localStorage.setItem("userEmail", data.user.email || "");

        // ✅ Confirmar registro exitoso
        setErrorMessage("✅ Usuario registrado correctamente.");
        navigate("/citas");
      } else {
        setErrorMessage(
          "⚠️ Usuario registrado, pero no se recibió token. Inicia sesión."
        );
        navigate("/login");
      }
    } catch (error) {
      console.error("❌ Error en registro:", error);

      // Muestra error del backend si existe
      setErrorMessage(
        error.response?.data?.message ||
          "❌ Error al registrar usuario. Intenta nuevamente."
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="relative z-20">
        <Navbar />
      </header>

      <main className="flex flex-1 items-center justify-center relative z-10">
        <div className="bg-white p-8 rounded-lg w-full max-w-md border border-gray-300 shadow-md">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
            Crear cuenta
          </h2>

          {/* Mensaje de error o éxito */}
          {errorMessage && (
            <p
              className={`text-center text-sm mb-4 ${
                errorMessage.startsWith("✅")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {errorMessage}
            </p>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm mb-1">Nombre completo</label>
              <input
                type="text"
                placeholder="Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

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
              Registrarse
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Inicia sesión
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;
