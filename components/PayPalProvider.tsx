'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { ReactNode } from 'react';

interface PayPalProviderProps {
  children: ReactNode;
}

export default function PayPalProvider({ children }: PayPalProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    console.error('PayPal Client ID is not configured. Please add NEXT_PUBLIC_PAYPAL_CLIENT_ID to your environment variables.');
    return <>{children}</>;
  }

  const initialOptions = {
    clientId: clientId,
    currency: 'USD',
    intent: 'capture',
    vault: true, // Enable vaulting for subscriptions
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
}
