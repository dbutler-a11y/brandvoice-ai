'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { ReactNode } from 'react';

interface PayPalProviderProps {
  children: ReactNode;
}

export default function PayPalProvider({ children }: PayPalProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    console.warn('PayPal Client ID not configured');
    return <>{children}</>;
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: 'USD',
        intent: 'capture',
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}
