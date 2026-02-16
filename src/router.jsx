import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/Authcontext";
import { SessionProvider } from "./contexts/SessionContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import StaffRoute from "./components/StaffRoute";

// Public Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Functions from "./pages/Functions";
import RecreationalFacilities from "./pages/RecreationalFacilities";

// Protected Pages
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Menu from "./pages/Menu";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUploads from "./pages/admin/AdminUploads";

// Staff Pages
import StaffLayout from "./pages/staff/StaffLayout";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffRooms from "./pages/staff/StaffRooms";
import StaffMenu from "./pages/staff/StaffMenu";
import StaffBookings from "./pages/staff/StaffBookings";
import StaffUploads from "./pages/staff/StaffUploads";

const PageShell = ({ children }) => (
  <div className="container mx-auto px-4 py-8">{children}</div>
);

function AppRouter() {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <SessionProvider>
          <Routes>
            {/* Admin Routes - separate layout without Navbar/Footer */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <ErrorBoundary>
                    <AdminLayout />
                  </ErrorBoundary>
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="rooms" element={<AdminRooms />} />
              <Route path="menu" element={<AdminMenu />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="uploads" element={<AdminUploads />} />
            </Route>

            {/* Staff Routes - separate layout without Navbar/Footer */}
            <Route
              path="/staff"
              element={
                <StaffRoute>
                  <ErrorBoundary>
                    <StaffLayout />
                  </ErrorBoundary>
                </StaffRoute>
              }
            >
              <Route index element={<StaffDashboard />} />
              <Route path="rooms" element={<StaffRooms />} />
              <Route path="menu" element={<StaffMenu />} />
              <Route path="bookings" element={<StaffBookings />} />
              <Route path="uploads" element={<StaffUploads />} />
            </Route>

            {/* Main Site Routes - with Navbar/Footer */}
            <Route
              path="*"
              element={
              <div className="min-h-screen bg-premier-light flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/functions" element={<Functions />} />
                      <Route path="/facilities" element={<RecreationalFacilities />} />

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
                    path="/menu"
                    element={
                      <ProtectedRoute>
                        <PageShell>
                          <Menu />
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
                    path="*"
                    element={
                      <PageShell>
                        <NotFound />
                      </PageShell>
                    }
                  />
                </Routes>
                  </ErrorBoundary>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
      </SessionProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default AppRouter;
