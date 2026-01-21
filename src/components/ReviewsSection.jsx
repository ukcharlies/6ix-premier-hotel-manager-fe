import React from "react";

const reviewsData = [
  {
    id: 1,
    review:
      "Clean rooms, friendly staff, great location — perfect for my business trips.",
    author: "Aisha M.",
    location: "Lagos",
    rating: 5,
  },
  {
    id: 2,
    review: "Loved the rooftop pool and breakfast. The kids had a blast.",
    author: "Emeka T.",
    location: "Guest",
    rating: 4,
  },
  {
    id: 3,
    review: "Fast check-in and reliable Wi-Fi. Will stay again.",
    author: "John D.",
    location: null,
    rating: 4,
  },
  {
    id: 4,
    review: "Fast check-in and reliable Wi-Fi. Will stay again.",
    author: "6ixthedev.",
    location: "Abuja",
    rating: 4,
  },
];

const StarIcon = ({ filled }) => (
  <svg
    className={`w-5 h-5 ${filled ? "text-premier-copper fill-current" : "text-premier-gray"}`}
    fill={filled ? "currentColor" : "none"}
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
    />
  </svg>
);

const QuoteIcon = () => (
  <svg
    className="w-10 h-10 text-premier-copper/20"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

const ReviewsSection = () => {
  return (
    <section className="relative py-12 sm:py-20 lg:py-6 bg-gradient-to-b from-white via-premier-light/20 to-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Transitional Microcopy */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-sm font-semibold text-dark-300 uppercase tracking-[0.08em] mb-3">
            GUEST EXPERIENCES
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-premier-dark mb-4">
            Don't take our word for it
          </h2>
          <p className="text-lg text-dark-400 max-w-2xl mx-auto">
            See why guests keep coming back.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reviewsData.map((review) => (
            <div
              key={review.id}
              className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-premier-gray/30 group hover:border-premier-copper/50"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                <QuoteIcon />
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} filled={star <= review.rating} />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="relative z-10 mb-6">
                <p className="text-base sm:text-lg text-premier-dark leading-relaxed font-medium">
                  "{review.review}"
                </p>
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-premier-gray/30">
                {/* Avatar Placeholder */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-premier-copper to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {review.author.charAt(0)}
                </div>

                {/* Author Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-premier-dark truncate">
                    {review.author}
                  </p>
                  {review.location && (
                    <p className="text-xs text-dark-400 truncate">
                      {review.location}
                    </p>
                  )}
                </div>

                {/* Verified Badge */}
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-premier-light text-premier-copper text-xs font-semibold">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Rating Summary */}
        <div className="mt-12 lg:mt-16 bg-gradient-to-br from-premier-copper/5 to-primary-100/10 rounded-3xl p-6 sm:p-8 border border-premier-copper/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="text-4xl sm:text-5xl font-bold text-premier-copper">
                  4.7
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} filled={star <= 4.7} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-dark-400">
                Based on{" "}
                <span className="font-semibold text-premier-dark">
                  350+ reviews
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-premier-dark">98%</p>
                <p className="text-xs text-dark-400 uppercase tracking-wider">
                  Satisfaction
                </p>
              </div>
              <div className="h-12 w-px bg-premier-gray/50 hidden sm:block" />
              <div className="text-center">
                <p className="text-2xl font-bold text-premier-dark">95%</p>
                <p className="text-xs text-dark-400 uppercase tracking-wider">
                  Return Rate
                </p>
              </div>
              <div className="h-12 w-px bg-premier-gray/50 hidden sm:block" />
              <div className="text-center">
                <p className="text-2xl font-bold text-premier-dark">4.8</p>
                <p className="text-xs text-dark-400 uppercase tracking-wider">
                  Service
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 lg:mt-16">
          <button className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-premier-copper hover:bg-primary-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-xl group">
            <span>Read All Reviews</span>
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
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
