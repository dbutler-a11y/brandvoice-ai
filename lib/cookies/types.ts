// Cookie consent types
export type CookieCategory = 'necessary' | 'analytics' | 'marketing';

export interface CookieConsent {
  necessary: boolean; // Always true, required for site to function
  analytics: boolean;
  marketing: boolean;
  timestamp: string; // ISO date string of when consent was given
}

export const DEFAULT_CONSENT: CookieConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: '',
};

export const COOKIE_CONSENT_KEY = 'cookie-consent';

// Cookie category descriptions for the UI
export const COOKIE_CATEGORIES = {
  necessary: {
    name: 'Necessary',
    description: 'Essential cookies required for the website to function properly. These cannot be disabled.',
    required: true,
  },
  analytics: {
    name: 'Analytics',
    description: 'Help us understand how visitors interact with our website by collecting anonymous information.',
    required: false,
  },
  marketing: {
    name: 'Marketing',
    description: 'Used to deliver personalized ads and measure the effectiveness of our advertising campaigns.',
    required: false,
  },
} as const;
