'use client'

import { useState } from 'react'
import {
  Mail,
  Video,
  Zap,
  DollarSign,
  Users,
  Target,
  Calculator,
  ExternalLink,
  Copy,
  Check,
  Workflow,
  MessageSquare,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Play,
  Monitor,
  Heart,
  Search,
  Lightbulb,
  Award,
  Presentation,
  Gift,
  Calendar
} from 'lucide-react'

export default function ColdOutreachPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [emailVolume, setEmailVolume] = useState(1000)
  const [videoLength, setVideoLength] = useState(5) // 5 minutes default
  const [responseRate, setResponseRate] = useState(15) // 15% assumed

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Cost calculations for 5-minute personalized video
  const calculateCosts = () => {
    const videoMinutes = videoLength

    // Per-video costs
    const syncSoCostPerMin = 3.00 // $0.05/sec = $3/min
    const lipSyncCost = videoMinutes * syncSoCostPerMin

    // ElevenLabs TTS (5 min = ~750-900 words = ~4500 chars)
    const charsPerMin = 900 // ~150 words/min * 6 chars/word
    const totalChars = videoMinutes * charsPerMin
    const elevenLabsCost = (totalChars / 1000) * 0.20 // $0.20 per 1k chars

    // GPT-4 for script personalization (~500 tokens in, ~1000 out)
    const gpt4InputCost = 0.01 // ~$0.01 per 1k input tokens
    const gpt4OutputCost = 0.03 // ~$0.03 per 1k output tokens
    const gptCost = 0.015 + 0.045 // Approx per personalization

    // n8n cloud (Pro plan ~$50/mo for 10k executions)
    const n8nCostPerExec = 0.005

    // Loom hosting (Business $12.50/user/mo, unlimited videos)
    const loomMonthlyCost = 12.50
    const loomPerVideo = loomMonthlyCost / 100 // Assuming 100 videos/mo

    const perVideoCost = lipSyncCost + elevenLabsCost + gptCost + n8nCostPerExec + loomPerVideo
    const monthlyTotal = perVideoCost * emailVolume

    return {
      lipSyncCost: lipSyncCost.toFixed(2),
      ttsCost: elevenLabsCost.toFixed(2),
      gptCost: gptCost.toFixed(3),
      n8nCost: n8nCostPerExec.toFixed(3),
      loomCost: loomPerVideo.toFixed(3),
      perVideoCost: perVideoCost.toFixed(2),
      monthlyTotal: monthlyTotal.toFixed(2),
      expectedResponses: Math.round(emailVolume * (responseRate / 100)),
      costPerResponse: (monthlyTotal / (emailVolume * (responseRate / 100))).toFixed(2),
    }
  }

  const costs = calculateCosts()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-10 h-10" />
          <div>
            <h1 className="text-3xl font-bold">Cold Outreach Strategy</h1>
            <p className="text-purple-100">Personalized 5-Min Loom Videos at Scale</p>
          </div>
        </div>
        <p className="text-lg text-purple-100 max-w-3xl">
          Inspired by Nick Abraham&apos;s hyper-personalization framework - but instead of text,
          we&apos;re sending custom AI-generated video pitches to B2B prospects.
        </p>
      </div>

      {/* Nick Abraham Strategy Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Nick Abraham&apos;s Cold Email Framework</h2>
          <a
            href="https://www.leadbird.io/resources/cold-email-outreach-masterclass-ft-nick-abraham"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Core Principles</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span><strong>Hyper-Personalization:</strong> Make every email feel manually written specifically for them</span>
              </li>
              <li className="flex items-start gap-2">
                <Users className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span><strong>Intent Signals:</strong> Scrape competitor LinkedIn followers for warm leads</span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span><strong>Demand Gen &gt; Demand Capture:</strong> Create new demand rather than capturing existing</span>
              </li>
              <li className="flex items-start gap-2">
                <MessageSquare className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <span><strong>Value-First CTA:</strong> Offer free audits/resources, ask for interest not calls</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Nick&apos;s Tools Stack</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Quicklines</span>
                <span className="text-purple-600 font-medium">AI personalized intros</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Scrubby</span>
                <span className="text-purple-600 font-medium">Email validation</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Inboxy</span>
                <span className="text-purple-600 font-medium">Email warmup</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Smartlead</span>
                <span className="text-purple-600 font-medium">Cold email sending</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-purple-200">
              <p className="text-sm text-gray-700">
                <strong>His Results:</strong> 1.5M+ cold emails/month, 40%+ response rates with hyper-personalization
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-800">Our Differentiation</h4>
              <p className="text-amber-700 text-sm">
                Instead of personalized text emails, we send 5-minute personalized Loom-style videos
                with AI lipsync - exponentially more engaging and impossible for competitors to replicate at scale.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The Video Strategy */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Video className="w-6 h-6 text-pink-600" />
          <h2 className="text-xl font-bold text-gray-900">5-Minute Personalized Video Strategy</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Video Structure */}
          <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-xl p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Video Structure (5 min)</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <p className="font-medium text-gray-800">Hook (0-30s)</p>
                  <p className="text-sm text-gray-600">&quot;Hey [Name], I saw [specific thing about their business]...&quot;</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <p className="font-medium text-gray-800">Pain Point (30s-1.5m)</p>
                  <p className="text-sm text-gray-600">Identify their specific challenge based on research</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <p className="font-medium text-gray-800">Solution Demo (1.5m-4m)</p>
                  <p className="text-sm text-gray-600">Show how AI spokesperson videos solve their content problem</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                <div>
                  <p className="font-medium text-gray-800">CTA (4m-5m)</p>
                  <p className="text-sm text-gray-600">&quot;Reply if you&apos;d like a free custom video sample&quot;</p>
                </div>
              </div>
            </div>
          </div>

          {/* Personalization Variables */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Personalization Variables</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-white rounded border border-blue-200">
                <code className="text-blue-600">{`{{first_name}}`}</code>
                <span className="text-gray-600 ml-2">Prospect&apos;s name</span>
              </div>
              <div className="p-2 bg-white rounded border border-blue-200">
                <code className="text-blue-600">{`{{company}}`}</code>
                <span className="text-gray-600 ml-2">Company name</span>
              </div>
              <div className="p-2 bg-white rounded border border-blue-200">
                <code className="text-blue-600">{`{{industry}}`}</code>
                <span className="text-gray-600 ml-2">Fitness, e-comm, etc.</span>
              </div>
              <div className="p-2 bg-white rounded border border-blue-200">
                <code className="text-blue-600">{`{{pain_point}}`}</code>
                <span className="text-gray-600 ml-2">GPT-generated insight</span>
              </div>
              <div className="p-2 bg-white rounded border border-blue-200">
                <code className="text-blue-600">{`{{social_proof}}`}</code>
                <span className="text-gray-600 ml-2">Industry-specific case</span>
              </div>
              <div className="p-2 bg-white rounded border border-blue-200">
                <code className="text-blue-600">{`{{custom_hook}}`}</code>
                <span className="text-gray-600 ml-2">Recent post/news about them</span>
              </div>
            </div>
          </div>

          {/* Target Markets */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Target B2B Markets</h3>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border border-green-200">
                <p className="font-medium text-gray-800">Fitness Studios & Gyms</p>
                <p className="text-xs text-gray-600">Need constant content for social</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-green-200">
                <p className="font-medium text-gray-800">E-commerce Brands</p>
                <p className="text-xs text-gray-600">UGC-style ads perform best</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-green-200">
                <p className="font-medium text-gray-800">Local Service Businesses</p>
                <p className="text-xs text-gray-600">Restaurants, salons, clinics</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-green-200">
                <p className="font-medium text-gray-800">Marketing Agencies</p>
                <p className="text-xs text-gray-600">White-label opportunity</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-green-200">
                <p className="font-medium text-gray-800">Course Creators</p>
                <p className="text-xs text-gray-600">Need promotional content</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED LOOM SCRIPT STRUCTURE - 8 Phases */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Play className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-bold text-gray-900">Detailed 5-Min Loom Script Structure</h2>
          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">For Automation</span>
        </div>

        <p className="text-gray-600 mb-6">
          This is the exact script structure for personalized Loom-style cold outreach videos.
          Each phase has specific wording that will be templated for n8n automation.
        </p>

        {/* Phase Grid */}
        <div className="space-y-4">

          {/* PHASE 1: Screen Share Opening */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
            <div className="ml-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Phase 1: Screen Share Opening</h3>
                  <span className="text-xs text-blue-600">0:00-0:15 • Their website/social on screen</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <p className="text-gray-800 italic">
                  &quot;Hey, <span className="bg-green-100 text-green-700 px-1 rounded font-mono text-sm">{`{{first_name}}`}</span>! I hope <span className="bg-green-100 text-green-700 px-1 rounded font-mono text-sm">{`{{current_promo_reference}}`}</span> is going well for you!&quot;
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  <strong>Visual:</strong> Share their website or one of their social channels on screen so they know this was filmed specifically for them.
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Screen share active</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Personalized greeting</span>
              </div>
            </div>
          </div>

          {/* PHASE 2: Fan Connection */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 to-rose-600 rounded-full"></div>
            <div className="ml-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-5 border border-pink-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Phase 2: Fan Connection</h3>
                  <span className="text-xs text-pink-600">0:15-0:30 • Build genuine rapport</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-pink-100">
                <p className="text-gray-800 italic">
                  &quot;The reason I&apos;m filming this is because I&apos;ve been a huge fan of your content, and I really resonate with your mission.&quot;
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  <strong>Purpose:</strong> Establish authentic connection. This isn&apos;t a cold pitch - you genuinely follow and appreciate their work.
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">Genuine appreciation</span>
                <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">Mission alignment</span>
              </div>
            </div>
          </div>

          {/* PHASE 3: Research Hook */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></div>
            <div className="ml-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Phase 3: Research Hook</h3>
                  <span className="text-xs text-amber-600">0:30-1:00 • Show you did your homework</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-amber-100">
                <p className="text-gray-800 italic">
                  &quot;So when I saw your post about <span className="bg-green-100 text-green-700 px-1 rounded font-mono text-sm">{`{{recent_post_topic}}`}</span>, I got curious why you&apos;re not doing <span className="bg-green-100 text-green-700 px-1 rounded font-mono text-sm">{`{{opportunity_gap}}`}</span>, and, after digging in, I couldn&apos;t help myself but put together this <span className="bg-green-100 text-green-700 px-1 rounded font-mono text-sm">{`{{strategy_name}}`}</span>.&quot;
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  <strong>Key:</strong> Reference something specific you saw them post. Identify a gap/opportunity they&apos;re missing. Present your solution as something you created FOR them.
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Specific reference</span>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Gap identification</span>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Custom strategy</span>
              </div>
            </div>
          </div>

          {/* PHASE 4: Value Proposition */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
            <div className="ml-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Phase 4: Value Proposition</h3>
                  <span className="text-xs text-green-600">1:00-1:15 • The big promise + transition</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <p className="text-gray-800 italic">
                  &quot;This will allow you to triple the amount of customers you get from the content you&apos;re already posting if you just shift the way that you&apos;re converting people... let me explain.&quot;
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  <strong>Transition:</strong> &quot;Let me explain&quot; signals you&apos;re about to switch to your credibility slide / Google Slides presentation.
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Big promise</span>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Leverage existing content</span>
              </div>
            </div>
          </div>

          {/* PHASE 5: Credibility Slide */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-violet-600 rounded-full"></div>
            <div className="ml-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Phase 5: Credibility Slide</h3>
                  <span className="text-xs text-purple-600">1:15-1:45 • Switch to Google Slides</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <p className="text-gray-800 italic">
                  &quot;This whole system uses strategies backed by <span className="bg-green-100 text-green-700 px-1 rounded font-mono text-sm">{`{{credibility_proof}}`}</span>.&quot;
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  <strong>Visual:</strong> Switch from their website to your credibility slide in Google Slides. Show logos, results, testimonials, case studies.
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Google Slides</span>
                <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full">Social proof</span>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Case studies</span>
              </div>
            </div>
          </div>

          {/* PHASE 6: Strategy Walkthrough + Teaser */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-blue-600 rounded-full"></div>
            <div className="ml-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                  <Presentation className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Phase 6: Strategy Walkthrough + Teaser</h3>
                  <span className="text-xs text-indigo-600">1:45-4:00 • Walk through your strategy slides</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-indigo-100">
                <p className="text-gray-800 mb-3">
                  <strong>During walkthrough:</strong> Frame your services as a strategy you&apos;re walking them through, not a sales pitch.
                </p>
                <p className="text-gray-800 italic">
                  After explaining: &quot;Now everything I&apos;ve shared is just 5% of what <span className="bg-green-100 text-green-700 px-1 rounded font-mono text-sm">{`{{solution_name}}`}</span> can do.&quot;
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  <strong>Purpose:</strong> Give genuine value while teasing there&apos;s much more. Creates curiosity and positions you as the expert who can unlock the full potential.
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Value-first teaching</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">5% teaser</span>
              </div>
            </div>
          </div>

          {/* PHASE 7: Soft CTA */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-cyan-600 rounded-full"></div>
            <div className="ml-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-5 border border-teal-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Phase 7: Soft CTA</h3>
                  <span className="text-xs text-teal-600">4:00-4:30 • Give them options</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-teal-100">
                <p className="text-gray-800 italic">
                  &quot;I hope that this is helpful and that you either take this and run with it, or that we have the opportunity to dive into it on a call.&quot;
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  <strong>Key:</strong> Give them permission to just take the value and run - no pressure. This builds trust and paradoxically increases conversions.
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">No pressure</span>
                <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">Two options</span>
              </div>
            </div>
          </div>

          {/* PHASE 8: Meeting Request */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-rose-600 rounded-full"></div>
            <div className="ml-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Phase 8: Meeting Request</h3>
                  <span className="text-xs text-red-600">4:30-5:00 • Clear next step</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-red-100">
                <p className="text-gray-800 italic">
                  &quot;Let me know if you can meet for 15 minutes in the next few days. At the bottom of the video, I&apos;ll give you a link to choose your time. Hope to talk to you soon!&quot;
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  <strong>Execution:</strong> Include Calendly/booking link below the video. Make it easy - just 15 minutes, their choice of time.
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">15-min ask</span>
                <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">Calendly link below</span>
              </div>
            </div>
          </div>
        </div>

        {/* Automation Variables Summary */}
        <div className="mt-8 bg-gray-900 rounded-xl p-6 text-white">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Personalization Variables for n8n Automation
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <code className="bg-green-500/20 text-green-400 px-2 py-1 rounded">{`{{first_name}}`}</code>
                <span className="text-gray-400">Prospect&apos;s first name</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="bg-green-500/20 text-green-400 px-2 py-1 rounded">{`{{current_promo_reference}}`}</code>
                <span className="text-gray-400">Current promotion/launch they&apos;re running</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="bg-green-500/20 text-green-400 px-2 py-1 rounded">{`{{recent_post_topic}}`}</code>
                <span className="text-gray-400">Topic from their recent social post</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="bg-green-500/20 text-green-400 px-2 py-1 rounded">{`{{opportunity_gap}}`}</code>
                <span className="text-gray-400">What they&apos;re missing/not doing</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <code className="bg-green-500/20 text-green-400 px-2 py-1 rounded">{`{{strategy_name}}`}</code>
                <span className="text-gray-400">Name of your custom strategy</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="bg-green-500/20 text-green-400 px-2 py-1 rounded">{`{{credibility_proof}}`}</code>
                <span className="text-gray-400">Your social proof/credentials</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="bg-green-500/20 text-green-400 px-2 py-1 rounded">{`{{solution_name}}`}</code>
                <span className="text-gray-400">Your product/service name</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="bg-green-500/20 text-green-400 px-2 py-1 rounded">{`{{calendly_link}}`}</code>
                <span className="text-gray-400">Your booking link</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copy Full Script Template Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => copyToClipboard(loomScriptTemplate, 'loom-script')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all font-semibold shadow-lg"
          >
            {copiedId === 'loom-script' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copiedId === 'loom-script' ? 'Copied to Clipboard!' : 'Copy Full Loom Script Template'}
          </button>
        </div>
      </div>

      {/* n8n Automation Flow */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Workflow className="w-6 h-6 text-orange-600" />
          <h2 className="text-xl font-bold text-gray-900">n8n Automation Pipeline</h2>
        </div>

        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 rounded-xl p-6">
          <div className="flex flex-wrap items-center gap-4 justify-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                <Users className="w-8 h-8" />
              </div>
              <p className="text-xs text-center mt-2 font-medium">Lead List<br/>CSV/Airtable</p>
            </div>
            <div className="text-orange-400 text-2xl">→</div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-amber-500 rounded-xl flex items-center justify-center text-white">
                <Sparkles className="w-8 h-8" />
              </div>
              <p className="text-xs text-center mt-2 font-medium">GPT-4<br/>Script Gen</p>
            </div>
            <div className="text-amber-400 text-2xl">→</div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center text-white">
                <MessageSquare className="w-8 h-8" />
              </div>
              <p className="text-xs text-center mt-2 font-medium">ElevenLabs<br/>TTS</p>
            </div>
            <div className="text-yellow-400 text-2xl">→</div>

            {/* Step 4 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-pink-500 rounded-xl flex items-center justify-center text-white">
                <Video className="w-8 h-8" />
              </div>
              <p className="text-xs text-center mt-2 font-medium">Sync.so<br/>Lip Sync</p>
            </div>
            <div className="text-pink-400 text-2xl">→</div>

            {/* Step 5 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center text-white">
                <Video className="w-8 h-8" />
              </div>
              <p className="text-xs text-center mt-2 font-medium">Loom/Cloud<br/>Upload</p>
            </div>
            <div className="text-purple-400 text-2xl">→</div>

            {/* Step 6 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                <Mail className="w-8 h-8" />
              </div>
              <p className="text-xs text-center mt-2 font-medium">Smartlead<br/>Send Email</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Base Video Template</h4>
            <p className="text-sm text-gray-600">
              Record one 5-minute &quot;skeleton&quot; video with placeholder speech. The AI lip-syncs
              your face to the personalized TTS audio for each prospect.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Scaling Strategy</h4>
            <p className="text-sm text-gray-600">
              Start with 50/day, scale to 200/day. Each video takes ~3-5 min to process.
              Batch overnight for next-day sending.
            </p>
          </div>
        </div>
      </div>

      {/* Cost Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">Cost Analysis Calculator</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Email Volume: <span className="text-purple-600 font-bold">{emailVolume.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={emailVolume}
                onChange={(e) => setEmailVolume(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>100</span>
                <span>5,000</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Length: <span className="text-purple-600 font-bold">{videoLength} minutes</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={videoLength}
                onChange={(e) => setVideoLength(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 min</span>
                <span>10 min</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Response Rate: <span className="text-purple-600 font-bold">{responseRate}%</span>
              </label>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={responseRate}
                onChange={(e) => setResponseRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5%</span>
                <span>40%</span>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Cost Per Video ({videoLength} min)</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Sync.so Lip Sync ($3/min)</span>
                <span className="font-medium text-gray-800">${costs.lipSyncCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ElevenLabs TTS (~$0.20/1k chars)</span>
                <span className="font-medium text-gray-800">${costs.ttsCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GPT-4 Script Personalization</span>
                <span className="font-medium text-gray-800">${costs.gptCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">n8n Automation (per exec)</span>
                <span className="font-medium text-gray-800">${costs.n8nCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Loom/Hosting (amortized)</span>
                <span className="font-medium text-gray-800">${costs.loomCost}</span>
              </div>

              <div className="border-t border-green-300 pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-800">Per Video Total</span>
                  <span className="text-green-600">${costs.perVideoCost}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Projections */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          <div className="bg-purple-100 rounded-xl p-5 text-center">
            <p className="text-sm text-purple-700 mb-1">Monthly Video Cost</p>
            <p className="text-3xl font-bold text-purple-800">${Number(costs.monthlyTotal).toLocaleString()}</p>
          </div>
          <div className="bg-blue-100 rounded-xl p-5 text-center">
            <p className="text-sm text-blue-700 mb-1">Expected Responses</p>
            <p className="text-3xl font-bold text-blue-800">{costs.expectedResponses}</p>
          </div>
          <div className="bg-green-100 rounded-xl p-5 text-center">
            <p className="text-sm text-green-700 mb-1">Cost Per Response</p>
            <p className="text-3xl font-bold text-green-800">${costs.costPerResponse}</p>
          </div>
          <div className="bg-amber-100 rounded-xl p-5 text-center">
            <p className="text-sm text-amber-700 mb-1">If 10% Convert @ $1,500</p>
            <p className="text-3xl font-bold text-amber-800">${(costs.expectedResponses * 0.1 * 1500).toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">ROI Analysis</h4>
          <p className="text-blue-700 text-sm">
            At {emailVolume.toLocaleString()} videos/month with {responseRate}% response rate, you get <strong>{costs.expectedResponses} warm leads</strong>.
            If 10% of those convert at $1,500 average sale = <strong>${(costs.expectedResponses * 0.1 * 1500).toLocaleString()} revenue</strong> on
            ${Number(costs.monthlyTotal).toLocaleString()} spend = <strong>{((costs.expectedResponses * 0.1 * 1500) / Number(costs.monthlyTotal) * 100).toFixed(0)}% ROI</strong>.
          </p>
        </div>
      </div>

      {/* Monthly Fixed Costs */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="w-6 h-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900">Monthly Fixed Costs (Infrastructure)</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-800">n8n Cloud Pro</span>
              <span className="text-emerald-600 font-bold">$50/mo</span>
            </div>
            <p className="text-xs text-gray-600">10,000 executions included</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-800">Sync.so Hobbyist</span>
              <span className="text-emerald-600 font-bold">$5/mo</span>
            </div>
            <p className="text-xs text-gray-600">+ $3/min usage</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-800">ElevenLabs Pro</span>
              <span className="text-emerald-600 font-bold">$82.50/mo</span>
            </div>
            <p className="text-xs text-gray-600">~500k chars included</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-800">Loom Business</span>
              <span className="text-emerald-600 font-bold">$12.50/mo</span>
            </div>
            <p className="text-xs text-gray-600">Unlimited videos, custom branding</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-800">Smartlead</span>
              <span className="text-emerald-600 font-bold">$39/mo</span>
            </div>
            <p className="text-xs text-gray-600">Cold email sending + warmup</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-800">OpenAI GPT-4</span>
              <span className="text-emerald-600 font-bold">~$20/mo</span>
            </div>
            <p className="text-xs text-gray-600">Pay-as-you-go</p>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-5 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-emerald-100">Total Fixed Monthly</p>
              <p className="text-3xl font-bold">~$209/mo</p>
            </div>
            <div className="text-right">
              <p className="text-emerald-100">+ Variable (at 1k videos)</p>
              <p className="text-3xl font-bold">~${Number(costs.monthlyTotal).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Key Resources</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Nick Abraham Masterclass', url: 'https://www.leadbird.io/resources/cold-email-outreach-masterclass-ft-nick-abraham' },
            { title: 'Nick\'s Hyper-Personalization Framework', url: 'https://www.coldsend.pro/playbooks/nick-abraham-hyper-personalization-framework' },
            { title: 'Sync.so Pricing Calculator', url: 'https://sync.so/calculator' },
            { title: 'Sync.so API Docs', url: 'https://docs.sync.so/models/lipsync' },
            { title: 'ElevenLabs API Pricing', url: 'https://elevenlabs.io/pricing/api' },
            { title: 'n8n Workflow Templates', url: 'https://n8n.io/workflows' },
          ].map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-purple-600" />
              <span className="text-gray-700 text-sm">{link.title}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Script Template */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Script Template (GPT Prompt)</h2>
          <button
            onClick={() => copyToClipboard(scriptTemplate, 'script')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
          >
            {copiedId === 'script' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedId === 'script' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
          {scriptTemplate}
        </pre>
      </div>
    </div>
  )
}

const scriptTemplate = `You are a personalized video script writer for cold outreach. Generate a 5-minute video script for the following prospect:

PROSPECT INFO:
- Name: {{first_name}} {{last_name}}
- Company: {{company}}
- Industry: {{industry}}
- Role: {{title}}
- Recent LinkedIn post/activity: {{recent_activity}}

YOUR PERSONA:
- Name: [Your name]
- Company: BrandVoice.AI
- Offering: AI spokesperson video production for businesses

SCRIPT STRUCTURE (exactly 5 minutes):

**[0:00-0:30] HOOK - Personal Connection**
Start with "Hey {{first_name}}!" and reference something SPECIFIC about their company or recent post. Make it clear you did your research.

**[0:30-1:30] PAIN POINT - Industry Problem**
Identify the content challenge in their industry. For {{industry}}, focus on:
- Time spent creating video content
- Cost of hiring creators/influencers
- Inconsistent posting hurting engagement
- Competitors outpacing them on social

**[1:30-4:00] SOLUTION DEMO**
Explain how AI spokesperson videos solve this:
1. Custom avatar that looks/sounds like a real person
2. 30 videos per month, delivered in days
3. Consistent brand voice across all content
4. Fraction of the cost of traditional video production
5. Show a quick example (reference sample reel)

**[4:00-5:00] SOFT CTA**
- Offer something FREE (sample video for their brand)
- Ask for interest, not a call: "If this sounds interesting, just reply and I'll create a free 30-second sample using your brand."
- End with "Looking forward to hearing from you, {{first_name}}!"

TONE: Conversational, helpful, not salesy. Like you're giving free advice to a friend.

OUTPUT: The complete 5-minute script with timestamps and natural speech patterns (include "um", pauses, conversational fillers to sound human).`

const loomScriptTemplate = `=== 5-MINUTE PERSONALIZED LOOM VIDEO SCRIPT ===
For n8n Automation with AI Lip Sync

PERSONALIZATION VARIABLES:
- {{first_name}} - Prospect's first name
- {{current_promo_reference}} - Something they're currently promoting/launching
- {{recent_post_topic}} - Topic from their recent social media post
- {{opportunity_gap}} - What they're not doing that they should be
- {{strategy_name}} - Name of your custom strategy for them
- {{credibility_proof}} - Your social proof/credentials
- {{solution_name}} - Your product/service name
- {{calendly_link}} - Your booking link

=== SCRIPT STRUCTURE ===

**PHASE 1: SCREEN SHARE OPENING (0:00-0:15)**
[VISUAL: Share their website or one of their social channels on screen]
"Hey, {{first_name}}! I hope {{current_promo_reference}} is going well for you!"

**PHASE 2: FAN CONNECTION (0:15-0:30)**
"The reason I'm filming this is because I've been a huge fan of your content, and I really resonate with your mission."

**PHASE 3: RESEARCH HOOK (0:30-1:00)**
"So when I saw your post about {{recent_post_topic}}, I got curious why you're not doing {{opportunity_gap}}, and, after digging in, I couldn't help myself but put together this {{strategy_name}}."

**PHASE 4: VALUE PROPOSITION + TRANSITION (1:00-1:15)**
"This will allow you to triple the amount of customers you get from the content you're already posting if you just shift the way that you're converting people... let me explain."

**PHASE 5: CREDIBILITY SLIDE (1:15-1:45)**
[VISUAL: Switch to Google Slides - show credibility slide]
"This whole system uses strategies backed by {{credibility_proof}}."

**PHASE 6: STRATEGY WALKTHROUGH + TEASER (1:45-4:00)**
[VISUAL: Walk through your strategy slides in Google Slides]
[Frame your services as a strategy walkthrough, not a sales pitch]
[After explaining the strategy:]
"Now everything I've shared is just 5% of what {{solution_name}} can do."

**PHASE 7: SOFT CTA (4:00-4:30)**
"I hope that this is helpful and that you either take this and run with it, or that we have the opportunity to dive into it on a call."

**PHASE 8: MEETING REQUEST (4:30-5:00)**
"Let me know if you can meet for 15 minutes in the next few days. At the bottom of the video, I'll give you a link to choose your time. Hope to talk to you soon!"
[INCLUDE: {{calendly_link}} below the video]

=== AUTOMATION NOTES ===
- Record ONE skeleton video with placeholder audio
- GPT-4 personalizes script for each prospect
- ElevenLabs generates personalized TTS audio
- Sync.so lip-syncs your face to the new audio
- Upload to Loom/cloud storage
- Smartlead sends email with embedded video link

=== KEY PRINCIPLES ===
1. SCREEN SHARE - Show their website/social so they KNOW it's for them
2. FAN CONNECTION - You're not cold, you genuinely follow their work
3. SPECIFIC REFERENCE - Reference something they actually posted
4. VALUE FIRST - Give them actionable strategy they can use
5. 5% TEASER - Leave them wanting more
6. NO PRESSURE - Let them take it and run OR book a call
7. EASY CTA - Just 15 minutes, their choice of time`
