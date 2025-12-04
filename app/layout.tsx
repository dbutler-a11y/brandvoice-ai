import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CookieConsentProvider, Analytics } from "@/components/cookies";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "BrandVoice.AI - Custom AI Spokespersons & Done-For-You Video Content",
  description: "Your custom AI spokesperson and 30 days of viral-ready content, delivered in just 7 days. Never film yourself again.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CookieConsentProvider>
          {children}
          <Analytics />
          <SpeedInsights />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
