import Link from "next/link";
import { ReactNode } from "react";
import { CookieSettingsButton } from "@/components/cookies";
import { ChatWidget } from "@/components/chat";
import { VoiceAgentWidget } from "@/components/elevenlabs";
import { AIAssistantNudge } from "@/components/ai-assistant-nudge";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BV</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                BrandVoice<span className="text-purple-600">.AI</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/how-it-works"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/portfolio"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Examples
              </Link>
              <Link
                href="/portal/login"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/#book-call"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                Book a Call
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Chat Widget */}
      <ChatWidget />

      {/* Voice Agent Widget */}
      <VoiceAgentWidget />

      {/* AI Assistant Nudge - Contextual prompts to encourage voice/chat usage */}
      <AIAssistantNudge />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">BV</span>
                </div>
                <span className="text-xl font-bold text-white">
                  BrandVoice<span className="text-purple-400">.AI</span>
                </span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Your custom AI spokesperson and 30 days of viral-ready content,
                delivered in just 7 days. Never film yourself again.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
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
                    href="/faq"
                    className="hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
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
                  <CookieSettingsButton />
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <div className="space-y-4">
                <p>
                  <a
                    href="mailto:hello@brandvoice.ai"
                    className="hover:text-white transition-colors"
                  >
                    hello@brandvoice.ai
                  </a>
                </p>
                <Link
                  href="/#book-call"
                  className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  Book a Call
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>
              &copy; {new Date().getFullYear()} BrandVoice.AI by Eula Properties LLC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
