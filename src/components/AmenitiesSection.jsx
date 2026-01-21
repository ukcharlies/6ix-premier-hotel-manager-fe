import ScrollFloat from './ScrollFloat';

const amenitiesData = [
  {
    title: "24/7 Front Desk",
    description: "Always-on assistance and concierge service to make your stay seamless.",
    image: "/marten-bjork-n_IKQDCyrG0-unsplash.jpg",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: "Complimentary Wi-Fi",
    description: "Fast, secure internet in rooms & public areas to keep you connected.",
    image: "/christian-lambert-vmIWr0NnpCQ-unsplash.jpg",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
      </svg>
    )
  },
  {
    title: "Rooftop Pool & Lounge",
    description: "Swim, relax, and take in stunning city views from our exclusive rooftop.",
    image: "/vojtech-bruzek-Yrxr3bsPdS0-unsplash.jpg",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    )
  },
  {
    title: "Fitness Center",
    description: "Open daily with modern equipment to maintain your wellness routine.",
    image: "/bilderboken-rlwE8f8anOc-unsplash.jpg",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    )
  },
  {
    title: "Breakfast Buffet",
    description: "Local and international dishes served fresh each morning to start your day right.",
    image: "/deluxe_room.jpg",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
      </svg>
    )
  },
  {
    title: "Conference Rooms",
    description: "Flexible spaces for meetings and events with state-of-the-art technology.",
    image: "/room.jpg",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    )
  }
];

const AmenitiesSection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-premier-light/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-sm font-semibold text-premier-copper uppercase tracking-[0.08em] mb-3">
            What We Offer
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-premier-dark mb-4">
            Amenities & Facilities
          </h2>
          <p className="text-lg text-dark-400 max-w-2xl mx-auto">
            From restful sleep to productive meetings — enjoy modern amenities designed for your comfort.
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="space-y-12 lg:space-y-20">
          {amenitiesData.map((amenity, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-6 lg:gap-12 items-center`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl group">
                  <img
                    src={amenity.image}
                    alt={amenity.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-premier-dark/60 via-premier-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon Badge */}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-full p-4 text-premier-copper shadow-lg">
                    {amenity.icon}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2 space-y-4">
                <ScrollFloat
                  animationDuration={1}
                  ease="back.inOut(2)"
                  scrollStart="center bottom+=50%"
                  scrollEnd="bottom bottom-=40%"
                  stagger={0.05}
                  containerClassName="mb-0"
                  textClassName="text-premier-dark font-bold"
                >
                  {amenity.title}
                </ScrollFloat>
                
                <p className="text-base sm:text-lg text-dark-400 leading-relaxed">
                  {amenity.description}
                </p>

                {/* Decorative Line */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="h-[2px] w-16 bg-premier-copper rounded-full" />
                  <div className="h-[2px] w-8 bg-premier-copper/50 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16 lg:mt-20">
          <button className="px-8 py-4 rounded-full bg-premier-copper hover:bg-primary-600 text-white font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            Explore Our Facilities
          </button>
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
