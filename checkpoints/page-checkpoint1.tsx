"use client";

import Link from "next/link";
import { useState } from "react";
import { BookCallSection } from "@/components/calendly";
import { VoicePreviewSection } from "@/components/voice-preview";
import { TestimonialSection } from "@/components/testimonials/TestimonialSection";
import { UseCaseCarousel } from "@/components/testimonials/UseCaseCarousel";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{
    title: string;
    niche: string;
  } | null>(null);

  const handleVideoClick = (title: string, niche: string) => {
    setSelectedVideo({ title, niche });
    setShowModal(true);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-indigo-50 to-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
              Done-For-You AI Content Service
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Own AI Spokesperson +<br />
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                30 Days of Content
              </span>
              <br />
              Done For You in 7 Days
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Never film yourself again. We create a custom AI spokesperson and
              30 days of viral-ready video content for your business.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {/* Glowing CTA Button */}
              <div className="relative group w-full sm:w-auto">
                {/* Animated gradient border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-border"></div>
                <Link
                  href="#book-call"
                  className="relative block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto text-center"
                >
                  Book a Call
                </Link>
              </div>
              <Link
                href="#pricing"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg border-2 border-purple-600 hover:bg-purple-50 transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                See Pricing
              </Link>
            </div>

            {/* Hero Video */}
            <div className="max-w-4xl mx-auto mt-12">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="aspect-video">
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src="/videos/hero-avatar.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
              {/* View More Link */}
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 mt-6 text-purple-600 hover:text-purple-700 font-semibold transition-colors group"
              >
                <span>View More Examples</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 sm:p-12 text-center text-white shadow-xl">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              We Handle Everything
            </h3>
            <p className="text-xl mb-6 max-w-3xl mx-auto opacity-90">
              No more filming. No more editing. No more writer&apos;s block. Just 30
              days of professional content delivered to your door.
            </p>
            <Link
              href="#what-you-get"
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
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
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
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
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-white"
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
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
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
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
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
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
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
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
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
