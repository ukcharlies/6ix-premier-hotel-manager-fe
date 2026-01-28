import React from "react";

export default function StaffBookings() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-premier-dark">Bookings Management</h1>
        <p className="text-gray-500 mt-1">View and manage room reservations</p>
      </div>

      {/* Coming Soon Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-premier-dark mb-2">Bookings Feature Coming Soon</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          The bookings management system is currently under development. 
          You'll be able to view, confirm, and manage guest reservations here.
        </p>
        
        {/* Feature Preview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-medium text-premier-dark">View Bookings</h3>
            <p className="text-sm text-gray-500 mt-1">See all upcoming and past reservations</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">✅</div>
            <h3 className="font-medium text-premier-dark">Confirm Stays</h3>
            <p className="text-sm text-gray-500 mt-1">Check-in and check-out guests</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-medium text-premier-dark">Occupancy Stats</h3>
            <p className="text-sm text-gray-500 mt-1">Track room availability and revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
}
