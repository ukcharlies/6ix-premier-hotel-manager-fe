import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/Authcontext";
import api from "../../services/api";

// Stat Card Component
function StatCard({ title, value, icon: Icon, color, link }) {
  const Card = link ? Link : "div";
  const cardProps = link ? { to: link } : {};
  
  return (
    <Card
      {...cardProps}
      className={`p-6 bg-white rounded-xl shadow-sm border border-gray-100 ${
        link ? "hover:shadow-md transition-shadow cursor-pointer" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-premier-dark">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon />
        </div>
      </div>
    </Card>
  );
}

// Icons
const RoomsIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const MenuItemIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const BookingsIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

export default function StaffDashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    rooms: 0,
    menuItems: 0,
    uploads: 0,
    bookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        console.log("[STAFF DASHBOARD] Fetching stats...");
        
        // Fetch stats from various endpoints with fallbacks
        const [roomsRes, menuRes, uploadsRes] = await Promise.all([
          api.get("/rooms").catch(err => {
            console.error("[STAFF DASHBOARD] Rooms error:", err);
            return { data: { rooms: [], data: [] } };
          }),
          api.get("/menu").catch(err => {
            console.error("[STAFF DASHBOARD] Menu error:", err);
            return { data: { menuItems: [], data: [] } };
          }),
          api.get("/uploads/stats").catch(err => {
            console.error("[STAFF DASHBOARD] Uploads error:", err);
            return { data: { stats: { total: 0 }, data: { count: 0 } } };
          }),
        ]);

        console.log("[STAFF DASHBOARD] Rooms response:", roomsRes.data);
        console.log("[STAFF DASHBOARD] Menu response:", menuRes.data);
        console.log("[STAFF DASHBOARD] Uploads response:", uploadsRes.data);

        // Extract data with fallbacks
        const roomsData = roomsRes.data?.rooms || roomsRes.data?.data || [];
        const menuData = menuRes.data?.menuItems || menuRes.data?.data || [];
        const uploadsData = uploadsRes.data?.stats || uploadsRes.data?.data || {};

        setRooms(Array.isArray(roomsData) ? roomsData.slice(0, 6) : []);
        setMenuItems(Array.isArray(menuData) ? menuData.slice(0, 6) : []);
        setStats({
          rooms: Array.isArray(roomsData) ? roomsData.length : 0,
          menuItems: Array.isArray(menuData) ? menuData.length : 0,
          uploads: uploadsData.total || uploadsData.count || 0,
          bookings: 0, // Placeholder until bookings are implemented
        });
      } catch (error) {
        console.error("[STAFF DASHBOARD] Failed to fetch stats:", error);
        // Set default stats on error
        setStats({
          rooms: 0,
          menuItems: 0,
          uploads: 0,
          bookings: 0,
        });
        setRooms([]);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Rooms",
      value: loading ? "..." : stats.rooms,
      icon: RoomsIcon,
      color: "bg-blue-500",
      link: "/staff/rooms",
    },
    {
      title: "Menu Items",
      value: loading ? "..." : stats.menuItems,
      icon: MenuItemIcon,
      color: "bg-amber-500",
      link: "/staff/menu",
    },
    {
      title: "Bookings",
      value: loading ? "..." : stats.bookings,
      icon: BookingsIcon,
      color: "bg-emerald-500",
      link: "/staff/bookings",
    },
    {
      title: "Uploads",
      value: loading ? "..." : stats.uploads,
      icon: UploadIcon,
      color: "bg-purple-500",
      link: "/staff/uploads",
    },
  ];

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-premier-dark">
          Welcome back, {currentUser?.firstName}!
        </h1>
        <p className="mt-1 text-gray-500">
          Here's an overview of your staff dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-premier-dark mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/staff/rooms"
            className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="p-2 bg-blue-500 rounded-lg">
              <RoomsIcon />
            </div>
            <div>
              <p className="font-medium text-premier-dark">Manage Rooms</p>
              <p className="text-sm text-gray-500">Add or edit rooms</p>
            </div>
          </Link>

          <Link
            to="/staff/menu"
            className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <div className="p-2 bg-amber-500 rounded-lg">
              <MenuItemIcon />
            </div>
            <div>
              <p className="font-medium text-premier-dark">Manage Menu</p>
              <p className="text-sm text-gray-500">Update restaurant items</p>
            </div>
          </Link>

          <Link
            to="/staff/bookings"
            className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <div className="p-2 bg-emerald-500 rounded-lg">
              <BookingsIcon />
            </div>
            <div>
              <p className="font-medium text-premier-dark">View Bookings</p>
              <p className="text-sm text-gray-500">Check reservations</p>
            </div>
          </Link>

          <Link
            to="/staff/uploads"
            className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <div className="p-2 bg-purple-500 rounded-lg">
              <UploadIcon />
            </div>
            <div>
              <p className="font-medium text-premier-dark">Upload Files</p>
              <p className="text-sm text-gray-500">Manage media assets</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Role Info Banner */}
      <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-100 rounded-full">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-emerald-800">Staff Access</h3>
            <p className="text-sm text-emerald-700 mt-1">
              As a staff member, you can manage rooms, menu items, bookings, and uploads.
              For user management or system settings, please contact an administrator.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Rooms Section */}
      {rooms.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-premier-dark">Recent Rooms</h2>
            <Link to="/staff/rooms" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <div key={room.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-premier-dark">{room.name}</h3>
                    <p className="text-sm text-gray-500">{room.type}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    room.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {room.available ? "Available" : "Unavailable"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{room.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-emerald-600">${Number(room.price).toFixed(2)}</span>
                  <span className="text-sm text-gray-500">{room.capacity} guests</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Menu Items Section */}
      {menuItems.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-premier-dark">Recent Menu Items</h2>
            <Link to="/staff/menu" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-premier-dark">{item.name}</h3>
                    <p className="text-xs text-amber-600 font-medium">{item.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-amber-600">${Number(item.price).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
