import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext";

/**
 * StaffRoute - Route guard for staff/admin pages
 * 
 * Behavior:
 * - Loading: Shows loading spinner
 * - Not authenticated: Redirects to login
 * - Not staff/admin: Redirects to dashboard with denial message
 * - Staff or Admin: Renders children
 * 
 * This allows both ADMIN and STAFF roles to access operational features
 * like room management, menu management, uploads, and bookings.
 */
export default function StaffRoute({ children }) {
  const { currentUser, loading, canAccessStaffFeatures } = useAuth();
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
    console.log(`[RBAC] Staff route denied: ${location.pathname} - User not authenticated`);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Not staff or admin - redirect to dashboard
  if (!canAccessStaffFeatures) {
    console.log(`[RBAC] Staff route denied: ${location.pathname} - User ${currentUser.email} is not STAFF or ADMIN (Role: ${currentUser.role})`);
    return (
      <Navigate 
        to="/dashboard" 
        state={{ 
          accessDenied: true, 
          message: "You don't have permission to access staff pages." 
        }} 
        replace 
      />
    );
  }

  // Staff or Admin - render children
  console.log(`[RBAC] Staff route granted: ${location.pathname} - ${currentUser.role} ${currentUser.email}`);
  return children;
}
