import { useEffect, useMemo, useRef, useState } from "react";
import CircularGallery from "../components/CircularGallery";
const heroImage = "/bilderboken-rlwE8f8anOc-unsplash.jpg";

const CalendarIcon = () => (
  <svg
    className="h-5 w-5 text-premier-dark"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M8 3v4M16 3v4M3 9h18" />
  </svg>
);

const UsersIcon = () => (
  <svg
    className="h-5 w-5 text-premier-dark"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <circle cx="9" cy="9" r="3" />
    <path d="M2 20c0-3 3-5 7-5" />
    <path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3" />
    <path d="M14 20c0-2 2-3.7 5-4" />
  </svg>
);

const formatDate = (date) =>
  date?.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

const isSameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isInRange = (date, start, end) =>
  start && end && date > start && date < end;

function MonthCalendar({ monthDate, startDate, endDate, onSelectDay }) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = new Date(year, month, 1).getDay();
  const days = useMemo(() => {
    const placeholders = Array.from({ length: offset }).map((_, i) => ({
      key: `p-${i}`,
    }));
    const realDays = Array.from({ length: daysInMonth }).map((_, i) => {
      const date = new Date(year, month, i + 1);
      return { key: date.toISOString(), date };
    });
    return [...placeholders, ...realDays];
  }, [daysInMonth, offset, month, year]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-2 lg:gap-3 text-center text-sm font-medium text-dark-400 mb-4">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((label) => (
          <div key={label} className="text-premier-dark/70">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 lg:gap-3">
        {days.map((item) =>
          item.date ? (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectDay(item.date)}
              className={[
                "h-10 lg:h-12 rounded-full text-sm lg:text-base transition-all duration-150 font-medium",
                isSameDay(item.date, startDate) || isSameDay(item.date, endDate)
                  ? "bg-premier-copper text-white shadow-md"
                  : isInRange(item.date, startDate, endDate)
                  ? "bg-premier-light text-premier-dark"
                  : "text-premier-dark hover:bg-premier-light/80",
              ].join(" ")}
            >
              {item.date.getDate()}
            </button>
          ) : (
            <div key={item.key} />
          )
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const galleryItems = [
    { image: "/king.jpg", text: "Signature King Suite" },
    { image: "/room.jpg", text: "Premier Double" },
    { image: "/room2.jpg", text: "Skyline Deluxe" },
    { image: "/Standard.jpg", text: "Standard Retreat" },
  ];

  const roomHighlights = [
    {
      title: "Signature King Suite",
      image: "/king.jpg",
      copy: "Spacious living, bespoke bedding, and lounge access for business or leisure.",
      tags: ["City views", "Executive lounge", "Walk-in shower"],
    },
    {
      title: "Premier Double",
      image: "/room.jpg",
      copy: "Thoughtfully designed for small groups or families with layered comfort touches.",
      tags: ["Two plush doubles", "Sound-damped walls", "24/7 concierge"],
    },
    {
      title: "Skyline Deluxe",
      image: "/room2.jpg",
      copy: "Floor-to-ceiling outlooks, curated art, and a calm palette to reset your day.",
      tags: ["Panoramic windows", "Turn-down service", "In-room dining"],
    },
    {
      title: "Standard Retreat",
      image: "/Standard.jpg",
      copy: "Minimal, refined essentials with the same signature Premier service standards.",
      tags: ["Crisp linens", "Rainfall shower", "Fast Wi-Fi"],
    },
  ];

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const datePickerRef = useRef(null);
  const guestRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (
        datePickerOpen &&
        datePickerRef.current &&
        !datePickerRef.current.contains(e.target)
      ) {
        setDatePickerOpen(false);
      }
      if (
        guestOpen &&
        guestRef.current &&
        !guestRef.current.contains(e.target)
      ) {
        setGuestOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [datePickerOpen, guestOpen]);

  const formattedDates =
    startDate && endDate
      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
      : "Select dates";

  const guestLabel = `${guests.adults} adult${guests.adults > 1 ? "s" : ""}, ${
    guests.children
  } child${guests.children !== 1 ? "ren" : ""}`;

  const nextMonth = useMemo(
    () => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    [currentMonth]
  );

  const handleSelectDay = (day) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
      return;
    }
    if (day < startDate) {
      setStartDate(day);
      setEndDate(null);
      return;
    }
    setEndDate(day);
  };

  const adjustGuests = (type, delta) => {
    setGuests((prev) => {
      const next = { ...prev, [type]: Math.max(0, prev[type] + delta) };
      if (next.adults === 0 && next.children > 0) next.children = 0;
      return next;
    });
  };

  const handlePrevRoom = () => {
    setCurrentRoomIndex((prev) => 
      prev === 0 ? roomHighlights.length - 1 : prev - 1
    );
  };

  const handleNextRoom = () => {
    setCurrentRoomIndex((prev) => 
      prev === roomHighlights.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="bg-gradient-to-b from-premier-light/50 via-white to-premier-light/40 min-h-screen text-premier-dark">
      <section className="relative isolate overflow-hidden bg-premier-dark text-white">
        <div
          className="absolute inset-0 opacity-80 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-premier-dark/85 via-premier-dark/75 to-[#0f1416]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(164,117,80,0.35),transparent_50%)]" />
        <div className="absolute inset-y-0 right-[-6%] w-1/3 bg-gradient-to-b from-white/10 via-transparent to-transparent blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm ring-1 ring-white/10">
              <span className="h-2 w-2 rounded-full bg-primary-500" />
              Tailored arrivals, elevated stays
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
              Discover Your Perfect Luxury Escape
            </h1>
            <p className="text-lg sm:text-xl text-premier-light/90 max-w-2xl">
              Signature stays, bespoke experiences, and seamless check-ins crafted for modern travelers who expect more than a room.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold shadow-lg shadow-black/20 transition-colors hover:from-primary-500 hover:to-primary-400">
                Book Now
              </button>
              <button className="px-6 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors">
                Explore Experiences
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-2">
              {[
                { label: "Curated suites", value: "30+" },
                { label: "Cities worldwide", value: "12" },
                { label: "Concierge coverage", value: "24/7" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-white/5 px-4 py-3 sm:px-5 sm:py-4 ring-1 ring-white/10 backdrop-blur-sm"
                >
                  <p className="text-sm text-premier-light/80">{item.label}</p>
                  <p className="text-2xl font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-14 sm:-mt-16 lg:-mt-20 pb-12 sm:pb-16 lg:pb-24 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="bg-white/95 text-premier-dark rounded-3xl shadow-2xl shadow-black/10 ring-1 ring-dark-100/60 px-4 sm:px-6 lg:px-8 py-6 lg:py-7 backdrop-blur">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:items-end">
              <div className="space-y-2 relative" ref={datePickerRef}>
                <p className="text-sm font-semibold text-premier-dark">
                  Check-in / Check-out
                </p>
                <button
                type="button"
                onClick={() => {
                  setDatePickerOpen((open) => !open);
                  setGuestOpen(false);
                }}
                className="w-full flex items-center gap-3 rounded-2xl border border-premier-gray bg-white px-4 py-3 shadow-sm hover:border-premier-copper transition-colors text-left"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-premier-light text-premier-dark">
                  <CalendarIcon />
                </span>
                <span className="text-base font-medium">{formattedDates}</span>
              </button>

              {datePickerOpen && (
                <div className="absolute z-50 mt-3 w-full lg:w-auto lg:min-w-[700px] bg-white rounded-2xl shadow-2xl border border-premier-gray p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-8">
                    <button
                      type="button"
                      className="h-10 w-10 rounded-full border border-premier-gray text-premier-dark hover:border-premier-copper transition-colors"
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() - 1,
                            1
                          )
                        )
                      }
                      aria-label="Previous month"
                    >
                      {"<"}
                    </button>
                    <div className="flex-1 text-center font-semibold text-lg text-premier-dark">
                      {currentMonth.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      &nbsp;|&nbsp;{" "}
                      {nextMonth.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <button
                      type="button"
                      className="h-10 w-10 rounded-full border border-premier-gray text-premier-dark hover:border-premier-copper transition-colors"
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() + 1,
                            1
                          )
                        )
                      }
                      aria-label="Next month"
                    >
                      {">"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
                    <div>
                      <p className="text-sm font-semibold text-premier-dark mb-4">
                        {currentMonth.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <MonthCalendar
                        monthDate={currentMonth}
                        startDate={startDate}
                        endDate={endDate}
                        onSelectDay={handleSelectDay}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-premier-dark mb-4">
                        {nextMonth.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <MonthCalendar
                        monthDate={nextMonth}
                        startDate={startDate}
                        endDate={endDate}
                        onSelectDay={handleSelectDay}
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setStartDate(null);
                        setEndDate(null);
                      }}
                      className="px-4 py-2 rounded-full border border-premier-gray text-premier-dark hover:border-premier-copper transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setDatePickerOpen(false)}
                      className="px-5 py-2 rounded-full bg-premier-copper text-white font-semibold shadow hover:bg-primary-600 transition-colors"
                    >
                      Save Dates
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 relative" ref={guestRef}>
              <p className="text-sm font-semibold text-premier-dark">Guests</p>
              <button
                type="button"
                onClick={() => {
                  setGuestOpen((open) => !open);
                  setDatePickerOpen(false);
                }}
                className="w-full flex items-center gap-3 rounded-2xl border border-premier-gray bg-white px-4 py-3 shadow-sm hover:border-premier-copper transition-colors text-left"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-premier-light text-premier-dark">
                  <UsersIcon />
                </span>
                <span className="text-base font-medium">{guestLabel}</span>
              </button>

              {guestOpen && (
                <div className="absolute z-20 mt-3 w-full bg-white rounded-2xl shadow-2xl border border-premier-gray p-5">
                  <div className="space-y-4">
                    {["adults", "children"].map((type) => (
                      <div
                        key={type}
                        className="flex items-center justify-between"
                      >
                        <span className="capitalize text-premier-dark font-medium">
                          {type}
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => adjustGuests(type, -1)}
                            className="h-10 w-10 rounded-xl border border-premier-gray text-premier-dark font-bold hover:border-premier-copper transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-premier-dark font-semibold">
                            {guests[type]}
                          </span>
                          <button
                            type="button"
                            onClick={() => adjustGuests(type, 1)}
                            className="h-10 w-10 rounded-xl border border-premier-gray text-premier-dark font-bold hover:border-premier-copper transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setGuestOpen(false)}
                      className="px-5 py-2 rounded-full bg-premier-copper text-white font-semibold shadow hover:bg-primary-600 transition-colors"
                    >
                      Save Guests
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full">
              <button className="w-full bg-premier-copper hover:bg-primary-600 text-white font-semibold rounded-2xl py-4 shadow-lg transition-colors">
                Search Luxury Stays
              </button>
            </div>
          </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-dark-300 uppercase tracking-[0.08em]">
                Rooms & Suites
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-premier-dark">
                Spaces that feel custom-built for you
              </h2>
              <p className="text-dark-400 max-w-3xl">
                Choose the mood: sweeping skyline suites, calm doubles, or quietly luxurious standards. Every room is layered with Premier linens, intuitive lighting, and tech that simply works.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full bg-premier-copper hover:bg-primary-600 text-white px-5 py-2.5 text-sm font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
              <span>View More</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          {/* Carousel Container */}
          <div className="relative px-8 sm:px-12 lg:px-16">
            {/* Navigation Buttons */}
            <button
              onClick={handlePrevRoom}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-white shadow-xl border border-premier-gray hover:bg-premier-light hover:border-premier-copper transition-all duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous room"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-premier-dark group-hover:text-premier-copper transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={handleNextRoom}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-white shadow-xl border border-premier-gray hover:bg-premier-light hover:border-premier-copper transition-all duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next room"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-premier-dark group-hover:text-premier-copper transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Room Card Display */}
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-premier-light/50 border border-premier-gray/60 shadow-lg">
              <div 
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentRoomIndex * 100}%)` }}
              >
                {roomHighlights.map((room, index) => (
                  <div
                    key={`${room.title}-${index}`}
                    className="w-full flex-shrink-0"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-2 gap-0 min-h-[600px] sm:min-h-[550px] md:min-h-[500px] lg:min-h-[480px]">
                      {/* Image Section */}
                      <div className="md:col-span-2 lg:col-span-1 relative overflow-hidden min-h-[300px] sm:min-h-[350px] md:min-h-full">
                        <img
                          src={room.image}
                          alt={room.title}
                          className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      
                      {/* Content Section */}
                      <div className="md:col-span-3 lg:col-span-1 flex flex-col justify-center space-y-4 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-premier-copper/10 flex items-center justify-center text-premier-copper font-bold text-xl sm:text-2xl">
                            {room.title.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-premier-dark leading-tight">
                              {room.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-dark-400 mt-1">Premier Collection</p>
                          </div>
                        </div>
                        
                        <p className="text-dark-400 text-sm sm:text-base lg:text-lg leading-relaxed">
                          {room.copy}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {room.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full bg-premier-light px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-premier-dark ring-1 ring-premier-gray hover:ring-premier-copper hover:bg-premier-copper/10 transition-all duration-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <button className="mt-4 inline-flex items-center gap-2 self-start px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-premier-copper hover:bg-primary-600 text-white text-sm sm:text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                          Book This Room
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
              {roomHighlights.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentRoomIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentRoomIndex
                      ? 'w-8 h-3 bg-premier-copper shadow-md'
                      : 'w-3 h-3 bg-premier-gray hover:bg-premier-copper/50'
                  }`}
                  aria-label={`Go to room ${index + 1}`}
                />
              ))}
            </div>

            {/* Room Counter */}
            <div className="text-center mt-3 sm:mt-4">
              <span className="text-xs sm:text-sm font-medium text-dark-400">
                Room {currentRoomIndex + 1} of {roomHighlights.length}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-dark-300 uppercase tracking-[0.08em]">
                Immersive Preview
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-premier-dark">
                Circular Gallery Showcase
              </h2>
              <p className="text-dark-400 max-w-2xl">
                Glide through our curated destinations in a smooth circular reel. Drag or scroll to explore — every card tilts into view with subtle depth and soft edges.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:max-w-xs text-sm text-dark-400">
              <div className="rounded-2xl bg-white border border-premier-gray px-3 py-2 shadow-sm">
                Touch & drag to orbit
              </div>
              <div className="rounded-2xl bg-white border border-premier-gray px-3 py-2 shadow-sm">
                Scroll snaps cards into focus
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-dark-900 via-premier-dark to-black ring-1 ring-white/5 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.75)] px-2 sm:px-4 py-6 sm:py-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(164,117,80,0.16),transparent_45%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.04),transparent_45%)]" />
            <div className="relative">
              <CircularGallery
                bend={3.2}
                textColor="#f6f7f8"
                borderRadius={0.08}
                scrollEase={0.07}
                items={galleryItems}
                className="h-[320px] sm:h-[420px] lg:h-[540px]"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
