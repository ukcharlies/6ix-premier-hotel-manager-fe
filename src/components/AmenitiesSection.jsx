import ScrollFloat from './ScrollFloat';

const amenitiesData = [
  {
    title: "24/7 Front Desk",
    description: "Our attentive staff is always available to assist you with check-in, luggage handling, local recommendations, and any special requests. Whether you arrive late at night or need assistance early in the morning, we're here to ensure your stay is effortless and memorable. From booking transportation to arranging dinner reservations, consider us your personal concierge team dedicated to making every moment of your stay exceptional.",
    image: "/marten-bjork-n_IKQDCyrG0-unsplash.jpg",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: "Complimentary Wi-Fi",
    description: "Stay seamlessly connected with our high-speed, secure Wi-Fi available throughout the hotel. Whether you're catching up on work emails in your room, video calling loved ones from the lobby, or streaming your favorite shows, our robust network ensures you're always online. Enjoy unlimited bandwidth with enterprise-grade security, perfect for business travelers and leisure guests alike who need reliable connectivity.",
    image: "/christian-lambert-vmIWr0NnpCQ-unsplash.jpg",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
      </svg>
    )
  },
  {
    title: "Rooftop Pool & Lounge",
    description: "Escape to our exclusive rooftop oasis featuring a heated infinity pool with breathtaking city skyline views. Unwind on plush loungers, sip handcrafted cocktails from our poolside bar, and watch the sunset paint the cityscape in golden hues. Open year-round with temperature-controlled water, private cabanas available for reservation, and attentive poolside service ensuring your relaxation is never interrupted.",
    image: "/vojtech-bruzek-Yrxr3bsPdS0-unsplash.jpg",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    )
  },
  {
    title: "Fitness Center",
    description: "Maintain your wellness routine in our state-of-the-art fitness center, equipped with the latest Technogym cardio machines, free weights, and strength training equipment. Open 24/7 for your convenience, featuring floor-to-ceiling windows with inspiring city views, complimentary fresh towels, purified water stations, and personal training sessions available by appointment. Your health and fitness goals don't take a vacation, and neither should your workout regimen.",
    image: "/bilderboken-rlwE8f8anOc-unsplash.jpg",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    )
  },
  {
    title: "Breakfast Buffet",
    description: "Start your day with our lavish breakfast buffet featuring an extensive selection of local and international cuisines. From freshly baked pastries and artisan breads to made-to-order omelets, tropical fruits, premium coffees, and traditional favorites, every morning becomes a culinary journey. Our chefs source the finest ingredients daily, accommodating dietary preferences and allergies with dedicated stations for gluten-free, vegan, and organic options.",
    image: "/deluxe_room.jpg",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
      </svg>
    )
  },
  {
    title: "Conference Rooms",
    description: "Host successful meetings and events in our versatile conference facilities, equipped with cutting-edge audiovisual technology, high-speed internet, and flexible seating arrangements. From intimate boardroom sessions to grand presentations for up to 200 attendees, our professional events team handles every detail—from custom catering menus to technical support—ensuring your business gatherings run flawlessly while you focus on what matters most.",
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
    <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-premier-light/30 to-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header - Left Aligned like ROOMS & SUITES */}
        <div className="flex flex-col gap-3 mb-12 sm:mb-16">
          <div className="space-y-3 flex-1">
            <p className="text-sm font-semibold text-dark-300 uppercase tracking-[0.08em]">
              WHAT WE OFFER
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-premier-dark leading-tight">
              Amenities & Facilities
            </h2>
            <p className="text-dark-400 max-w-3xl">
              From restful sleep to productive meetings — enjoy modern amenities designed for your comfort.
            </p>
          </div>
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
                  textClassName="text-premier-dark font-bold whitespace-nowrap"
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

        {/* CTA Button - Matching RoomShowcase Style */}
        <div className="flex justify-center mt-16 lg:mt-20">
          <button className="inline-flex items-center gap-2 rounded-full bg-premier-copper hover:bg-primary-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 w-full sm:w-auto max-w-sm group">
            <span>Explore Our Facilities</span>
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
