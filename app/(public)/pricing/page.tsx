import Link from 'next/link';
import Image from 'next/image';
import { Check, Star, Zap } from 'lucide-react';
import { AIAssistantInlineCTA } from '@/components/ai-assistant-inline-cta';
import { ContentPackageGrid } from '@/components/pricing/ContentPackageGrid';

export default function PricingPage() {
  const packages = [
    {
      name: 'Brand Starter Kit',
      price: '$497',
      billing: ' one-time',
      billingNote: 'Perfect entry point',
      description: 'Best for: New brands & growing businesses',
      features: [
        'Logo & brand colors',
        'Icons & graphics package',
        'Ready-to-use files',
        'Custom website design',
        'Mobile-friendly layout',
        '30 days of social content',
        'Scripts & captions',
        'Telegram or Discord bot setup',
        'Auto-response templates',
      ],
      cta: 'Get Started',
      popular: false,
      checkoutUrl: '/checkout?package=starter-kit',
    },
    {
      name: 'AI Spokesperson Launch Kit',
      price: '$1,497',
      billing: ' one-time',
      billingNote: 'No subscription required',
      description: 'Best for: One-time content package',
      features: [
        '1 Custom AI spokesperson avatar',
        '1 Brand voice',
        '30 scripts (20-40 seconds)',
        '30 short-form videos',
        'Viral-style captions',
        'Simple branding',
        'Delivered in 7 days',
        '9:16 format, ad-ready',
        'Client portal access',
      ],
      cta: 'Get Started',
      popular: false,
      checkoutUrl: '/checkout?package=launch-kit',
    },
    {
      name: 'Content Engine Monthly',
      price: '$997',
      billing: '/month',
      billingNote: '3-month minimum commitment',
      description: 'Best for: Consistent monthly content',
      features: [
        'Everything in Launch Kit',
        '30 new videos every 30 days',
        'Monthly strategy call',
        'Priority delivery',
        'Ad-ready formatting',
        'Ongoing portal access',
      ],
      cta: 'Get Started',
      popular: false,
      checkoutUrl: '/checkout?package=content-engine-monthly',
    },
    {
      name: 'Content Engine PRO',
      price: '$1,997',
      billing: '/month',
      billingNote: '3-month minimum commitment',
      description: 'Best for: High-volume businesses',
      features: [
        '30-40 videos per month',
        'Up to 2 custom AI avatars',
        'Up to 2 custom brand voices',
        'Hook & CTA variations (A/B)',
        'Multi-format: 9:16, 1:1, 16:9',
        'Faster turnaround (3-5 days)',
      ],
      cta: 'Get Started',
      popular: false,
      checkoutUrl: '/checkout?package=content-engine-pro',
    },
    {
      name: 'AUTHORITY Engine',
      price: '$3,997',
      billing: '/month',
      billingNote: '3-month minimum commitment',
      description: 'Best for: Serious brands & agencies',
      features: [
        '60+ videos per month',
        'Up to 3 custom AI avatars',
        'Up to 3 custom voices',
        'Multi-language versions',
        'Full funnel scripting',
        'Posting & scheduling support',
        'Campaign-ready variations',
      ],
      cta: 'Get Started',
      popular: true,
      checkoutUrl: '/checkout?package=authority-engine',
    },
  ];

  const addons = [
    {
      name: 'Custom Avatar',
      price: '$497',
      description: 'Additional custom AI spokesperson avatar',
      icon: '/images/icons/brand/user-avatar.png',
    },
    {
      name: 'Custom Voice',
      price: '$297',
      description: 'Additional custom brand voice',
      icon: '/images/icons/brand/microphone.png',
    },
    {
      name: 'Promo Campaign Pack',
      price: '$797',
      description: 'Complete promotional campaign package',
      icon: '/images/icons/brand/megaphone-sparkles.png',
    },
    {
      name: 'Posting & Scheduling',
      price: '$297/month',
      description: 'Content scheduling and posting management',
      icon: '/images/icons/brand/document.png',
    },
  ];

  const faqs = [
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Yes, you can upgrade at any time. For downgrades, changes take effect at the end of your current billing cycle.',
    },
    {
      question: 'What happens after the 3-month minimum?',
      answer: 'After the initial 3-month commitment for Content Engine Monthly, you can continue month-to-month or cancel with 30 days notice.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Due to the custom nature of our AI spokesperson creation, we do not offer refunds. However, we work closely with you to ensure satisfaction with revisions included.',
    },
    {
      question: 'Can I use the videos for paid advertising?',
      answer: 'Absolutely! All videos are delivered ad-ready and formatted for platforms like Facebook, Instagram, TikTok, and YouTube.',
    },
    {
      question: 'How many revisions are included?',
      answer: 'Each package includes up to 2 revision rounds per delivery. Additional revisions can be requested for a small fee.',
    },
    {
      question: 'What if I need more videos than my plan includes?',
      answer: 'You can either upgrade to a higher tier or purchase additional videos a la carte at $50-75 per video depending on your plan.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Choose the perfect package for your content needs. All plans include premium AI spokesperson videos, professional scripts, and dedicated support.
          </p>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                pkg.popular ? 'ring-4 ring-purple-500 lg:scale-105' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  MOST POPULAR
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{pkg.price}</span>
                  <span className="text-gray-600 ml-1">{pkg.billing}</span>
                  {pkg.billingNote && (
                    <div className="text-xs text-gray-500 mt-1">{pkg.billingNote}</div>
                  )}
                </div>

                <p className="text-sm text-purple-600 font-medium mb-6">{pkg.description}</p>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={pkg.checkoutUrl}
                  className={`block w-full text-center py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {pkg.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* AI Assistant CTA - Help choosing */}
        <AIAssistantInlineCTA variant="pricing" className="mt-8" />
      </div>

      {/* Content Package Grid - What's Included */}
      <ContentPackageGrid />

      {/* Add-ons Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Enhance Your Package</h2>
            <p className="text-lg text-gray-600">Add extra features to customize your content engine</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {addons.map((addon, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="w-12 h-12 mb-4">
                  <Image
                    src={addon.icon}
                    alt={addon.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{addon.name}</h3>
                <p className="text-2xl font-bold text-purple-600 mb-3">{addon.price}</p>
                <p className="text-sm text-gray-600">{addon.description}</p>
              </div>
            ))}
          </div>

          {/* Premium Add-on - Facebook Ad Creative Engine */}
          <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl p-1 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-orange-500 fill-current" />
                  <h3 className="text-2xl font-bold text-gray-900">Facebook Ad Creative Engine</h3>
                </div>
                <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  PREMIUM
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                Complete Facebook ad creative production including multiple variations, formats, and optimizations for maximum ROAS.
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                    +$1,497
                  </span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                <Link
                  href="/services/facebook-ad-engine"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">Everything you need to know about our pricing</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of businesses creating viral content with AI spokespersons
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            >
              Schedule a Call
            </Link>
            <Link
              href="/samples"
              className="bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-800 transition-colors duration-200"
            >
              View Samples
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
