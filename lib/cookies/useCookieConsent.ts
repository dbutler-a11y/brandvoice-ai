'use client';

import { useState, useEffect, useCallback } from 'react';
import { CookieConsent, CookieCategory, DEFAULT_CONSENT, COOKIE_CONSENT_KEY } from './types';

interface UseCookieConsentReturn {
  consent: CookieConsent | null;
  hasConsent: (category: CookieCategory) => boolean;
  isConsentGiven: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (preferences: Partial<CookieConsent>) => void;
  resetConsent: () => void;
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
  showPreferences: boolean;
  setShowPreferences: (show: boolean) => void;
}

export function useCookieConsent(): UseCookieConsentReturn {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // Load consent from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CookieConsent;
        setConsent(parsed);
      } catch {
        // Invalid stored consent, will show banner
        setConsent(null);
      }
    }
    setIsLoaded(true);
  }, []);

  // Show banner if no consent is stored
  useEffect(() => {
    if (isLoaded && !consent) {
      setShowBanner(true);
    }
  }, [isLoaded, consent]);

  const saveConsent = useCallback((newConsent: CookieConsent) => {
    const consentWithTimestamp = {
      ...newConsent,
      necessary: true, // Always true
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentWithTimestamp));
    setConsent(consentWithTimestamp);
    setShowBanner(false);
    setShowPreferences(false);
  }, []);

  const acceptAll = useCallback(() => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: '',
    });
  }, [saveConsent]);

  const rejectAll = useCallback(() => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: '',
    });
  }, [saveConsent]);

  const savePreferences = useCallback((preferences: Partial<CookieConsent>) => {
    saveConsent({
      ...DEFAULT_CONSENT,
      ...consent,
      ...preferences,
      necessary: true, // Always true
      timestamp: '',
    });
  }, [consent, saveConsent]);

  const resetConsent = useCallback(() => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    setConsent(null);
    setShowBanner(true);
  }, []);

  const hasConsent = useCallback((category: CookieCategory): boolean => {
    if (!consent) return category === 'necessary';
    return consent[category] ?? false;
  }, [consent]);

  const isConsentGiven = consent !== null;

  return {
    consent,
    hasConsent,
    isConsentGiven,
    acceptAll,
    rejectAll,
    savePreferences,
    resetConsent,
    showBanner,
    setShowBanner,
    showPreferences,
    setShowPreferences,
  };
}

// Standalone helper functions for use outside React components
export function getStoredConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as CookieConsent;
  } catch {
    return null;
  }
}

export function hasStoredConsent(category: CookieCategory): boolean {
  const consent = getStoredConsent();
  if (!consent) return category === 'necessary';
  return consent[category] ?? false;
}
