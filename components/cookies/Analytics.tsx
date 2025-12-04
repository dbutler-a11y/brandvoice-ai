'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useCookieConsentContext } from './CookieConsentProvider';

// Replace these with your actual IDs
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || 'XXXXXXXXXXXXXXX';

export default function Analytics() {
  const { hasConsent, isConsentGiven } = useCookieConsentContext();
  const [shouldLoadAnalytics, setShouldLoadAnalytics] = useState(false);
  const [shouldLoadMarketing, setShouldLoadMarketing] = useState(false);

  useEffect(() => {
    if (isConsentGiven) {
      setShouldLoadAnalytics(hasConsent('analytics'));
      setShouldLoadMarketing(hasConsent('marketing'));
    }
  }, [isConsentGiven, hasConsent]);

  return (
    <>
      {/* Google Analytics - Only loads if analytics consent is given */}
      {shouldLoadAnalytics && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Meta/Facebook Pixel - Only loads if marketing consent is given */}
      {shouldLoadMarketing && META_PIXEL_ID !== 'XXXXXXXXXXXXXXX' && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
