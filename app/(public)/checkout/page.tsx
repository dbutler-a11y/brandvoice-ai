'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Check, Package, Shield, Plus, Minus, Sparkles, Lock } from 'lucide-react';
import { PayPalProvider, PayPalCheckoutButton } from '@/components/paypal';

// Package definitions - matches pricing page (ordered by price)
const packages = {
  'starter-kit': {
    id: 'starter-kit',
    name: 'Brand Starter Kit',
    price: 497,
    billing: 'one-time',
    billingNote: '',
    description: 'Best for: New businesses starting fresh',
    features: [
      'Logo & complete brand identity',
      'Custom website (mobile-ready)',
      '30 days of social content',
      'Telegram or Discord sales bot',
      'Auto-response templates',
    ],
  },
  'content-engine': {
    id: 'content-engine',
    name: 'Content Engine',
    price: 997,
    billing: 'monthly',
    billingNote: '3-month minimum',
    description: 'Best for: Growing brands',
    features: [
      'Everything in Launch Kit',
      '30 new videos monthly',
      'Monthly strategy call',
      'Priority 5-day delivery',
      'All ad-ready formats',
    ],
  },
  'launch-kit': {
    id: 'launch-kit',
    name: 'AI Spokesperson Launch Kit',
    price: 1497,
    billing: 'one-time',
    billingNote: '',
    description: 'Best for: One-time video projects',
    features: [
      'Custom AI spokesperson avatar',
      'Cloned brand voice',
      '30 professional video scripts',
      '30 short-form videos',
      'Viral-style captions included',
      '2 revision rounds',
      'Delivered in 7 days',
    ],
  },
  'authority-engine': {
    id: 'authority-engine',
    name: 'Authority Engine',
    price: 3997,
    billing: 'monthly',
    billingNote: '3-month minimum',
    description: 'Best for: Agencies & enterprises',
    features: [
      '60+ videos per month',
      'Up to 3 AI spokespersons',
      'Up to 3 brand voices',
      'Multi-language versions',
      'Full funnel scripting',
      'Campaign variations',
    ],
  },
};

// Add-on definitions
const addOns = [
  {
    id: 'voice-cloning',
    name: 'Voice Cloning',
    description: 'Clone your own voice for your AI spokesperson',
    price: 299,
    priceType: 'one-time',
    icon: '🎙️',
    popular: true,
  },
  {
    id: 'multi-language-dubbing',
    name: 'Multi-Language Dubbing',
    description: 'Translate and dub your videos into additional languages',
    price: 149,
    priceType: 'per-language',
    icon: '🌍',
    popular: true,
  },
  {
    id: 'audio-cleanup',
    name: 'Audio Cleanup & Enhancement',
    description: 'AI-powered audio isolation and noise removal',
    price: 99,
    priceType: 'one-time',
    icon: '🔊',
    popular: false,
  },
  {
    id: 'custom-sound-effects',
    name: 'Custom Sound Effects Pack',
    description: 'Professional whooshes, transitions, and music beds',
    price: 149,
    priceType: 'one-time',
    icon: '🎵',
    popular: false,
  },
  {
    id: 'extra-avatar',
    name: 'Additional AI Avatar',
    description: 'Add another custom AI spokesperson to your package',
    price: 499,
    priceType: 'per-avatar',
    icon: '👤',
    popular: false,
  },
  {
    id: 'rush-delivery',
    name: 'Rush Delivery',
    description: 'Get your videos delivered in 3 days instead of 7',
    price: 299,
    priceType: 'one-time',
    icon: '⚡',
    popular: true,
  },
];

type PackageId = keyof typeof packages;

interface SelectedAddOn {
  id: string;
  quantity: number;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const packageId = searchParams.get('package') as PackageId;

  const selectedPackage = packageId ? packages[packageId] : null;
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOn[]>([]);

  // Calculate totals
  const packagePrice = selectedPackage?.price || 0;
  const addOnsTotal = selectedAddOns.reduce((total, selected) => {
    const addOn = addOns.find(a => a.id === selected.id);
    return total + (addOn ? addOn.price * selected.quantity : 0);
  }, 0);
  const grandTotal = packagePrice + addOnsTotal;

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev => {
      const existing = prev.find(a => a.id === addOnId);
      if (existing) {
        return prev.filter(a => a.id !== addOnId);
      }
      return [...prev, { id: addOnId, quantity: 1 }];
    });
  };

  const updateAddOnQuantity = (addOnId: string, delta: number) => {
    setSelectedAddOns(prev => {
      return prev.map(a => {
        if (a.id === addOnId) {
          const newQty = Math.max(1, a.quantity + delta);
          return { ...a, quantity: newQty };
        }
        return a;
      });
    });
  };

  const isAddOnSelected = (addOnId: string) => {
    return selectedAddOns.some(a => a.id === addOnId);
  };

  const getAddOnQuantity = (addOnId: string) => {
    return selectedAddOns.find(a => a.id === addOnId)?.quantity || 0;
  };

  // Prepare add-ons for PayPal
  const formattedAddOns = selectedAddOns.map((selected) => {
    const addOn = addOns.find(a => a.id === selected.id);
    return {
      id: selected.id,
      name: addOn?.name || '',
      price: addOn?.price || 0,
      quantity: selected.quantity,
    };
  }).filter(a => a.name);

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Select a Package</h1>
          <p className="text-gray-600 mb-6">
            Please select a package from our pricing page to continue.
          </p>
          <button
            onClick={() => router.push('/pricing')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200"
          >
            View Pricing
          </button>
        </div>
      </div>
    );
  }

  const isSubscription = selectedPackage.billing === 'monthly';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Complete Your Order
          </h1>
          <p className="text-lg text-gray-600">
            Customize your package with premium add-ons
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selected Package */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Selected Package</h2>
              </div>

              <div className="flex items-start justify-between p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {selectedPackage.name}
                  </h3>
                  <p className="text-purple-600 text-sm font-medium">
                    {selectedPackage.description}
                  </p>
                  <ul className="mt-3 space-y-1">
                    {selectedPackage.features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {selectedPackage.features.length > 4 && (
                      <li className="text-sm text-purple-600 font-medium">
                        +{selectedPackage.features.length - 4} more features
                      </li>
                    )}
                  </ul>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    ${selectedPackage.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {isSubscription ? '/month' : 'one-time'}
                  </div>
                  {selectedPackage.billingNote && (
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedPackage.billingNote}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => router.push('/pricing')}
                className="mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Change Package
              </button>
            </div>

            {/* Add-ons Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Premium Add-Ons</h2>
                  <p className="text-sm text-gray-600">Enhance your package with these options</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addOns.map((addOn) => {
                  const isSelected = isAddOnSelected(addOn.id);
                  const quantity = getAddOnQuantity(addOn.id);

                  return (
                    <div
                      key={addOn.id}
                      className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 bg-white'
                      }`}
                      onClick={() => toggleAddOn(addOn.id)}
                    >
                      {addOn.popular && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Popular
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{addOn.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">{addOn.name}</h3>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-purple-600 border-purple-600'
                                : 'border-gray-300'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{addOn.description}</p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="text-lg font-bold text-purple-600">
                              ${addOn.price}
                              <span className="text-xs font-normal text-gray-500 ml-1">
                                {addOn.priceType}
                              </span>
                            </div>

                            {isSelected && addOn.priceType !== 'one-time' && (
                              <div
                                className="flex items-center gap-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => updateAddOnQuantity(addOn.id, -1)}
                                  className="w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-5 h-5 text-gray-600" />
                                </button>
                                <span className="w-8 text-center font-semibold">{quantity}</span>
                                <button
                                  onClick={() => updateAddOnQuantity(addOn.id, 1)}
                                  className="w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-5 h-5 text-gray-600" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

              {/* Package */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{selectedPackage.name}</p>
                    <p className="text-sm text-gray-500">
                      {isSubscription ? 'Monthly subscription' : 'One-time purchase'}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${selectedPackage.price.toLocaleString()}
                  </span>
                </div>

                {/* Selected Add-ons */}
                {selectedAddOns.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-3">Add-ons:</p>
                    {selectedAddOns.map((selected) => {
                      const addOn = addOns.find(a => a.id === selected.id);
                      if (!addOn) return null;
                      return (
                        <div key={selected.id} className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">
                            {addOn.icon} {addOn.name}
                            {selected.quantity > 1 && (
                              <span className="text-gray-400 ml-1">×{selected.quantity}</span>
                            )}
                          </span>
                          <span className="font-medium text-gray-900">
                            ${(addOn.price * selected.quantity).toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                {addOnsTotal > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Package</span>
                      <span className="text-gray-900">${packagePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Add-ons</span>
                      <span className="text-gray-900">${addOnsTotal.toLocaleString()}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-purple-600">
                      ${grandTotal.toLocaleString()}
                    </span>
                    {isSubscription && (
                      <p className="text-xs text-gray-500">/month</p>
                    )}
                  </div>
                </div>
              </div>

              {/* PayPal Checkout */}
              <div className="mt-6 relative">
                <PayPalProvider>
                  <PayPalCheckoutButton
                    packageId={selectedPackage.id}
                    packageName={selectedPackage.name}
                    amount={selectedPackage.price}
                    isSubscription={isSubscription}
                    addOns={formattedAddOns}
                    onSuccess={(orderId) => {
                      console.log('Payment successful:', orderId);
                      // Redirect to success page with order details
                      router.push(`/checkout/success?orderId=${orderId}&package=${selectedPackage.id}`);
                    }}
                    onError={(error) => {
                      console.error('Payment error:', error);
                      alert('Payment failed. Please try again or contact support.');
                    }}
                  />
                </PayPalProvider>
              </div>

              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                <span>Secure checkout powered by PayPal</span>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Secure Checkout</p>
                    <p className="text-xs text-gray-500">256-bit SSL encryption</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Satisfaction Guarantee</p>
                    <p className="text-xs text-gray-500">We&apos;ll make it right</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Questions?{' '}
                <a href="mailto:support@brandvoice.studio" className="text-purple-600 hover:text-purple-700 font-medium">
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
