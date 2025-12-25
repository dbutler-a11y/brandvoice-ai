'use client'

import { useState } from 'react'
import Link from 'next/link'

// Sample Data (inline until /lib/sampleData.ts is created)
const SAMPLE_SCRIPTS = [
  {
    id: 1,
    type: 'FAQ',
    title: 'What Makes Our Med Spa Different?',
    content: `Hey there! If you're wondering what makes our med spa stand out from the rest, let me tell you.

First, we only use FDA-approved treatments and the latest technology. No cutting corners here.

Second, our team isn't just certified – they're passionate about helping you look and feel amazing. We spend time understanding YOUR goals, not just pushing products.

And third? We actually care about results. That's why we offer free consultations and create custom treatment plans just for you.

Ready to see the difference for yourself? Book your free consultation today. Link in bio!`,
    wordCount: 98,
    duration: '35-40 seconds',
    color: 'blue'
  },
  {
    id: 2,
    type: 'Service',
    title: 'Discover Our Signature Hydrafacial',
    content: `Want glowing, radiant skin in just 30 minutes? Let me introduce you to our signature HydraFacial treatment.

This isn't your average facial. The HydraFacial uses patented technology to cleanse, extract, and hydrate your skin all at once. It's like a power wash for your face – but way more relaxing!

The best part? Zero downtime. You can literally get a HydraFacial on your lunch break and go back to work glowing.

Perfect for all skin types, whether you're dealing with fine lines, uneven texture, or just want that red-carpet glow.

First-time clients get 20% off this month. Don't miss out – book now!`,
    wordCount: 112,
    duration: '40-45 seconds',
    color: 'blue'
  },
  {
    id: 3,
    type: 'Promo',
    title: 'Holiday Special: Buy 2 Get 1 Free',
    content: `Okay, this is HUGE. For the next 48 hours only, we're running our biggest sale of the year!

Buy any 2 treatments and get a third one completely FREE. Yes, you heard that right.

Want Botox, filler, AND a HydraFacial? Done. Laser hair removal sessions? Stack 'em up. The choice is yours.

This is the perfect time to stock up on your favorite treatments or finally try something new you've been curious about.

But remember – this ends in 48 hours. Once it's gone, it's gone.

Click the link in bio to book your appointment now. Trust me, you don't want to miss this!`,
    wordCount: 108,
    duration: '40 seconds',
    color: 'purple'
  },
  {
    id: 4,
    type: 'Testimonial',
    title: 'Real Results: Sarah\'s Transformation',
    content: `I want to share something special with you today. This is Sarah – and she came to us six months ago feeling self-conscious about her skin.

After trying everything over the counter with no luck, she was ready to give up. But then she tried our custom skincare program.

Fast forward to today – her skin is glowing, her confidence is through the roof, and she literally can't stop smiling.

Here's what Sarah said: "I finally feel like myself again. The team didn't just treat my skin – they changed my life."

And that's exactly why we do what we do.

If you're ready for your own transformation, book a free consultation. Your glow-up is waiting!`,
    wordCount: 121,
    duration: '45 seconds',
    color: 'green'
  },
  {
    id: 5,
    type: 'Tip',
    title: 'Skincare Mistake You\'re Probably Making',
    content: `Quick question: Are you washing your face with hot water?

If yes, STOP. I know it feels amazing, but hot water is actually stripping your skin of its natural oils. This leads to dryness, irritation, and even more oil production.

Here's what to do instead: Use lukewarm water to cleanse, then finish with a splash of cold water to close your pores.

It's a small change that makes a massive difference.

Want more skincare tips like this? Follow for weekly advice from our expert estheticians.

And if you're dealing with stubborn skin issues, book a free consultation. We'll create a custom plan just for you!`,
    wordCount: 110,
    duration: '40 seconds',
    color: 'yellow'
  },
  {
    id: 6,
    type: 'Brand',
    title: 'Why We Started This Med Spa',
    content: `Let me tell you why we do what we do.

Five years ago, I was sitting in a consultation room at another med spa, and the person across from me didn't ask a single question about MY goals. They just wanted to sell me packages.

I walked out feeling like a number, not a person. And I promised myself that if I ever opened my own practice, it would be different.

Today, every single client who walks through our doors gets heard, understood, and treated like family.

Because you deserve more than cookie-cutter treatments. You deserve results that are as unique as you are.

That's our promise. That's our mission.

Ready to experience the difference? Book your free consultation today.`,
    wordCount: 127,
    duration: '45-50 seconds',
    color: 'indigo'
  }
]

const SAMPLE_EMAILS = [
  {
    day: 1,
    subject: 'Quick question about your skincare goals...',
    preview: 'Hey {{FirstName}}, I noticed you downloaded our free skincare guide...',
    body: `Hey {{FirstName}},

I noticed you downloaded our free skincare guide last week – awesome!

I'm reaching out because I'm curious: what's your #1 skincare goal right now?

Is it:
- Reducing fine lines and wrinkles?
- Getting rid of stubborn acne or scarring?
- Achieving that healthy, natural glow?
- Something else entirely?

Hit reply and let me know. I'd love to point you in the right direction.

And if you're ready to take the next step, we're offering FREE consultations this week (normally $150). Just book using the link below.

[Book Free Consultation]

Talk soon,
[Your Name]
[Med Spa Name]

P.S. No pressure – but these free consultation spots fill up fast. Grab yours while you can!`
  },
  {
    day: 3,
    subject: 'The #1 treatment our clients rave about',
    preview: "It's not what you think...",
    body: `Hey {{FirstName}},

Quick question: If you could fix ONE thing about your skin in the next 30 days, what would it be?

Here's why I'm asking...

The #1 treatment our clients rave about isn't some expensive laser procedure or injectable. It's our Custom HydraFacial.

Why? Because it works for EVERYONE. Acne, aging, dryness, dullness – you name it.

Plus, there's zero downtime. You literally walk out glowing.

Right now, we're running a first-timer special: Get your first HydraFacial for just $99 (normally $199).

Want in?

[Claim Your $99 HydraFacial]

Only 8 spots left this month!

Cheers,
[Your Name]

P.S. Still not sure? Check out these before & after photos: [link]`
  },
  {
    day: 5,
    subject: 'This might be why your skin isn\'t improving...',
    preview: 'Most people make this mistake',
    body: `Hey {{FirstName}},

Can I be honest with you for a second?

Most people who struggle with their skin aren't using the wrong products.

They're using the wrong APPROACH.

Here's what I mean:

Everyone's skin is different. What works for your friend might not work for you. That's why drugstore "one size fits all" solutions rarely deliver results.

At [Med Spa Name], we don't believe in cookie-cutter treatments.

We analyze YOUR skin, understand YOUR goals, and create a custom plan that actually works for YOU.

That's the difference between wasting money on products that don't work... and finally seeing real results.

Want to see what a custom approach could do for your skin?

Book your free skin analysis today (no obligation, no pressure):

[Book Free Analysis]

You deserve better than guesswork.

[Your Name]`
  },
  {
    day: 7,
    subject: 'Last chance: Free consultation ends tonight',
    preview: 'Don\'t miss out on this, {{FirstName}}',
    body: `Hey {{FirstName}},

Just a quick heads up – our free consultation offer ends TONIGHT at midnight.

After that, we're going back to our regular $150 fee.

If you've been thinking about:
- Finally getting clear, glowing skin
- Reducing fine lines or wrinkles
- Treating stubborn acne or scarring
- Or just feeling more confident in your own skin

Now's the time to act.

[Book Your Free Consultation - Today Only]

During your consultation, we'll:
- Analyze your skin and identify what's holding you back
- Answer all your questions (no judgment, ever)
- Create a custom treatment plan designed just for you
- Show you real before & after results from clients like you

Zero pressure. Just honest advice and a clear path forward.

Sound good?

Grab your spot before midnight:

[Yes, I Want My Free Consultation]

Talk soon,
[Your Name]

P.S. Seriously, these spots are going fast. Don't miss out!`
  },
  {
    day: 10,
    subject: 'Should I keep sending you these emails?',
    preview: 'I want to make sure I\'m not bothering you...',
    body: `Hey {{FirstName}},

I've sent you a few emails about our med spa treatments, and I haven't heard back.

That's totally okay – but I want to make sure I'm not clogging up your inbox if you're not interested.

So here's the deal:

If you want to keep hearing from me (skincare tips, special offers, treatment info), you don't have to do anything. You'll stay on the list.

If you're not interested right now, just hit unsubscribe below. No hard feelings!

But before you go, I want to leave you with this:

If you're struggling with your skin, you're not alone. And you don't have to figure it out by yourself.

We're here whenever you're ready.

[Book a Free Consultation]

Or, if you just want to learn more first, check out our free resources:
- [Free Skincare Guide]
- [Before & After Gallery]
- [Treatment FAQ]

Either way, I wish you the best on your skincare journey.

Take care,
[Your Name]
[Med Spa Name]`
  }
]

const SAMPLE_ADS = [
  {
    id: 1,
    type: 'Lead Gen',
    headline: 'Get Glowing Skin in 30 Minutes',
    primaryText: 'Struggling with dull, tired skin? Our signature HydraFacial treatment cleanses, extracts, and hydrates – all in one relaxing 30-minute session. Perfect for all skin types, zero downtime. First-time clients get 20% off this month! Book your appointment now and see the difference.',
    description: 'FDA-approved treatments. Expert estheticians. Real results.',
    cta: 'Book Now',
    headlineCount: 32,
    primaryCount: 278,
    descriptionCount: 61
  },
  {
    id: 2,
    type: 'Awareness',
    headline: 'Your Skin Deserves Better Than Drugstore Solutions',
    primaryText: 'Ever wonder why your skincare routine isn\'t working? One-size-fits-all products can\'t address YOUR unique skin concerns. At [Med Spa Name], we analyze your skin and create custom treatment plans that actually deliver results. No guesswork. No wasted money. Just clear, healthy, glowing skin.',
    description: 'Custom skincare solutions for every skin type and concern.',
    cta: 'Learn More',
    headlineCount: 54,
    primaryCount: 307,
    descriptionCount: 60
  },
  {
    id: 3,
    type: 'Offer',
    headline: '48-Hour Flash Sale: Buy 2 Treatments, Get 1 FREE',
    primaryText: 'Our biggest sale of the year is HERE! For the next 48 hours only, buy any 2 treatments and get a 3rd completely free. Botox, fillers, HydraFacials, laser treatments – your choice! This is your chance to stock up on favorites or try something new. Don\'t wait – sale ends in 48 hours!',
    description: 'Limited time only. Premium treatments at unbeatable prices.',
    cta: 'Claim Offer',
    headlineCount: 54,
    primaryCount: 301,
    descriptionCount: 63
  },
  {
    id: 4,
    type: 'Retargeting',
    headline: 'Still Thinking About That Free Consultation?',
    primaryText: 'We noticed you checked out our website – welcome! We\'re still holding your spot for a FREE consultation (normally $150). During your visit, we\'ll analyze your skin, answer your questions, and create a custom treatment plan just for you. Zero pressure, just expert advice. Ready to take the next step?',
    description: 'Free consultation. Custom solutions. Real results you can see.',
    cta: 'Book Free Consultation',
    headlineCount: 49,
    primaryCount: 310,
    descriptionCount: 62
  },
  {
    id: 5,
    type: 'Social Proof',
    headline: 'See Why 500+ Clients Trust Us With Their Skin',
    primaryText: '"I finally feel confident without makeup!" - Sarah M. "My skin has never looked better!" - Jennifer L. "The team actually listened to my concerns." - Amanda K. Real clients. Real results. Real confidence. Join hundreds of happy clients who transformed their skin with our custom treatment plans.',
    description: '5-star rated med spa. Expert care. Proven results.',
    cta: 'See Before & After',
    headlineCount: 52,
    primaryCount: 296,
    descriptionCount: 50
  }
]

const SAMPLE_VIDEOS = [
  {
    id: 1,
    title: 'AI Spokesperson Demo',
    description: 'Example of our AI-generated spokesperson content - vertical format perfect for TikTok, Instagram Reels, and YouTube Shorts.',
    videoUrl: '/videos/samples/example-content-1.mp4',
    duration: '8 seconds',
    format: '9:16 Vertical',
    category: 'Demo'
  }
]

type TabType = 'videos' | 'scripts' | 'emails' | 'ads'
type ScriptType = 'FAQ' | 'Service' | 'Promo' | 'Testimonial' | 'Tip' | 'Brand' | 'All'

export default function SamplesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('videos')
  const [selectedScriptType, setSelectedScriptType] = useState<ScriptType>('All')
  const [expandedScript, setExpandedScript] = useState<number | null>(null)
  const [expandedEmail, setExpandedEmail] = useState<number | null>(null)

  const scriptTypes: ScriptType[] = ['All', 'FAQ', 'Service', 'Promo', 'Testimonial', 'Tip', 'Brand']

  const filteredScripts = selectedScriptType === 'All'
    ? SAMPLE_SCRIPTS
    : SAMPLE_SCRIPTS.filter(script => script.type === selectedScriptType)

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700'
    }
    return colors[type] || colors.blue
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'FAQ':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'Service':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      case 'Promo':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        )
      case 'Testimonial':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        )
      case 'Tip':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium mb-6 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            See What You&apos;ll Get
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Real examples from our 30-Day Content Engine. This is exactly what you&apos;ll receive – professionally crafted content ready to post.
          </p>
        </div>
      </section>

      {/* Tabbed Navigation */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'videos'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Video Examples
            </button>
            <button
              onClick={() => setActiveTab('scripts')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'scripts'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Video Scripts
            </button>
            <button
              onClick={() => setActiveTab('emails')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'emails'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Cold Emails
            </button>
            <button
              onClick={() => setActiveTab('ads')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'ads'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Facebook Ads
            </button>
          </div>

          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  AI Spokesperson Video Examples
                </h3>
                <p className="text-gray-600 mb-4">
                  See real examples of the AI-generated spokesperson videos we create for our clients. These videos are ready for TikTok, Instagram Reels, YouTube Shorts, and paid ads.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded border border-purple-200">
                    9:16 Vertical
                  </span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200">
                    Ad-Ready
                  </span>
                  <span className="px-2 py-1 bg-green-50 text-green-700 rounded border border-green-200">
                    Caption-Ready
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SAMPLE_VIDEOS.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
                  >
                    {/* Video Player */}
                    <div className="relative aspect-[9/16] bg-gradient-to-br from-gray-900 to-gray-800">
                      <video
                        className="w-full h-full object-cover"
                        controls
                        playsInline
                        preload="metadata"
                        poster=""
                      >
                        <source src={video.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>

                    {/* Video Info */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                          {video.category}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {video.format}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{video.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{video.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* More videos coming soon */}
              <div className="text-center py-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                <svg className="w-12 h-12 mx-auto text-indigo-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">More Examples Coming Soon</h4>
                <p className="text-gray-600 max-w-md mx-auto">
                  We&apos;re adding more video examples across different industries and styles. Check back soon!
                </p>
              </div>
            </div>
          )}

          {/* Scripts Tab */}
          {activeTab === 'scripts' && (
            <div className="space-y-6">
              {/* Script Type Filter */}
              <div className="flex flex-wrap gap-2 justify-center bg-white p-4 rounded-lg shadow-sm">
                {scriptTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedScriptType(type)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      selectedScriptType === type
                        ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Script Cards */}
              <div className="grid gap-4">
                {filteredScripts.map((script) => (
                  <div
                    key={script.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <button
                      onClick={() => setExpandedScript(expandedScript === script.id ? null : script.id)}
                      className="w-full px-6 py-4 flex items-start justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(script.color)}`}>
                            {getTypeIcon(script.type)}
                            {script.type}
                          </span>
                          <span className="text-xs text-gray-500 hidden sm:inline">
                            {script.wordCount} words • {script.duration}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {script.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {script.content.substring(0, 120)}...
                        </p>
                      </div>
                      <svg
                        className={`w-6 h-6 text-gray-400 flex-shrink-0 ml-4 transition-transform ${
                          expandedScript === script.id ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {expandedScript === script.id && (
                      <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gray-50">
                        <div className="prose max-w-none">
                          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                            {script.content}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {script.wordCount} words
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {script.duration}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emails Tab */}
          {activeTab === 'emails' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  5-Email Cold Outreach Sequence
                </h3>
                <p className="text-gray-600 mb-6">
                  A strategic follow-up sequence designed to warm up leads and convert them into booked consultations.
                </p>
              </div>

              <div className="relative">
                {/* Timeline connector */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 via-purple-200 to-indigo-200 hidden md:block" />

                {SAMPLE_EMAILS.map((email, index) => (
                  <div key={index} className="relative mb-6 last:mb-0">
                    {/* Day Badge */}
                    <div className="flex items-start gap-6">
                      <div className="hidden md:flex flex-shrink-0 w-16 h-16 rounded-full bg-indigo-600 text-white items-center justify-center font-bold text-lg shadow-lg z-10">
                        Day {email.day}
                      </div>

                      <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                        <button
                          onClick={() => setExpandedEmail(expandedEmail === index ? null : index)}
                          className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="text-xs text-indigo-600 font-semibold mb-1 md:hidden">
                                DAY {email.day}
                              </div>
                              <h4 className="text-lg font-bold text-gray-900 mb-1">
                                {email.subject}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {email.preview}
                              </p>
                            </div>
                            <svg
                              className={`w-6 h-6 text-gray-400 flex-shrink-0 ml-4 transition-transform ${
                                expandedEmail === index ? 'transform rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>

                        {expandedEmail === index && (
                          <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gray-50">
                            <div className="bg-white rounded border border-gray-200 p-4">
                              <div className="mb-3 pb-3 border-b border-gray-200">
                                <div className="text-xs text-gray-500 mb-1">Subject:</div>
                                <div className="font-semibold text-gray-900">{email.subject}</div>
                              </div>
                              <div className="prose max-w-none">
                                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
{email.body}
                                </pre>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facebook Ads Tab */}
          {activeTab === 'ads' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Facebook Ad Campaign Assets
                </h3>
                <p className="text-gray-600 mb-4">
                  Complete ad copy optimized for different campaign objectives. All character counts are Facebook-compliant.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200">
                    Lead Generation
                  </span>
                  <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded border border-purple-200">
                    Brand Awareness
                  </span>
                  <span className="px-2 py-1 bg-green-50 text-green-700 rounded border border-green-200">
                    Conversions
                  </span>
                  <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded border border-yellow-200">
                    Retargeting
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {SAMPLE_ADS.map((ad) => (
                  <div
                    key={ad.id}
                    className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Ad Preview Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-sm">[Your Med Spa Name]</div>
                          <div className="text-xs text-blue-100">Sponsored</div>
                        </div>
                      </div>
                    </div>

                    {/* Ad Content */}
                    <div className="p-5 space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-gray-500 uppercase">
                            {ad.type}
                          </span>
                          <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded">
                            {ad.cta}
                          </span>
                        </div>
                      </div>

                      {/* Primary Text */}
                      <div>
                        <div className="text-sm text-gray-700 leading-relaxed mb-2">
                          {ad.primaryText}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className={`${ad.primaryCount <= 125 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {ad.primaryCount}/125 chars
                          </span>
                        </div>
                      </div>

                      {/* Mock Image Placeholder */}
                      <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center border border-gray-200">
                        <svg className="w-16 h-16 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>

                      {/* Headline */}
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="font-semibold text-gray-900 text-sm mb-1">
                          {ad.headline}
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          {ad.description}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className={`${ad.headlineCount <= 40 ? 'text-green-600' : 'text-yellow-600'}`}>
                            Headline: {ad.headlineCount}/40
                          </span>
                          <span className={`${ad.descriptionCount <= 90 ? 'text-green-600' : 'text-yellow-600'}`}>
                            Description: {ad.descriptionCount}/90
                          </span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                        {ad.cta}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Get Your 30-Day Content Pack?
          </h2>
          <p className="text-xl text-indigo-100 mb-4">
            Get professionally written scripts, cold email sequences, and ad copy tailored to YOUR business.
          </p>
          <p className="text-lg text-indigo-200 mb-8">
            Plus your custom AI spokesperson bringing it all to life. 7-day delivery guaranteed.
          </p>
          <Link
            href="/intake"
            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl mb-6"
          >
            Start Your Intake Form
          </Link>

          {/* Trust Elements */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-indigo-100">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>7-Day Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>100% Satisfaction Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Revision Rounds Included</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
