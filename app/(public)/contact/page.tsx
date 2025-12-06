import CalendlyEmbed from '@/components/calendly/CalendlyEmbed';
import CalendlyButton from '@/components/calendly/CalendlyButton';
import {
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

export const metadata = {
  title: 'Contact Us | BrandVoice Studio',
  description: 'Get in touch with BrandVoice Studio. Schedule a call, send us an email, or find answers to your questions about AI spokesperson video production.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Let&apos;s Talk About Your Brand
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
              We&apos;re here to help you transform your content marketing with AI spokespersons
            </p>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Contact Options Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Schedule a Call */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-purple-100 hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <CalendarDaysIcon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Schedule a Call
            </h3>
            <p className="text-gray-600 mb-6">
              Book a free 30-minute discovery call to discuss your needs and see if we&apos;re a good fit.
            </p>
            <CalendlyButton
              text="Book Now"
              className="w-full justify-center"
            />
          </div>

          {/* Email Us */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-purple-100 hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <EnvelopeIcon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Email Us
            </h3>
            <p className="text-gray-600 mb-4">
              Prefer email? Send us a message and we&apos;ll respond within 24 hours.
            </p>
            <a
              href="mailto:hello@brandvoice.studio"
              className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2 group"
            >
              <EnvelopeIcon className="w-5 h-5" />
              <span className="group-hover:underline">hello@brandvoice.studio</span>
            </a>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-purple-100 hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <QuestionMarkCircleIcon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Browse FAQ
            </h3>
            <p className="text-gray-600 mb-6">
              Find quick answers to common questions about our services, pricing, and process.
            </p>
            <a
              href="/faq"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              View FAQ
            </a>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Information */}
          <div className="space-y-8">
            {/* Response Time */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Quick Response Time
                </h3>
              </div>
              <p className="text-gray-700 mb-4">
                We typically respond to all inquiries within 24 hours during business days. For urgent matters, booking a call is the fastest way to get answers.
              </p>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Business Hours:</strong>
                </p>
                <p className="text-gray-700">
                  Monday - Friday: 9:00 AM - 6:00 PM EST
                </p>
              </div>
            </div>

            {/* What to Include in Your Message */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-purple-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                What to Include in Your Message
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <strong>Your business type</strong> and industry
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <strong>Your content goals</strong> and what you want to achieve
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <strong>Your timeline</strong> for getting started
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 text-sm font-bold">4</span>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <strong>Any specific questions</strong> you have about our process
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Other Ways to Connect */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-purple-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Prefer to Learn More First?
              </h3>
              <div className="space-y-4">
                <a
                  href="/how-it-works"
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 group-hover:text-purple-600">
                      See How It Works
                    </p>
                    <p className="text-sm text-gray-600">
                      Our 8-step process explained
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>

                <a
                  href="/pricing"
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 group-hover:text-purple-600">
                      View Pricing
                    </p>
                    <p className="text-sm text-gray-600">
                      Transparent pricing for all packages
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>

                <a
                  href="/portfolio"
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <PhoneIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 group-hover:text-purple-600">
                      View Portfolio
                    </p>
                    <p className="text-sm text-gray-600">
                      See examples of our work
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Calendly Embed */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-purple-100">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Book a Discovery Call
                </h2>
                <p className="text-gray-600">
                  The fastest way to get answers is to schedule a call. Pick a time that works for you.
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
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to help you get started
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                How quickly will I hear back?
              </h3>
              <p className="text-gray-700">
                We respond to all emails within 24 hours during business days (Monday-Friday). If you book a call, you&apos;ll speak with us at your scheduled time.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                What&apos;s the best way to contact you?
              </h3>
              <p className="text-gray-700">
                For detailed discussions about your project, we recommend booking a call. For simple questions or to share information, email works great.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Can I see examples before contacting you?
              </h3>
              <p className="text-gray-700">
                Absolutely! Check out our portfolio page to see sample AI spokesperson videos across different industries. You can also use our Voice Preview tool to hear different voice options.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Do you offer consultations outside of business hours?
              </h3>
              <p className="text-gray-700">
                While our standard hours are Monday-Friday 9 AM - 6 PM EST, we can sometimes accommodate evening or weekend calls. Mention your preferred time when booking and we&apos;ll do our best to work with your schedule.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                What if I&apos;m not sure which package I need?
              </h3>
              <p className="text-gray-700">
                That&apos;s exactly what the discovery call is for! We&apos;ll discuss your goals, budget, and needs to recommend the perfect package for your situation. No pressure - just guidance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Content?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join 50+ brands creating engaging content with AI spokespersons. Let&apos;s discuss how we can help your business grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CalendlyButton
              text="Schedule a Call"
              className="px-8 py-4 text-lg"
            />
            <a
              href="mailto:hello@brandvoice.studio"
              className="inline-flex items-center justify-center px-8 py-4 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition-colors duration-200 border-2 border-white/30 text-lg"
            >
              <EnvelopeIcon className="w-5 h-5 mr-2" />
              Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
