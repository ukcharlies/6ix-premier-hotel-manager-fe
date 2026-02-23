import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/Authcontext";
import StaySearchPanel from "../components/StaySearchPanel";
import { buildUploadImageUrl } from "../utils/publicUrl";

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

export default function RoomBooking() {
  const { roomId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const queryAdults = Number(searchParams.get("adults") || 2);
  const queryChildren = Number(searchParams.get("children") || 0);
  const queryGuests =
    Number(searchParams.get("guests")) || Math.max(1, queryAdults + Math.ceil(queryChildren / 2));

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [specialRequests, setSpecialRequests] = useState("");
  const [stayData, setStayData] = useState({
    checkInDate: searchParams.get("checkInDate") || "",
    checkOutDate: searchParams.get("checkOutDate") || "",
    adults: queryAdults,
    children: queryChildren,
    guests: queryGuests,
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/rooms/${roomId}`);
        setRoom(response.data?.room || null);
      } catch (error) {
        console.error("[ROOM BOOKING] fetch room error:", error);
        setRoom(null);
        setMessage(error.response?.data?.message || "Unable to load room details.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    setStayData({
      checkInDate: searchParams.get("checkInDate") || "",
      checkOutDate: searchParams.get("checkOutDate") || "",
      adults: queryAdults,
      children: queryChildren,
      guests: queryGuests,
    });
  }, [queryAdults, queryChildren, queryGuests, searchParams]);

  const nights = useMemo(
    () => calculateNights(stayData.checkInDate, stayData.checkOutDate),
    [stayData.checkInDate, stayData.checkOutDate],
  );
  const total = useMemo(
    () => (nights > 0 ? Number(room?.pricePerNight || 0) * nights : 0),
    [nights, room?.pricePerNight],
  );
  const image = room?.image || room?.images?.[0];

  const handleStayUpdate = ({ checkInDate, checkOutDate, adults, children, guests }) => {
    const params = new URLSearchParams({
      checkInDate,
      checkOutDate,
      adults: String(adults),
      children: String(children),
      guests: String(guests),
    });

    setSearchParams(params);
    setMessage("");
  };

  const handleProceedToPayment = async () => {
    if (!room) return;

    if (!currentUser) {
      navigate("/login", {
        state: {
          from: { pathname: location.pathname, search: location.search },
          message: "Please sign in to complete your booking and payment.",
        },
      });
      return;
    }

    if (!stayData.checkInDate || !stayData.checkOutDate || nights <= 0) {
      setMessage("Select valid check-in and check-out dates before proceeding.");
      setMessageType("error");
      return;
    }

    setProcessing(true);
    setMessage("");

    try {
      const bookingResponse = await api.post("/bookings", {
        roomId: room.id,
        checkInDate: stayData.checkInDate,
        checkOutDate: stayData.checkOutDate,
        numberOfGuests: Math.max(1, Number(stayData.guests || 1)),
        specialRequests,
      });

      const bookingId = bookingResponse.data?.booking?.id;
      if (!bookingId) {
        throw new Error("Booking created but booking ID was not returned");
      }

      const paymentResponse = await api.post("/payments/flutterwave/initiate", { bookingId });
      const paymentLink = paymentResponse.data?.data?.paymentLink;

      if (!paymentLink) {
        throw new Error("Payment link was not returned. Booking is saved in your bookings.");
      }

      window.location.assign(paymentLink);
    } catch (error) {
      console.error("[ROOM BOOKING] booking/payment error:", error);
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to proceed to payment. Please try again.",
      );
      setMessageType("error");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[420px]">
        <div className="w-12 h-12 border-4 border-premier-copper border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-10 text-center space-y-4">
        <p className="text-gray-600">Room could not be found.</p>
        <Link to="/rooms" className="inline-flex px-4 py-2 rounded-lg bg-premier-copper text-white">
          Back to Rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-premier-dark to-dark-700 text-white px-6 py-8">
        <h1 className="text-3xl font-bold">Book Room {room.roomNumber}</h1>
        <p className="text-white/80 mt-1">
          Confirm your stay details and pay securely with Flutterwave (card, transfer, USSD).
        </p>
      </div>

      {message ? (
        <div
          className={`rounded-lg px-4 py-3 border ${
            messageType === "error"
              ? "bg-rose-50 border-rose-200 text-rose-700"
              : "bg-blue-50 border-blue-200 text-blue-700"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <StaySearchPanel
          initialValues={stayData}
          buttonLabel="Update Stay Details"
          onSearch={handleStayUpdate}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="h-72 bg-gray-100 overflow-hidden">
            {image ? (
              <img
                src={buildUploadImageUrl(image)}
                alt={`Room ${room.roomNumber}`}
                className="w-full h-full object-cover"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/room.jpg";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
            )}
          </div>

          <div className="p-6 space-y-3">
            <h2 className="text-2xl font-bold text-premier-dark">
              Room {room.roomNumber} • {room.roomType}
            </h2>
            <p className="text-gray-600">{room.description || "No room description provided."}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-gray-50 px-3 py-2.5 border border-gray-100">
                <p className="text-xs text-gray-600">Price/Night</p>
                <p className="text-lg font-bold text-premier-copper">{formatMoney(room.pricePerNight)}</p>
              </div>
              <div className="rounded-lg bg-gray-50 px-3 py-2.5 border border-gray-100">
                <p className="text-xs text-gray-600">Capacity</p>
                <p className="text-lg font-bold text-premier-dark">{room.capacity} guests</p>
              </div>
            </div>
            {Array.isArray(room.amenities) && room.amenities.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {room.amenities.map((amenity) => (
                  <span
                    key={`${room.id}-${amenity}`}
                    className="px-2.5 py-1 text-xs rounded-full bg-premier-light text-premier-dark border border-premier-dark/10"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h3 className="text-xl font-bold text-premier-dark">Payment Summary</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600">
              Check-in: <span className="font-semibold text-premier-dark">{stayData.checkInDate ? formatDate(stayData.checkInDate) : "Not selected"}</span>
            </p>
            <p className="text-gray-600">
              Check-out: <span className="font-semibold text-premier-dark">{stayData.checkOutDate ? formatDate(stayData.checkOutDate) : "Not selected"}</span>
            </p>
            <p className="text-gray-600">
              Nights: <span className="font-semibold text-premier-dark">{nights || 0}</span>
            </p>
            <p className="text-gray-600">
              Guests:{" "}
              <span className="font-semibold text-premier-dark">
                {stayData.guests} effective (2 children age 0-7 = 1 guest)
              </span>
            </p>
            <p className="text-gray-600">
              Status after payment: <span className="font-semibold text-premier-dark">Confirmed</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (optional)</label>
            <textarea
              rows={3}
              value={specialRequests}
              onChange={(event) => setSpecialRequests(event.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-premier-copper focus:border-premier-copper"
              placeholder="Airport pickup, high-floor preference, etc."
            />
          </div>

          <div className="rounded-lg bg-premier-light/50 border border-premier-copper/20 p-4">
            <p className="text-sm text-gray-600">Total amount</p>
            <p className="text-3xl font-bold text-premier-copper">{formatMoney(total)}</p>
          </div>

          <button
            type="button"
            onClick={handleProceedToPayment}
            disabled={processing}
            className="w-full px-4 py-3 rounded-lg bg-premier-copper text-white font-semibold hover:bg-primary-600 disabled:opacity-70"
          >
            {processing ? "Preparing Secure Checkout..." : "Proceed to Flutterwave Payment"}
          </button>

          <p className="text-xs text-gray-500">
            Supported methods: card, bank transfer, and USSD (depending on Flutterwave availability).
          </p>
        </div>
      </div>
    </div>
  );
}
