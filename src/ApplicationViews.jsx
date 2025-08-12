// src/ApplicationViews.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Dashboard } from "./views/Dashboard";
import { ROUTES } from "./utils/constants.js";
import { PageTemplate } from "./views/PageTemplate";
import { HomePage } from "./views/HomePage";

export const ApplicationViews = () => {
  return (
    <AuthProvider>
      {/* <Router> */}
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
