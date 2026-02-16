import React, { useState, useEffect } from "react";
import api from "../../services/api";

export default function StaffRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "STANDARD",
    description: "",
    price: "",
    capacity: "",
    amenities: "",
    images: "",
    available: true,
  });

  const roomTypes = ["STANDARD", "DELUXE", "SUITE", "PENTHOUSE"];

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
        setRooms(Array.isArray(roomsData) ? roomsData : []);
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
        ...formData,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        amenities: formData.amenities.split(",").map((a) => a.trim()).filter(Boolean),
        images: formData.images.split(",").map((i) => i.trim()).filter(Boolean),
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
      name: room.name,
      type: room.type,
      description: room.description || "",
      price: room.price.toString(),
      capacity: room.capacity.toString(),
      amenities: room.amenities?.join(", ") || "",
      images: room.images?.join(", ") || "",
      available: room.available,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "STANDARD",
      description: "",
      price: "",
      capacity: "",
      amenities: "",
      images: "",
      available: true,
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
          <h1 className="text-2xl font-bold text-premier-dark">Rooms Management</h1>
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
          <button onClick={() => setError(null)} className="ml-4 text-red-500 hover:text-red-700">
            Dismiss
          </button>
        </div>
      )}

      {showForm && (
        <div className="mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">
            {editingRoom ? "Edit Room" : "Add New Room"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {roomTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (per night)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma-separated)</label>
              <input
                type="text"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                placeholder="WiFi, TV, Mini Bar"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Images (comma-separated URLs)</label>
              <input
                type="text"
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="available"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="available" className="text-sm font-medium text-gray-700">
                Available for booking
              </label>
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
          <div key={room.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-40 bg-gray-200 relative">
              {room.images?.[0] ? (
                <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded ${
                room.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {room.available ? "Available" : "Unavailable"}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-premier-dark">{room.name}</h3>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{room.type}</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{room.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-emerald-600">${room.price}/night</span>
                <button
                  onClick={() => handleEdit(room)}
                  className="px-3 py-1 text-sm border border-emerald-600 text-emerald-600 rounded hover:bg-emerald-50"
                >
                  Edit
                </button>
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
    </div>
  );
}
