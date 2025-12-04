'use client';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface PayPalCheckoutButtonProps {
  packageId: string;
  packageName: string;
  amount: number;
  isSubscription: boolean;
  addOns?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  onSuccess?: (orderId: string) => void;
  onError?: (error: unknown) => void;
}

export default function PayPalCheckoutButton({
  packageId,
  packageName,
  amount,
  isSubscription,
  addOns = [],
  onSuccess,
  onError,
}: PayPalCheckoutButtonProps) {
  const router = useRouter();
  const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer();
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate total with add-ons
  const addOnsTotal = addOns.reduce((sum, addon) => sum + addon.price * addon.quantity, 0);
  const totalAmount = amount + addOnsTotal;

  // Build description
  const description = addOns.length > 0
    ? `${packageName} + ${addOns.length} add-on(s)`
    : packageName;

  if (isPending) {
    return (
      <div className="w-full py-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Loading PayPal...</span>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="w-full py-4 text-center text-red-600">
        Failed to load PayPal. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="w-full">
      {isProcessing && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Processing payment...</p>
          </div>
        </div>
      )}

      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 50,
        }}
        disabled={isProcessing}
        createOrder={async (data, actions) => {
          // For one-time payments
          return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
              {
                description: description,
                amount: {
                  currency_code: 'USD',
                  value: totalAmount.toFixed(2),
                  breakdown: {
                    item_total: {
                      currency_code: 'USD',
                      value: totalAmount.toFixed(2),
                    },
                  },
                },
                items: [
                  {
                    name: packageName,
                    unit_amount: {
                      currency_code: 'USD',
                      value: amount.toFixed(2),
                    },
                    quantity: '1',
                    category: 'DIGITAL_GOODS' as const,
                  },
                  ...addOns.map((addon) => ({
                    name: addon.name,
                    unit_amount: {
                      currency_code: 'USD',
                      value: addon.price.toFixed(2),
                    },
                    quantity: addon.quantity.toString(),
                    category: 'DIGITAL_GOODS' as const,
                  })),
                ],
              },
            ],
            application_context: {
              brand_name: 'BrandVoice.AI',
              landing_page: 'BILLING',
              user_action: 'PAY_NOW',
              return_url: `${window.location.origin}/checkout/success`,
              cancel_url: `${window.location.origin}/checkout?package=${packageId}`,
            },
          });
        }}
        onApprove={async (data, actions) => {
          setIsProcessing(true);
          try {
            if (actions.order) {
              const details = await actions.order.capture();
              console.log('Payment successful:', details);

              // Save order to database
              const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  paypalOrderId: details.id,
                  packageId,
                  packageName,
                  amount: totalAmount,
                  addOns,
                  payerEmail: details.payer?.email_address,
                  payerName: details.payer?.name?.given_name,
                  status: details.status,
                }),
              });

              if (!response.ok) {
                console.error('Failed to save order');
              }

              onSuccess?.(details.id || '');

              // Redirect to success page
              router.push(`/checkout/success?orderId=${details.id}&package=${packageId}`);
            }
          } catch (error) {
            console.error('Error processing payment:', error);
            onError?.(error);
            setIsProcessing(false);
          }
        }}
        onError={(err) => {
          console.error('PayPal error:', err);
          onError?.(err);
          setIsProcessing(false);
        }}
        onCancel={() => {
          console.log('Payment cancelled');
          setIsProcessing(false);
        }}
      />

      {/* Alternative payment note */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Secure payment powered by PayPal
        </p>
        <p className="text-xs text-gray-400 mt-1">
          You can pay with PayPal or credit/debit card
        </p>
      </div>
    </div>
  );
}
