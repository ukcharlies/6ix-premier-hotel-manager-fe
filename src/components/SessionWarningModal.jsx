import React from "react";

/**
 * Session Warning Modal
 * 
 * Displays when user session is about to expire due to inactivity.
 * Allows user to extend session or log out immediately.
 */
export default function SessionWarningModal({
  isOpen,
  remainingTime,
  onExtend,
  onLogout,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          {/* Warning Icon */}
          <div className="bg-amber-50 px-6 py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <svg
                className="h-8 w-8 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900">
              Session Expiring Soon
            </h3>
            
            <p className="mt-2 text-gray-600">
              Your session will expire in
            </p>
            
            {/* Countdown Timer */}
            <div className="mt-4 inline-flex items-center justify-center rounded-xl bg-amber-100 px-6 py-3">
              <span className="text-3xl font-bold text-amber-700 tabular-nums">
                {remainingTime}
              </span>
            </div>
            
            <p className="mt-4 text-sm text-gray-500">
              You've been inactive for a while. Click below to stay logged in.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 bg-gray-50 px-6 py-4">
            <button
              onClick={onLogout}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            >
              Log Out Now
            </button>
            <button
              onClick={onExtend}
              className="flex-1 rounded-lg bg-premier-copper px-4 py-2.5 text-sm font-medium text-white hover:bg-premier-copper/90 focus:outline-none focus:ring-2 focus:ring-premier-copper focus:ring-offset-2 transition-colors"
            >
              Stay Logged In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
