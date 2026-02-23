import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import CircularGallery from "../components/CircularGallery";
import RoomShowcase from "../components/RoomShowcase";
import TextPressure from "../components/TextPressure";
import AmenitiesSection from "../components/AmenitiesSection";
import ReviewsSection from "../components/ReviewsSection";
import StaySearchPanel from "../components/StaySearchPanel";
const heroImage = "/bilderboken-rlwE8f8anOc-unsplash.jpg";

export default function Home() {
  const navigate = useNavigate();
  const searchSectionRef = useRef(null);
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

  const handleBookNow = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleExploreExperiences = () => {
    navigate("/facilities");
  };

  const handleSearchStays = ({ checkInDate, checkOutDate, adults, children, guests }) => {
    const params = new URLSearchParams({
      checkInDate,
      checkOutDate,
      adults: String(adults),
      children: String(children),
      guests: String(guests),
    });
    navigate(`/rooms?${params.toString()}`);
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
              Signature stays, bespoke experiences, and seamless check-ins
              crafted for modern travelers who expect more than a room.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleBookNow}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold shadow-lg shadow-black/20 transition-colors hover:from-primary-500 hover:to-primary-400"
              >
                Book Now
              </button>
              <button
                type="button"
                onClick={handleExploreExperiences}
                className="px-6 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
              >
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
                  <p className="text-2xl font-semibold text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        ref={searchSectionRef}
        className="relative -mt-14 sm:-mt-16 lg:-mt-20 pb-12 sm:pb-16 lg:pb-24 z-10"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="bg-white/95 text-premier-dark rounded-3xl shadow-2xl shadow-black/10 ring-1 ring-dark-100/60 px-4 sm:px-6 lg:px-8 py-6 lg:py-7 backdrop-blur">
            <StaySearchPanel
              initialValues={{ adults: 2, children: 0 }}
              buttonLabel="Search Luxury Stays"
              onSearch={handleSearchStays}
            />
          </div>
        </div>
      </section>

      <RoomShowcase
        rooms={roomHighlights}
        sectionTitle="ROOMS & SUITES"
        sectionSubtitle="Spaces that feel custom-built for you"
        viewMoreLink="/rooms"
      />

      {/* TextPressure Section - Two Lines, No Overflow */}
      <section className="relative py-1 sm:py-2 lg:py-3 bg-gradient-to-b from-white via-premier-light/10 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative flex items-center justify-center"
            style={{ minHeight: "100px" }}
          >
            {/* Single TextPressure instance with two lines */}
            <TextPressure
              lineTexts={["Stay the night", "Remember it forever"]}
              flex={false}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#A47550"
              strokeColor="#1B2E34"
              minFontSize={45}
              maxFontSize={160}
              safePaddingX={16}
              maxWidthStretch={140}
              className="w-full !text-left"
            />
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <AmenitiesSection />

      {/* Reviews Section */}
      <ReviewsSection />

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
                Glide through our curated destinations in a smooth circular
                reel. Drag or scroll to explore — every card tilts into view
                with subtle depth and soft edges.
              </p>
            </div>
            {/* <div className="grid grid-cols-2 gap-3 sm:max-w-xs text-sm text-dark-400">
              <div className="rounded-2xl bg-white border border-premier-gray px-3 py-2 shadow-sm">
                Touch & drag to orbit
              </div>
              <div className="rounded-2xl bg-white border border-premier-gray px-3 py-2 shadow-sm">
                Scroll snaps cards into focus
              </div>
            </div> */}
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
