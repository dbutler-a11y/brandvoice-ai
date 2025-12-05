import Link from 'next/link';
import {
  Zap,
  Target,
  Layers,
  RefreshCw,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Play,
  DollarSign,
  Users,
  Clock
} from 'lucide-react';

export const metadata = {
  title: 'Facebook Ad Creative Engine | BrandVoice Studio',
  description: 'Transform your AI spokesperson videos into high-converting Facebook ad creatives. Multiple variations, formats, and optimizations for maximum ROAS.',
};

export default function FacebookAdEnginePage() {
  const features = [
    {
      icon: Layers,
      title: 'Multiple Ad Variations',
      description: 'Get 10-15 unique creative variations per video, each with different hooks, CTAs, and visual treatments to maximize testing potential.',
    },
    {
      icon: Target,
      title: 'Audience-Specific Creatives',
      description: 'Creatives tailored for cold, warm, and hot audiences. Different messaging angles for each stage of your funnel.',
    },
    {
      icon: RefreshCw,
      title: 'Multi-Format Delivery',
      description: 'Every ad delivered in 9:16 (Stories/Reels), 1:1 (Feed), and 16:9 (In-stream) formats. Ready for all placements.',
    },
    {
      icon: BarChart3,
      title: 'Performance Optimization',
      description: 'Monthly creative refresh based on your ad account data. We analyze what\'s working and create more of it.',
    },
  ];

  const deliverables = [
    '10-15 unique ad variations per month',
    'Hook variations (pattern interrupt, curiosity, problem-aware)',
    'CTA variations (soft sell, direct, urgency)',
    'Text overlay variations for sound-off viewing',
    'Thumbnail options for each creative',
    'Caption copy for each variation',
    'All 3 aspect ratios per creative',
    'Monthly performance review call',
    'Creative testing roadmap',
    'Competitor creative analysis',
  ];

  const results = [
    {
      metric: '2.5x',
      label: 'Average ROAS Improvement',
      description: 'Clients see significant return improvements within 60 days',
    },
    {
      metric: '40%',
      label: 'Lower CPM',
      description: 'Better creative = better relevance scores = lower costs',
    },
    {
      metric: '3x',
      label: 'More Testing Capacity',
      description: 'Test more angles and hooks without additional production time',
    },
  ];

  const process = [
    {
      step: '01',
      title: 'Strategy Session',
      description: 'We analyze your current ads, audiences, and goals to create a testing roadmap.',
    },
    {
      step: '02',
      title: 'Creative Production',
      description: 'Your spokesperson videos are transformed into multiple ad variations with different hooks and CTAs.',
    },
    {
      step: '03',
      title: 'Delivery & Launch',
      description: 'Receive organized creative assets with naming conventions optimized for ad manager.',
    },
    {
      step: '04',
      title: 'Analyze & Iterate',
      description: 'Monthly review of performance data to inform next month\'s creative direction.',
    },
  ];

  const faqs = [
    {
      question: 'Do I need a BrandVoice subscription to use this?',
      answer: 'Yes, the Facebook Ad Creative Engine is an add-on to any of our monthly plans (Content Engine Monthly, PRO, or AUTHORITY). We use your monthly spokesperson videos as the source material for ad creatives.',
    },
    {
      question: 'How is this different from just running my videos as ads?',
      answer: 'Raw videos rarely perform well as ads. We add strategic hooks in the first 3 seconds, optimize for sound-off viewing with text overlays, create multiple CTA variations, and format everything for each placement. The result is ads built to stop the scroll and convert.',
    },
    {
      question: 'What if I\'m not running Facebook ads yet?',
      answer: 'This service is designed for businesses already running (or ready to run) paid ads. If you\'re not there yet, we recommend starting with our content packages to build organic presence first.',
    },
    {
      question: 'Can you manage my ad campaigns too?',
      answer: 'This service focuses on creative production, not media buying. However, we can recommend trusted ad management partners if needed.',
    },
    {
      question: 'What results can I realistically expect?',
      answer: 'Results depend on many factors (offer, audience, budget). However, clients typically see 30-50% lower CPAs within 60 days due to improved creative performance. We provide benchmarks during our strategy session.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-6 h-6 fill-current" />
              <span className="text-sm font-semibold uppercase tracking-wide">Premium Add-On</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Facebook Ad Creative Engine
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Transform your AI spokesperson videos into scroll-stopping,
              high-converting Facebook ad creatives. Multiple variations, all formats,
              optimized for maximum ROAS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#book-call"
                className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              >
                Book Strategy Call
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/30 transition-colors duration-200"
              >
                <Play className="w-5 h-5" />
                See How It Works
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl" />
      </section>

      {/* Value Props - Quick Stats */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <DollarSign className="w-8 h-8 text-orange-500 mb-2" />
              <div className="text-3xl font-bold text-gray-900">+$1,000</div>
              <div className="text-gray-600">/month add-on</div>
            </div>
            <div className="flex flex-col items-center">
              <Layers className="w-8 h-8 text-orange-500 mb-2" />
              <div className="text-3xl font-bold text-gray-900">10-15</div>
              <div className="text-gray-600">Ad variations/month</div>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-8 h-8 text-orange-500 mb-2" />
              <div className="text-3xl font-bold text-gray-900">3</div>
              <div className="text-gray-600">Audience angles</div>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-orange-500 mb-2" />
              <div className="text-3xl font-bold text-gray-900">5 Days</div>
              <div className="text-gray-600">Turnaround time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Your Videos Are Great.<br />
                <span className="text-orange-500">Your Ads Could Be Better.</span>
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg">
                  You&apos;re creating professional AI spokesperson content every month.
                  But when it comes to paid ads, you&apos;re either:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <span>Running raw videos as ads (low engagement, high CPMs)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <span>Spending hours trying to edit variations yourself</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <span>Testing only 1-2 creatives when you need 10+</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">✗</span>
                    <span>Watching competitors outperform you with better creative</span>
                  </li>
                </ul>
                <p className="text-lg font-medium text-gray-900 pt-4">
                  The Facebook Ad Creative Engine solves this. We transform your monthly
                  spokesperson videos into a full testing library of ad creatives.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-8 border border-orange-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">What Changes With This Add-On:</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Every video becomes 10-15 ad-ready creatives</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Hooks designed to stop the scroll in 0-3 seconds</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Text overlays for 85% sound-off viewers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">All formats ready for every placement</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Monthly creative strategy based on your data</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for Performance Marketers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to run winning ad creative at scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Everything Included
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                A complete creative production system for your paid ads
              </p>
              <div className="grid grid-cols-1 gap-3">
                {deliverables.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-8">Expected Results</h3>
              <div className="space-y-8">
                {results.map((result, index) => (
                  <div key={index}>
                    <div className="text-4xl font-bold text-orange-400 mb-2">{result.metric}</div>
                    <div className="text-lg font-semibold mb-1">{result.label}</div>
                    <div className="text-gray-400 text-sm">{result.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A systematic approach to creative testing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-orange-100 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2">
                    <ArrowRight className="w-6 h-6 text-orange-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl p-1">
            <div className="bg-white rounded-xl p-8 md:p-12">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Add to Any Monthly Plan
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Requires Content Engine Monthly, PRO, or AUTHORITY subscription
                </p>
                <div className="mb-8">
                  <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                    +$1,000
                  </span>
                  <span className="text-xl text-gray-600 ml-2">/month</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="#book-call"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
                  >
                    Book Strategy Call
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
                  >
                    View All Plans
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
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
      </section>

      {/* CTA Section */}
      <section id="book-call" className="py-20 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Scale Your Paid Ads?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Book a strategy call to see how the Facebook Ad Creative Engine
            can transform your ad performance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://calendly.com/brandvoice-studio/strategy"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            >
              Book Strategy Call
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/30 transition-colors duration-200"
            >
              Back to Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
