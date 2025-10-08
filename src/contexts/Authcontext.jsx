import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto authenticate for development
  useEffect(() => {
    // Set a mock authenticated user
    setCurrentUser({
      id: 1,
      email: "test@example.com",
      name: "Test User",
      role: "admin", // This will give access to all pages
    });
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res?.data?.token) {
      localStorage.setItem("token", res.data.token);
      setCurrentUser(res.data.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
