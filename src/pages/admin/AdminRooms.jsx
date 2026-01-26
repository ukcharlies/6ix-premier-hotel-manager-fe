import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    roomNumber: "",
    roomType: "",
    description: "",
    pricePerNight: "",
    capacity: "",
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
      const res = await api.get("/rooms");
      if (res.data.success) {
        setRooms(res.data.rooms);
      }
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
      setError("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const data = {
        ...form,
        pricePerNight: parseFloat(form.pricePerNight),
        capacity: parseInt(form.capacity),
      };

      if (editingRoom) {
        await api.put(`/rooms/${editingRoom.id}`, data);
        setSuccess("Room updated successfully");
      } else {
        await api.post("/rooms", data);
        setSuccess("Room created successfully");
      }

      fetchRooms();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save room");
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setForm({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      description: room.description || "",
      pricePerNight: room.pricePerNight.toString(),
      capacity: room.capacity.toString(),
      status: room.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (room) => {
    if (!confirm(`Are you sure you want to delete room ${room.roomNumber}?`)) {
      return;
    }

    try {
      await api.delete(`/rooms/${room.id}`);
      setSuccess("Room deleted successfully");
      fetchRooms();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete room");
    }
  };

  const resetForm = () => {
    setForm({
      roomNumber: "",
      roomType: "",
      description: "",
      pricePerNight: "",
      capacity: "",
      status: "AVAILABLE",
    });
    setEditingRoom(null);
    setShowModal(false);
  };

  const statusColors = {
    AVAILABLE: "bg-green-100 text-green-800",
    OCCUPIED: "bg-blue-100 text-blue-800",
    MAINTENANCE: "bg-yellow-100 text-yellow-800",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-premier-copper border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-premier-dark">Rooms Management</h1>
          <p className="text-gray-500 mt-1">Manage hotel rooms and availability</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-premier-copper text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Room
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">×</button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center justify-between">
          {success}
          <button onClick={() => setSuccess(null)} className="text-green-700 hover:text-green-900">×</button>
        </div>
      )}

      {/* Rooms Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Room</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Price/Night</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Capacity</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <tr key={room.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-premier-dark">{room.roomNumber}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{room.roomType}</td>
                    <td className="py-3 px-4 font-medium text-premier-dark">
                      ${room.pricePerNight?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{room.capacity} guests</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[room.status]}`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleEdit(room)}
                        className="text-premier-copper hover:text-primary-600 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(room)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    No rooms found. Add your first room!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-premier-dark">
                {editingRoom ? "Edit Room" : "Add New Room"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                <input
                  type="text"
                  value={form.roomNumber}
                  onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                <select
                  value={form.roomType}
                  onChange={(e) => setForm({ ...form, roomType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
                  required
                >
                  <option value="">Select type</option>
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price/Night ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.pricePerNight}
                    onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
                    required
                  />
                </div>
              </div>
              {editingRoom && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
                  >
                    {statusTypes.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-premier-copper text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {editingRoom ? "Update Room" : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
