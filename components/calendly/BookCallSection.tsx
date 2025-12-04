'use client';

import CalendlyEmbed from './CalendlyEmbed';

interface BookCallSectionProps {
  title?: string;
  subtitle?: string;
}

export default function BookCallSection({
  title = "Ready to Get Started?",
  subtitle = "Book a free discovery call to discuss your AI spokesperson needs and see how we can help your business grow.",
}: BookCallSectionProps) {
  return (
    <section id="book-call" className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Benefits */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              What to expect on the call:
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Learn about your business</h4>
                  <p className="text-gray-600">We&apos;ll discuss your goals, target audience, and brand voice.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">See examples & demos</h4>
                  <p className="text-gray-600">Watch sample videos in your industry and see the quality firsthand.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Get a custom quote</h4>
                  <p className="text-gray-600">Receive pricing tailored to your specific needs and package selection.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">No pressure, just answers</h4>
                  <p className="text-gray-600">Ask any questions - this is about finding if we&apos;re the right fit.</p>
                </div>
              </li>
            </ul>

            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-sm">
                    50+
                  </div>
                </div>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">50+ businesses</span> have already transformed their marketing with AI spokespersons
                </p>
              </div>
            </div>
          </div>

          {/* Calendly Embed */}
          <div className="bg-white rounded-2xl shadow-xl">
            <CalendlyEmbed height="700px" />
          </div>
        </div>
      </div>
    </section>
  );
}
