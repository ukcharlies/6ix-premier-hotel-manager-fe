import { useEffect, useMemo, useRef, useState } from "react";

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

const isInRange = (date, start, end) => start && end && date > start && date < end;

function toDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function MonthCalendar({ monthDate, startDate, endDate, onSelectDay }) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = new Date(year, month, 1).getDay();

  const days = useMemo(() => {
    const placeholders = Array.from({ length: offset }).map((_, index) => ({
      key: `p-${index}`,
    }));
    const realDays = Array.from({ length: daysInMonth }).map((_, index) => {
      const date = new Date(year, month, index + 1);
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
          ),
        )}
      </div>
    </div>
  );
}

export default function StaySearchPanel({
  initialValues,
  buttonLabel = "Search Luxury Stays",
  onSearch,
  buttonClassName = "bg-premier-copper hover:bg-primary-600",
}) {
  const [startDate, setStartDate] = useState(toDate(initialValues?.checkInDate));
  const [endDate, setEndDate] = useState(toDate(initialValues?.checkOutDate));
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [guests, setGuests] = useState({
    adults: Math.max(1, Number(initialValues?.adults || 2)),
    children: Math.max(0, Number(initialValues?.children || 0)),
  });
  const [searchError, setSearchError] = useState("");
  const datePickerRef = useRef(null);
  const guestRef = useRef(null);

  useEffect(() => {
    const nextStart = toDate(initialValues?.checkInDate);
    const nextEnd = toDate(initialValues?.checkOutDate);
    setStartDate(nextStart);
    setEndDate(nextEnd);
    setGuests({
      adults: Math.max(1, Number(initialValues?.adults || 2)),
      children: Math.max(0, Number(initialValues?.children || 0)),
    });
  }, [initialValues?.adults, initialValues?.children, initialValues?.checkInDate, initialValues?.checkOutDate]);

  useEffect(() => {
    function handleClick(event) {
      if (datePickerOpen && datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setDatePickerOpen(false);
      }
      if (guestOpen && guestRef.current && !guestRef.current.contains(event.target)) {
        setGuestOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [datePickerOpen, guestOpen]);

  const formattedDates =
    startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : "Select dates";

  const effectiveGuests = guests.adults + Math.ceil(guests.children / 2);

  const guestLabel = `${guests.adults} adult${guests.adults > 1 ? "s" : ""}, ${
    guests.children
  } child${guests.children !== 1 ? "ren" : ""}`;

  const nextMonth = useMemo(
    () => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    [currentMonth],
  );

  const handleSelectDay = (day) => {
    setSearchError("");
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
      const minValue = type === "adults" ? 1 : 0;
      return { ...prev, [type]: Math.max(minValue, prev[type] + delta) };
    });
  };

  const handleSearch = () => {
    if (!startDate || !endDate) {
      setSearchError("Please select both check-in and check-out dates.");
      return;
    }

    setSearchError("");
    onSearch?.({
      checkInDate: startDate.toISOString().slice(0, 10),
      checkOutDate: endDate.toISOString().slice(0, 10),
      adults: guests.adults,
      children: guests.children,
      guests: effectiveGuests,
      effectiveGuests,
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:items-end">
        <div className="space-y-2 relative" ref={datePickerRef}>
          <p className="text-sm font-semibold text-premier-dark">Check-in / Check-out</p>
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

          {datePickerOpen ? (
            <div className="absolute z-50 mt-3 w-full lg:w-auto lg:min-w-[700px] bg-white rounded-2xl shadow-2xl border border-premier-gray p-6 lg:p-8">
              <div className="flex items-center justify-between mb-8">
                <button
                  type="button"
                  className="h-10 w-10 rounded-full border border-premier-gray text-premier-dark hover:border-premier-copper transition-colors"
                  onClick={() =>
                    setCurrentMonth(
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
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
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
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
          ) : null}
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

          {guestOpen ? (
            <div className="absolute z-20 mt-3 w-full bg-white rounded-2xl shadow-2xl border border-premier-gray p-5">
              <div className="space-y-4">
                {["adults", "children"].map((type) => (
                  <div key={type} className="flex items-center justify-between">
                    <div>
                      <span className="capitalize text-premier-dark font-medium">{type}</span>
                      {type === "children" ? (
                        <p className="text-xs text-gray-500">Age 0-7 years</p>
                      ) : null}
                    </div>
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
              <div className="mt-4 rounded-lg bg-premier-light/60 px-3 py-2 text-xs text-premier-dark">
                Capacity count: {effectiveGuests} guest{effectiveGuests > 1 ? "s" : ""} (2 children
                = 1 guest).
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setGuestOpen(false)}
                  className="px-5 py-2 rounded-full bg-premier-copper text-white font-semibold shadow hover:bg-primary-600 transition-colors"
                >
                  Save Guests
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="w-full">
          <button
            type="button"
            onClick={handleSearch}
            className={`w-full text-white font-semibold rounded-2xl py-4 shadow-lg transition-colors ${buttonClassName}`}
          >
            {buttonLabel}
          </button>
        </div>
      </div>

      {searchError ? <p className="mt-3 text-sm text-red-600 font-medium">{searchError}</p> : null}
    </div>
  );
}
