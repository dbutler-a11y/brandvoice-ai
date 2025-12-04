import Link from 'next/link';
import {
  PhoneIcon,
  UserGroupIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  SparklesIcon,
  CheckBadgeIcon,
  RocketLaunchIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const steps = [
  {
    number: 1,
    title: 'Discovery & Booking',
    description: 'Book a call or get started online. We discuss your business, goals, and content needs, then help you choose the perfect package for your brand.',
    icon: PhoneIcon,
    color: 'from-purple-500 to-indigo-500',
  },
  {
    number: 2,
    title: 'Onboarding & Voice Selection',
    description: 'Complete our intake form with your brand details, use our Voice Preview tool to select your preferred voice tone, and share your branding assets.',
    icon: UserGroupIcon,
    color: 'from-indigo-500 to-purple-500',
  },
  {
    number: 3,
    title: 'Avatar & Voice Creation',
    description: 'We create your custom AI spokesperson, configure your brand voice in ElevenLabs, and conduct an internal quality review.',
    icon: SparklesIcon,
    color: 'from-purple-500 to-indigo-500',
  },
  {
    number: 4,
    title: 'Scriptwriting',
    description: 'AI-powered script generation creates 30 scripts covering FAQs, tips, CTAs, and offers. Optional client approval round available.',
    icon: DocumentTextIcon,
    color: 'from-indigo-500 to-purple-500',
  },
  {
    number: 5,
    title: 'Video Production',
    description: 'Generate all videos with your avatar and voice. Professional quality output in multiple format options.',
    icon: VideoCameraIcon,
    color: 'from-purple-500 to-indigo-500',
  },
  {
    number: 6,
    title: 'Quality Assurance',
    description: 'Internal QA on all videos, caption verification, and branding consistency check ensure everything meets our high standards.',
    icon: CheckBadgeIcon,
    color: 'from-indigo-500 to-purple-500',
  },
  {
    number: 7,
    title: 'Delivery',
    description: 'All 30 videos delivered to your portal, organized by day (1-30), ready to download and post immediately.',
    icon: RocketLaunchIcon,
    color: 'from-purple-500 to-indigo-500',
  },
  {
    number: 8,
    title: 'Ongoing (Monthly Clients)',
    description: 'Monthly strategy call, fresh 30 videos each month, and a continuous content engine to keep your brand active.',
    icon: ArrowPathIcon,
    color: 'from-indigo-500 to-purple-500',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            How It Works
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
            Your journey from booking to brand transformation in 8 simple steps
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="relative">
          {/* Vertical line for desktop */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-200 via-indigo-200 to-purple-200" />

          {/* Steps */}
          <div className="space-y-12 md:space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.number}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content Card */}
                  <div
                    className={`w-full md:w-5/12 ${
                      isEven ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'
                    }`}
                  >
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 md:p-8 border border-purple-100">
                      <div
                        className={`flex items-center gap-3 mb-4 ${
                          isEven ? 'md:justify-end' : 'md:justify-start'
                        } justify-start`}
                      >
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Circle */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 items-center justify-center shadow-lg z-10 border-4 border-white">
                    <span className="text-white text-xl font-bold">
                      {step.number}
                    </span>
                  </div>

                  {/* Mobile Step Number */}
                  <div className="md:hidden flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-lg font-bold shadow-lg mb-4 border-4 border-white">
                    {step.number}
                  </div>

                  {/* Spacer for desktop */}
                  <div className="hidden md:block w-5/12" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of brands creating engaging content with AI spokespersons.
            Book your call today and start your transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <PhoneIcon className="w-5 h-5 mr-2" />
              Book Your Call
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition-colors duration-200 shadow-lg hover:shadow-xl border-2 border-white/30"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>

      {/* Additional Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Process?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our streamlined 8-step process ensures quality, consistency, and results
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-purple-100">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Professional Quality
            </h3>
            <p className="text-gray-600">
              Every video goes through multiple quality checks to ensure your brand looks its absolute best.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg border border-purple-100">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
              <RocketLaunchIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Fast Turnaround
            </h3>
            <p className="text-gray-600">
              From booking to delivery in as little as 2 weeks. Get your content calendar filled fast.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg border border-purple-100">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
              <ArrowPathIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Continuous Support
            </h3>
            <p className="text-gray-600">
              Monthly clients get ongoing strategy calls and fresh content to keep your brand growing.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Teaser */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Have Questions?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Check out our FAQ page or book a call to discuss your specific needs
          </p>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            View FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
