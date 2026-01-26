import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

// Stat Card Component
const StatCard = ({ title, value, change, changeType, icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-premier-dark mt-1">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${changeType === "up" ? "text-green-600" : "text-red-600"}`}>
            {changeType === "up" ? "↑" : "↓"} {change}
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

// Quick Action Card
const QuickAction = ({ title, description, href, icon }) => (
  <Link
    to={href}
    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md hover:border-premier-copper/30 transition-all group"
  >
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-premier-light flex items-center justify-center text-premier-copper group-hover:bg-premier-copper group-hover:text-white transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-premier-dark group-hover:text-premier-copper transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  </Link>
);

// Recent Booking Row
const BookingRow = ({ booking }) => {
  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    CHECKED_IN: "bg-green-100 text-green-800",
    CHECKED_OUT: "bg-gray-100 text-gray-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-3 px-4">
        <p className="font-medium text-premier-dark">
          {booking.guest?.firstName} {booking.guest?.lastName}
        </p>
        <p className="text-sm text-gray-500">{booking.guest?.email}</p>
      </td>
      <td className="py-3 px-4">
        <p className="font-medium text-premier-dark">{booking.room?.roomNumber}</p>
        <p className="text-sm text-gray-500">{booking.room?.roomType}</p>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">
        {new Date(booking.checkInDate).toLocaleDateString()} -{" "}
        {new Date(booking.checkOutDate).toLocaleDateString()}
      </td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
          {booking.status}
        </span>
      </td>
      <td className="py-3 px-4 text-right font-medium text-premier-dark">
        ${booking.totalAmount?.toFixed(2)}
      </td>
    </tr>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/dashboard");
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-premier-copper border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-premier-dark">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to the admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.users?.total || 0}
          change={`${stats?.users?.newThisMonth || 0} new this month`}
          changeType="up"
          color="bg-blue-100 text-blue-600"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
        />
        <StatCard
          title="Total Rooms"
          value={stats?.rooms?.total || 0}
          change={`${stats?.rooms?.occupancyRate || 0}% occupancy`}
          changeType={stats?.rooms?.occupancyRate > 50 ? "up" : "down"}
          color="bg-green-100 text-green-600"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          }
        />
        <StatCard
          title="Pending Bookings"
          value={stats?.bookings?.pending || 0}
          change={`${stats?.bookings?.checkedInToday || 0} check-ins today`}
          changeType="up"
          color="bg-yellow-100 text-yellow-600"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          }
        />
        <StatCard
          title="Revenue (30 days)"
          value={`$${(stats?.revenue?.thisMonth || 0).toLocaleString()}`}
          color="bg-purple-100 text-purple-600"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Room Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-semibold text-premier-dark mb-4">Room Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Available</span>
              <span className="font-semibold text-green-600">{stats?.rooms?.available || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Occupied</span>
              <span className="font-semibold text-blue-600">{stats?.rooms?.occupied || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Maintenance</span>
              <span className="font-semibold text-yellow-600">{stats?.rooms?.maintenance || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-2">
          <h3 className="font-semibold text-premier-dark mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuickAction
              title="Add New Room"
              description="Create a new hotel room"
              href="/admin/rooms?action=create"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>}
            />
            <QuickAction
              title="Upload Room Images"
              description="Add images to rooms"
              href="/admin/uploads?type=room"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            />
            <QuickAction
              title="Manage Menu"
              description="Update restaurant menu"
              href="/admin/menu"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}
            />
            <QuickAction
              title="Upload Menu Images"
              description="Add images to menu items"
              href="/admin/uploads?type=menu"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
            />
            <QuickAction
              title="View Users"
              description="Manage user accounts & roles"
              href="/admin/users"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            />
            <QuickAction
              title="General Uploads"
              description="Manage other media files"
              href="/admin/uploads"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
            />
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="font-semibold text-premier-dark">Recent Bookings</h3>
          <Link
            to="/admin/bookings"
            className="text-sm text-premier-copper hover:text-primary-600 font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Guest</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Room</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Dates</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentBookings?.length > 0 ? (
                stats.recentBookings.map((booking) => (
                  <BookingRow key={booking.id} booking={booking} />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No recent bookings
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
