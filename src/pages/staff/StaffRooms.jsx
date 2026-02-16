import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { buildPublicUrl } from "../../utils/publicUrl";
import RoomImageManager from "../../components/RoomImageManager";

export default function StaffRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageManagerOpen, setImageManagerOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "Standard",
    description: "",
    pricePerNight: "",
    capacity: "",
    amenities: "",
    status: "AVAILABLE",
  });

  const roomTypes = ["Standard", "Deluxe", "Suite", "Premium", "Presidential"];
  const statusTypes = ["AVAILABLE", "OCCUPIED", "MAINTENANCE"];

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/rooms");
      console.log("[STAFF ROOMS] API Response:", response.data);

      if (response.data.success) {
        // Handle different response structures
        const roomsData = response.data.rooms || response.data.data || [];

        // Transform rooms to include image paths (backend may already provide images/image)
        const transformedRooms = roomsData.map((room) => {
          const imageUrls = room.images || room.roomImages?.map((ri) => ri.upload.path) || [];
          return {
            ...room,
            images: imageUrls,
          };
        });

        setRooms(Array.isArray(transformedRooms) ? transformedRooms : []);
        console.log(
          "[STAFF ROOMS] Transformed rooms:",
          transformedRooms.length,
        );
      }
    } catch (err) {
      console.error("[STAFF ROOMS] Fetch error:", err);
      setError(err.response?.data?.message || "Failed to load rooms");
      setRooms([]); // Prevent undefined errors
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        roomNumber: formData.roomNumber,
        roomType: formData.roomType,
        description: formData.description,
        pricePerNight: parseFloat(formData.pricePerNight),
        capacity: parseInt(formData.capacity),
        amenities: formData.amenities
          ? formData.amenities
              .split(",")
              .map((a) => a.trim())
              .filter(Boolean)
          : [],
        status: formData.status,
      };

      if (editingRoom) {
        await api.put(`/rooms/${editingRoom.id}`, payload);
      } else {
        await api.post("/rooms", payload);
      }

      setShowForm(false);
      setEditingRoom(null);
      resetForm();
      fetchRooms();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save room");
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      description: room.description || "",
      pricePerNight: room.pricePerNight.toString(),
      capacity: room.capacity.toString(),
      amenities: Array.isArray(room.amenities) ? room.amenities.join(", ") : "",
      status: room.status,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      roomNumber: "",
      roomType: "Standard",
      description: "",
      pricePerNight: "",
      capacity: "",
      amenities: "",
      status: "AVAILABLE",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-premier-dark">
            Rooms Management
          </h1>
          <p className="text-gray-500 mt-1">Create and manage hotel rooms</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingRoom(null);
            resetForm();
          }}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          + Add Room
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 text-red-500 hover:text-red-700"
          >
            Dismiss
          </button>
        </div>
      )}

      {showForm && (
        <div className="mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">
            {editingRoom ? "Edit Room" : "Add New Room"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Number
              </label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) =>
                  setFormData({ ...formData, roomNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Type
              </label>
              <select
                value={formData.roomType}
                onChange={(e) =>
                  setFormData({ ...formData, roomType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {roomTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (per night)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.pricePerNight}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerNight: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amenities (comma-separated)
              </label>
              <input
                type="text"
                value={formData.amenities}
                onChange={(e) =>
                  setFormData({ ...formData, amenities: e.target.value })
                }
                placeholder="WiFi, TV, Mini Bar"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {statusTypes.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingRoom(null);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                {editingRoom ? "Update Room" : "Create Room"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-48 bg-gray-200 relative overflow-hidden">
              {room.images?.[0] ? (
                <img
                  src={buildPublicUrl(room.images[0])}
                  alt={room.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/room.jpg";
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm mt-2">No Image</span>
                </div>
              )}
              <span
                className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded ${
                  room.status === "AVAILABLE"
                    ? "bg-green-100 text-green-700"
                    : room.status === "OCCUPIED"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {room.status}
              </span>
              <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-white/90 text-gray-700 rounded">
                {room.roomType}
              </span>
            </div>
            <div className="p-4">
              <div className="mb-2">
                <h3 className="font-semibold text-lg text-premier-dark">
                  Room {room.roomNumber} - {room.roomType}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {room.description}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-3 mb-3">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>Capacity: {room.capacity} guests</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-emerald-600">
                    ${room.pricePerNight ? Number(room.pricePerNight).toFixed(2) : "0.00"}
                  </span>
                  <span className="text-xs text-gray-500">per night</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveRoom(room);
                      setImageManagerOpen(true);
                    }}
                    className="px-3 py-2 text-sm border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Images
                  </button>
                  <button
                    onClick={() => handleEdit(room)}
                    className="px-4 py-2 text-sm border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No rooms found. Click "Add Room" to create your first room.
        </div>
      )}

      {imageManagerOpen && activeRoom && (
        <RoomImageManager
          roomId={activeRoom.id}
          roomNumber={activeRoom.roomNumber}
          onClose={async () => {
            setImageManagerOpen(false);
            setActiveRoom(null);
            await fetchRooms();
          }}
        />
      )}
    </div>
  );
}
