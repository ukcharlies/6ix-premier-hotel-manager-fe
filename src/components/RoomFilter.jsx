import React from "react";

export default function RoomFilter({ filters, onFilterChange }) {
  const handle = (e) =>
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  return (
    <div className="bg-white p-4 rounded shadow flex gap-4 flex-wrap">
      <input
        name="type"
        placeholder="Type"
        value={filters.type}
        onChange={handle}
        className="border p-2 rounded"
      />
      <input
        name="minPrice"
        placeholder="Min price"
        value={filters.minPrice}
        onChange={handle}
        className="border p-2 rounded"
      />
      <input
        name="maxPrice"
        placeholder="Max price"
        value={filters.maxPrice}
        onChange={handle}
        className="border p-2 rounded"
      />
      <input
        name="capacity"
        placeholder="Capacity"
        value={filters.capacity}
        onChange={handle}
        className="border p-2 rounded"
      />
      <select
        name="status"
        value={filters.status}
        onChange={handle}
        className="border p-2 rounded"
      >
        <option value="">Any status</option>
        <option value="AVAILABLE">Available</option>
        <option value="OCCUPIED">Occupied</option>
        <option value="MAINTENANCE">Maintenance</option>
      </select>
    </div>
  );
}
