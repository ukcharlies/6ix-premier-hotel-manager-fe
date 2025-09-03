import React from "react";
import { currency } from "../utils/format";

export default function RoomCard({ room }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-bold text-lg">
        Room {room.roomNumber} — {room.roomType}
      </h3>
      <p className="text-sm text-gray-600">{room.description}</p>
      <p className="mt-2">Capacity: {room.capacity}</p>
      <p className="mt-2 font-bold">{currency(room.pricePerNight)} / night</p>
      <p className="mt-2">Status: {room.currentStatus || room.status}</p>
    </div>
  );
}
