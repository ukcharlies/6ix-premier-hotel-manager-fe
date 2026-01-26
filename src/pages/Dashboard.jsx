import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext";

export default function Dashboard() {
  const { currentUser, isAdmin, isStaff } = useAuth();
  const location = useLocation();
  const accessDenied = location.state?.accessDenied;
  const deniedMessage = location.state?.message;

  return (
    <div className="space-y-6">
      {/* Access Denied Alert */}
      {accessDenied && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium">{deniedMessage || "Access denied"}</span>
          </div>
        </div>
      )}

      {/* Welcome Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-premier-dark">
          Welcome back, {currentUser?.firstName}!
        </h2>
        <p className="mt-2 text-gray-600">
          You are logged in as <span className="font-medium text-premier-copper">{currentUser?.role}</span>
        </p>
      </div>

      {/* Quick Actions based on role */}
      {(isAdmin || isStaff) && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-premier-dark mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 bg-premier-copper text-white rounded-lg hover:bg-premier-copper/90 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin Panel
              </Link>
            )}
            {isStaff && (
              <Link
                to="/staff"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Staff Panel
              </Link>
            )}
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 px-4 py-2 border border-premier-dark text-premier-dark rounded-lg hover:bg-premier-dark hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Browse Rooms
            </Link>
          </div>
        </div>
      )}

      {/* Guest Quick Actions */}
      {!isAdmin && !isStaff && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-premier-dark mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 px-4 py-2 bg-premier-copper text-white rounded-lg hover:bg-premier-copper/90 transition-colors"
            >
              Browse Rooms
            </Link>
            <Link
              to="/bookings"
              className="inline-flex items-center gap-2 px-4 py-2 border border-premier-dark text-premier-dark rounded-lg hover:bg-premier-dark hover:text-white transition-colors"
            >
              My Bookings
            </Link>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-600">
          More dashboard features coming soon: analytics widgets, occupancy stats, revenue tracking, and upcoming check-ins.
        </p>
      </div>
    </div>
  );
}
