import React from "react";
import BookingManagementPanel from "../../components/BookingManagementPanel";

export default function AdminBookings() {
  return <BookingManagementPanel roleMode="admin" showAuditLog />;
}
