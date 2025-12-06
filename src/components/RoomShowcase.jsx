import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/**
 * RoomShowcase Component
 * 
 * A reusable room carousel component that displays hotel rooms with auto-scrolling.
 * Can be populated with static data or API data.
 * 
 * @param {Array} rooms - Array of room objects with structure:
 *   {
 *     title: string,
 *     image: string,
 *     copy: string (description text),
 *     tags: string[] (amenities/features),
 *     collection: string (optional, e.g., "Premier Collection"),
 *     bookingLink: string (optional)
 *   }
 * @param {boolean} autoScroll - Enable/disable auto-scrolling (default: true)
 * @param {number} scrollInterval - Auto-scroll interval in ms (default: 4000)
 * @param {boolean} showViewMore - Show "View More" button (default: true)
 * @param {string} viewMoreLink - Link for "View More" button (default: "/rooms")
 * @param {string} title - Section title (default: 'ROOMS & SUITES')
 * @param {string} subtitle - Section subtitle
 * @param {string} description - Section description text
 */
export default function RoomShowcase({
  rooms = [],
  autoScroll = true,
  scrollInterval = 4000,
  showViewMore = true,
  viewMoreLink = '/rooms',
  title = 'ROOMS & SUITES',
  subtitle = 'Spaces that feel custom-built for you',
  description = 'Choose the mood: sweeping skyline suites, calm doubles, or quietly luxurious standards. Every room is layered with Premier linens, intuitive lighting, and tech that simply works.'
}) {
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(autoScroll);
  const autoScrollTimeoutRef = useRef(null);

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScrollEnabled || rooms.length === 0) return;

    const autoScrollIntervalId = setInterval(() => {
      setCurrentRoomIndex((prev) => 
        prev === rooms.length - 1 ? 0 : prev + 1
      );
    }, scrollInterval);

    return () => clearInterval(autoScrollIntervalId);
  }, [autoScrollEnabled, rooms.length, scrollInterval]);

  // Cleanup timeout ref on unmount
  useEffect(() => {
    return () => {
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
      }
    };
  }, []);

  const handlePrevRoom = () => {
    if (isTransitioning || rooms.length === 0) return;
    setAutoScrollEnabled(false);
    
    // Clear any existing resume timeout
    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current);
    }
    
    setIsTransitioning(true);
    setCurrentRoomIndex((prev) => 
      prev === 0 ? rooms.length - 1 : prev - 1
    );
    setTimeout(() => {
      setIsTransitioning(false);
      if (autoScroll) {
        autoScrollTimeoutRef.current = setTimeout(() => {
          setAutoScrollEnabled(true);
        }, 3000);
      }
    }, 600);
  };

  const handleNextRoom = () => {
    if (isTransitioning || rooms.length === 0) return;
    setAutoScrollEnabled(false);
    
    // Clear any existing resume timeout
    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current);
    }
    
    setIsTransitioning(true);
    setCurrentRoomIndex((prev) => 
      prev === rooms.length - 1 ? 0 : prev + 1
    );
    setTimeout(() => {
      setIsTransitioning(false);
      if (autoScroll) {
        autoScrollTimeoutRef.current = setTimeout(() => {
          setAutoScrollEnabled(true);
        }, 3000);
      }
    }, 600);
  };

  const handleDotClick = (index) => {
    if (isTransitioning || index === currentRoomIndex || rooms.length === 0) return;
    setAutoScrollEnabled(false);
    
    // Clear any existing resume timeout
    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current);
    }
    
    setIsTransitioning(true);
    setCurrentRoomIndex(index);
    setTimeout(() => {
      setIsTransitioning(false);
      if (autoScroll) {
        autoScrollTimeoutRef.current = setTimeout(() => {
          setAutoScrollEnabled(true);
        }, 3000);
      }
    }, 600);
  };

  if (rooms.length === 0) {
    return null;
  }

  const currentRoom = rooms[currentRoomIndex];

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-premier-light/30 to-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-12 sm:mb-16">
          <div className="space-y-3 flex-1">
            <p className="text-sm font-semibold text-dark-300 uppercase tracking-[0.08em]">
              {title}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-premier-dark leading-tight">
              {subtitle}
            </h2>
            <p className="text-dark-400 max-w-3xl">
              {description}
            </p>
          </div>
          
          {showViewMore && (
            <Link
              to={viewMoreLink}
              className="inline-flex items-center gap-2 rounded-full bg-premier-copper hover:bg-primary-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 whitespace-nowrap flex-shrink-0"
            >
              <span>View More</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          )}
        </div>

        {/* Room Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrevRoom}
            disabled={isTransitioning}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-xl flex items-center justify-center text-premier-dark hover:text-premier-copper transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous room"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNextRoom}
            disabled={isTransitioning}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-xl flex items-center justify-center text-premier-dark hover:text-premier-copper transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next room"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Room Cards Carousel */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9]">
              {rooms.map((room, index) => (
                <div
                  key={room.id || index}
                  className={`absolute inset-0 transition-all duration-600 ease-in-out ${
                    index === currentRoomIndex
                      ? 'opacity-100 translate-x-0 scale-100'
                      : index < currentRoomIndex
                      ? 'opacity-0 -translate-x-full scale-95'
                      : 'opacity-0 translate-x-full scale-95'
                  }`}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={room.image}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-premier-dark/80 via-premier-dark/50 to-transparent" />
                  </div>

                  {/* Content Overlay */}
                  <div className="relative h-full flex items-center">
                    <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                      <div className="max-w-xl lg:max-w-2xl">
                        {/* Room Badge */}
                        <div
                          className={`inline-flex items-center gap-2 mb-4 transition-all duration-500 ${
                            index === currentRoomIndex ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-4'
                          }`}
                        >
                          <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-premier-copper/20 backdrop-blur-sm border border-premier-copper/40 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                            {room.title.charAt(0)}
                          </span>
                        </div>

                        {/* Title */}
                        <h3
                          className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 transition-all duration-500 ${
                            index === currentRoomIndex ? 'opacity-100 translate-y-0 delay-150' : 'opacity-0 translate-y-4'
                          }`}
                        >
                          {room.title}
                        </h3>

                        {/* Collection */}
                        <p
                          className={`text-premier-copper text-sm sm:text-base font-medium mb-4 transition-all duration-500 ${
                            index === currentRoomIndex ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-4'
                          }`}
                        >
                          {room.collection || 'Premier Collection'}
                        </p>

                        {/* Description */}
                        <p
                          className={`text-white/90 text-base sm:text-lg leading-relaxed mb-6 transition-all duration-500 ${
                            index === currentRoomIndex ? 'opacity-100 translate-y-0 delay-250' : 'opacity-0 translate-y-4'
                          }`}
                        >
                          {room.copy || room.description}
                        </p>

                        {/* Tags/Amenities */}
                        {(room.tags || room.amenities) && (room.tags || room.amenities).length > 0 && (
                          <div
                            className={`flex flex-wrap gap-2 sm:gap-3 mb-6 transition-all duration-500 ${
                              index === currentRoomIndex ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-4'
                            }`}
                          >
                            {(room.tags || room.amenities).map((item, i) => (
                              <span
                                key={i}
                                className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs sm:text-sm font-medium"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Book Button */}
                        <Link
                          to={room.bookingLink || `/rooms/${room.id || room.title.toLowerCase().replace(/\s+/g, '-')}`}
                          className={`inline-block px-6 sm:px-8 py-3 sm:py-3.5 bg-premier-copper text-white rounded-lg font-semibold hover:bg-primary-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
                            index === currentRoomIndex ? 'opacity-100 translate-y-0 delay-350' : 'opacity-0 translate-y-4'
                          }`}
                        >
                          Book This Room
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
            {rooms.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-500 rounded-full transform hover:scale-125 ${
                  index === currentRoomIndex
                    ? 'w-10 h-3 bg-premier-copper shadow-lg scale-110'
                    : 'w-3 h-3 bg-premier-gray hover:bg-premier-copper/60 hover:w-5'
                }`}
                aria-label={`Go to room ${index + 1}`}
              />
            ))}
          </div>

          {/* Room Counter */}
          <div className="text-center mt-3 sm:mt-4">
            <span className="text-xs sm:text-sm font-medium text-dark-400 transition-all duration-300">
              Room <span className="inline-block transition-all duration-500 text-premier-copper font-bold transform scale-110">{currentRoomIndex + 1}</span> of {rooms.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
