import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext";

export default function ProtectedRoute({ children, requiredRole }) {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (requiredRole && currentUser.role !== requiredRole)
    return <Navigate to="/dashboard" replace />;

  return children;
}
