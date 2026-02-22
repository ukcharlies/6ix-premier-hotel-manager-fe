import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/Authcontext";
import { buildUploadImageUrl } from "../utils/publicUrl";

const ROOM_STATUSES = ["AVAILABLE", "OCCUPIED", "MAINTENANCE"];

const statusClasses = {
  AVAILABLE: "bg-emerald-100 text-emerald-700",
  OCCUPIED: "bg-blue-100 text-blue-700",
  MAINTENANCE: "bg-amber-100 text-amber-700",
};

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

const calculateNights = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) return 0;
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) return 0;
  const diff = checkOut.getTime() - checkIn.getTime();
  if (diff <= 0) return 0;
  return Math.max(1, Math.ceil(diff / (24 * 60 * 60 * 1000)));
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function Rooms() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [budget, setBudget] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [bookingRoomId, setBookingRoomId] = useState(null);
  const [availabilityMeta, setAvailabilityMeta] = useState(null);
  const [availabilityInput, setAvailabilityInput] = useState({
    checkInDate: "",
    checkOutDate: "",
    guests: "1",
  });

  const isAvailabilityMode = Boolean(availabilityMeta);
  const nights = calculateNights(availabilityInput.checkInDate, availabilityInput.checkOutDate);

  const setBanner = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
  };

  const fetchRooms = async ({ checkInDate, checkOutDate, guests } = {}) => {
    try {
      setLoading(true);
      setMessage("");

      if (checkInDate && checkOutDate) {
        const response = await api.get("/bookings/availability", {
          params: { checkInDate, checkOutDate, guests: guests || 1 },
        });
        const payload = response.data?.data || {};
        const availableRooms = Array.isArray(payload.availableRooms) ? payload.availableRooms : [];
        setRooms(availableRooms);
        setAvailabilityMeta({
          checkInDate,
          checkOutDate,
          guests: Number(guests || 1),
          totalRoomsConsidered: payload.totalRoomsConsidered || 0,
          availableCount: payload.availableCount || availableRooms.length,
        });
        return;
      }

      const response = await api.get("/rooms");
      const roomsData = Array.isArray(response.data?.rooms) ? response.data.rooms : [];
      setRooms(roomsData);
      setAvailabilityMeta(null);
    } catch (error) {
      console.error("[ROOMS] Fetch error:", error);
      setRooms([]);
      setAvailabilityMeta(null);
      setBanner(error.response?.data?.message || "Failed to fetch rooms", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryCheckIn = searchParams.get("checkInDate");
    const queryCheckOut = searchParams.get("checkOutDate");
    const queryGuests = searchParams.get("guests") || "1";

    setAvailabilityInput({
      checkInDate: queryCheckIn || "",
      checkOutDate: queryCheckOut || "",
      guests: queryGuests,
    });

    if (queryCheckIn && queryCheckOut) {
      fetchRooms({
        checkInDate: queryCheckIn,
        checkOutDate: queryCheckOut,
        guests: queryGuests,
      });
    } else {
      fetchRooms();
    }
  }, [searchParams]);

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
        ? room.roomImages.map((roomImage) => roomImage.upload?.path).filter(Boolean)
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

  const applyAvailabilitySearch = () => {
    if (!availabilityInput.checkInDate || !availabilityInput.checkOutDate) {
      setBanner("Select both check-in and check-out dates.", "error");
      return;
    }

    const guests = Math.max(1, Number(availabilityInput.guests || 1));
    const params = new URLSearchParams({
      checkInDate: availabilityInput.checkInDate,
      checkOutDate: availabilityInput.checkOutDate,
      guests: String(guests),
    });
    setSearchParams(params);
  };

  const clearAvailabilitySearch = () => {
    setSearchParams({});
  };

  const handleBookRoom = async (room) => {
    if (!availabilityInput.checkInDate || !availabilityInput.checkOutDate || nights <= 0) {
      setBanner("Select valid check-in and check-out dates before booking.", "error");
      return;
    }

    if (!currentUser) {
      navigate("/login", {
        state: {
          from: { pathname: "/rooms", search: location.search },
          message: "Sign in to complete this booking.",
        },
      });
      return;
    }

    if (currentUser.role === "STAFF") {
      navigate("/staff/bookings");
      return;
    }
    if (currentUser.role === "ADMIN") {
      navigate("/admin/bookings");
      return;
    }

    try {
      setBookingRoomId(room.id);
      await api.post("/bookings", {
        roomId: room.id,
        checkInDate: availabilityInput.checkInDate,
        checkOutDate: availabilityInput.checkOutDate,
        numberOfGuests: Math.max(1, Number(availabilityInput.guests || 1)),
      });
      setBanner("Booking submitted successfully. You can track status in My Bookings.", "success");
      navigate("/bookings");
    } catch (error) {
      console.error("[ROOMS] Booking create error:", error);
      setBanner(error.response?.data?.message || "Unable to complete booking", "error");
    } finally {
      setBookingRoomId(null);
    }
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
          Explore room details, view amenities, check date availability, and reserve with one click.
        </p>
      </div>

      {message ? (
        <div
          className={`rounded-lg px-4 py-3 border ${
            messageType === "error"
              ? "bg-rose-50 border-rose-200 text-rose-700"
              : messageType === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-blue-50 border-blue-200 text-blue-700"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Check-in</label>
            <input
              type="date"
              value={availabilityInput.checkInDate}
              onChange={(event) =>
                setAvailabilityInput((prev) => ({ ...prev, checkInDate: event.target.value }))
              }
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Check-out</label>
            <input
              type="date"
              value={availabilityInput.checkOutDate}
              onChange={(event) =>
                setAvailabilityInput((prev) => ({ ...prev, checkOutDate: event.target.value }))
              }
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Guests</label>
            <input
              type="number"
              min="1"
              value={availabilityInput.guests}
              onChange={(event) =>
                setAvailabilityInput((prev) => ({ ...prev, guests: event.target.value }))
              }
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-transparent text-sm"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={applyAvailabilitySearch}
              className="w-full px-3 py-2.5 bg-premier-copper text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-semibold"
            >
              Check Availability
            </button>
            {isAvailabilityMode ? (
              <button
                onClick={clearAvailabilitySearch}
                className="px-3 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                Reset
              </button>
            ) : null}
          </div>
        </div>

        {isAvailabilityMode ? (
          <div className="bg-premier-light/40 border border-premier-copper/20 rounded-lg p-3 text-sm">
            <p className="font-semibold text-premier-dark">
              {availabilityMeta.availableCount} of {availabilityMeta.totalRoomsConsidered} rooms available
            </p>
            <p className="text-gray-600 mt-1">
              Stay: {formatDate(availabilityMeta.checkInDate)} to {formatDate(availabilityMeta.checkOutDate)} •{" "}
              {availabilityMeta.guests} guest{availabilityMeta.guests > 1 ? "s" : ""} • {nights} night
              {nights !== 1 ? "s" : ""}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Add dates and guests to view only rooms available for your exact stay.
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Search</label>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Room #, type..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Type</label>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
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
              onChange={(event) => setStatusFilter(event.target.value)}
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
              onChange={(event) => setMinCapacity(event.target.value)}
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
              onChange={(event) => setBudget(event.target.value)}
              placeholder="Per night"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-premier-copper focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {filteredRooms.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500 font-medium">No rooms match your current search.</p>
          <p className="text-gray-400 text-sm mt-1">Try changing filters or date range.</p>
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
            const estimatedTotal = nights > 0 ? Number(room.pricePerNight || 0) * nights : 0;

            return (
              <article
                key={room.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative h-72 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {hasImages ? (
                    <img
                      src={activeImage}
                      alt={`Room ${room.roomNumber}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/room.jpg";
                      }}
                    />
                  ) : null}
                  <div className={hasImages ? "hidden" : "absolute inset-0 flex flex-col items-center justify-center text-gray-400"}>
                    <span className="text-xs">No Images</span>
                  </div>

                  <div
                    className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold ${
                      statusClasses[room.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {room.status}
                  </div>

                  {hasMultipleImages ? (
                    <>
                      <button
                        type="button"
                        onClick={() => moveImage(room.id, images.length, "prev")}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-lg"
                        aria-label="Previous room image"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(room.id, images.length, "next")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-lg"
                        aria-label="Next room image"
                      >
                        ›
                      </button>
                    </>
                  ) : null}

                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    {hasMultipleImages ? (
                      <div className="bg-black/70 text-white px-2.5 py-1.5 rounded-full text-xs font-semibold min-w-[45px] text-center">
                        {currentIndex + 1}/{images.length}
                      </div>
                    ) : null}
                    <span className="bg-black/70 text-white px-2.5 py-1.5 rounded-full text-xs font-semibold">
                      {images.length} photo{images.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold text-premier-dark">Room {room.roomNumber}</h2>
                      <p className="text-sm font-semibold text-premier-copper uppercase tracking-wide mt-1">
                        {room.roomType}
                      </p>
                    </div>
                    <div className="text-right bg-premier-copper/10 px-3 py-2 rounded-lg">
                      <p className="text-2xl font-bold text-premier-copper">{formatMoney(room.pricePerNight)}</p>
                      <p className="text-xs text-gray-600">per night</p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    {room.description || "No description provided for this room."}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-gray-50 px-3 py-2.5 border border-gray-100">
                      <p className="text-xs text-gray-600 font-medium">Capacity</p>
                      <p className="text-lg font-bold text-premier-dark">{room.capacity}</p>
                      <p className="text-xs text-gray-500">guests</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 px-3 py-2.5 border border-gray-100">
                      <p className="text-xs text-gray-600 font-medium">Stay Total</p>
                      <p className="text-lg font-bold text-premier-dark">
                        {nights > 0 ? formatMoney(estimatedTotal) : "—"}
                      </p>
                      <p className="text-xs text-gray-500">{nights > 0 ? `${nights} night(s)` : "Select dates"}</p>
                    </div>
                  </div>

                  {amenities.length > 0 ? (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-2.5">Amenities</p>
                      <div className="flex flex-wrap gap-2">
                        {amenities.map((amenity) => (
                          <span
                            key={`${room.id}-${amenity}`}
                            className="px-2.5 py-1.5 text-xs rounded-full bg-gradient-to-r from-premier-dark/5 to-premier-copper/5 text-premier-dark border border-premier-dark/10 font-medium"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <button
                    onClick={() => handleBookRoom(room)}
                    disabled={bookingRoomId === room.id}
                    className="w-full px-4 py-2.5 rounded-lg bg-premier-copper text-white font-semibold hover:bg-primary-600 transition-colors disabled:opacity-70"
                  >
                    {bookingRoomId === room.id
                      ? "Booking..."
                      : isAvailabilityMode
                        ? "Reserve This Room"
                        : "Select Dates to Reserve"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
