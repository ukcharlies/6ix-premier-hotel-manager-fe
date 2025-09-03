import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl text-blue-600">
          Hotel Management
        </Link>

        <div className="space-x-4">
          {currentUser ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/rooms">Rooms</Link>
              <Link to="/bookings">Bookings</Link>
              {currentUser.role === "ADMIN" && <Link to="/admin">Admin</Link>}
              <Link to="/profile">Profile</Link>
              <button
                onClick={handleLogout}
                className="ml-2 bg-blue-600 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link
                to="/register"
                className="ml-2 bg-blue-600 text-white px-3 py-1 rounded"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
