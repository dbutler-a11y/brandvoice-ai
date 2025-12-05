'use client';

import { useState, useEffect } from 'react';
import { useCookieConsent, COOKIE_CATEGORIES, CookieCategory } from '@/lib/cookies';

export default function CookiePreferencesModal() {
  const { consent, showPreferences, setShowPreferences, savePreferences } = useCookieConsent();

  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
  });

  // Sync with stored consent when modal opens
  useEffect(() => {
    if (showPreferences && consent) {
      setPreferences({
        analytics: consent.analytics,
        marketing: consent.marketing,
      });
    }
  }, [showPreferences, consent]);

  if (!showPreferences) return null;

  const handleToggle = (category: Exclude<CookieCategory, 'necessary'>) => {
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSave = () => {
    savePreferences({
      analytics: preferences.analytics,
      marketing: preferences.marketing,
    });
  };

  const handleCancel = () => {
    setShowPreferences(false);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-h-[calc(100dvh-2rem)] overflow-hidden animate-scale-in flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Cookie Preferences</h2>
            </div>
            <button
              onClick={handleCancel}
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close preferences"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Manage your cookie preferences below. Necessary cookies are always enabled.
          </p>
        </div>

        {/* Cookie Categories */}
        <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
          {/* Necessary Cookies - Always On */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{COOKIE_CATEGORIES.necessary.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{COOKIE_CATEGORIES.necessary.description}</p>
              </div>
              <div className="ml-4">
                <div className="w-12 h-7 bg-purple-600 rounded-full relative cursor-not-allowed opacity-70">
                  <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow" />
                </div>
                <span className="text-xs text-gray-500 mt-1 block text-center">Always on</span>
              </div>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{COOKIE_CATEGORIES.analytics.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{COOKIE_CATEGORIES.analytics.description}</p>
              </div>
              <button
                onClick={() => handleToggle('analytics')}
                className={`ml-4 w-12 h-7 rounded-full relative transition-colors ${
                  preferences.analytics ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    preferences.analytics ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{COOKIE_CATEGORIES.marketing.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{COOKIE_CATEGORIES.marketing.description}</p>
              </div>
              <button
                onClick={() => handleToggle('marketing')}
                className={`ml-4 w-12 h-7 rounded-full relative transition-colors ${
                  preferences.marketing ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    preferences.marketing ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-white transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg text-sm"
          >
            Save preferences
          </button>
        </div>
      </div>
    </div>
  );
}
