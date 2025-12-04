'use client';

import Link from 'next/link';
import { useCookieConsent } from '@/lib/cookies';
import { Cookie } from 'lucide-react';

export default function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, setShowPreferences } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-3 sm:p-4 animate-slide-up">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-5">
          {/* Header Row */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Cookie className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Cookie Preferences</h3>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            We use cookies to enhance your experience. By continuing, you agree to our{' '}
            <Link href="/privacy" className="text-purple-600 hover:text-purple-700 underline">
              Privacy Policy
            </Link>
            .
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <button
              onClick={() => setShowPreferences(true)}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm underline-offset-2 hover:underline order-3 sm:order-1"
            >
              Manage preferences
            </button>

            <div className="flex gap-2 order-1 sm:order-2">
              <button
                onClick={rejectAll}
                className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                Reject all
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm text-sm"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
