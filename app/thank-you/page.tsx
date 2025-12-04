import Link from 'next/link'

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Thanks! We&apos;ve Received Your Intake Form
          </h1>
        </div>

        {/* Message */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <p className="text-xl text-gray-700 mb-6">
            We&apos;ll review your information and start building your AI spokesperson.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Expect to hear from us within <span className="font-semibold text-indigo-600">24-48 hours</span>.
          </p>
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">What happens next?</h2>
            <ul className="text-left space-y-3 text-gray-600 max-w-lg mx-auto">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>We&apos;ll analyze your brand voice and content needs</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Our team will reach out to confirm details and timeline</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>We&apos;ll start building your custom AI spokesperson</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>You&apos;ll receive your 30-day content pack within 7 days</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Questions? Feel free to email us or give us a call.</p>
        </div>
      </div>
    </div>
  )
}
