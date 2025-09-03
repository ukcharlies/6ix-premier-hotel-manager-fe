import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Admin() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    roomNumber: "",
    roomType: "",
    description: "",
    pricePerNight: "",
    capacity: "",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/rooms");
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/rooms", {
        ...form,
        pricePerNight: parseFloat(form.pricePerNight),
        capacity: parseInt(form.capacity),
      });
      fetchRooms();
      setForm({
        roomNumber: "",
        roomType: "",
        description: "",
        pricePerNight: "",
        capacity: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Create Room</h2>
        <form onSubmit={submit} className="grid grid-cols-1 gap-3">
          <input
            value={form.roomNumber}
            onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
            placeholder="Room number"
            className="border p-2 rounded"
          />
          <input
            value={form.roomType}
            onChange={(e) => setForm({ ...form, roomType: e.target.value })}
            placeholder="Room type"
            className="border p-2 rounded"
          />
          <input
            value={form.pricePerNight}
            onChange={(e) =>
              setForm({ ...form, pricePerNight: e.target.value })
            }
            placeholder="Price per night"
            className="border p-2 rounded"
          />
          <input
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            placeholder="Capacity"
            className="border p-2 rounded"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            className="border p-2 rounded"
          />
          <button className="bg-blue-600 text-white p-2 rounded">
            Create Room
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-3">Rooms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map((r) => (
            <div key={r.id} className="bg-white p-4 rounded shadow">
              <div>
                {r.roomNumber} — {r.roomType}
              </div>
              <div>Price: {r.pricePerNight}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
