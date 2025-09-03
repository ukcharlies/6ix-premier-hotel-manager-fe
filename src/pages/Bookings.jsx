import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>
      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="bg-white p-4 rounded shadow">
            <div>
              Booking #{b.id} — {b.status}
            </div>
            <div>
              Room: {b.room?.roomNumber} ({b.room?.roomType})
            </div>
            <div>
              Check-in: {new Date(b.checkInDate).toLocaleDateString()} —
              Check-out: {new Date(b.checkOutDate).toLocaleDateString()}
            </div>
            <div>Total: {b.totalAmount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
