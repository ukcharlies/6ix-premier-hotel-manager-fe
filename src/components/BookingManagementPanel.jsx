import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { getApiOrigin } from "../utils/publicUrl";

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"];
const DRAGGABLE_STATUSES = new Set(["PENDING", "CONFIRMED", "CHECKED_IN"]);
const STATUS_BADGES = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  CHECKED_IN: "bg-emerald-100 text-emerald-800",
  CHECKED_OUT: "bg-slate-100 text-slate-700",
  CANCELLED: "bg-rose-100 text-rose-800",
};

const STATUS_BAR = {
  PENDING: "bg-amber-500",
  CONFIRMED: "bg-blue-600",
  CHECKED_IN: "bg-emerald-600",
  CHECKED_OUT: "bg-slate-500",
  CANCELLED: "bg-rose-500",
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

const DAY_MS = 24 * 60 * 60 * 1000;
const ROOM_COL_WIDTH = 230;
const DAY_COL_WIDTH = 64;

const toDateInput = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return local.toISOString().slice(0, 10);
};

const formatMoney = (value) =>
  `₦${Number(value || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatDayLabel = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const calculateNights = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) return 0;
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) return 0;
  const diff = checkOut.getTime() - checkIn.getTime();
  if (diff <= 0) return 0;
  return Math.max(1, Math.ceil(diff / DAY_MS));
};

const normalizeDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const addDays = (value, days) => {
  const date = normalizeDay(value);
  date.setDate(date.getDate() + days);
  return date;
};

const dayDiff = (fromDate, toDate) =>
  Math.round((normalizeDay(toDate).getTime() - normalizeDay(fromDate).getTime()) / DAY_MS);

const buildDaysInRange = (fromDate, toDate, maxDays = 35) => {
  const start = normalizeDay(fromDate);
  const end = normalizeDay(toDate);
  const days = [];

  while (start <= end && days.length < maxDays) {
    days.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }

  return days;
};

const getTimelineLayout = (events, rangeStart, totalDays) => {
  const segments = events
    .map((event) => {
      const startIndex = Math.max(0, dayDiff(rangeStart, event.checkInDate));
      const endIndex = Math.min(totalDays, dayDiff(rangeStart, event.checkOutDate));
      const span = endIndex - startIndex;
      if (span <= 0) return null;
      return {
        event,
        startIndex,
        endIndex,
        span,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.startIndex === b.startIndex) return a.endIndex - b.endIndex;
      return a.startIndex - b.startIndex;
    });

  const laneEnds = [];
  const laidOut = segments.map((segment) => {
    let lane = laneEnds.findIndex((laneEnd) => segment.startIndex >= laneEnd);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(segment.endIndex);
    } else {
      laneEnds[lane] = segment.endIndex;
    }

    return {
      ...segment,
      lane,
    };
  });

  const rowHeight = Math.max(48, laneEnds.length * 34 + 10);
  return { segments: laidOut, rowHeight };
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
            x
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
                onChange={(event) => setForm((prev) => ({ ...prev, checkOutDate: event.target.value }))}
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
  const canDragBookings = roleMode === "admin" || roleMode === "staff";
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
  const [draggingId, setDraggingId] = useState(null);
  const [dropHint, setDropHint] = useState(null);
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
      roomId: filters.roomId || "",
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

  const handleTimelineMove = async ({ bookingId, roomId, checkInDate, checkOutDate }) => {
    try {
      setSaving(true);
      await api.patch(`/bookings/${bookingId}`, {
        roomId,
        checkInDate,
        checkOutDate,
      });
      setSuccess("Booking moved on calendar");
      await refreshAll();
    } catch (requestError) {
      console.error("[BOOKINGS] timeline move error:", requestError);
      setError(requestError.response?.data?.message || "Unable to move booking in calendar");
    } finally {
      setSaving(false);
      setDraggingId(null);
      setDropHint(null);
    }
  };

  const calendarDays = useMemo(() => {
    if (!filters.fromDate || !filters.toDate) return [];
    return buildDaysInRange(filters.fromDate, filters.toDate, 35);
  }, [filters.fromDate, filters.toDate]);

  const rangeStart = calendarDays[0] || null;
  const totalDays = calendarDays.length;

  const timelineEvents = useMemo(() => {
    return calendarEvents.filter((event) => {
      const statusOk = filters.status ? event.status === filters.status : event.status !== "CANCELLED";
      const roomOk = filters.roomId ? String(event.roomId) === String(filters.roomId) : true;
      const guestOk = filters.guestId ? String(event.guestId) === String(filters.guestId) : true;
      return statusOk && roomOk && guestOk;
    });
  }, [calendarEvents, filters.guestId, filters.roomId, filters.status]);

  const totalRooms = rooms.length || 0;
  const occupiedToday = useMemo(() => {
    const todayKey = toDateInput(new Date());
    const events = timelineEvents.filter((event) => {
      const dayStart = normalizeDay(todayKey);
      const dayEnd = addDays(dayStart, 1);
      const eventStart = new Date(event.checkInDate);
      const eventEnd = new Date(event.checkOutDate);
      return eventStart < dayEnd && eventEnd > dayStart && event.status !== "CANCELLED";
    });
    const uniqueRooms = new Set(events.map((event) => event.roomId));
    return uniqueRooms.size;
  }, [timelineEvents]);

  const downloadCalendar = () => {
    const params = new URLSearchParams();
    if (filters.fromDate) params.set("fromDate", filters.fromDate);
    if (filters.toDate) params.set("toDate", filters.toDate);
    const query = params.toString();
    const url = `${getApiOrigin()}/api/bookings/calendar.ics${query ? `?${query}` : ""}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDropOnCell = async (event, targetRoomId, targetDay) => {
    event.preventDefault();
    const draggedBookingId = Number(event.dataTransfer.getData("bookingId") || draggingId);
    setDropHint(null);

    if (!draggedBookingId || !canDragBookings) return;

    const booking = timelineEvents.find((item) => Number(item.id) === draggedBookingId);
    if (!booking || !DRAGGABLE_STATUSES.has(booking.status)) return;

    const nights = calculateNights(booking.checkInDate, booking.checkOutDate);
    if (!nights) return;

    const nextCheckIn = toDateInput(targetDay);
    const nextCheckOut = toDateInput(addDays(targetDay, nights));

    if (
      Number(booking.roomId) === Number(targetRoomId) &&
      toDateInput(booking.checkInDate) === nextCheckIn
    ) {
      return;
    }

    await handleTimelineMove({
      bookingId: booking.id,
      roomId: Number(targetRoomId),
      checkInDate: nextCheckIn,
      checkOutDate: nextCheckOut,
    });
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
            x
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
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-premier-dark">Interactive Occupancy Calendar</h2>
          <p className="text-xs text-gray-500">
            {canDragBookings
              ? "Drag active booking blocks horizontally to shift dates or vertically to another room."
              : "Calendar is read-only for your role."}
          </p>
        </div>

        {calendarDays.length === 0 ? (
          <p className="text-sm text-gray-500">Select a date range to view calendar occupancy.</p>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <div
              className="min-w-fit"
              style={{ width: ROOM_COL_WIDTH + calendarDays.length * DAY_COL_WIDTH }}
            >
              <div
                className="grid border-b border-gray-200 bg-gray-50"
                style={{ gridTemplateColumns: `${ROOM_COL_WIDTH}px repeat(${calendarDays.length}, ${DAY_COL_WIDTH}px)` }}
              >
                <div className="sticky left-0 z-20 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">
                  Rooms
                </div>
                {calendarDays.map((day) => (
                  <div
                    key={`h-${toDateInput(day)}`}
                    className="px-1 py-2 text-center border-r border-gray-200 text-[11px] text-gray-600"
                  >
                    <p className="font-semibold text-gray-700">{formatDayLabel(day)}</p>
                    <p>{new Date(day).toLocaleDateString("en-US", { weekday: "short" })}</p>
                  </div>
                ))}
              </div>

              {rooms.length === 0 ? (
                <div className="px-4 py-6 text-sm text-gray-500">No rooms available for timeline.</div>
              ) : (
                rooms
                  .filter((room) => (filters.roomId ? String(room.id) === String(filters.roomId) : true))
                  .map((room) => {
                    const roomEvents = timelineEvents.filter((event) => Number(event.roomId) === Number(room.id));
                    const { segments, rowHeight } =
                      rangeStart && totalDays > 0
                        ? getTimelineLayout(roomEvents, rangeStart, totalDays)
                        : { segments: [], rowHeight: 50 };

                    return (
                      <div key={room.id} className="relative border-b border-gray-200 last:border-b-0">
                        <div
                          className="grid"
                          style={{
                            gridTemplateColumns: `${ROOM_COL_WIDTH}px repeat(${calendarDays.length}, ${DAY_COL_WIDTH}px)`,
                          }}
                        >
                          <div
                            className="sticky left-0 z-10 bg-white border-r border-gray-200 px-3 py-2"
                            style={{ height: rowHeight }}
                          >
                            <p className="text-sm font-semibold text-premier-dark">Room {room.roomNumber}</p>
                            <p className="text-xs text-gray-500">{room.roomType}</p>
                          </div>

                          {calendarDays.map((day) => {
                            const dayKey = toDateInput(day);
                            const isDropTarget =
                              dropHint &&
                              Number(dropHint.roomId) === Number(room.id) &&
                              dropHint.dayKey === dayKey;

                            return (
                              <div
                                key={`${room.id}-${dayKey}`}
                                style={{ height: rowHeight }}
                                className={`border-r border-gray-100 ${isDropTarget ? "bg-emerald-50" : "bg-white"}`}
                                onDragOver={(event) => {
                                  if (!canDragBookings) return;
                                  event.preventDefault();
                                }}
                                onDragEnter={() => {
                                  if (!canDragBookings) return;
                                  setDropHint({ roomId: room.id, dayKey });
                                }}
                                onDragLeave={() => {
                                  if (!canDragBookings) return;
                                  setDropHint((prev) =>
                                    prev && prev.roomId === room.id && prev.dayKey === dayKey ? null : prev,
                                  );
                                }}
                                onDrop={(event) => handleDropOnCell(event, room.id, day)}
                              />
                            );
                          })}
                        </div>

                        <div
                          className="absolute top-0 pointer-events-none"
                          style={{
                            left: ROOM_COL_WIDTH,
                            width: calendarDays.length * DAY_COL_WIDTH,
                            height: rowHeight,
                          }}
                        >
                          {segments.map((segment) => {
                            const canDrag = canDragBookings && DRAGGABLE_STATUSES.has(segment.event.status);
                            return (
                              <button
                                key={`seg-${segment.event.id}-${segment.startIndex}-${segment.endIndex}`}
                                type="button"
                                draggable={canDrag}
                                onDragStart={(event) => {
                                  if (!canDrag) {
                                    event.preventDefault();
                                    return;
                                  }
                                  event.dataTransfer.setData("bookingId", String(segment.event.id));
                                  setDraggingId(Number(segment.event.id));
                                }}
                                onDragEnd={() => {
                                  setDraggingId(null);
                                  setDropHint(null);
                                }}
                                onClick={() => {
                                  const booking = bookings.find((item) => Number(item.id) === Number(segment.event.id));
                                  if (booking) openEditModal(booking);
                                }}
                                className={`absolute pointer-events-auto text-left rounded px-2 text-[11px] text-white shadow-sm transition-opacity ${
                                  STATUS_BAR[segment.event.status] || "bg-gray-600"
                                } ${canDrag ? "cursor-grab" : "cursor-pointer"} ${
                                  draggingId === Number(segment.event.id) ? "opacity-60" : "opacity-95"
                                }`}
                                style={{
                                  left: segment.startIndex * DAY_COL_WIDTH + 2,
                                  width: segment.span * DAY_COL_WIDTH - 4,
                                  top: segment.lane * 34 + 6,
                                  height: 26,
                                }}
                                title={`${segment.event.guestName || "Guest"} • ${segment.event.status} • ${formatDate(segment.event.checkInDate)} - ${formatDate(segment.event.checkOutDate)}`}
                              >
                                <span className="font-semibold truncate block">
                                  {segment.event.guestName || "Guest"}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
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
                  <p className="text-xs text-gray-500">{new Date(log.createdAt).toLocaleString("en-US")}</p>
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
