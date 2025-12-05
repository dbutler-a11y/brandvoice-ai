import CalendlyEmbed from '@/components/calendly/CalendlyEmbed';
import {
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  VideoCameraIcon,
  SparklesIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export const metadata = {
  title: 'Book a Discovery Call | BrandVoice Studio',
  description: 'Schedule a free discovery call to discuss your AI spokesperson needs and see how we can transform your brand\'s content marketing.',
};

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Book Your Free Discovery Call
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-4">
              Let&apos;s discuss how AI spokespersons can transform your brand&apos;s content marketing
            </p>
            <div className="flex items-center justify-center gap-2 text-purple-100">
              <ClockIcon className="w-5 h-5" />
              <span className="text-lg">30 minutes • No pressure • 100% free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column - What to Expect */}
          <div className="space-y-8">
            {/* What to Expect Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-purple-100">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                What to Expect on the Call
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserGroupIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                      Learn About Your Business
                    </h3>
                    <p className="text-gray-600">
                      We&apos;ll discuss your goals, target audience, and brand voice to understand exactly what you need.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <VideoCameraIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                      See Examples & Live Demos
                    </h3>
                    <p className="text-gray-600">
                      Watch sample videos in your industry and see the quality of our AI spokespersons firsthand.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <SparklesIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                      Get a Custom Quote
                    </h3>
                    <p className="text-gray-600">
                      Receive pricing tailored to your specific needs and package selection - no cookie-cutter solutions.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircleIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                      No Pressure, Just Answers
                    </h3>
                    <p className="text-gray-600">
                      Ask any questions you have - this is about finding if we&apos;re the right fit for your brand.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Trust Indicators */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <StarIcon className="w-6 h-6 text-white fill-current" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Trusted by 50+ Brands
                </h3>
              </div>
              <p className="text-gray-700 mb-4">
                Businesses across industries have transformed their marketing with our AI spokesperson solutions.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Real Estate</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">E-commerce</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Professional Services</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Local Businesses</p>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-purple-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 text-lg mb-4 italic">
                &quot;The discovery call was incredibly helpful. They took the time to understand our brand and showed us exactly what we could expect. Two weeks later, we had 30 high-quality videos ready to go!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold">
                  SM
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sarah Mitchell</p>
                  <p className="text-gray-600 text-sm">CEO, Real Estate Agency</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Calendly Embed */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-purple-100">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Select Your Time
                </h2>
                <p className="text-gray-600">
                  Choose a time that works best for you. You&apos;ll receive a confirmation email with meeting details.
                </p>
              </div>
              <CalendlyEmbed height="700px" />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Common Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers before your call
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Do I need to prepare anything for the call?
              </h3>
              <p className="text-gray-700">
                No preparation needed! Just come ready to discuss your business goals and content needs. If you have existing branding materials or sample videos you like, feel free to share them during the call.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Will I be pressured to buy?
              </h3>
              <p className="text-gray-700">
                Absolutely not. Our goal is to understand your needs and show you what&apos;s possible. You&apos;ll receive pricing information, but there&apos;s zero pressure to commit on the call.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                How quickly can I get started after the call?
              </h3>
              <p className="text-gray-700">
                Most clients start within a few days. Once you choose a package, we&apos;ll send you an onboarding form and begin creating your AI spokesperson immediately.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                What if I need to reschedule?
              </h3>
              <p className="text-gray-700">
                No problem! You can reschedule or cancel anytime using the link in your confirmation email. We understand things come up.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-lg text-purple-100 mb-6">
            Check out our FAQ page or contact us directly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/faq"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors duration-200 shadow-lg"
            >
              View FAQ
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition-colors duration-200 border-2 border-white/30"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
