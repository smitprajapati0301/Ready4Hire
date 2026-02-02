import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Resume from "./pages/Resume";
import Interview from "./pages/Interview";
import Home from "./pages/Home";
import SiteShell from "./components/layout/SiteShell";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/landing" element={<Landing />} />

          {/* Protected routes */}
          <Route element={<SiteShell />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/resume"
              element={
                <ProtectedRoute>
                  <Resume />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview"
              element={
                <ProtectedRoute>
                  <Interview />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
