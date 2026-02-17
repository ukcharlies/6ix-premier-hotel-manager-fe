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
  const [budget, setBudget] = useState("");
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
      if (budget && roomPrice > Number(budget)) return false;
      return true;
    });
  }, [rooms, search, typeFilter, statusFilter, minCapacity, budget]);

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
          Explore available rooms with detailed pricing, amenities, and full image galleries.
        </p>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Room #, type..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-transparent text-sm"
            >
              <option value="">All Types</option>
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-transparent text-sm"
            >
              <option value="">All Statuses</option>
              {ROOM_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Min Guests</label>
            <input
              type="number"
              min="1"
              value={minCapacity}
              onChange={(e) => setMinCapacity(e.target.value)}
              placeholder="Capacity"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Budget</label>
            <input
              type="number"
              min="0"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Your budget"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* No Results */}
      {filteredRooms.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <p className="text-gray-500 font-medium">No rooms match your filters</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRooms.map((room) => {
            const images = getRoomImages(room);
            const currentIndex = activeImageIndex[room.id] || 0;
            const hasImages = images.length > 0;
            const activeImage = hasImages ? images[currentIndex % images.length] : "";
            const amenities = Array.isArray(room.amenities) ? room.amenities : [];
            const hasMultipleImages = images.length > 1;

            return (
              <article
                key={room.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Image Container */}
                <div className="relative h-72 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {hasImages ? (
                    <img
                      src={activeImage}
                      alt={`Room ${room.roomNumber}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : null}
                  <div className={hasImages ? "hidden" : "absolute inset-0 flex flex-col items-center justify-center text-gray-400"}>
                    <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">No Images</span>
                  </div>

                  {/* Status Badge */}
                  <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold text-white backdrop-blur-sm ${statusClasses[room.status] || "bg-gray-600/70"}`}>
                    {room.status}
                  </div>

                  {/* Image Navigation */}
                  {hasMultipleImages && (
                    <>
                      <button
                        type="button"
                        onClick={() => moveImage(room.id, images.length, "prev")}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-lg hover:shadow-xl transition-all"
                        aria-label="Previous room image"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(room.id, images.length, "next")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-lg hover:shadow-xl transition-all"
                        aria-label="Next room image"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Image Counter & Gallery */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    {hasMultipleImages && (
                      <div className="bg-black/70 text-white px-2.5 py-1.5 rounded-full text-xs font-semibold min-w-[45px] text-center backdrop-blur-sm">
                        {currentIndex + 1}/{images.length}
                      </div>
                    )}
                    <span className="bg-black/70 text-white px-2.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
                      {images.length} photo{images.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold text-premier-dark">Room {room.roomNumber}</h2>
                      <p className="text-sm font-semibold text-premier-copper uppercase tracking-wide mt-1">
                        {room.roomType}
                      </p>
                    </div>
                    <div className="text-right bg-premier-copper/10 px-3 py-2 rounded-lg">
                      <p className="text-2xl font-bold text-premier-copper">
                        ${Number(room.pricePerNight || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600">per night</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {room.description || "No description provided for this room."}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-gray-50 px-3 py-2.5 border border-gray-100">
                      <p className="text-xs text-gray-600 font-medium">Capacity</p>
                      <p className="text-lg font-bold text-premier-dark">{room.capacity}</p>
                      <p className="text-xs text-gray-500">guests</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 px-3 py-2.5 border border-gray-100">
                      <p className="text-xs text-gray-600 font-medium">Status</p>
                      <p className={`text-lg font-bold ${
                        room.status === "AVAILABLE" ? "text-emerald-700" :
                        room.status === "OCCUPIED" ? "text-blue-700" :
                        "text-amber-700"
                      }`}>
                        {room.status}
                      </p>
                    </div>
                  </div>

                  {/* Amenities */}
                  {amenities.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-2.5">Amenities</p>
                      <div className="flex flex-wrap gap-2">
                        {amenities.map((amenity) => (
                          <span
                            key={`${room.id}-${amenity}`}
                            className="px-2.5 py-1.5 text-xs rounded-full bg-gradient-to-r from-premier-dark/5 to-premier-copper/5 text-premier-dark border border-premier-dark/10 font-medium"
                          >
                            ✓ {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
