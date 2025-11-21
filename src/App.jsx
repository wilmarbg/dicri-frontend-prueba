import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Expedientes from "./pages/Expedientes";
import NuevoExpediente from "./pages/NuevoExpediente";
import ExpedienteDetalle from "./pages/ExpedienteDetalle";
import Reportes from './pages/Reportes';
import Loading from "./components/common/Loading";

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

function AppContent() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expedientes"
          element={
            <ProtectedRoute>
              <Expedientes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expedientes/nuevo"
          element={
            <ProtectedRoute>
              <NuevoExpediente />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expedientes/:id"
          element={
            <ProtectedRoute>
              <ExpedienteDetalle />
            </ProtectedRoute>
          }
        />

        <Route
            path="/reportes"
            element={
                <ProtectedRoute>
                    <Reportes />
                </ProtectedRoute>
            }
        />

        {}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
