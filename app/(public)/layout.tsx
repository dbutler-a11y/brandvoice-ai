import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { CookieSettingsButton } from "@/components/cookies";
import { VoiceAgentWidget } from "@/components/elevenlabs";
import { PublicHeader } from "@/components/PublicHeader";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <PublicHeader />

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Voice Agent Widget - Samira */}
      <VoiceAgentWidget />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center">
                  <Image
                    src="/images/icons/brand/megaphone-icon.png"
                    alt="BrandVoice"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </div>
                <span className="text-xl font-bold text-white">
                  BrandVoice<span className="text-purple-400">.AI</span>
                </span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Your custom AI spokesperson and 30 days of viral-ready content,
                delivered in just 7 days. Never film yourself again.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 rounded-full text-sm text-gray-300">
                  <Image src="/images/icons/brand/video-camera.png" alt="" width={14} height={14} className="w-3.5 h-3.5 opacity-70" />
                  AI Videos
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 rounded-full text-sm text-gray-300">
                  <Image src="/images/icons/brand/waveform.png" alt="" width={14} height={14} className="w-3.5 h-3.5 opacity-70" />
                  Voice Cloning
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 rounded-full text-sm text-gray-300">
                  <Image src="/images/icons/brand/sparkle-stars.png" alt="" width={14} height={14} className="w-3.5 h-3.5 opacity-70" />
                  7-Day Delivery
                </span>
              </div>
            </div>

            {/* Pages Column 1 */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Image src="/images/icons/brand/document.png" alt="" width={16} height={16} className="w-4 h-4 opacity-50" />
                Pages
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/portfolio"
                    className="hover:text-white transition-colors"
                  >
                    Examples
                  </Link>
                </li>
                <li>
                  <Link
                    href="/voice-preview"
                    className="hover:text-white transition-colors"
                  >
                    Voice Samples
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/creator-markets"
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    Creator Markets
                    <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full font-medium">
                      NEW
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Pages Column 2 */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Image src="/images/icons/brand/user-avatar.png" alt="" width={16} height={16} className="w-4 h-4 opacity-50" />
                Account
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/portal"
                    className="hover:text-white transition-colors"
                  >
                    Client Portal
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="hover:text-white transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <CookieSettingsButton />
                </li>
                <li className="pt-4">
                  <Link
                    href="/#book-call"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Image src="/images/icons/brand/megaphone-sparkles.png" alt="" width={16} height={16} className="w-4 h-4" />
                    Book a Call
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} BrandVoice Studio by Eula Properties LLC. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <span>Made with</span>
              <Image src="/images/icons/brand/sparkle-stars.png" alt="love" width={14} height={14} className="w-3.5 h-3.5" />
              <span>for creators</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
