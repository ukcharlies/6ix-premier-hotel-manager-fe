import { useEffect, useMemo, useRef, useState } from "react";

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
      <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-dark-400 mb-3">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((label) => (
          <div key={label} className="text-premier-dark/70">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((item) =>
          item.date ? (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectDay(item.date)}
              className={[
                "h-10 rounded-full text-sm transition-all duration-150",
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
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

  return (
    <div className="relative bg-premier-light">
      {/* Hero section with background image - takes 2/3 of viewport */}
      <div className="relative h-[80vh] min-h-[500px] bg-premier-dark text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-premier-dark/80 via-premier-dark/70 to-premier-dark/85" />

        <div className="relative h-full flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12">
          <div className="max-w-4xl">
            <p className="text-premier-light/90 text-lg mb-4">
              6ix Premier Collection
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
              Discover Your Perfect Luxury Escape
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-premier-light/90 max-w-2xl">
              Signature stays, bespoke experiences, and seamless check-ins
              crafted for modern travelers.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="px-6 py-3 rounded-full bg-premier-copper text-white font-semibold shadow-lg hover:bg-primary-600 transition-colors">
                Book Now
              </button>
              <button className="px-6 py-3 rounded-full border border-premier-light/40 text-white font-semibold hover:bg-white/10 transition-colors">
                Explore Experiences
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking container - positioned to overlap 1/3 into hero and 2/3 outside */}
      <div className="relative -mt-24 px-6 sm:px-10 lg:px-16 pb-16">
        <div className="bg-white/95 text-premier-dark rounded-3xl shadow-2xl px-4 sm:px-6 py-6 max-w-6xl mx-auto backdrop-blur">
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
                <div className="absolute z-20 mt-3 w-full max-w-3xl lg:max-w-2xl bg-white rounded-2xl shadow-2xl border border-premier-gray p-6">
                  <div className="flex items-center justify-between mb-6">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-premier-dark mb-2">
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
                      <p className="text-sm font-semibold text-premier-dark mb-2">
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

                  <div className="mt-6 flex justify-end gap-3">
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
    </div>
  );
}
