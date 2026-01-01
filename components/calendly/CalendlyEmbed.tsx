'use client';

import { useEffect } from 'react';

interface CalendlyEmbedProps {
  url?: string;
  className?: string;
  height?: string;
  hideHeader?: boolean;
}

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, string>;
        utm?: Record<string, string>;
      }) => void;
      initPopupWidget: (options: { url: string; prefill?: Record<string, unknown> }) => void;
      showPopupWidget: (url: string) => void;
    };
  }
}

export default function CalendlyEmbed({
  url,
  className = '',
  height = '950px',
  hideHeader = false,
}: CalendlyEmbedProps) {
  const baseUrl = url || process.env.NEXT_PUBLIC_CALENDLY_URL || '';
  // Add parameters to hide Calendly branding/header for cleaner embed
  const calendlyUrl = baseUrl ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}hide_gdpr_banner=1${hideHeader ? '&hide_event_type_details=1' : ''}` : '';

  useEffect(() => {
    // Load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector(
        'script[src="https://assets.calendly.com/assets/external/widget.js"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  if (!baseUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 rounded-xl p-8 ${className}`} style={{ minHeight: height }}>
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Scheduling Coming Soon</h3>
          <p className="text-gray-600 mb-4">
            Add your Calendly URL to enable booking.
          </p>
          <p className="text-sm text-gray-500">
            Set <code className="bg-gray-100 px-2 py-1 rounded">NEXT_PUBLIC_CALENDLY_URL</code> in your .env file
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`calendly-inline-widget ${className}`}
      data-url={calendlyUrl}
      style={{ minWidth: '320px', height }}
    />
  );
}
