"use client";

import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Michael Chen",
    title: "Broker/Owner",
    company: "Chen Premier Realty",
    image: "/images/testimonials/michael-chen.jpg",
    quote: "BrandVoice Studio transformed how I market my listings. I went from struggling to post once a week to having 30 days of professional content ready to go. My engagement has tripled and I've closed 3 deals from leads who found me through my videos.",
    metric: "3x engagement increase",
  },
  {
    id: 2,
    name: "Sofia Martinez",
    title: "Founder & Medical Director",
    company: "Glow Aesthetics Med Spa",
    image: "/images/testimonials/sofia-martinez.jpg",
    quote: "As a med spa owner, I was always too busy with clients to create content. Now I have a consistent presence on social media without lifting a finger. The AI spokesperson looks so professional - my patients can't believe it's not me!",
    metric: "40% more bookings",
  },
  {
    id: 3,
    name: "Marcus Thompson",
    title: "Owner & Head Coach",
    company: "Elite Performance Fitness",
    image: "/images/testimonials/marcus-thompson.jpg",
    quote: "I was skeptical at first, but the results speak for themselves. My gym membership inquiries shot up within the first month. The content quality is incredible and perfectly captures my brand's energy.",
    metric: "2x membership inquiries",
  },
  {
    id: 4,
    name: "Jennifer Wong",
    title: "Managing Partner",
    company: "Wong & Associates Law",
    image: "/images/testimonials/jennifer-wong.jpg",
    quote: "In the legal industry, trust is everything. BrandVoice created content that positions me as an authority in my field. I've received more quality leads in 2 months than I did in the previous year from traditional marketing.",
    metric: "150% more qualified leads",
  },
  {
    id: 5,
    name: "Omar Hassan",
    title: "Founder & CEO",
    company: "Luxe Home Goods",
    image: "/images/testimonials/omar-hassan.jpg",
    quote: "Running an e-commerce brand, I needed content that converts. The AI spokesperson videos have become our top-performing ads. Our ROAS improved dramatically and customer acquisition costs dropped by 35%.",
    metric: "35% lower CAC",
  },
];

export function TestimonialSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Growing Businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our clients have to say about their results
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              100+
            </div>
            <p className="text-gray-600 text-lg">Businesses Served</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              3,000+
            </div>
            <p className="text-gray-600 text-lg">Videos Created</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              98%
            </div>
            <p className="text-gray-600 text-lg">Client Satisfaction</p>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              {/* Header with photo and info */}
              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 ring-2 ring-purple-100">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.title}</p>
                  <p className="text-sm text-purple-600 font-medium">
                    {testimonial.company}
                  </p>
                </div>
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Metric badge and stars */}
              <div className="flex items-center justify-between">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  {testimonial.metric}
                </span>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Second row - 2 cards centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
          {testimonials.slice(3, 5).map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              {/* Header with photo and info */}
              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 ring-2 ring-purple-100">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.title}</p>
                  <p className="text-sm text-purple-600 font-medium">
                    {testimonial.company}
                  </p>
                </div>
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Metric badge and stars */}
              <div className="flex items-center justify-between">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  {testimonial.metric}
                </span>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
