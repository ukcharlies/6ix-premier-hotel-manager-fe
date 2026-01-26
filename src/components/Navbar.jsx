import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext";
import { Menu } from "@headlessui/react";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = async () => {
    await logout();
    nav("/login");
  };

  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "Restaurant", path: "/restaurant" },
    { name: "Special Offers", path: "/offers" },
    { name: "Rooms", path: "/rooms" },
    { name: "Recreational Facilities", path: "/facilities" },
    { name: "Functions", path: "/functions" },
  ];

  const privateLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Bookings", path: "/bookings" },
    { name: "Profile", path: "/profile" },
    { name: "Change Password", path: "/settings/change-password" },
    ...(currentUser?.role === "ADMIN"
      ? [{ name: "Admin Panel", path: "/admin" }]
      : []),
    ...(currentUser?.role === "STAFF"
      ? [{ name: "Staff Panel", path: "/staff" }]
      : []),
  ];

  return (
    <nav className="bg-gradient-to-r from-premier-dark via-dark-700 to-premier-copper shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-1">
              <span className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white tracking-tight whitespace-nowrap">
                6ix Premier
              </span>
              {/* <span className="hidden md:inline text-sm text-premier-light">
                Hotel
              </span> */}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center flex-1 justify-center px-4">
            <div className="flex items-center space-x-1">
              {publicLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 inline-flex items-center justify-center
                    ${
                      location.pathname === link.path
                        ? "bg-premier-copper text-white shadow-lg"
                        : "text-premier-light hover:text-white hover:bg-premier-dark/80 hover:scale-105"
                    }`}
                  aria-current={
                    location.pathname === link.path ? "page" : undefined
                  }
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Section - Fixed to the right */}
          <div className="hidden lg:flex items-center flex-shrink-0">
            {!currentUser ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-white bg-premier-dark/70 hover:bg-premier-dark px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-premier-copper text-white hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-semibold shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            ) : (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center text-white hover:opacity-90 text-sm px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
                  <FaUserCircle className="h-5 w-5" />
                  <span className="ml-2 text-sm">
                    {currentUser?.firstName}
                  </span>
                </Menu.Button>
                <Menu.Items className="absolute right-0 w-48 mt-1 origin-top-right bg-white divide-y divide-premier-light rounded-md shadow-lg ring-1 ring-premier-dark ring-opacity-20 focus:outline-none z-50">
                  <div className="px-1 py-1">
                    {privateLinks.map((link) => (
                      <Menu.Item key={link.path}>
                        {({ active }) => (
                          <Link
                            to={link.path}
                            className={`group flex rounded-md items-center w-full px-2 py-1 text-sm ${
                              active
                                ? "bg-premier-copper text-white"
                                : "text-premier-dark"
                            }`}
                          >
                            {link.name}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`group flex rounded-md items-center w-full px-2 py-1 text-sm ${
                            active
                              ? "bg-premier-copper text-white"
                              : "text-premier-dark"
                          }`}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            )}
          </div>

          {/* Mobile: Hamburger */}
          <div className="flex items-center lg:hidden ml-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              onMouseEnter={() => setIsMobileMenuOpen(true)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center p-1.5 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-premier-copper transition-colors"
            >
              <svg
                className={`${isMobileMenuOpen ? "hidden" : "block"} h-5 w-5`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? "block" : "hidden"} h-5 w-5`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        onMouseLeave={() => setIsMobileMenuOpen(false)}
        className={`${isMobileMenuOpen ? "block" : "hidden"} lg:hidden`}
        role="menu"
        aria-label="Main menu"
      >
        <div className="pt-2 pb-3 space-y-1 bg-gradient-to-b from-premier-dark to-premier-copper px-2 sm:px-4">
          {publicLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "bg-premier-copper text-white"
                  : "text-premier-light hover:bg-premier-dark/80 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {currentUser ? (
            <div className="mt-2 border-t border-white/20 pt-2">
              {privateLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === link.path
                      ? "bg-premier-copper text-white"
                      : "text-premier-light hover:bg-premier-dark/80 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="mt-1 w-full text-left px-3 py-2 rounded-md text-sm font-medium text-premier-light hover:bg-premier-dark/80 hover:text-white"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-2 border-t border-white/20 pt-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-premier-light hover:bg-premier-dark/80 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-1 block w-full text-left px-3 py-2 rounded-md text-sm font-medium bg-premier-copper text-white hover:bg-primary-600"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
