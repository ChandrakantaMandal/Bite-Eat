import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../pages/auth/hook/useAuth";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/user/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
