import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../ContextAPI/Auth";

const ProtectedAdminRoute = ({ children }) => {
  const { token, user } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
