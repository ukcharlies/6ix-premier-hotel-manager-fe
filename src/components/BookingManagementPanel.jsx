import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { getApiOrigin } from "../utils/publicUrl";

const STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "CANCELLED",
];

const STATUS_BADGES = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  CHECKED_IN: "bg-emerald-100 text-emerald-800",
  CHECKED_OUT: "bg-slate-100 text-slate-700",
  CANCELLED: "bg-rose-100 text-rose-800",
};

const THEME = {
  staff: {
    accentBg: "bg-emerald-600 hover:bg-emerald-700",
    accentText: "text-emerald-700",
    accentSoftBg: "bg-emerald-50",
    accentRing: "focus:ring-emerald-500 focus:border-emerald-500",
    gradient: "from-emerald-600 to-teal-600",
  },
  admin: {
    accentBg: "bg-premier-copper hover:bg-primary-600",
    accentText: "text-premier-copper",
    accentSoftBg: "bg-premier-copper/10",
    accentRing: "focus:ring-premier-copper focus:border-premier-copper",
    gradient: "from-premier-dark to-dark-700",
  },
};

const toDateInput = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const calculateNights = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) return 0;
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) return 0;
  const diff = checkOut.getTime() - checkIn.getTime();
  if (diff <= 0) return 0;
  return Math.max(1, Math.ceil(diff / (24 * 60 * 60 * 1000)));
};

const normalizeDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const buildDaysInRange = (fromDate, toDate) => {
  const start = normalizeDay(fromDate);
  const end = normalizeDay(toDate);
  const days = [];

  while (start <= end) {
    days.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }

  return days;
};

function BookingModal({
  open,
  mode,
  form,
  setForm,
  rooms,
  guests,
  showGuestSelector,
  onClose,
  onSubmit,
  saving,
  accent,
}) {
  if (!open) return null;

  const selectedRoom = rooms.find((room) => String(room.id) === String(form.roomId));
  const nights = calculateNights(form.checkInDate, form.checkOutDate);
  const estimatedTotal = nights > 0 ? nights * Number(selectedRoom?.pricePerNight || 0) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 p-4 overflow-y-auto">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-premier-dark">
            {mode === "create" ? "Create Booking" : "Adjust Booking"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {showGuestSelector && mode === "create" ? (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Guest</label>
                <select
                  required
                  value={form.guestId}
                  onChange={(event) => setForm((prev) => ({ ...prev, guestId: event.target.value }))}
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 ${accent.accentRing}`}
                >
                  <option value="">Select guest</option>
                  {guests.map((guest) => (
                    <option key={guest.id} value={guest.id}>
                      {guest.firstName} {guest.lastName} ({guest.email})
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
              <select
                required
                value={form.roomId}
                onChange={(event) => setForm((prev) => ({ ...prev, roomId: event.target.value }))}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 ${accent.accentRing}`}
              >
                <option value="">Select room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Room {room.roomNumber} • {room.roomType} • {formatMoney(room.pricePerNight)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
              <input
                type="number"
                min="1"
                required
                value={form.numberOfGuests}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, numberOfGuests: event.target.value }))
                }
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 ${accent.accentRing}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
              <input
                type="date"
                required
                value={form.checkInDate}
                onChange={(event) => setForm((prev) => ({ ...prev, checkInDate: event.target.value }))}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 ${accent.accentRing}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
              <input
                type="date"
                required
                value={form.checkOutDate}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, checkOutDate: event.target.value }))
                }
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 ${accent.accentRing}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 ${accent.accentRing}`}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
            <textarea
              rows={3}
              value={form.specialRequests}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, specialRequests: event.target.value }))
              }
              className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 ${accent.accentRing}`}
              placeholder="Any special notes for this booking..."
            />
          </div>

          <div className={`rounded-lg p-3 ${accent.accentSoftBg}`}>
            <p className="text-sm text-gray-700">
              {nights > 0 ? `${nights} night${nights > 1 ? "s" : ""}` : "Select valid dates"} •
              Estimated total:{" "}
              <span className={`font-semibold ${accent.accentText}`}>{formatMoney(estimatedTotal)}</span>
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              disabled={saving}
              type="submit"
              className={`px-4 py-2 text-white rounded-lg ${accent.accentBg} disabled:opacity-70`}
            >
              {saving ? "Saving..." : mode === "create" ? "Create Booking" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BookingManagementPanel({ roleMode = "staff", showAuditLog = false }) {
  const accent = THEME[roleMode] || THEME.staff;
  const today = useMemo(() => new Date(), []);
  const defaultFrom = toDateInput(new Date(today.getFullYear(), today.getMonth(), 1));
  const defaultTo = toDateInput(new Date(today.getFullYear(), today.getMonth() + 1, 0));

  const [filters, setFilters] = useState({
    status: "",
    roomId: "",
    guestId: "",
    fromDate: defaultFrom,
    toDate: defaultTo,
  });
  const [bookings, setBookings] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [summary, setSummary] = useState({ total: 0, totalRevenue: 0 });
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [activeBooking, setActiveBooking] = useState(null);
  const [form, setForm] = useState({
    roomId: "",
    guestId: "",
    checkInDate: defaultFrom,
    checkOutDate: defaultTo,
    numberOfGuests: 1,
    specialRequests: "",
    status: "CONFIRMED",
  });

  const showGuestSelector = roleMode === "staff" || roleMode === "admin";

  const loadReferences = useCallback(async () => {
    try {
      const calls = [api.get("/rooms")];
      if (showGuestSelector) {
        calls.push(api.get("/bookings/guests", { params: { limit: 100 } }));
      }
      if (showAuditLog) {
        calls.push(api.get("/admin/activity", { params: { tableName: "bookings", limit: 20 } }));
      }

      const responses = await Promise.all(calls);

      const roomsRes = responses[0];
      const roomsData = Array.isArray(roomsRes.data?.rooms) ? roomsRes.data.rooms : [];
      setRooms(roomsData);

      if (showGuestSelector) {
        const guestsRes = responses[1];
        setGuests(Array.isArray(guestsRes.data?.guests) ? guestsRes.data.guests : []);
      }

      if (showAuditLog) {
        const logsRes = responses[responses.length - 1];
        setAuditLogs(Array.isArray(logsRes.data?.logs) ? logsRes.data.logs : []);
      }
    } catch (requestError) {
      console.error("[BOOKINGS] loadReferences error:", requestError);
    }
  }, [showAuditLog, showGuestSelector]);

  const loadBookings = useCallback(async () => {
    try {
      const bookingParams = {
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.roomId ? { roomId: filters.roomId } : {}),
        ...(filters.guestId ? { guestId: filters.guestId } : {}),
        ...(filters.fromDate ? { fromDate: filters.fromDate } : {}),
        ...(filters.toDate ? { toDate: filters.toDate } : {}),
      };

      const [bookingsRes, calendarRes] = await Promise.all([
        api.get("/bookings", { params: bookingParams }),
        api.get("/bookings/calendar", {
          params: {
            fromDate: filters.fromDate,
            toDate: filters.toDate,
          },
        }),
      ]);

      setBookings(Array.isArray(bookingsRes.data?.bookings) ? bookingsRes.data.bookings : []);
      setSummary(bookingsRes.data?.summary || { total: 0, totalRevenue: 0 });
      setCalendarEvents(Array.isArray(calendarRes.data?.data?.events) ? calendarRes.data.data.events : []);
      setError("");
    } catch (requestError) {
      console.error("[BOOKINGS] loadBookings error:", requestError);
      setError(requestError.response?.data?.message || "Failed to load booking data");
    } finally {
      setLoading(false);
    }
  }, [filters.fromDate, filters.guestId, filters.roomId, filters.status, filters.toDate]);

  useEffect(() => {
    loadReferences();
  }, [loadReferences]);

  useEffect(() => {
    setLoading(true);
    loadBookings();
  }, [loadBookings]);

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([loadBookings(), loadReferences()]);
  };

  const openCreateModal = () => {
    setModalMode("create");
    setActiveBooking(null);
    setForm({
      roomId: "",
      guestId: "",
      checkInDate: filters.fromDate || defaultFrom,
      checkOutDate: filters.toDate || defaultTo,
      numberOfGuests: 1,
      specialRequests: "",
      status: "CONFIRMED",
    });
    setModalOpen(true);
  };

  const openEditModal = (booking) => {
    setModalMode("edit");
    setActiveBooking(booking);
    setForm({
      roomId: String(booking.roomId),
      guestId: String(booking.guestId),
      checkInDate: toDateInput(booking.checkInDate),
      checkOutDate: toDateInput(booking.checkOutDate),
      numberOfGuests: booking.numberOfGuests,
      specialRequests: booking.specialRequests || "",
      status: booking.status,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveBooking(null);
  };

  const handleSubmitBooking = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        roomId: Number(form.roomId),
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        numberOfGuests: Number(form.numberOfGuests),
        specialRequests: form.specialRequests,
        status: form.status,
      };

      if (showGuestSelector && modalMode === "create") {
        payload.guestId = Number(form.guestId);
      }

      if (modalMode === "create") {
        await api.post("/bookings", payload);
        setSuccess("Booking created successfully");
      } else if (activeBooking) {
        await api.patch(`/bookings/${activeBooking.id}`, payload);
        setSuccess("Booking adjusted successfully");
      }

      closeModal();
      await refreshAll();
    } catch (requestError) {
      console.error("[BOOKINGS] save error:", requestError);
      setError(requestError.response?.data?.message || "Unable to save booking");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (bookingId, nextStatus) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: nextStatus });
      setSuccess("Booking status updated");
      await refreshAll();
    } catch (requestError) {
      console.error("[BOOKINGS] status update error:", requestError);
      setError(requestError.response?.data?.message || "Unable to update booking status");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.post(`/bookings/${bookingId}/cancel`);
      setSuccess("Booking cancelled");
      await refreshAll();
    } catch (requestError) {
      console.error("[BOOKINGS] cancel error:", requestError);
      setError(requestError.response?.data?.message || "Unable to cancel booking");
    }
  };

  const calendarDays = useMemo(() => {
    if (!filters.fromDate || !filters.toDate) return [];
    return buildDaysInRange(filters.fromDate, filters.toDate).slice(0, 42);
  }, [filters.fromDate, filters.toDate]);

  const eventsByDay = useMemo(() => {
    const map = new Map();
    calendarDays.forEach((day) => {
      const start = normalizeDay(day);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      const events = calendarEvents.filter((event) => {
        const eventStart = new Date(event.checkInDate);
        const eventEnd = new Date(event.checkOutDate);
        return eventStart < end && eventEnd > start && event.status !== "CANCELLED";
      });
      map.set(day.toISOString().slice(0, 10), events);
    });
    return map;
  }, [calendarDays, calendarEvents]);

  const totalRooms = rooms.length || 0;
  const occupiedToday = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const events = eventsByDay.get(todayKey) || [];
    const uniqueRooms = new Set(events.map((event) => event.roomId));
    return uniqueRooms.size;
  }, [eventsByDay]);

  const downloadCalendar = () => {
    const params = new URLSearchParams();
    if (filters.fromDate) params.set("fromDate", filters.fromDate);
    if (filters.toDate) params.set("toDate", filters.toDate);
    const query = params.toString();
    const url = `${getApiOrigin()}/api/bookings/calendar.ics${query ? `?${query}` : ""}`;
    window.open(url, "_blank", "noopener,noreferrer");
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
      <div className={`rounded-2xl bg-gradient-to-r ${accent.gradient} text-white px-6 py-8`}>
        <h1 className="text-3xl font-bold">Bookings Operations</h1>
        <p className="text-white/80 mt-1">
          Real-time reservations, room occupancy, and calendar synchronization.
        </p>
      </div>

      {error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">{error}</div>
      ) : null}
      {success ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess("")} className="text-emerald-700 hover:text-emerald-900">
            ✕
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-3xl font-bold text-premier-dark mt-1">{summary.total || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Revenue in View</p>
          <p className="text-3xl font-bold text-premier-dark mt-1">{formatMoney(summary.totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Occupied Today</p>
          <p className="text-3xl font-bold text-premier-dark mt-1">
            {occupiedToday}/{totalRooms || 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
              className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 ${accent.accentRing}`}
            >
              <option value="">All</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Room</label>
            <select
              value={filters.roomId}
              onChange={(event) => setFilters((prev) => ({ ...prev, roomId: event.target.value }))}
              className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 ${accent.accentRing}`}
            >
              <option value="">All Rooms</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Room {room.roomNumber}
                </option>
              ))}
            </select>
          </div>

          {showGuestSelector ? (
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Guest</label>
              <select
                value={filters.guestId}
                onChange={(event) => setFilters((prev) => ({ ...prev, guestId: event.target.value }))}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 ${accent.accentRing}`}
              >
                <option value="">All Guests</option>
                {guests.map((guest) => (
                  <option key={guest.id} value={guest.id}>
                    {guest.firstName} {guest.lastName}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">From</label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(event) => setFilters((prev) => ({ ...prev, fromDate: event.target.value }))}
              className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 ${accent.accentRing}`}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">To</label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(event) => setFilters((prev) => ({ ...prev, toDate: event.target.value }))}
              className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 ${accent.accentRing}`}
            />
          </div>

          <div className="flex items-end gap-2">
            <button onClick={openCreateModal} className={`px-3 py-2 text-white rounded-lg ${accent.accentBg}`}>
              New Booking
            </button>
            <button
              onClick={downloadCalendar}
              className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
            >
              Sync Calendar
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-premier-dark mb-4">Occupancy Calendar</h2>
        {calendarDays.length === 0 ? (
          <p className="text-sm text-gray-500">Select a date range to view calendar occupancy.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {calendarDays.map((day) => {
              const key = day.toISOString().slice(0, 10);
              const events = eventsByDay.get(key) || [];
              const occupiedRooms = new Set(events.map((event) => event.roomId)).size;
              const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

              return (
                <div key={key} className="rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-premier-dark">{formatDate(day)}</p>
                    <span className="text-xs text-gray-500">{occupancyRate}% full</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {occupiedRooms} occupied / {totalRooms || 0} rooms
                  </p>
                  <div className="mt-2 space-y-1 max-h-24 overflow-auto">
                    {events.length > 0 ? (
                      events.slice(0, 4).map((event) => (
                        <div key={`${event.id}-${key}`} className="text-xs bg-gray-50 rounded px-2 py-1">
                          Room {event.roomNumber} • {event.status}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-emerald-600">No bookings</p>
                    )}
                    {events.length > 4 ? (
                      <p className="text-xs text-gray-500">+{events.length - 4} more bookings</p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-premier-dark">Reservations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Guest</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Room</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Dates</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <p className="font-medium text-premier-dark">
                        {booking.guest?.firstName} {booking.guest?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{booking.guest?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      Room {booking.room?.roomNumber} • {booking.room?.roomType}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          STATUS_BADGES[booking.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-premier-dark">
                      {formatMoney(booking.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <select
                          value={booking.status}
                          onChange={(event) => handleStatusChange(booking.id, event.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-xs"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => openEditModal(booking)}
                          className={`text-sm font-medium ${accent.accentText}`}
                        >
                          Edit
                        </button>
                        {booking.status !== "CANCELLED" ? (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-sm text-rose-600 font-medium"
                          >
                            Cancel
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    No bookings found for selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAuditLog ? (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-premier-dark">Booking Audit Trail</h2>
            <span className="text-xs text-gray-500">Admin only</span>
          </div>
          <div className="divide-y divide-gray-100">
            {auditLogs.length > 0 ? (
              auditLogs.map((log) => (
                <div key={log.id} className="px-5 py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-premier-dark">
                      #{log.recordId} • {log.action}
                    </p>
                    <p className="text-xs text-gray-500">
                      {log.user?.firstName} {log.user?.lastName} ({log.user?.email})
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleString("en-US")}
                  </p>
                </div>
              ))
            ) : (
              <p className="px-5 py-6 text-sm text-gray-500">No booking activity yet.</p>
            )}
          </div>
        </div>
      ) : null}

      <BookingModal
        open={modalOpen}
        mode={modalMode}
        form={form}
        setForm={setForm}
        rooms={rooms}
        guests={guests}
        showGuestSelector={showGuestSelector}
        onClose={closeModal}
        onSubmit={handleSubmitBooking}
        saving={saving}
        accent={accent}
      />
    </div>
  );
}
