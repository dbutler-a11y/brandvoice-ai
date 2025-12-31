"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { BookCallSection } from '@/components/calendly';

const mainSteps = [
  {
    number: 1,
    title: 'Book Your Call',
    subtitle: '15 minutes to transform your content',
    description: 'Schedule a quick discovery call. We\'ll learn about your business, discuss your goals, and recommend the perfect package.',
    icon: '/images/icons/brand/megaphone-sparkles.png',
    details: [
      'Discuss your brand and target audience',
      'Review AI spokesperson options',
      'Choose your package and timeline',
    ],
  },
  {
    number: 2,
    title: 'We Create Your Content',
    subtitle: 'Sit back while we work',
    description: 'Our team handles everything—avatar creation, voice cloning, scriptwriting, and video production. You just approve.',
    icon: '/images/icons/brand/video-camera.png',
    details: [
      'Custom AI avatar tailored to your brand',
      'Professional scripts for your industry',
      '30 videos produced and quality-checked',
    ],
  },
  {
    number: 3,
    title: 'Download & Post',
    subtitle: '30 days of content, delivered',
    description: 'Access your client portal, download all videos with captions, and start posting. Your content calendar is done.',
    icon: '/images/icons/brand/checkmark.png',
    details: [
      'All videos organized by day (1-30)',
      'Captions and hashtags included',
      'Multiple formats for all platforms',
    ],
  },
];

const timeline = [
  { day: 'Day 1', task: 'Kickoff call & onboarding', icon: '/images/icons/brand/speech-bubble.png' },
  { day: 'Day 2-3', task: 'Avatar & voice creation', icon: '/images/icons/brand/user-avatar.png' },
  { day: 'Day 3-4', task: 'Script generation & approval', icon: '/images/icons/brand/document.png' },
  { day: 'Day 4-6', task: 'Video production', icon: '/images/icons/brand/video-camera.png' },
  { day: 'Day 7', task: 'Quality check & delivery', icon: '/images/icons/brand/sparkle-stars.png' },
];

const faqs = [
  {
    question: 'How realistic do the AI videos look?',
    answer: 'Extremely realistic. Our AI spokespersons use the latest technology—most viewers can\'t tell the difference from a real person. Check out our portfolio for examples.',
  },
  {
    question: 'What if I don\'t like the result?',
    answer: 'Every package includes 2 revision rounds. You can request changes to scripts, pacing, or style before final delivery.',
  },
  {
    question: 'Can I use these videos for paid ads?',
    answer: 'Absolutely! All videos are delivered in ad-ready formats optimized for Facebook, Instagram, TikTok, and YouTube.',
  },
  {
    question: 'Do I need to be on camera at all?',
    answer: 'Nope! That\'s the whole point. Your AI spokesperson handles all the on-camera work. You just provide your brand info.',
  },
];

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-6">
            <Image
              src="/images/icons/brand/sparkle-stars.png"
              alt=""
              width={16}
              height={16}
              className="w-4 h-4"
            />
            Simple 3-Step Process
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            From Booking to
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Brand Transformation
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Get 30 days of professional AI spokesperson videos delivered in just 7 days. No filming required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#book-call"
              className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started Now
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg border border-gray-200 hover:bg-gray-50 transition-all"
            >
              See Examples
            </Link>
          </div>
        </div>
      </section>

      {/* Main 3 Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {mainSteps.map((step, index) => (
              <div
                key={step.number}
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-4">
                    Step {step.number}
                  </div>

                  <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h2>

                  <p className="text-lg text-purple-600 font-medium mb-4">
                    {step.subtitle}
                  </p>

                  <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
                    {step.description}
                  </p>

                  <ul className="space-y-3 text-left max-w-md mx-auto lg:mx-0">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div className="flex-1 flex justify-center">
                  <div className="relative">
                    {/* Background glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-3xl blur-2xl scale-110" />

                    {/* Card */}
                    <div className="relative bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
                      <div className="w-32 h-32 mx-auto mb-6">
                        <Image
                          src={step.icon}
                          alt={step.title}
                          width={128}
                          height={128}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {step.number}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Your 7-Day Timeline
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Here's exactly what happens after you book
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-200 via-indigo-300 to-purple-200 -translate-y-1/2" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {timeline.map((item, index) => (
                <div key={index} className="relative text-center">
                  {/* Icon circle */}
                  <div className="relative z-10 w-20 h-20 mx-auto mb-4 bg-white rounded-full shadow-lg border-4 border-purple-100 flex items-center justify-center">
                    <Image
                      src={item.icon}
                      alt=""
                      width={40}
                      height={40}
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-2">
                    {item.day}
                  </div>

                  <p className="text-gray-700 font-medium text-sm">
                    {item.task}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What's Included
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need, nothing you don't
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '/images/icons/brand/user-avatar.png', title: 'Custom AI Avatar', desc: 'A spokesperson that matches your brand aesthetic' },
              { icon: '/images/icons/brand/waveform.png', title: 'Cloned Voice', desc: 'Natural-sounding voice tailored to your brand' },
              { icon: '/images/icons/brand/document.png', title: '30 Scripts', desc: 'Professional scripts covering FAQs, tips & CTAs' },
              { icon: '/images/icons/brand/video-camera.png', title: '30 Videos', desc: 'Short-form videos ready for all platforms' },
              { icon: '/images/icons/brand/speech-bubble.png', title: 'Captions & Hashtags', desc: 'Viral-style captions for maximum engagement' },
              { icon: '/images/icons/brand/checkmark.png', title: '2 Revision Rounds', desc: 'Request changes until you\'re 100% satisfied' },
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:bg-purple-50 transition-colors">
                <div className="w-16 h-16 mb-5">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-purple-600 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/faq"
              className="text-purple-600 font-semibold hover:text-purple-700"
            >
              View all FAQs →
            </Link>
          </div>
        </div>
      </section>

      {/* Book Call Section */}
      <BookCallSection
        title="Ready to Transform Your Content?"
        subtitle="Book a free 15-minute call. We'll discuss your goals and show you exactly how we can help."
      />
    </div>
  );
}
