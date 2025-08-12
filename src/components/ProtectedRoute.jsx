import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { ROUTES } from "../utils/constants.js";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  console.log(`Checking access to ${location.pathname}`, { isAuthenticated, loading });

  if (loading) {
    console.log("Auth context is loading, showing loading state");
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // ✅ If NOT authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("User is NOT authenticated, redirecting to login");
    return <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
  }

  // ✅ If authenticated, render the protected content
  console.log("User is authenticated, rendering protected content");
  return children;
};
