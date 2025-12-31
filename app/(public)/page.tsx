"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { BookCallSection } from "@/components/calendly";
import { VoicePreviewSection } from "@/components/voice-preview";
import { TestimonialSection } from "@/components/testimonials/TestimonialSection";
import { UseCaseCarousel } from "@/components/testimonials/UseCaseCarousel";
import { HeroAnimation } from "@/components/HeroAnimation";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{
    title: string;
    niche: string;
  } | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const promoVideoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (promoVideoRef.current) {
      promoVideoRef.current.muted = !promoVideoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoClick = (title: string, niche: string) => {
    setSelectedVideo({ title, niche });
    setShowModal(true);
  };

  return (
    <div className="bg-white">
      {/* Hero Section - Premium CapCut-inspired design */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Animated gradient background - more white base with intensified orbs */}
        <div className="absolute inset-0 bg-white">
          {/* Intensified animated gradient orbs - glassmorphism effect */}
          {/* Purple orb - top left */}
          <div className="absolute -top-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-300/60 to-violet-400/50 rounded-full blur-3xl animate-orb-1"></div>
          {/* Pink orb - top right */}
          <div className="absolute top-20 right-1/5 w-[450px] h-[450px] bg-gradient-to-br from-pink-300/55 to-rose-400/45 rounded-full blur-3xl animate-orb-2"></div>
          {/* Blue orb - middle left */}
          <div className="absolute top-1/3 -left-20 w-[400px] h-[400px] bg-gradient-to-br from-blue-300/50 to-indigo-400/40 rounded-full blur-3xl animate-orb-3"></div>
          {/* Orange orb - bottom center */}
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-gradient-to-br from-orange-200/45 to-amber-300/35 rounded-full blur-3xl animate-orb-4"></div>
          {/* Indigo orb - bottom right */}
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-300/50 to-purple-300/40 rounded-full blur-3xl animate-orb-5"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center">
            {/* Main Headline - Large, bold, Apple-style */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-[1.1] tracking-tight">
              Everything Your Brand Needs
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent">
                to Grow
              </span>
            </h1>

            {/* Subheadline - Clean, simple */}
            <p className="text-xl sm:text-2xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-normal">
              AI video content, voice cloning, ad creatives, and social media—all done for you in 7 days.
            </p>

            {/* CTAs - Clean, minimal buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <Link
                href="#book-call"
                className="inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform w-full sm:w-auto"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Book a Call
              </Link>
              <Link
                href="#pricing"
                className="inline-flex items-center justify-center bg-white/80 backdrop-blur-sm text-gray-900 px-8 py-4 rounded-full font-semibold text-lg border border-gray-200 hover:bg-white hover:border-gray-300 transition-all w-full sm:w-auto"
              >
                See Pricing
              </Link>
            </div>

            {/* Small tagline */}
            <p className="text-sm text-gray-400 mb-12">
              No credit card required
            </p>

            {/* Hero Animation - Script to Video Transformation */}
            <div className="max-w-5xl mx-auto">
              <HeroAnimation />

              {/* View More Link */}
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 mt-10 text-gray-500 hover:text-gray-900 font-medium transition-colors group"
              >
                <span>View more examples</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Generated Content Showcase */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Video Player */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px]">
                {/* Phone Frame Effect */}
                <div className="relative aspect-[9/16] rounded-[2.5rem] overflow-hidden bg-black shadow-2xl ring-1 ring-gray-200">
                  {/* Video */}
                  <video
                    ref={promoVideoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/images/brandvoice-logo.png"
                  >
                    <source src="/videos/brandvoice-promo.mp4" type="video/mp4" />
                  </video>

                  {/* Sound Toggle Button */}
                  <button
                    onClick={toggleMute}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all z-10"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                  >
                    {isMuted ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    )}
                  </button>

                  {/* Subtle overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  AI Generated
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-6">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Live Example
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                This Is What We
                <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Create For You
                </span>
              </h2>

              <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Professional AI spokesperson videos ready for Instagram, TikTok, YouTube Shorts, and paid ads. No filming required.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                  View More Examples
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center bg-white text-gray-900 px-8 py-4 rounded-full font-semibold border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  How It Works
                </Link>
              </div>

              {/* Stats Row */}
              <div className="mt-10 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">7</div>
                  <div className="text-sm text-gray-500">Day Delivery</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">30+</div>
                  <div className="text-sm text-gray-500">Videos/Month</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-500">Done-For-You</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Carousel Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See how businesses like yours are transforming their content strategy
            </p>
          </div>
        </div>
        <UseCaseCarousel />
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Stop Struggling With Content Creation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              You know you need consistent content, but...
            </p>
          </div>

          {/* Pain Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Tired of Filming Yourself?
              </h3>
              <p className="text-gray-600">
                Camera shy? Hate being on video? You&apos;re not alone.
              </p>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Time for Content?
              </h3>
              <p className="text-gray-600">
                Running your business takes all your time. Content falls behind.
              </p>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Inconsistent Posting?
              </h3>
              <p className="text-gray-600">
                Post once, disappear for weeks. Your audience forgets you exist.
              </p>
            </div>
          </div>

          {/* Solution */}
          <div className="relative bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 sm:p-12 text-center text-white shadow-xl overflow-hidden">
            {/* Decorative megaphone accent */}
            <div className="absolute -top-4 -right-4 w-32 h-32 opacity-20 pointer-events-none">
              <Image
                src="/images/icons/brand/megaphone-sparkles.png"
                alt=""
                width={128}
                height={128}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 opacity-15 pointer-events-none rotate-12">
              <Image
                src="/images/icons/brand/megaphone-icon.png"
                alt=""
                width={96}
                height={96}
                className="w-full h-full object-contain"
              />
            </div>

            <h3 className="relative text-3xl sm:text-4xl font-bold mb-4">
              We Handle Everything
            </h3>
            <p className="relative text-xl mb-6 max-w-3xl mx-auto opacity-90">
              No more filming. No more editing. No more writer&apos;s block. Just 30
              days of professional content delivered to your door.
            </p>
            <Link
              href="#what-you-get"
              className="relative inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              See What You Get
            </Link>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section id="what-you-get" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What You Get
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to dominate social media for the next 30 days
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mb-6">
                <Image
                  src="/images/icons/brand/user-avatar.png"
                  alt="Custom AI Spokesperson"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Custom AI Spokesperson
              </h3>
              <p className="text-gray-600">
                Your very own AI avatar that looks, sounds, and speaks like a
                real person. Choose from our library or create a custom look.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mb-6">
                <Image
                  src="/images/icons/brand/video-camera.png"
                  alt="30 Short-Form Videos"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                30 Short-Form Videos
              </h3>
              <p className="text-gray-600">
                30 vertical videos optimized for Instagram Reels, TikTok, and
                YouTube Shorts. All under 60 seconds and ready to post.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mb-6">
                <Image
                  src="/images/icons/brand/speech-bubble.png"
                  alt="Viral-Style Captions"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Viral-Style Captions
              </h3>
              <p className="text-gray-600">
                Every video comes with a scroll-stopping caption, hashtags, and
                posting instructions. Just copy and paste.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mb-6">
                <Image
                  src="/images/icons/brand/checkmark.png"
                  alt="Ad-Ready Formatting"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Ad-Ready Formatting
              </h3>
              <p className="text-gray-600">
                Want to run ads? All videos are formatted for Facebook, Instagram,
                and TikTok advertising specs right out of the box.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mb-6">
                <Image
                  src="/images/icons/brand/document.png"
                  alt="Client Portal Access"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Client Portal Access
              </h3>
              <p className="text-gray-600">
                Track your project progress, preview videos, and download all
                content from your secure client dashboard.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mb-6">
                <Image
                  src="/images/icons/brand/sparkle-stars.png"
                  alt="Fast 7-Day Turnaround"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Fast 7-Day Turnaround
              </h3>
              <p className="text-gray-600">
                From kickoff call to final delivery, get everything in just 7
                days. Most services take weeks or months.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple process, powerful results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Book Your Call
                </h3>
                <p className="text-gray-600">
                  Schedule a quick 15-minute strategy call. We&apos;ll discuss your
                  business and content goals.
                </p>
              </div>
              {/* Connector line for desktop */}
              <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-300 to-indigo-300 -z-10"></div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Choose Your Avatar
                </h3>
                <p className="text-gray-600">
                  Select from our library of AI spokespersons or request a
                  custom look for your brand.
                </p>
              </div>
              <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300 -z-10"></div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  We Create Your Content
                </h3>
                <p className="text-gray-600">
                  Our team scripts, produces, and edits 30 videos. Track
                  progress in your portal.
                </p>
              </div>
              <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-300 to-indigo-300 -z-10"></div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  4
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Start Posting
                </h3>
                <p className="text-gray-600">
                  Download all 30 videos with captions and start posting. Your
                  content calendar is done!
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="#book-call"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Voice Preview Section */}
      <VoicePreviewSection />

      {/* Video Samples Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              See Our Work in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sample AI spokesperson videos across different industries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: "How Long Does Botox Last?",
                niche: "Med Spa",
                duration: "0:28",
                gradient: "from-pink-400 via-rose-400 to-red-400",
              },
              {
                title: "Top 3 Home Staging Tips",
                niche: "Real Estate",
                duration: "0:35",
                gradient: "from-blue-400 via-cyan-400 to-teal-400",
              },
              {
                title: "5 Min Morning Stretch Routine",
                niche: "Fitness",
                duration: "0:42",
                gradient: "from-orange-400 via-amber-400 to-yellow-400",
              },
              {
                title: "Overcome Imposter Syndrome",
                niche: "Coaching",
                duration: "0:31",
                gradient: "from-purple-400 via-violet-400 to-indigo-400",
              },
              {
                title: "Why Choose Us for Your Plumbing",
                niche: "Local Service",
                duration: "0:26",
                gradient: "from-emerald-400 via-green-400 to-lime-400",
              },
              {
                title: "Our Chef's Special This Week",
                niche: "Restaurant",
                duration: "0:33",
                gradient: "from-red-400 via-pink-400 to-fuchsia-400",
              },
            ].map((video, index) => (
              <div
                key={index}
                onClick={() => handleVideoClick(video.title, video.niche)}
                className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-[9/16] overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${video.gradient} opacity-80 group-hover:opacity-90 transition-opacity`}
                  ></div>

                  {/* Duration Badge */}
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded">
                    {video.duration}
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                      <svg
                        className="w-8 h-8 text-purple-600 ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Gradient Overlay Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      {video.niche}
                    </span>
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg group-hover:text-purple-600 transition-colors">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              View All Samples
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Video Preview Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              {/* Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Video Preview Coming Soon
              </h3>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold text-purple-600">
                  {selectedVideo?.title}
                </span>
              </p>
              <p className="text-gray-500 mb-6">
                {selectedVideo?.niche} Industry
              </p>
              <p className="text-gray-600 mb-8">
                Full video samples will be available soon. Book a call to see
                complete examples of our work!
              </p>

              {/* Buttons */}
              <div className="space-y-3">
                <Link
                  href="#book-call"
                  onClick={() => setShowModal(false)}
                  className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Book a Call to See More
                </Link>
                <button
                  onClick={() => setShowModal(false)}
                  className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Who It's For Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Perfect For
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ideal for service-based businesses that need consistent content
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { icon: "💆", label: "Med Spas" },
              { icon: "🏠", label: "Real Estate" },
              { icon: "💼", label: "Business Coaches" },
              { icon: "💪", label: "Fitness Trainers" },
              { icon: "📊", label: "Marketing Agencies" },
              { icon: "⚖️", label: "Lawyers & Law Firms" },
              { icon: "🏥", label: "Healthcare Providers" },
              { icon: "💰", label: "Financial Advisors" },
              { icon: "🎨", label: "Creative Agencies" },
              { icon: "🏗️", label: "Contractors" },
              { icon: "🍽️", label: "Restaurants" },
              { icon: "📚", label: "Course Creators" },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900">{item.label}</h3>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg mb-6">
              Not sure if this is right for your business?
            </p>
            <Link
              href="#book-call"
              className="inline-block text-purple-600 font-bold hover:text-purple-700 text-lg underline"
            >
              Let&apos;s talk and find out
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialSection />

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Package
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From one-time launches to full-scale content engines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Package 1: AI Spokesperson Launch Kit */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  AI Spokesperson Launch Kit
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    $1,500
                  </span>
                  <span className="text-gray-600 text-lg block mt-1">One-Time</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "1 Custom AI spokesperson avatar",
                    "1 Brand voice",
                    "30 scripts",
                    "30 short-form videos",
                    "Viral-style captions",
                    "Delivered in 7 days",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/checkout?package=launch-kit"
                  className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Package 2: Content Engine Monthly */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Content Engine Monthly
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    $997
                  </span>
                  <span className="text-gray-600 text-lg block mt-1">/month</span>
                  <span className="text-sm text-gray-500">3-month minimum</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "Everything in Launch Kit",
                    "30 new videos every 30 days",
                    "Monthly strategy call",
                    "Priority delivery",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/checkout?package=content-engine-monthly"
                  className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Package 3: Content Engine PRO */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Content Engine PRO
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    $2,497
                  </span>
                  <span className="text-gray-600 text-lg block mt-1">/month</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "30-40 videos per month",
                    "Up to 2 custom AI avatars",
                    "Up to 2 custom brand voices",
                    "Hook & CTA variations",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/checkout?package=content-engine-pro"
                  className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Package 4: AUTHORITY Engine - MOST POPULAR */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-purple-500 hover:shadow-3xl transition-shadow transform lg:-translate-y-2">
              {/* Most Popular Badge */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center py-3 font-bold text-sm">
                MOST POPULAR
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  AUTHORITY Engine
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    $4,997
                  </span>
                  <span className="text-gray-600 text-lg block mt-1">/month</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "60+ videos per month",
                    "Up to 3 custom AI avatars",
                    "Up to 3 custom voices",
                    "Full funnel scripting",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/checkout?package=authority-engine"
                  className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book a Call Section with Calendly */}
      <BookCallSection
        title="Ready to Stop Filming Yourself?"
        subtitle="Book your free strategy call now and get 30 days of content delivered in just 7 days."
      />

      {/* Add animation styles */}
      <style jsx>{`
        /* Intensified orb animations - faster and more dynamic */
        @keyframes orb-float-1 {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
          }
          25% {
            transform: translateY(-40px) translateX(30px) scale(1.05);
          }
          50% {
            transform: translateY(-20px) translateX(60px) scale(0.95);
          }
          75% {
            transform: translateY(-50px) translateX(20px) scale(1.02);
          }
        }
        @keyframes orb-float-2 {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
          }
          33% {
            transform: translateY(30px) translateX(-40px) scale(1.08);
          }
          66% {
            transform: translateY(-25px) translateX(-20px) scale(0.92);
          }
        }
        @keyframes orb-float-3 {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
          }
          20% {
            transform: translateY(-35px) translateX(25px) scale(1.1);
          }
          50% {
            transform: translateY(20px) translateX(50px) scale(0.9);
          }
          80% {
            transform: translateY(-15px) translateX(35px) scale(1.05);
          }
        }
        @keyframes orb-float-4 {
          0%, 100% {
            transform: translateX(-50%) translateY(0) scale(1);
          }
          25% {
            transform: translateX(-45%) translateY(-30px) scale(1.06);
          }
          50% {
            transform: translateX(-55%) translateY(15px) scale(0.94);
          }
          75% {
            transform: translateX(-48%) translateY(-20px) scale(1.03);
          }
        }
        @keyframes orb-float-5 {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
          }
          40% {
            transform: translateY(-45px) translateX(-35px) scale(1.07);
          }
          70% {
            transform: translateY(25px) translateX(-50px) scale(0.93);
          }
        }
        .animate-orb-1 {
          animation: orb-float-1 8s ease-in-out infinite;
        }
        .animate-orb-2 {
          animation: orb-float-2 10s ease-in-out infinite;
          animation-delay: -2s;
        }
        .animate-orb-3 {
          animation: orb-float-3 9s ease-in-out infinite;
          animation-delay: -4s;
        }
        .animate-orb-4 {
          animation: orb-float-4 7s ease-in-out infinite;
          animation-delay: -1s;
        }
        .animate-orb-5 {
          animation: orb-float-5 11s ease-in-out infinite;
          animation-delay: -3s;
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes gradient-border {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-border {
          background-size: 200% 200%;
          animation: gradient-border 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
