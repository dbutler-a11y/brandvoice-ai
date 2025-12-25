import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CookieConsentProvider, Analytics } from "@/components/cookies";

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
  // Cross-platform icon configuration (centralized here - do not duplicate elsewhere)
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  // Brand theme color: purple-600 (#7c3aed)
  themeColor: "#7c3aed",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BrandVoice.AI",
  },
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
        </CookieConsentProvider>
      </body>
    </html>
  );
}
