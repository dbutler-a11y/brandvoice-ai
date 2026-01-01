import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Creator Markets | BrandVoice Studio",
  description:
    "Predict creator growth, analyze influencer performance, and discover emerging talent with AI-powered analytics.",
  openGraph: {
    title: "Creator Markets - Predict & Analyze Influencer Growth",
    description:
      "AI-powered prediction markets and analytics for the creator economy.",
  },
};

// Mock data for demonstration
const featuredCreators = [
  {
    handle: "@techreview_pro",
    name: "Tech Review Pro",
    followers: "2.4M",
    growth: "+12.3%",
    sentiment: "bullish",
    prediction: "2.8M by Q2 2025",
    category: "Tech",
  },
  {
    handle: "@fitness_journey",
    name: "Fitness Journey",
    followers: "890K",
    growth: "+8.7%",
    sentiment: "bullish",
    prediction: "1M by March 2025",
    category: "Health",
  },
  {
    handle: "@startup_daily",
    name: "Startup Daily",
    followers: "1.2M",
    growth: "+5.2%",
    sentiment: "neutral",
    prediction: "1.4M by Q2 2025",
    category: "Business",
  },
];

const marketPredictions = [
  {
    question: "Will MrBeast hit 400M YouTube subscribers by Dec 2025?",
    yesPrice: 0.72,
    volume: "$45,230",
    endDate: "Dec 31, 2025",
  },
  {
    question: "Will any TikTok creator surpass 200M followers in 2025?",
    yesPrice: 0.45,
    volume: "$23,100",
    endDate: "Dec 31, 2025",
  },
  {
    question: "Will Instagram Reels overtake TikTok in daily active creators?",
    yesPrice: 0.28,
    volume: "$18,500",
    endDate: "Jun 30, 2025",
  },
  {
    question: "Will AI-generated content accounts reach 10M+ followers?",
    yesPrice: 0.65,
    volume: "$31,200",
    endDate: "Dec 31, 2025",
  },
];

export default function CreatorMarketsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-gray-950 to-gray-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Beta Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium px-4 py-2 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Coming Soon - Join Waitlist
            </span>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Creator{" "}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Markets
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Predict creator growth, analyze influencer performance, and
              discover emerging talent before they go viral.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <a
                href="mailto:hello@brandvoice.studio?subject=Creator%20Markets%20Waitlist&body=Hi%2C%20I%27d%20like%20to%20join%20the%20Creator%20Markets%20waitlist.%0A%0AName%3A%20%0ACompany%3A%20"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg shadow-green-500/20"
              >
                Join the Waitlist
                <svg
                  className="w-5 h-5"
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
              </a>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 bg-white/5 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all border border-white/10"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">$2.4B+</div>
                <div className="text-sm text-gray-500">Creator Economy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50M+</div>
                <div className="text-sm text-gray-500">Active Creators</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">AI-Powered</div>
                <div className="text-sm text-gray-500">Predictions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prediction Markets Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Prediction Markets
              </h2>
              <p className="text-gray-400">
                Bet on creator milestones and industry trends
              </p>
            </div>
            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full font-medium">
              Demo Data
            </span>
          </div>

          <div className="grid gap-4">
            {marketPredictions.map((prediction, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:border-green-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-2">
                      {prediction.question}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Volume: {prediction.volume}</span>
                      <span>Ends: {prediction.endDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">
                        {(prediction.yesPrice * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500">Yes Price</div>
                    </div>
                    <button className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg font-medium hover:bg-green-500/30 transition-colors">
                      Trade
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Analytics Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Creator Analytics
              </h2>
              <p className="text-gray-400">
                AI-powered insights on creator performance
              </p>
            </div>
            <span className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full font-medium">
              Coming Soon
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredCreators.map((creator, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {creator.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{creator.name}</h3>
                    <p className="text-gray-500 text-sm">{creator.handle}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Followers</span>
                    <span className="text-white font-medium">
                      {creator.followers}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">30d Growth</span>
                    <span className="text-green-400 font-medium">
                      {creator.growth}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">AI Prediction</span>
                    <span className="text-purple-400 font-medium">
                      {creator.prediction}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Sentiment</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        creator.sentiment === "bullish"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {creator.sentiment.toUpperCase()}
                    </span>
                  </div>
                </div>

                <button className="w-full mt-4 bg-purple-500/20 text-purple-400 py-2 rounded-lg font-medium hover:bg-purple-500/30 transition-colors">
                  View Full Analytics
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-12 text-center">
            How Creator Markets Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-400"
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
              <h3 className="text-white font-semibold mb-2">
                1. Analyze Trends
              </h3>
              <p className="text-gray-400 text-sm">
                Our AI tracks millions of data points to identify emerging
                creators and predict growth trajectories.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">
                2. Make Predictions
              </h3>
              <p className="text-gray-400 text-sm">
                Place predictions on creator milestones, platform shifts, and
                industry trends using our prediction markets.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">
                3. Earn & Discover
              </h3>
              <p className="text-gray-400 text-sm">
                Win from accurate predictions and discover emerging talent
                before they go mainstream.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="py-12 border-t border-gray-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-white font-semibold mb-4">
            Consent-Based Platform
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Creator Markets operates on a consent-first model. All creator data
            is sourced through official APIs with creator permission, or from
            publicly available aggregate statistics. No individual likeness is
            traded without explicit creator opt-in.
          </p>
          <p className="text-gray-600 text-xs">
            Prediction markets are for entertainment and educational purposes.
            Check your local regulations regarding prediction market
            participation.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-t from-green-900/20 to-transparent">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Be First to Access Creator Markets
          </h2>
          <p className="text-gray-400 mb-8">
            Join the waitlist to get early access when we launch.
          </p>
          <div className="flex justify-center">
            <a
              href="mailto:hello@brandvoice.studio?subject=Creator%20Markets%20Waitlist&body=Hi%2C%20I%27d%20like%20to%20join%20the%20Creator%20Markets%20waitlist.%0A%0AName%3A%20%0ACompany%3A%20"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg shadow-green-500/20"
            >
              Join Waitlist
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
