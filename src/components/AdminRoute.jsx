import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext";

/**
 * AdminRoute - Route guard for admin-only pages
 * 
 * Behavior:
 * - Loading: Shows loading spinner
 * - Not authenticated: Redirects to login
 * - Not admin: Redirects to dashboard with denial message
 * - Admin: Renders children
 */
export default function AdminRoute({ children }) {
  const { currentUser, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-premier-light">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-premier-copper border-t-transparent rounded-full animate-spin" />
          <p className="text-premier-dark/70">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!currentUser) {
    console.log(`[RBAC] Route denied: ${location.pathname} - User not authenticated`);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Not admin - redirect to dashboard
  if (!isAdmin) {
    console.log(`[RBAC] Route denied: ${location.pathname} - User ${currentUser.email} is not ADMIN (Role: ${currentUser.role})`);
    return (
      <Navigate 
        to="/dashboard" 
        state={{ 
          accessDenied: true, 
          message: "You don't have permission to access admin pages." 
        }} 
        replace 
      />
    );
  }

  // Admin - render children
  console.log(`[RBAC] Route granted: ${location.pathname} - Admin ${currentUser.email}`);
  return children;
}
