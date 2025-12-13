/**
 * Content Security Policy (CSP) Configuration
 *
 * This controls what resources the browser is allowed to load,
 * preventing XSS attacks and data injection.
 */

// Trusted domains for your app
const trustedDomains = {
  // Your own domains
  self: ["'self'"],

  // Supabase
  supabase: [
    'https://*.supabase.co',
    'wss://*.supabase.co',
  ],

  // PayPal
  paypal: [
    'https://*.paypal.com',
    'https://*.paypalobjects.com',
  ],

  // ElevenLabs
  elevenlabs: [
    'https://*.elevenlabs.io',
    'https://unpkg.com',
  ],

  // Calendly
  calendly: [
    'https://calendly.com',
    'https://assets.calendly.com',
  ],

  // Google (OAuth & Analytics)
  google: [
    'https://accounts.google.com',
    'https://*.google.com',
    'https://*.googleapis.com',
    'https://*.gstatic.com',
  ],

  // Analytics & Monitoring
  analytics: [
    'https://*.sentry.io',
    'https://*.ingest.sentry.io',
    'https://*.google-analytics.com',
    'https://*.googletagmanager.com',
  ],

  // Media/CDN
  media: [
    'https://*.cloudfront.net',
    'https://*.vercel.app',
    'blob:',
    'data:',
  ],

  // Fonts
  fonts: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ],
};

// Build CSP directives
export function buildCSP(nonce?: string): string {
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],

    'script-src': [
      "'self'",
      // Allow inline scripts with nonce (more secure than unsafe-inline)
      nonce ? `'nonce-${nonce}'` : "'unsafe-inline'",
      "'unsafe-eval'", // Required for Next.js in development
      ...trustedDomains.paypal,
      ...trustedDomains.elevenlabs,
      ...trustedDomains.calendly,
      ...trustedDomains.analytics,
    ],

    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for styled-jsx and Tailwind
      ...trustedDomains.fonts,
    ],

    'img-src': [
      "'self'",
      ...trustedDomains.media,
      ...trustedDomains.supabase,
      ...trustedDomains.paypal,
      'https:',
    ],

    'font-src': [
      "'self'",
      ...trustedDomains.fonts,
      'data:',
    ],

    'connect-src': [
      "'self'",
      ...trustedDomains.supabase,
      ...trustedDomains.google,
      ...trustedDomains.paypal,
      ...trustedDomains.elevenlabs,
      ...trustedDomains.analytics,
      // Allow localhost in development
      ...(process.env.NODE_ENV === 'development' ? ['ws://localhost:*', 'http://localhost:*'] : []),
    ],

    'frame-src': [
      "'self'",
      ...trustedDomains.google,
      ...trustedDomains.paypal,
      ...trustedDomains.calendly,
      ...trustedDomains.elevenlabs,
    ],

    'media-src': [
      "'self'",
      ...trustedDomains.media,
      ...trustedDomains.supabase,
      'https:',
      'blob:',
    ],

    'object-src': ["'none'"],

    'base-uri': ["'self'"],

    'form-action': ["'self'", ...trustedDomains.google, ...trustedDomains.supabase, ...trustedDomains.paypal],

    'frame-ancestors': ["'self'"],

    // Upgrade insecure requests in production
    ...(process.env.NODE_ENV === 'production' && {
      'upgrade-insecure-requests': [],
    }),
  };

  return Object.entries(directives)
    .map(([key, values]) => {
      if (values.length === 0) return key;
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
}

// Generate a random nonce for inline scripts
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString('base64');
}
