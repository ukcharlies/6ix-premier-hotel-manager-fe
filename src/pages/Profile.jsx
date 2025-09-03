import React from "react";
import { useAuth } from "../contexts/Authcontext";

export default function Profile() {
  const { currentUser } = useAuth();

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold">Profile</h2>
      <p className="mt-2">
        Name: {currentUser?.firstName} {currentUser?.lastName}
      </p>
      <p>Email: {currentUser?.email}</p>
      <p>Role: {currentUser?.role}</p>
    </div>
  );
}
