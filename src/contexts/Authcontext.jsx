import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount only
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        if (isMounted && res?.data?.success) {
          setCurrentUser(res.data.user);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Auth check failed:", error);
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res?.data?.success) {
      setCurrentUser(res.data.user);
      console.log(`[AUTH] User logged in: ${email}, Role: ${res.data.user.role}`);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.post("/auth/register", userData);
    if (res?.data?.success) {
      setCurrentUser(res.data.user);
      console.log(`[AUTH] User registered: ${userData.email}, Role: ${res.data.user.role}`);
    }
    return res;
  };

  const logout = async () => {
    try {
      const email = currentUser?.email;
      await api.post("/auth/logout");
      setCurrentUser(null);
      console.log(`[AUTH] User logged out: ${email}`);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateProfile = async (userData) => {
    const res = await api.put("/users/profile", userData);
    if (res?.data?.success) {
      setCurrentUser(res.data.user);
    }
    return res;
  };

  // Memoized role-based values
  const authValues = useMemo(() => {
    const role = currentUser?.role || null;
    const isAdmin = role === "ADMIN";
    const isStaff = role === "STAFF";
    const isGuest = role === "GUEST";
    const isAuthenticated = !!currentUser;
    // Can access staff features (ADMIN or STAFF)
    const canAccessStaffFeatures = isAdmin || isStaff;

    // Log role assignment for debugging
    if (currentUser && process.env.NODE_ENV === "development") {
      console.log(`[RBAC] User: ${currentUser.email}, Role: ${role}, isAdmin: ${isAdmin}, isStaff: ${isStaff}`);
    }

    return {
      currentUser,
      loading,
      role,
      isAdmin,
      isStaff,
      isGuest,
      isAuthenticated,
      canAccessStaffFeatures,
      login,
      logout,
      register,
      updateProfile,
      setCurrentUser,
    };
  }, [currentUser, loading]);

  return (
    <AuthContext.Provider value={authValues}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
