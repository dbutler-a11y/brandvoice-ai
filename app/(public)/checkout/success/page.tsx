'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Mail, Calendar, FileText } from 'lucide-react';

// Package definitions for display
const packages: Record<string, { name: string; billing: string }> = {
  'launch-kit': {
    name: 'AI Spokesperson Launch Kit',
    billing: 'one-time',
  },
  'content-engine-monthly': {
    name: 'Content Engine Monthly',
    billing: 'monthly',
  },
  'content-engine-pro': {
    name: 'Content Engine PRO',
    billing: 'monthly',
  },
  'authority-engine': {
    name: 'AUTHORITY Engine',
    billing: 'monthly',
  },
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const packageId = searchParams.get('package');

  const selectedPackage = packageId && packages[packageId] ? packages[packageId] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600">
            Thank you for choosing BrandVoice Studio
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Confirmation</h2>

          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Order ID:</span>
                <span className="font-mono text-sm font-medium text-gray-900">{orderId}</span>
              </div>
            </div>
          )}

          {selectedPackage && (
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Package:</span>
                <span className="font-semibold text-gray-900">{selectedPackage.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Billing:</span>
                <span className="font-medium text-gray-900">
                  {selectedPackage.billing === 'monthly' ? 'Monthly Subscription' : 'One-time Payment'}
                </span>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-start gap-3 text-sm text-gray-700">
              <Mail className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p>
                A confirmation email has been sent to your email address with your order details and receipt.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Happens Next?</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Complete Your Intake Form
                </h3>
                <p className="text-gray-600 mb-3">
                  Fill out our detailed intake form to help us understand your brand, target audience, and content goals.
                </p>
                <Link
                  href="/intake"
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200"
                >
                  Start Intake Form
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Schedule Your Strategy Call
                </h3>
                <p className="text-gray-600">
                  Book a 30-minute strategy call with our team to discuss your vision and align on content direction.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Production Begins
                </h3>
                <p className="text-gray-600">
                  Our team will create your custom AI spokesperson and begin producing your first batch of videos.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Access Your Portal
                </h3>
                <p className="text-gray-600">
                  Review, approve, and download your videos through your dedicated client portal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Need Help?</h2>
          <p className="text-blue-100 mb-6">
            Our support team is here to help you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@brandvoice.studio"
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Contact Support
            </a>
            <Link
              href="/"
              className="bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-800 transition-colors duration-200"
            >
              Return to Home
            </Link>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Expected delivery timeframe will be confirmed during your strategy call
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
