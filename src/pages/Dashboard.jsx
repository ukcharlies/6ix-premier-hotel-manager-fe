import React from "react";

export default function Dashboard() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p className="mt-2">Welcome to the Hotel Management Dashboard.</p>
      <p className="mt-4 text-sm text-gray-600">
        (Add analytics widgets here: occupancy, revenue, upcoming check-ins.)
      </p>
    </div>
  );
}
