import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHotel } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-premier-black via-premier-dark to-dark-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-premier-copper/20 rounded-lg">
                <FaHotel className="text-2xl text-premier-copper" />
              </div>
              <span className="text-2xl font-bold tracking-tight">6ix Premier</span>
            </div>
            <p className="text-premier-gray leading-relaxed">
              Experience luxury hospitality at its finest. Where comfort meets elegance and exceptional service is our standard.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-premier-copper/10 rounded-lg hover:bg-premier-copper/30 transition-all duration-200 hover:scale-110">
                <FaFacebook className="text-lg text-premier-copper" />
              </a>
              <a href="#" className="p-2 bg-premier-copper/10 rounded-lg hover:bg-premier-copper/30 transition-all duration-200 hover:scale-110">
                <FaTwitter className="text-lg text-premier-copper" />
              </a>
              <a href="#" className="p-2 bg-premier-copper/10 rounded-lg hover:bg-premier-copper/30 transition-all duration-200 hover:scale-110">
                <FaInstagram className="text-lg text-premier-copper" />
              </a>
              <a href="#" className="p-2 bg-premier-copper/10 rounded-lg hover:bg-premier-copper/30 transition-all duration-200 hover:scale-110">
                <FaLinkedin className="text-lg text-premier-copper" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/rooms" className="block text-premier-gray hover:text-premier-copper transition-colors hover:translate-x-1 transform duration-200">
                Rooms & Suites
              </Link>
              <Link to="/restaurant" className="block text-premier-gray hover:text-premier-copper transition-colors hover:translate-x-1 transform duration-200">
                Restaurant
              </Link>
              <Link to="/offers" className="block text-premier-gray hover:text-premier-copper transition-colors hover:translate-x-1 transform duration-200">
                Special Offers
              </Link>
              <Link to="/facilities" className="block text-premier-gray hover:text-premier-copper transition-colors hover:translate-x-1 transform duration-200">
                Recreational Facilities
              </Link>
              <Link to="/functions" className="block text-premier-gray hover:text-premier-copper transition-colors hover:translate-x-1 transform duration-200">
                Functions & Events
              </Link>
            </div>
          </div>

          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Company</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-premier-gray hover:text-premier-copper transition-colors hover:translate-x-1 transform duration-200">
                About Us
              </Link>
              <Link to="/news" className="block text-premier-gray hover:text-premier-copper transition-colors hover:translate-x-1 transform duration-200">
                News & Updates
              </Link>
              <Link to="/contact" className="block text-premier-gray hover:text-premier-copper transition-colors hover:translate-x-1 transform duration-200">
                Contact Us
              </Link>
              <Link to="/careers" className="block text-premier-gray hover:text-premier-copper transition-colors hover:translate-x-1 transform duration-200">
                Careers
              </Link>
              <Link to="/privacy" className="block text-premier-gray hover:text-premier-copper transition-colors hover:translate-x-1 transform duration-200">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Get In Touch</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-premier-copper mt-1 flex-shrink-0" />
                <div className="text-premier-gray">
                  <p className="font-medium">6ix Premier Hotel</p>
                  <p>123 Luxury Avenue</p>
                  <p>Downtown District, City 12345</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <FaPhone className="text-premier-copper flex-shrink-0" />
                <a href="tel:+1234567890" className="text-premier-gray hover:text-premier-copper transition-colors">
                  +1 (234) 567-8900
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-premier-copper flex-shrink-0" />
                <a href="mailto:info@6ixpremier.com" className="text-premier-gray hover:text-premier-copper transition-colors">
                  info@6ixpremier.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter subscription */}
        <div className="py-8 border-t border-premier-gray/20">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
            <p className="text-premier-gray mb-4">Subscribe to our newsletter for exclusive offers and updates</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-premier-dark/50 border border-premier-gray/30 text-white placeholder-premier-gray focus:outline-none focus:ring-2 focus:ring-premier-copper focus:border-transparent"
              />
              <button className="px-6 py-2 bg-premier-copper text-white font-semibold rounded-lg hover:bg-primary-600 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-premier-copper">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="py-6 border-t border-premier-gray/20">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-premier-gray text-sm">
              © {new Date().getFullYear()} 6ix Premier Hotel. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/terms" className="text-premier-gray hover:text-premier-copper transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-premier-gray hover:text-premier-copper transition-colors">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="text-premier-gray hover:text-premier-copper transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
