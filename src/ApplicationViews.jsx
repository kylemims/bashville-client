// src/ApplicationViews.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Login } from "./views/Login";
import { Register } from "./views/Register.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./views/Dashboard";
import { ROUTES } from "./utils/constants.js";
import { PageTemplate } from "./views/PageTemplate";
import { HomePage } from "./views/HomePage";
import { NewProject } from "./views/NewProject.jsx";

export const ApplicationViews = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />

        {/* Protected routes */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/new"
          element={
            <ProtectedRoute>
              <NewProject />
            </ProtectedRoute>
          }
        />

        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/template" element={<PageTemplate />} />

        {/* Redirect any unknown routes to HomePage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* </Router> */}
    </AuthProvider>
  );
};
