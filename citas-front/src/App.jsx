import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";

// 🧭 Páginas
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Citas from "./pages/citas.jsx";
import Perfil from "./pages/perfil.jsx";
import DashboardAdmin from "./pages/Admin/DashboardAdmin.jsx";
import DashboardDoctor from "./pages/Doctor/DashboardDoctor.jsx";

// 🔐 Rutas protegidas
import AdminRoute from "./pages/Admin/AdminRoute.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import DoctorRoute from "./components/DoctorRoute.jsx";

// 🔔 Notificaciones
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <div className="bg-zinc-950 text-blue-400 min-h-screen">
        <main className="p-6">
          <Routes>
            {/* 🌐 Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 👤 Usuario autenticado */}
            <Route
              path="/citas"
              element={
                <PrivateRoute>
                  <Citas />
                </PrivateRoute>
              }
            />

            <Route
              path="/perfil"
              element={
                <PrivateRoute>
                  <Perfil />
                </PrivateRoute>
              }
            />

            {/* 🩺 Doctor */}
            <Route
              path="/dashboard/doctor"
              element={
                <DoctorRoute>
                  <DashboardDoctor />
                </DoctorRoute>
              }
            />

            {/* 👑 Administrador */}
            <Route  
              path="/admin"
              element={
                <AdminRoute>
                  <DashboardAdmin />
                </AdminRoute>
              }
            />

            {/* 🏠 Redirecciones y error 404 */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
              path="*"
              element={
                <div className="text-center text-red-400 mt-10 text-lg font-semibold">
                  🚫 Página no encontrada
                </div>
              }
            />
          </Routes>
        </main>

        {/* 🔔 Contenedor global de notificaciones */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          theme="dark"
        />
      </div>
    </AuthProvider>
  );
}

export default App;
