import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { buildUploadImageUrl, getApiOrigin } from "../utils/publicUrl";

const statusClasses = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  CHECKED_IN: "bg-emerald-100 text-emerald-800",
  CHECKED_OUT: "bg-slate-100 text-slate-700",
  CANCELLED: "bg-rose-100 text-rose-800",
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [summary, setSummary] = useState({ total: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cancelingId, setCancelingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/bookings");
      setBookings(Array.isArray(response.data?.bookings) ? response.data.bookings : []);
      setSummary(response.data?.summary || { total: 0, totalRevenue: 0 });
    } catch (requestError) {
      console.error("[BOOKINGS] fetch error:", requestError);
      setError(requestError.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      setCancelingId(bookingId);
      await api.post(`/bookings/${bookingId}/cancel`);
      setMessage("Booking cancelled successfully.");
      await fetchBookings();
    } catch (requestError) {
      console.error("[BOOKINGS] cancel error:", requestError);
      setError(requestError.response?.data?.message || "Unable to cancel booking");
    } finally {
      setCancelingId(null);
    }
  };

  const syncCalendar = () => {
    window.open(`${getApiOrigin()}/api/bookings/calendar.ics`, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[320px]">
        <div className="w-10 h-10 border-4 border-premier-copper border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-premier-dark to-dark-700 text-white px-6 py-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-white/80 mt-1">Track your stay status, totals, and calendar schedule.</p>
      </div>

      {error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">{error}</div>
      ) : null}
      {message ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage("")}>✕</button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-3xl font-bold text-premier-dark mt-1">{summary.total || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-3xl font-bold text-premier-dark mt-1">
            ${Number(summary.totalRevenue || 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center">
          <button
            onClick={syncCalendar}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium text-sm"
          >
            Sync With Calendar
          </button>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 py-16 text-center space-y-4">
          <p className="text-gray-500">You do not have any bookings yet.</p>
          <Link
            to="/rooms"
            className="inline-flex px-4 py-2 rounded-lg bg-premier-copper text-white hover:bg-primary-600"
          >
            Browse Rooms
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const image = booking.room?.image || booking.room?.images?.[0];
            return (
              <article
                key={booking.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
              >
                <div className="p-5 flex flex-col lg:flex-row gap-4">
                  <div className="w-full lg:w-56 h-40 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {image ? (
                      <img
                        src={buildUploadImageUrl(image)}
                        alt={`Room ${booking.room?.roomNumber}`}
                        className="w-full h-full object-cover"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = "/room.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className="text-xl font-semibold text-premier-dark">
                        Booking #{booking.id} • Room {booking.room?.roomNumber}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusClasses[booking.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <p className="text-gray-600">
                      {booking.room?.roomType} • {booking.numberOfGuests} guest
                      {booking.numberOfGuests > 1 ? "s" : ""} • {booking.nights} night
                      {booking.nights > 1 ? "s" : ""}
                    </p>
                    <p className="text-gray-600">
                      {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                    </p>

                    {booking.specialRequests ? (
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold text-gray-700">Requests:</span>{" "}
                        {booking.specialRequests}
                      </p>
                    ) : null}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <p className="text-xl font-bold text-premier-copper">
                        ${Number(booking.totalAmount || 0).toFixed(2)}
                      </p>
                      {["PENDING", "CONFIRMED"].includes(booking.status) ? (
                        <button
                          onClick={() => cancelBooking(booking.id)}
                          disabled={cancelingId === booking.id}
                          className="px-4 py-2 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 disabled:opacity-70"
                        >
                          {cancelingId === booking.id ? "Cancelling..." : "Cancel Booking"}
                        </button>
                      ) : null}
                    </div>
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
