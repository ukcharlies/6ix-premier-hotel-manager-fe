import React, { createContext, useContext, useState, useEffect } from "react";
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
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.post("/auth/register", userData);
    if (res?.data?.success) {
      setCurrentUser(res.data.user);
    }
    return res;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setCurrentUser(null);
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

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        loading, 
        login, 
        logout,
        register,
        updateProfile,
        setCurrentUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
