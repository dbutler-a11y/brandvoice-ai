'use client';

import { useEffect, useState } from 'react';

interface CalendlyButtonProps {
  url?: string;
  text?: string;
  className?: string;
  prefill?: {
    name?: string;
    email?: string;
    customAnswers?: Record<string, string>;
  };
}

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string; prefill?: Record<string, unknown> }) => void;
      showPopupWidget: (url: string) => void;
    };
  }
}

export default function CalendlyButton({
  url,
  text = 'Book a Call',
  className = '',
  prefill,
}: CalendlyButtonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const calendlyUrl = url || process.env.NEXT_PUBLIC_CALENDLY_URL || '';

  useEffect(() => {
    // Load Calendly CSS
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Cleanup handled by browser
    };
  }, []);

  const handleClick = () => {
    if (!calendlyUrl) {
      alert('Calendly URL not configured. Please add NEXT_PUBLIC_CALENDLY_URL to your .env file.');
      return;
    }

    if (isLoaded && window.Calendly) {
      window.Calendly.initPopupWidget({
        url: calendlyUrl,
        prefill: prefill
          ? {
              name: prefill.name,
              email: prefill.email,
              customAnswers: prefill.customAnswers,
            }
          : undefined,
      });
    } else {
      // Fallback - open in new tab
      window.open(calendlyUrl, '_blank');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg ${className}`}
    >
      {text}
    </button>
  );
}
