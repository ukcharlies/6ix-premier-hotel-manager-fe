import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ScrollFloat from "../components/ScrollFloat";

// Hero background image (pool/leisure area)
const heroImage = "/vojtech-bruzek-Yrxr3bsPdS0-unsplash.jpg";

// SVG Icons
const SwimIcon = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
    />
  </svg>
);

const DumbbellIcon = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
    />
  </svg>
);

const SunIcon = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
    />
  </svg>
);

const HeartPulseIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
    />
  </svg>
);

const SparkleIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
    />
  </svg>
);

// Checkmark Icon
const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-premier-copper flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// Facilities Data
const facilitiesData = [
  {
    title: "Rooftop Pool & Lounge",
    description:
      "Escape to our exclusive rooftop oasis where luxury meets relaxation. Our temperature-controlled infinity pool offers breathtaking panoramic city views, creating the perfect backdrop for your leisure time. Whether you're taking a refreshing morning swim or unwinding with sunset cocktails, our attentive poolside staff ensures every moment is extraordinary. The sophisticated lounge area features plush cabanas, ambient music, and a curated menu of light bites and signature beverages. Open year-round with premium towel service, the rooftop pool transforms from a serene daytime retreat into an elegant evening social space.",
    highlights: [
      "Heated infinity pool with city skyline views",
      "Premium poolside loungers and private cabanas",
      "Signature cocktails and refreshment service",
      "Ambient lighting for evening relaxation",
      "Year-round temperature control",
      "Complimentary towel and amenity service",
    ],
    image: "/vojtech-bruzek-Yrxr3bsPdS0-unsplash.jpg",
    icon: <SwimIcon />,
  },
  {
    title: "Fitness Center",
    description:
      "Maintain your wellness journey in our cutting-edge fitness facility, meticulously designed for guests who prioritize health and vitality. Featuring the latest Technogym cardiovascular equipment, comprehensive strength training machines, and dedicated free weight areas, our fitness center caters to all workout preferences and fitness levels. Floor-to-ceiling windows flood the space with natural light while offering inspiring city vistas. Available 24/7 for your convenience, the climate-controlled environment ensures optimal comfort during any workout. Personal training sessions can be arranged, and our fitness consultants are available to create customized workout plans tailored to your goals.",
    highlights: [
      "Latest Technogym cardio and strength equipment",
      "24/7 access for maximum flexibility",
      "Panoramic city views with natural lighting",
      "Climate-controlled environment",
      "Personal training sessions available",
      "Complimentary workout towels and water",
    ],
    image: "/bilderboken-rlwE8f8anOc-unsplash.jpg",
    icon: <DumbbellIcon />,
  },
  {
    title: "Relaxation Spaces",
    description:
      "Discover our thoughtfully curated outdoor areas where comfort meets community. Our elegant indoor lounges provide sophisticated settings for casual meetings, quiet reading, or connecting with fellow travelers over artisan coffee. Step outside to beautifully landscaped terraces featuring comfortable seating arrangements perfect for soaking in fresh air and natural surroundings. As evening descends, these spaces transform with ambient lighting, creating an intimate atmosphere ideal for unwinding after a busy day. Whether you seek solitude or socialization, our versatile spaces accommodate every mood while maintaining the refined ambiance that defines 6ix Premier Hotel.",
    highlights: [
      "Beautifully landscaped outdoor terraces",
      "Elegant indoor lounge areas",
      "Comfortable seating for groups and individuals",
      "Evening ambient lighting",
      "Complimentary Wi-Fi throughout",
      "Ideal for families, couples, and solo travelers",
    ],
    image: "/marten-bjork-n_IKQDCyrG0-unsplash.jpg",
    icon: <UsersIcon />,
  },
];

// Benefits/Features Grid
const experienceFeatures = [
  {
    icon: "🏊",
    title: "Pool Excellence",
    description:
      "Temperature-controlled, crystal-clear water maintained to the highest hygiene standards",
  },
  {
    icon: "💪",
    title: "Premium Equipment",
    description: "Top-tier Technogym machines regularly serviced and sanitized",
  },
  {
    icon: "🧘",
    title: "Wellness Focus",
    description:
      "Spaces designed to promote physical health and mental relaxation",
  },
  {
    icon: "🌿",
    title: "Clean & Safe",
    description:
      "Rigorous cleaning protocols and safety measures for peace of mind",
  },
  {
    icon: "⭐",
    title: "Professional Service",
    description:
      "Attentive staff dedicated to enhancing your recreational experience",
  },
  {
    icon: "🌅",
    title: "Scenic Views",
    description: "Breathtaking vistas from our rooftop pool and fitness center",
  },
];

export default function RecreationalFacilities() {
  const heroRef = useRef(null);

  // Parallax effect for hero
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-premier-light">
      {/* ========== HERO SECTION ========== */}
      <section className="relative h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden">
        {/* Background Image with Parallax */}
        <div
          ref={heroRef}
          className="absolute inset-0 w-full h-[120%]"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-premier-dark/70 via-premier-dark/50 to-premier-dark/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-premier-dark/40 via-transparent to-premier-dark/40" />

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Decorative Elements */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-premier-copper" />
              <SunIcon />
              <div className="h-px w-12 bg-premier-copper" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Recreational Facilities
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-premier-light/90 font-light max-w-2xl mx-auto">
              Relax, recharge, and enjoy every moment of your stay.
            </p>

            {/* Quick Features */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-6">
              <div className="flex items-center gap-2 text-white/90">
                <SwimIcon />
                <span className="text-sm sm:text-base">Rooftop Pool</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <DumbbellIcon />
                <span className="text-sm sm:text-base">24/7 Fitness</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <UsersIcon />
                <span className="text-sm sm:text-base">Social Spaces</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/rooms"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-premier-copper hover:bg-primary-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <span>Explore Our Rooms</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                to="/bookings"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold backdrop-blur-sm border border-white/30 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
                <span>Book Your Stay</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white/70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* ========== INTRO SECTION ========== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-lg sm:text-xl text-dark-400 leading-relaxed">
            Your stay at{" "}
            <span className="text-premier-copper font-semibold">
              6ix Premier Hotel
            </span>{" "}
            goes beyond comfort. Our recreational facilities are designed to
            promote relaxation, wellness, and leisure, offering guests the
            perfect balance between activity and rest.
          </p>
        </div>
      </section>

      {/* ========== FACILITIES SECTION ========== */}
      <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-premier-light/30 to-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Section Header */}
          <div className="flex flex-col gap-3 mb-12 sm:mb-16 text-center">
            <div className="space-y-3 flex-1">
              <p className="text-sm font-semibold text-dark-300 uppercase tracking-[0.08em]">
                WELLNESS & LEISURE
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-premier-dark leading-tight">
                World-Class Recreational Amenities
              </h2>
              <p className="text-dark-400 max-w-3xl mx-auto">
                From invigorating workouts to serene relaxation, our facilities
                cater to every aspect of your well-being.
              </p>
            </div>
          </div>

          {/* Facilities Cards - Alternating Layout */}
          <div className="space-y-16 lg:space-y-24">
            {facilitiesData.map((facility, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-8 lg:gap-12 items-center`}
              >
                {/* Image */}
                <div className="w-full lg:w-1/2">
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group">
                    <img
                      src={facility.image}
                      alt={facility.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-premier-dark/70 via-premier-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Icon Badge */}
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-premier-copper shadow-lg">
                      {facility.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2 space-y-5">
                  <ScrollFloat
                    animationDuration={1}
                    ease="back.inOut(2)"
                    scrollStart="center bottom+=50%"
                    scrollEnd="bottom bottom-=40%"
                    stagger={0.05}
                    containerClassName="mb-0"
                    textClassName="text-premier-dark font-bold whitespace-nowrap"
                  >
                    {facility.title}
                  </ScrollFloat>

                  <p className="text-base sm:text-lg text-dark-400 leading-relaxed">
                    {facility.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-3 pt-2">
                    <p className="text-sm font-semibold text-premier-dark flex items-center gap-2">
                      <SparkleIcon />
                      Highlights
                    </p>
                    <div className="grid gap-3">
                      {facility.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckIcon />
                          <span className="text-dark-400 text-sm leading-relaxed">
                            {highlight}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Decorative Line */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="h-[2px] w-16 bg-premier-copper rounded-full" />
                    <div className="h-[2px] w-8 bg-premier-copper/50 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== GUEST EXPERIENCE SECTION ========== */}
      <section className="py-16 sm:py-20 lg:py-24 bg-premier-dark relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-premier-copper rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-premier-copper rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-sm font-semibold text-premier-copper uppercase tracking-[0.08em] mb-3">
              DESIGNED FOR YOU
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
              Designed for Comfort and Well-Being
            </h2>
            <p className="text-premier-gray max-w-2xl mx-auto">
              Every recreational facility at 6ix Premier Hotel is maintained to
              the highest standards of cleanliness, safety, and guest
              satisfaction. Our team ensures a peaceful environment where guests
              can relax with confidence.
            </p>
          </div>

          {/* Experience Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {experienceFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-premier-gray text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="relative py-20 sm:py-24 lg:py-32 overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-premier-dark/90 via-premier-dark/85 to-premier-copper/80" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <HeartPulseIcon />
            </div>
            <p className="text-premier-copper text-sm font-semibold uppercase tracking-[0.15em]">
              READY TO RELAX?
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Experience More Than
              <br />
              Just a Stay
            </h2>
            <p className="text-premier-light/80 text-lg max-w-2xl mx-auto">
              Book your stay today and discover the perfect balance of comfort,
              wellness, and luxury at 6ix Premier Hotel.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/rooms"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-premier-copper hover:bg-primary-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <span>Explore Our Rooms</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                to="/bookings"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold backdrop-blur-sm border border-white/30 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
                <span>Book Your Stay</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
