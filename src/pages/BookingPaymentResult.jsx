import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function BookingPaymentResult() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      const bookingId = searchParams.get("bookingId");
      const status = searchParams.get("status");
      const transactionId = searchParams.get("transaction_id");
      const txRef = searchParams.get("tx_ref");

      if (!bookingId) {
        setError("Missing booking reference.");
        setLoading(false);
        return;
      }

      if (status && String(status).toLowerCase() === "cancelled") {
        setError("Payment was cancelled before completion.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/payments/flutterwave/verify/${bookingId}`, {
          params: {
            ...(transactionId ? { transaction_id: transactionId } : {}),
            ...(txRef ? { tx_ref: txRef } : {}),
          },
        });

        setResult(response.data);
      } catch (requestError) {
        console.error("[PAYMENT RESULT] verify error:", requestError);
        setError(requestError.response?.data?.message || "Could not verify payment.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[420px]">
        <div className="w-12 h-12 border-4 border-premier-copper border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-10 max-w-xl mx-auto text-center space-y-4">
        <h1 className="text-2xl font-bold text-rose-700">Payment Not Completed</h1>
        <p className="text-gray-600">{error}</p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/bookings" className="px-4 py-2 rounded-lg bg-premier-copper text-white">
            View My Bookings
          </Link>
          <Link to="/rooms" className="px-4 py-2 rounded-lg border border-gray-300">
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-10 max-w-xl mx-auto text-center space-y-4">
      <h1
        className={`text-2xl font-bold ${
          result?.verified ? "text-emerald-700" : "text-amber-700"
        }`}
      >
        {result?.verified ? "Payment Successful" : "Payment Pending/Failed"}
      </h1>
      <p className="text-gray-600">{result?.message || "Payment verification completed."}</p>

      <div className="bg-gray-50 rounded-lg p-4 text-sm text-left space-y-1">
        <p>
          <span className="text-gray-500">Booking ID:</span>{" "}
          <span className="font-semibold">{result?.booking?.id || "—"}</span>
        </p>
        <p>
          <span className="text-gray-500">Booking Status:</span>{" "}
          <span className="font-semibold">{result?.booking?.status || "—"}</span>
        </p>
        <p>
          <span className="text-gray-500">Payment Status:</span>{" "}
          <span className="font-semibold">{result?.payment?.paymentStatus || "—"}</span>
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Link to="/bookings" className="px-4 py-2 rounded-lg bg-premier-copper text-white">
          Go to My Bookings
        </Link>
        <Link to="/rooms" className="px-4 py-2 rounded-lg border border-gray-300">
          Browse Rooms
        </Link>
      </div>
    </div>
  );
}
