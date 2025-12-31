"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { BookCallSection } from '@/components/calendly';

const packages = [
  {
    name: 'Brand Starter Kit',
    price: 497,
    originalPrice: 997,
    billing: 'one-time',
    description: 'Launch your brand with everything you need',
    icon: '/images/icons/brand/sparkle-stars.png',
    features: [
      { text: 'Logo & complete brand identity', icon: '/images/icons/brand/sparkle-stars.png' },
      { text: 'Custom website (mobile-ready)', icon: '/images/icons/brand/document.png' },
      { text: '30 days of social content', icon: '/images/icons/brand/megaphone-sparkles.png' },
      { text: 'Telegram or Discord sales bot', icon: '/images/icons/brand/speech-bubble.png' },
      { text: 'Auto-response templates', icon: '/images/icons/brand/checkmark.png' },
    ],
    best: 'New businesses starting fresh',
    cta: 'Get Started',
    checkoutUrl: '/checkout?package=starter-kit',
    tier: 'starter',
  },
  {
    name: 'AI Spokesperson Launch Kit',
    price: 1497,
    originalPrice: 2997,
    billing: 'one-time',
    description: '30 AI videos delivered in 7 days',
    icon: '/images/icons/brand/video-camera.png',
    features: [
      { text: 'Custom AI spokesperson avatar', icon: '/images/icons/brand/user-avatar.png' },
      { text: 'Cloned brand voice', icon: '/images/icons/brand/waveform.png' },
      { text: '30 professional video scripts', icon: '/images/icons/brand/document.png' },
      { text: '30 short-form videos', icon: '/images/icons/brand/video-camera.png' },
      { text: 'Viral-style captions included', icon: '/images/icons/brand/speech-bubble.png' },
      { text: '2 revision rounds', icon: '/images/icons/brand/checkmark.png' },
    ],
    best: 'One-time video projects',
    cta: 'Get Started',
    checkoutUrl: '/checkout?package=launch-kit',
    tier: 'launch',
  },
  {
    name: 'Content Engine',
    price: 997,
    originalPrice: 1997,
    billing: '/month',
    billingNote: '3-month minimum',
    description: '30 fresh videos every single month',
    icon: '/images/icons/brand/megaphone-sparkles.png',
    features: [
      { text: 'Everything in Launch Kit', icon: '/images/icons/brand/checkmark.png' },
      { text: '30 new videos monthly', icon: '/images/icons/brand/video-camera.png' },
      { text: 'Monthly strategy call', icon: '/images/icons/brand/speech-bubble.png' },
      { text: 'Priority 5-day delivery', icon: '/images/icons/brand/sparkle-stars.png' },
      { text: 'All ad-ready formats', icon: '/images/icons/brand/megaphone-sparkles.png' },
    ],
    best: 'Growing brands',
    cta: 'Get Started',
    checkoutUrl: '/checkout?package=content-engine',
    popular: true,
    tier: 'engine',
  },
  {
    name: 'Authority Engine',
    price: 3997,
    originalPrice: 7997,
    billing: '/month',
    billingNote: '3-month minimum',
    description: '60+ videos for serious scale',
    icon: '/images/icons/brand/megaphone-geometric.png',
    features: [
      { text: '60+ videos per month', icon: '/images/icons/brand/video-camera.png' },
      { text: 'Up to 3 AI spokespersons', icon: '/images/icons/brand/user-avatar.png' },
      { text: 'Up to 3 brand voices', icon: '/images/icons/brand/waveform.png' },
      { text: 'Multi-language versions', icon: '/images/icons/brand/speech-bubble.png' },
      { text: 'Full funnel scripting', icon: '/images/icons/brand/document.png' },
      { text: 'Campaign variations', icon: '/images/icons/brand/megaphone-geometric.png' },
    ],
    best: 'Agencies & enterprises',
    cta: 'Book a Call',
    checkoutUrl: '#book-call',
    tier: 'authority',
  },
];

const comparisonFeatures = [
  { name: 'AI Spokesperson Avatar', starter: '—', launch: '1', engine: '1', authority: '3' },
  { name: 'Brand Voice Clone', starter: '—', launch: '1', engine: '1', authority: '3' },
  { name: 'Videos Included', starter: '—', launch: '30', engine: '30/mo', authority: '60+/mo' },
  { name: 'Scripts Included', starter: '30 social posts', launch: '30', engine: '30/mo', authority: '60+/mo' },
  { name: 'Website Design', starter: '✓', launch: '—', engine: '—', authority: '—' },
  { name: 'Sales Bot Setup', starter: '✓', launch: '—', engine: '—', authority: '—' },
  { name: 'Revision Rounds', starter: '1', launch: '2', engine: '2', authority: 'Unlimited' },
  { name: 'Delivery Time', starter: '7 days', launch: '7 days', engine: '5 days', authority: '3 days' },
  { name: 'Strategy Calls', starter: '—', launch: '—', engine: 'Monthly', authority: 'Bi-weekly' },
  { name: 'Ad-Ready Formats', starter: '—', launch: '✓', engine: '✓', authority: '✓' },
  { name: 'Multi-Language', starter: '—', launch: '—', engine: '—', authority: '✓' },
];

const faqs = [
  {
    question: 'What makes your AI videos different?',
    answer: 'We use the latest AI technology combined with professional scriptwriting. Our videos look incredibly realistic—most viewers can\'t tell they\'re AI-generated. Plus, we handle everything from avatar creation to final delivery.',
  },
  {
    question: 'How long until I get my videos?',
    answer: 'Launch Kit: 7 days. Content Engine: 5 days. Authority Engine: 3 days. We work fast without sacrificing quality.',
  },
  {
    question: 'Can I use these for paid ads?',
    answer: 'Absolutely! All videos are delivered in ad-ready formats optimized for Facebook, Instagram, TikTok, and YouTube. Many clients see great ROAS with our AI spokesperson ads.',
  },
  {
    question: 'What if I don\'t like the result?',
    answer: 'Every package includes revision rounds. You can request changes to scripts, pacing, or style. We work with you until you\'re 100% satisfied.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Monthly plans have a 3-month minimum commitment. After that, you can cancel with 30 days notice. One-time packages have no ongoing commitment.',
  },
  {
    question: 'Do I need to be on camera?',
    answer: 'Never! That\'s the whole point. Your AI spokesperson handles all on-camera work. You just provide brand info and approve scripts.',
  },
  {
    question: 'What\'s included in the Brand Starter Kit?',
    answer: 'Everything you need to launch: professional logo design, complete brand identity, a custom mobile-ready website, 30 days of social media content, and a sales bot for Telegram or Discord with auto-response templates.',
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Sale Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold mb-8 shadow-lg">
            <Image
              src="/images/icons/brand/sparkle-stars.png"
              alt=""
              width={20}
              height={20}
              className="w-5 h-5"
            />
            NEW YEAR'S SALE — 50% OFF ALL PACKAGES
            <Image
              src="/images/icons/brand/sparkle-stars.png"
              alt=""
              width={20}
              height={20}
              className="w-5 h-5"
            />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Simple, Transparent
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>

          <p className="text-xl text-gray-500 mb-4 max-w-2xl mx-auto">
            Professional AI spokesperson videos and complete brand solutions. No hidden fees. No surprises.
          </p>

          <p className="text-sm text-purple-600 font-medium">
            Sale ends January 7th, 2025
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                  pkg.popular
                    ? 'ring-4 ring-purple-500 shadow-2xl lg:scale-105'
                    : 'shadow-xl hover:shadow-2xl border border-gray-100'
                }`}
              >
                {pkg.popular && (
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center py-2.5 text-sm font-bold flex items-center justify-center gap-2">
                    <Image
                      src="/images/icons/brand/sparkle-stars.png"
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    MOST POPULAR
                    <Image
                      src="/images/icons/brand/sparkle-stars.png"
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Icon */}
                  <div className="w-16 h-16 mb-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl flex items-center justify-center">
                    <Image
                      src={pkg.icon}
                      alt={pkg.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                  {/* Name & Description */}
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{pkg.description}</p>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">
                        ${pkg.price.toLocaleString()}
                      </span>
                      <span className="text-gray-500">{pkg.billing}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-400 line-through">
                        ${pkg.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                        50% OFF
                      </span>
                    </div>
                    {pkg.billingNote && (
                      <p className="text-xs text-gray-400 mt-1">{pkg.billingNote}</p>
                    )}
                  </div>

                  {/* Best For */}
                  <p className="text-sm text-purple-600 font-medium mb-4">
                    Best for: {pkg.best}
                  </p>

                  {/* Features with mini icons */}
                  <ul className="space-y-2.5 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm">
                        <Image
                          src={feature.icon}
                          alt=""
                          width={16}
                          height={16}
                          className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-70"
                        />
                        <span className="text-gray-700">{feature.text}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={pkg.checkoutUrl}
                    className={`block w-full text-center py-3.5 rounded-xl font-semibold transition-all ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {pkg.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Compare Plans Toggle */}
          <div className="text-center mt-12">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
            >
              <Image
                src="/images/icons/brand/document.png"
                alt=""
                width={20}
                height={20}
                className="w-5 h-5 opacity-70"
              />
              {showComparison ? 'Hide' : 'View'} full comparison
              <svg
                className={`w-5 h-5 transition-transform ${showComparison ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      {showComparison && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Compare All Plans
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold">Starter Kit</th>
                    <th className="px-6 py-4 text-center font-semibold">Launch Kit</th>
                    <th className="px-6 py-4 text-center font-semibold bg-purple-600">Content Engine</th>
                    <th className="px-6 py-4 text-center font-semibold">Authority</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 font-medium text-gray-900">{feature.name}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{feature.starter}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{feature.launch}</td>
                      <td className="px-6 py-4 text-center text-gray-900 font-semibold bg-purple-50">{feature.engine}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{feature.authority}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100">
                    <td className="px-6 py-4 font-bold text-gray-900">Price</td>
                    <td className="px-6 py-4 text-center font-bold text-gray-900">$497</td>
                    <td className="px-6 py-4 text-center font-bold text-gray-900">$1,497</td>
                    <td className="px-6 py-4 text-center font-bold text-purple-600 bg-purple-50">$997/mo</td>
                    <td className="px-6 py-4 text-center font-bold text-gray-900">$3,997/mo</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* What's Included Banner */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Every Package Includes</h2>
            <p className="text-purple-100 text-lg">Premium features across all plans</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: '/images/icons/brand/user-avatar.png', label: 'Custom AI Avatar', desc: 'Your unique spokesperson' },
              { icon: '/images/icons/brand/waveform.png', label: 'Voice Cloning', desc: 'Natural-sounding delivery' },
              { icon: '/images/icons/brand/document.png', label: 'Pro Scripts', desc: 'Engaging copy that converts' },
              { icon: '/images/icons/brand/checkmark.png', label: 'Revisions', desc: 'Until you\'re 100% happy' },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <p className="text-white font-semibold text-lg mb-1">{item.label}</p>
                <p className="text-purple-200 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-500">Simple process, powerful results</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: '/images/icons/brand/megaphone-sparkles.png',
                title: 'Book Your Call',
                desc: '15-minute strategy session to understand your goals'
              },
              {
                step: '02',
                icon: '/images/icons/brand/video-camera.png',
                title: 'We Create',
                desc: 'Our team handles scripting, production, and editing'
              },
              {
                step: '03',
                icon: '/images/icons/brand/checkmark.png',
                title: 'Download & Post',
                desc: 'Get your content delivered, ready to publish'
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold rounded-full flex items-center justify-center">
                    {item.step}
                  </span>
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
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center">
              <Image
                src="/images/icons/brand/speech-bubble.png"
                alt="FAQ"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-purple-600 transition-transform flex-shrink-0 ml-4 ${openFaq === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center">
            <Image
              src="/images/icons/brand/checkmark.png"
              alt="Guarantee"
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Satisfaction Guaranteed
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            We work with you until you're 100% happy. Every package includes revision rounds,
            and our team is dedicated to making your content perfect. If you're not satisfied
            after revisions, we'll make it right.
          </p>
        </div>
      </section>

      {/* Book Call Section */}
      <BookCallSection
        title="Not Sure Which Plan?"
        subtitle="Book a free 15-minute call. We'll help you choose the perfect package for your business."
      />
    </div>
  );
}
