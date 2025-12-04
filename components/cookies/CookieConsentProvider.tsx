'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useCookieConsent } from '@/lib/cookies';
import CookieBanner from './CookieBanner';
import CookiePreferencesModal from './CookiePreferencesModal';

type CookieConsentContextType = ReturnType<typeof useCookieConsent>;

const CookieConsentContext = createContext<CookieConsentContextType | null>(null);

export function useCookieConsentContext() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsentContext must be used within CookieConsentProvider');
  }
  return context;
}

interface CookieConsentProviderProps {
  children: ReactNode;
}

export default function CookieConsentProvider({ children }: CookieConsentProviderProps) {
  const cookieConsent = useCookieConsent();

  return (
    <CookieConsentContext.Provider value={cookieConsent}>
      {children}
      <CookieBanner />
      <CookiePreferencesModal />
    </CookieConsentContext.Provider>
  );
}
