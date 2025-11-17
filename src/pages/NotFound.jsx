import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-6xl font-bold text-blue-600">404</h1>
        <h2 className="text-3xl font-semibold mt-4 text-gray-900">Page Not Found</h2>
        <p className="mt-4 text-gray-600">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-8 space-y-4">
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Need help?{' '}
            <Link to="/contact" className="text-blue-600 hover:text-blue-500">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
