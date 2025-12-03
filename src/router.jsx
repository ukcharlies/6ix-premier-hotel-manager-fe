import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/Authcontext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

// Protected Pages
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import Admin from "./pages/Admin";

const PageShell = ({ children }) => (
  <div className="container mx-auto px-4 py-8">{children}</div>
);

function AppRouter() {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-premier-light flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Public Routes */}
            <Route
              path="/login"
              element={
                currentUser ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <PageShell>
                    <Login />
                  </PageShell>
                )
              }
            />
            <Route
              path="/register"
              element={
                currentUser ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <PageShell>
                    <Register />
                  </PageShell>
                )
              }
            />
            <Route
              path="/verify-email"
              element={
                <PageShell>
                  <VerifyEmail />
                </PageShell>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PageShell>
                  <ForgotPassword />
                </PageShell>
              }
            />
            <Route
              path="/reset-password/:token"
              element={
                <PageShell>
                  <ResetPassword />
                </PageShell>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PageShell>
                    <Dashboard />
                  </PageShell>
                </ProtectedRoute>
              }
            />

            <Route
              path="/rooms"
              element={
                <ProtectedRoute>
                  <PageShell>
                    <Rooms />
                  </PageShell>
                </ProtectedRoute>
              }
            />

            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <PageShell>
                    <Bookings />
                  </PageShell>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <PageShell>
                    <Profile />
                  </PageShell>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings/change-password"
              element={
                <ProtectedRoute>
                  <PageShell>
                    <ChangePassword />
                  </PageShell>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <PageShell>
                    <Admin />
                  </PageShell>
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={
                <PageShell>
                  <NotFound />
                </PageShell>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default AppRouter;
