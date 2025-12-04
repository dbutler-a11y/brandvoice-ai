'use client';

import { useCookieConsentContext } from './CookieConsentProvider';

export default function CookieSettingsButton() {
  const { setShowPreferences } = useCookieConsentContext();

  return (
    <button
      onClick={() => setShowPreferences(true)}
      className="hover:text-white transition-colors text-left"
    >
      Cookie Settings
    </button>
  );
}
