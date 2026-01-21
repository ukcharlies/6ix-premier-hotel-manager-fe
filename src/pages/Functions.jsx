import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ScrollFloat from "../components/ScrollFloat";

// Hero background image (you can change this to a relevant venue/ballroom image)
const heroImage = "/bilderboken-rlwE8f8anOc-unsplash.jpg";

// SVG Icons
const CalendarCheckIcon = () => (
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
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
    />
  </svg>
);

const UsersGroupIcon = () => (
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
      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
    />
  </svg>
);

const SparklesIcon = () => (
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
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
    />
  </svg>
);

const BuildingOfficeIcon = () => (
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
      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
    />
  </svg>
);

const TableCellsIcon = () => (
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
      d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
    />
  </svg>
);

const HeartIcon = () => (
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

// Checkmark Icon for bullet points
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

// Venue Data
const venueData = [
  {
    title: "Grand Ballroom",
    description:
      "Our magnificent Grand Ballroom is the crown jewel of 6ix Premier Hotel, offering an expansive and versatile space ideal for weddings, conferences, gala dinners, and large receptions. With soaring high ceilings adorned with elegant chandeliers, customizable ambient lighting systems, and a state-of-the-art integrated sound system, this venue transforms to match your vision perfectly. Whether you're planning an intimate celebration or a grand corporate event, our ballroom provides the sophisticated backdrop your occasion deserves.",
    capacity: "Up to 350 guests",
    configurations: ["Theatre", "Banquet", "Classroom", "U-Shape"],
    features: [
      "High ceilings",
      "Crystal chandeliers",
      "Customizable lighting",
      "Integrated sound system",
      "Private entrance",
    ],
    image: "/king.jpg",
    icon: <BuildingOfficeIcon />,
  },
  {
    title: "Executive Conference ",
    description:
      "Designed for productivity and professionalism, our Executive Conference Rooms provide the perfect environment for board meetings, strategy sessions, investor presentations, and corporate trainings. Each room is equipped with cutting-edge audiovisual technology, seamless video conferencing capabilities, and ergonomic furnishings to ensure your team can focus on what matters most. Natural lighting and soundproofed walls create an atmosphere conducive to focused discussions and important decisions.",
    capacity: "10–40 guests",
    configurations: ["Boardroom", "Classroom", "Theatre"],
    features: [
      "4K presentation screens",
      "Video conferencing",
      "Whiteboards",
      "High-speed Wi-Fi",
      "Dedicated support",
    ],
    image: "/room.jpg",
    icon: <TableCellsIcon />,
  },
  {
    title: "Private Event Lounges",
    description:
      "For those seeking an intimate setting with impeccable service, our Private Event Lounges offer the perfect retreat for exclusive gatherings, milestone celebrations, anniversary dinners, and VIP receptions. Featuring plush lounge seating, sophisticated ambient lighting, and dedicated private service, these spaces create an atmosphere of refined luxury. Each lounge can be customized to reflect your personal style, complete with curated music selections and bespoke catering experiences.",
    capacity: "Up to 50 guests",
    configurations: ["Cocktail", "Seated Dinner", "Lounge Style"],
    features: [
      "Lounge seating",
      "Ambient lighting",
      "Private bar service",
      "Custom décor options",
      "Dedicated staff",
    ],
    image: "/room2.jpg",
    icon: <HeartIcon />,
  },
];

// Event Support Features
const supportFeatures = [
  {
    title: "Dedicated Event Coordinator",
    description:
      "A personal event specialist assigned to guide you from planning to execution",
  },
  {
    title: "Flexible Seating & Layouts",
    description:
      "Adaptable configurations to match your event style and guest count",
  },
  {
    title: "On-Site Technical Support",
    description: "Professional AV technicians available throughout your event",
  },
  {
    title: "Custom Catering Options",
    description:
      "Tailored menus from our executive chef, including dietary accommodations",
  },
  {
    title: "Secure Parking & Valet",
    description:
      "Convenient parking facilities with optional valet service for guests",
  },
  {
    title: "Guest Assistance Services",
    description:
      "Concierge support for accommodations, transportation, and special requests",
  },
];

// Event Types
const eventTypes = [
  {
    icon: "🎯",
    title: "Corporate Meetings & Conferences",
    description: "Strategic sessions and team gatherings",
  },
  {
    icon: "💒",
    title: "Weddings & Engagements",
    description: "Your perfect day, beautifully executed",
  },
  {
    icon: "🎂",
    title: "Birthdays & Celebrations",
    description: "Milestone moments made memorable",
  },
  {
    icon: "🚀",
    title: "Product Launches",
    description: "Make an impactful brand statement",
  },
  {
    icon: "📚",
    title: "Workshops & Seminars",
    description: "Learning environments that inspire",
  },
  {
    icon: "🎉",
    title: "Social Galas & Dinners",
    description: "Elegant evenings of distinction",
  },
];

export default function Functions() {
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
              <SparklesIcon />
              <div className="h-px w-12 bg-premier-copper" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Functions & Events
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-premier-light/90 font-light max-w-2xl mx-auto">
              Elegant spaces designed for meetings, celebrations, and memorable
              moments.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-6">
              <div className="flex items-center gap-2 text-white/90">
                <CalendarCheckIcon />
                <span className="text-sm sm:text-base">350+ Events Yearly</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <UsersGroupIcon />
                <span className="text-sm sm:text-base">Up to 350 Guests</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <SparklesIcon />
                <span className="text-sm sm:text-base">5-Star Service</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/bookings"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-premier-copper hover:bg-primary-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <span>Request a Booking</span>
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
              <a
                href="tel:+234800000000"
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
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                <span>Speak to Events Team</span>
              </a>
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
            At{" "}
            <span className="text-premier-copper font-semibold">
              6ix Premier Hotel
            </span>
            , we provide thoughtfully designed function spaces that combine
            comfort, flexibility, and professional support. Whether you are
            hosting a corporate meeting, a private celebration, or a large
            social event, our venues are tailored to deliver seamless
            experiences from start to finish.
          </p>
        </div>
      </section>

      {/* ========== FUNCTION SPACES SECTION ========== */}
      <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-premier-light/30 to-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Section Header */}
          <div className="flex flex-col gap-3 mb-12 sm:mb-16">
            <div className="space-y-3 flex-1">
              <p className="text-sm font-semibold text-dark-300 uppercase tracking-[0.08em]">
                OUR FUNCTION SPACES
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-premier-dark leading-tight">
                Versatile Venues for Every Occasion
              </h2>
              <p className="text-dark-400 max-w-3xl">
                Our function rooms are crafted to accommodate a wide range of
                events, offering adaptable layouts, modern amenities, and a
                refined atmosphere.
              </p>
            </div>
          </div>

          {/* Venue Cards - Alternating Layout */}
          <div className="space-y-16 lg:space-y-24">
            {venueData.map((venue, index) => (
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
                      src={venue.image}
                      alt={venue.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-premier-dark/70 via-premier-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Icon Badge */}
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-premier-copper shadow-lg">
                      {venue.icon}
                    </div>

                    {/* Capacity Badge */}
                    <div className="absolute bottom-6 right-6 bg-premier-copper text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      {venue.capacity}
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
                    {venue.title}
                  </ScrollFloat>

                  <p className="text-base sm:text-lg text-dark-400 leading-relaxed">
                    {venue.description}
                  </p>

                  {/* Configurations */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-premier-dark">
                      Configurations:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {venue.configurations.map((config, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-premier-light text-premier-dark text-sm rounded-full"
                        >
                          {config}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-premier-dark">
                      Features:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {venue.features.map((feature, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-premier-copper/10 text-premier-copper text-sm rounded-full"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {feature}
                        </span>
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

      {/* ========== EVENT SUPPORT SECTION ========== */}
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
              PROFESSIONAL EVENT SUPPORT
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
              Seamless Planning, Exceptional Execution
            </h2>
            <p className="text-premier-gray max-w-2xl mx-auto">
              Our dedicated events team works closely with you to ensure every
              detail is handled with precision. From space setup to catering
              coordination, we provide end-to-end support to bring your vision
              to life.
            </p>
          </div>

          {/* Support Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {supportFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-premier-copper/20 rounded-xl flex items-center justify-center group-hover:bg-premier-copper/30 transition-colors duration-300">
                    <CheckIcon />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-premier-gray text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== EVENTS WE HOST SECTION ========== */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-sm font-semibold text-dark-300 uppercase tracking-[0.08em] mb-3">
              IDEAL FOR
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-premier-dark leading-tight">
              Events We Host
            </h2>
          </div>

          {/* Event Types Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventTypes.map((event, index) => (
              <div
                key={index}
                className="group bg-premier-light/50 hover:bg-premier-copper/10 border border-premier-gray/30 hover:border-premier-copper/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg cursor-pointer"
              >
                <div className="text-4xl mb-4">{event.icon}</div>
                <h3 className="text-premier-dark font-semibold text-lg mb-2 group-hover:text-premier-copper transition-colors duration-300">
                  {event.title}
                </h3>
                <p className="text-dark-400 text-sm">{event.description}</p>
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
            <p className="text-premier-copper text-sm font-semibold uppercase tracking-[0.15em]">
              START PLANNING TODAY
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Plan Your Next Event
              <br />
              With Confidence
            </h2>
            <p className="text-premier-light/80 text-lg max-w-2xl mx-auto">
              Let our experienced events team help you create an unforgettable
              experience. Whether it's an intimate gathering or a grand
              celebration, we're here to make it happen.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/bookings"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-premier-copper hover:bg-primary-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <span>Request a Function Booking</span>
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
              <a
                href="mailto:events@6ixpremier.com"
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
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <span>Speak With Our Events Team</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
