import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { buildUploadImageUrl } from "../utils/publicUrl";

const ROOM_STATUSES = ["AVAILABLE", "OCCUPIED", "MAINTENANCE"];

const statusClasses = {
  AVAILABLE: "bg-emerald-100 text-emerald-700",
  OCCUPIED: "bg-blue-100 text-blue-700",
  MAINTENANCE: "bg-amber-100 text-amber-700",
};

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState({});

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const res = await api.get("/rooms");
        const roomsData = Array.isArray(res.data?.rooms) ? res.data.rooms : [];
        setRooms(roomsData);
      } catch (err) {
        console.error("[ROOMS] Fetch error:", err);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const roomTypes = useMemo(
    () => [...new Set(rooms.map((room) => room.roomType).filter(Boolean))],
    [rooms],
  );

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const roomName = `Room ${room.roomNumber} ${room.roomType || ""}`.toLowerCase();
      const roomDescription = (room.description || "").toLowerCase();
      const roomStatus = room.status || "";
      const roomPrice = Number(room.pricePerNight || 0);
      const roomCapacity = Number(room.capacity || 0);

      if (search) {
        const q = search.toLowerCase();
        if (!roomName.includes(q) && !roomDescription.includes(q)) return false;
      }
      if (typeFilter && room.roomType !== typeFilter) return false;
      if (statusFilter && roomStatus !== statusFilter) return false;
      if (minCapacity && roomCapacity < Number(minCapacity)) return false;
      if (maxPrice && roomPrice > Number(maxPrice)) return false;
      return true;
    });
  }, [rooms, search, typeFilter, statusFilter, minCapacity, maxPrice]);

  const getRoomImages = (room) => {
    const imagePaths = Array.isArray(room.images)
      ? room.images
      : Array.isArray(room.roomImages)
      ? room.roomImages.map((ri) => ri.upload?.path).filter(Boolean)
      : [];
    return imagePaths.map((path) => buildUploadImageUrl(path)).filter(Boolean);
  };

  const moveImage = (roomId, total, direction) => {
    if (total <= 1) return;
    setActiveImageIndex((prev) => {
      const current = prev[roomId] || 0;
      const next = direction === "next" ? (current + 1) % total : (current - 1 + total) % total;
      return { ...prev, [roomId]: next };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[420px]">
        <div className="w-12 h-12 border-4 border-premier-copper border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-premier-dark to-dark-700 text-white px-6 py-8">
        <h1 className="text-3xl font-bold">Rooms</h1>
        <p className="text-white/80 mt-1">
          Browse room inventory with pricing, status, amenities, and gallery previews.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search room number, type, description"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
          >
            <option value="">All Types</option>
            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
          >
            <option value="">All Statuses</option>
            {ROOM_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={minCapacity}
            onChange={(e) => setMinCapacity(e.target.value)}
            placeholder="Min Capacity"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
          />
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max Price"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
          />
        </div>
      </div>

      {filteredRooms.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">No rooms match your current filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRooms.map((room) => {
            const images = getRoomImages(room);
            const currentIndex = activeImageIndex[room.id] || 0;
            const hasImages = images.length > 0;
            const activeImage = hasImages ? images[currentIndex % images.length] : "";
            const amenities = Array.isArray(room.amenities) ? room.amenities : [];

            return (
              <article
                key={room.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="relative h-60 bg-gray-100">
                  {hasImages ? (
                    <img
                      src={activeImage}
                      alt={`Room ${room.roomNumber}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fallback = e.currentTarget.nextElementSibling;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div className={`${hasImages ? "hidden" : "flex"} w-full h-full items-center justify-center text-gray-400`}>
                    <span>No image uploaded</span>
                  </div>
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${statusClasses[room.status] || "bg-gray-100 text-gray-700"}`}>
                    {room.status}
                  </span>
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 text-white">
                    {images.length} image{images.length === 1 ? "" : "s"}
                  </span>
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => moveImage(room.id, images.length, "prev")}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                        aria-label="Previous room image"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(room.id, images.length, "next")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                        aria-label="Next room image"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-premier-dark">Room {room.roomNumber}</h2>
                      <p className="text-sm text-gray-500">{room.roomType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-premier-copper">
                        ${Number(room.pricePerNight || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">per night</p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm min-h-[40px]">
                    {room.description || "No description provided for this room."}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-gray-50 px-3 py-2">
                      <p className="text-gray-500">Capacity</p>
                      <p className="font-semibold text-premier-dark">{room.capacity} guests</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 px-3 py-2">
                      <p className="text-gray-500">Room ID</p>
                      <p className="font-semibold text-premier-dark">#{room.id}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Amenities</p>
                    {amenities.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {amenities.map((amenity) => (
                          <span
                            key={`${room.id}-${amenity}`}
                            className="px-2.5 py-1 text-xs rounded-full bg-premier-light text-premier-dark border border-dark-100"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No amenities listed</p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
