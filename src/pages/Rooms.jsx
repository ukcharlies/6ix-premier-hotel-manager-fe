import React, { useEffect, useState } from "react";
import api from "../services/api";
import RoomCard from "../components/RoomCard";
import RoomFilter from "../components/RoomFilter";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    minPrice: "",
    maxPrice: "",
    capacity: "",
    status: "",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [rooms, filters]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await api.get("/rooms");
      console.log("[ROOMS] API Response:", res.data);
      
      // Handle different response structures
      const roomsData = res.data?.rooms || res.data?.data || res.data || [];
      setRooms(Array.isArray(roomsData) ? roomsData : []);
    } catch (err) {
      console.error("[ROOMS] Fetch error:", err);
      setRooms([]); // Prevent undefined errors
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let r = rooms;
    if (filters.type) r = r.filter((x) => x.roomType === filters.type);
    if (filters.minPrice)
      r = r.filter((x) => x.pricePerNight >= parseFloat(filters.minPrice));
    if (filters.maxPrice)
      r = r.filter((x) => x.pricePerNight <= parseFloat(filters.maxPrice));
    if (filters.capacity)
      r = r.filter((x) => x.capacity >= parseInt(filters.capacity));
    if (filters.status) r = r.filter((x) => x.currentStatus === filters.status);
    setFiltered(r);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-premier-copper border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Available Rooms</h1>
      <RoomFilter filters={filters} onFilterChange={setFilters} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filtered.map((r) => (
          <RoomCard key={r.id} room={r} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-12">No rooms match your filters.</div>
      )}
    </div>
  );
}
