'use client';

import { useState } from 'react';
import {
  Copy,
  Check,
  ExternalLink,
  Zap,
  Mic,
  Video,
  Globe,
  DollarSign,
  Code,
  Cpu,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  Layers,
  Wifi,
  Volume2,
  Eye,
  Brain,
  ArrowRight,
  PlayCircle,
  Settings,
  Users
} from 'lucide-react';

interface Provider {
  name: string;
  description: string;
  technology: string;
  latency: string;
  pricing: string;
  bestFor: string[];
  pros: string[];
  cons: string[];
  apiType: string;
  website: string;
  docsUrl: string;
  recommended?: boolean;
}

const providers: Provider[] = [
  {
    name: 'Simli',
    description: 'Fast, lifelike AI avatars using 3D Gaussian splatting for real-time lip sync',
    technology: '3D Neural Architecture (Gaussian Splatting)',
    latency: '<300ms',
    pricing: '$10 free credits, then pay-as-you-go (50 min/month free)',
    bestFor: ['Customer support', 'EdTech', 'E-commerce', 'Quick prototyping'],
    pros: [
      'Lowest barrier to entry ($10 free)',
      'Full face animation, not just lips',
      'WebRTC streaming built-in',
      'TypeScript & Python SDKs',
      'No-code widget option'
    ],
    cons: [
      'Newer platform, smaller community',
      'Limited avatar customization',
      'Requires credits for heavy usage'
    ],
    apiType: 'WebRTC + REST',
    website: 'https://www.simli.com/',
    docsUrl: 'https://docs.simli.com/introduction',
    recommended: true
  },
  {
    name: 'D-ID',
    description: 'Enterprise-grade streaming avatars with Agents 2.0 for interactive conversations',
    technology: 'Proprietary Neural Rendering + LLM Integration',
    latency: '<500ms (near-human)',
    pricing: 'API Build ~$18/mo, Enterprise custom',
    bestFor: ['Enterprise', 'Customer service', 'Training', 'Marketing'],
    pros: [
      'Mature platform, large community',
      'Express Avatars (record yourself)',
      'Agents 2.0 with RAG support',
      'Bring your own LLM',
      'REST, WebRTC, JS SDK'
    ],
    cons: [
      'Higher cost at scale',
      'Enterprise features locked behind custom pricing',
      'Processing can be slower than Simli'
    ],
    apiType: 'REST + WebRTC + SDK',
    website: 'https://www.d-id.com/',
    docsUrl: 'https://docs.d-id.com/'
  },
  {
    name: 'HeyGen',
    description: 'Professional AI video platform with streaming avatar for livestreams and chats',
    technology: 'Deep Learning Lip Sync + Voice Cloning',
    latency: '<1000ms',
    pricing: 'Enterprise only (contact sales)',
    bestFor: ['Marketing videos', 'Corporate training', 'Localization'],
    pros: [
      '300+ AI voices, 175+ languages',
      'High-quality video output',
      'Streaming avatar feature',
      'Great for pre-recorded content too'
    ],
    cons: [
      'API only on Enterprise plan',
      'Less focus on real-time interaction',
      'Expensive for small projects'
    ],
    apiType: 'REST (Enterprise)',
    website: 'https://www.heygen.com/',
    docsUrl: 'https://docs.heygen.com/'
  },
  {
    name: 'Beyond Presence (Genesis)',
    description: 'Ultra-low latency (<100ms) hyper-realistic 1080p avatars',
    technology: 'High-Resolution Neural Rendering',
    latency: '<100ms',
    pricing: 'Contact for pricing',
    bestFor: ['Premium experiences', 'Healthcare', 'Finance', 'VIP support'],
    pros: [
      'Best-in-class latency (<100ms)',
      '1080p resolution avatars',
      'Works with OpenAI, ElevenLabs, Cartesia',
      'Most human-like quality'
    ],
    cons: [
      'Premium pricing (enterprise)',
      'Limited public documentation',
      'Newer to market'
    ],
    apiType: 'WebRTC',
    website: 'https://www.beyondpresence.ai/',
    docsUrl: 'https://www.beyondpresence.ai/'
  },
  {
    name: 'Microsoft Azure Avatar',
    description: 'Enterprise Azure service for real-time avatar synthesis with Speech SDK',
    technology: 'Azure Speech Service + Neural TTS',
    latency: '<500ms',
    pricing: 'Azure consumption-based',
    bestFor: ['Enterprise', 'Azure ecosystem', 'Accessibility', 'Kiosks'],
    pros: [
      'Enterprise security & compliance',
      'Integrates with Azure ecosystem',
      'Detailed viseme data for lip sync',
      'Well-documented'
    ],
    cons: [
      'Requires Azure subscription',
      'More complex setup',
      'Less natural than dedicated providers'
    ],
    apiType: 'WebRTC + REST',
    website: 'https://azure.microsoft.com/en-us/products/ai-services/ai-speech',
    docsUrl: 'https://learn.microsoft.com/en-us/azure/ai-services/speech-service/text-to-speech-avatar/real-time-synthesis-avatar'
  }
];

const voiceProviders = [
  {
    name: 'OpenAI Realtime API',
    description: 'Native speech-to-speech with GPT-4o, same tech as ChatGPT Voice Mode',
    technology: 'gpt-realtime model (multimodal S2S)',
    latency: '<500ms end-to-end',
    pricing: '$0.06/min audio input, $0.24/min audio output',
    features: [
      'Direct audio-to-audio (no STT/TTS chain)',
      'Natural interruption handling',
      'Function calling support',
      'WebSocket + WebRTC transport',
      '6 preset voices'
    ],
    useWith: 'Simli, D-ID, Beyond Presence for visual avatar',
    website: 'https://platform.openai.com/docs/guides/realtime',
    recommended: true
  },
  {
    name: 'ElevenLabs Conversational AI',
    description: 'Most natural voice synthesis with real-time agent platform',
    technology: 'Custom turn-taking models + TTS',
    latency: 'Sub-second turnaround',
    pricing: 'Free tier available, paid plans from $5/mo',
    features: [
      'Natural turn-taking (no awkward pauses)',
      'Integrated RAG for knowledge bases',
      'Voice cloning',
      'Multilingual with auto-detection',
      'WebSocket + SDKs (JS, Python, iOS)'
    ],
    useWith: 'Any avatar provider (Simli, D-ID, etc.)',
    website: 'https://elevenlabs.io/conversational-ai'
  },
  {
    name: 'Cartesia',
    description: 'Ultra-fast voice synthesis optimized for conversational AI',
    technology: 'Sonic model (streaming TTS)',
    latency: '<100ms time-to-first-audio',
    pricing: 'Pay-as-you-go',
    features: [
      'Fastest time-to-first-audio',
      'Emotion control',
      'Voice cloning',
      'Streaming output',
      'WebSocket API'
    ],
    useWith: 'Beyond Presence, Simli',
    website: 'https://cartesia.ai/'
  }
];

const openSourceOptions = [
  {
    name: 'TalkingHead (GitHub)',
    description: 'JavaScript class for real-time lip-sync using Ready Player Me 3D avatars',
    repo: 'https://github.com/met4citizen/TalkingHead',
    technology: 'WebGL + Ready Player Me + OpenAI Realtime API',
    pros: ['Free', 'Full source code', 'Works with OpenAI Realtime', 'Used by MIT/Harvard researchers'],
    cons: ['Requires 3D avatar setup', 'More technical setup', 'Limited to Ready Player Me avatars']
  },
  {
    name: 'MuseTalk (Tencent)',
    description: 'High-quality lip-sync at 30+ FPS on GPU, multilingual support',
    repo: 'https://github.com/TMElyralab/MuseTalk',
    technology: 'GAN-based lip sync',
    pros: ['Free', 'Real-time capable (30+ FPS)', 'Works with any face image', 'Multilingual'],
    cons: ['Requires GPU', 'Self-hosted only', 'More complex integration']
  },
  {
    name: 'Wav2Lip',
    description: 'Popular GAN model for realistic lip movements synced to audio',
    repo: 'https://github.com/Rudrabha/Wav2Lip',
    technology: 'GAN-based lip sync',
    pros: ['Free', 'Well-documented', 'Works with any language', 'Large community'],
    cons: ['Requires GPU for real-time', 'Quality varies', 'Needs video processing pipeline']
  },
  {
    name: 'Wawa-Lipsync',
    description: 'Browser-native, real-time lipsync - no server needed',
    repo: 'https://github.com/wawa-lipsync',
    technology: 'Browser audio analysis + viseme mapping',
    pros: ['Runs in browser', 'No server costs', 'Easy integration', 'Works with any audio'],
    cons: ['Less realistic than neural approaches', 'Limited to supported avatar formats']
  }
];

export default function LiveAvatarResearchPage() {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedProvider, setExpandedProvider] = useState<string | null>('Simli');
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'voice' | 'opensource' | 'implementation'>('overview');

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Video className="w-8 h-8 text-green-400" />
            Live Avatar Technology Research
          </h1>
          <p className="text-gray-400">
            Real-time conversational AI avatars with lip-sync - the technology behind ChatGPT Voice Mode and ElevenLabs agents
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'providers', label: 'Avatar Providers', icon: Users },
            { id: 'voice', label: 'Voice APIs', icon: Volume2 },
            { id: 'opensource', label: 'Open Source', icon: Code },
            { id: 'implementation', label: 'Implementation', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* What is this technology */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-400" />
                What is Real-Time Conversational AI?
              </h2>
              <p className="text-gray-300 mb-4">
                This technology combines <strong>three core components</strong> to create live, interactive AI avatars that can converse naturally:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
                  <h3 className="font-semibold text-blue-400 mb-2">1. Speech-to-Speech AI</h3>
                  <p className="text-sm text-gray-400">
                    The brain - processes your voice and generates intelligent responses. OpenAI&apos;s Realtime API does this natively without chaining STT→LLM→TTS.
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-green-500">
                  <h3 className="font-semibold text-green-400 mb-2">2. Voice Synthesis</h3>
                  <p className="text-sm text-gray-400">
                    The voice - converts AI responses to natural-sounding speech. ElevenLabs, Cartesia, or OpenAI&apos;s built-in voices.
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-purple-500">
                  <h3 className="font-semibold text-purple-400 mb-2">3. Avatar Lip-Sync</h3>
                  <p className="text-sm text-gray-400">
                    The face - renders a visual avatar that moves its lips in sync with the audio. Simli, D-ID, or HeyGen handle this.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-4 border border-green-700/50">
                <h4 className="font-semibold text-green-400 mb-2">The Key Insight</h4>
                <p className="text-sm text-gray-300">
                  ChatGPT&apos;s Voice Mode uses OpenAI&apos;s <code className="bg-gray-800 px-1 rounded">gpt-realtime</code> model which processes audio directly -
                  no text conversion. This preserves tone, emotion, and enables natural interruptions. ElevenLabs does similar with their Conversational AI 2.0.
                  The visual avatar layer (lip-sync) is typically a separate service you combine with the voice.
                </p>
              </div>
            </div>

            {/* Architecture Diagram */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Layers className="w-6 h-6 text-cyan-400" />
                System Architecture
              </h2>

              <div className="bg-gray-800 rounded-lg p-6 font-mono text-sm">
                <div className="space-y-4">
                  <div className="text-center text-gray-500 mb-4">Real-Time Conversational Avatar Stack</div>

                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <div className="bg-blue-900/50 border border-blue-500 rounded-lg px-4 py-2 text-blue-300">
                      User Microphone
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                    <div className="bg-purple-900/50 border border-purple-500 rounded-lg px-4 py-2 text-purple-300">
                      WebRTC Stream
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                    <div className="bg-green-900/50 border border-green-500 rounded-lg px-4 py-2 text-green-300">
                      Voice AI (OpenAI/ElevenLabs)
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="border-l-2 border-gray-600 h-8"></div>
                  </div>

                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <div className="bg-yellow-900/50 border border-yellow-500 rounded-lg px-4 py-2 text-yellow-300">
                      Audio Response
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                    <div className="bg-pink-900/50 border border-pink-500 rounded-lg px-4 py-2 text-pink-300">
                      Avatar Renderer (Simli/D-ID)
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                    <div className="bg-cyan-900/50 border border-cyan-500 rounded-lg px-4 py-2 text-cyan-300">
                      Video Stream to User
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-300 mb-2">Transport Protocol</h4>
                  <p className="text-sm text-gray-500">
                    <strong>WebRTC</strong> is the standard for real-time audio/video. It handles peer-to-peer connections with low latency (&lt;300ms).
                    WebSocket is used for control messages.
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-300 mb-2">Latency Target</h4>
                  <p className="text-sm text-gray-500">
                    <strong>&lt;500ms total</strong> for natural conversation. Best providers achieve &lt;300ms. Human conversation typically has 200-400ms response gaps.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Comparison */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                Quick Decision Guide
              </h2>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg p-4 border border-green-700/50">
                  <h4 className="font-semibold text-green-400 mb-2">Best for Getting Started Quickly</h4>
                  <p className="text-sm text-gray-300">
                    <strong>Simli + ElevenLabs Conversational AI</strong> - $10 free credits from Simli, ElevenLabs has free tier.
                    Can have a working demo in hours.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-lg p-4 border border-blue-700/50">
                  <h4 className="font-semibold text-blue-400 mb-2">Best for Enterprise/Production</h4>
                  <p className="text-sm text-gray-300">
                    <strong>D-ID Agents 2.0 + OpenAI Realtime API</strong> - Enterprise security, custom LLM support,
                    mature platform with extensive documentation.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 border border-purple-700/50">
                  <h4 className="font-semibold text-purple-400 mb-2">Best for Highest Quality</h4>
                  <p className="text-sm text-gray-300">
                    <strong>Beyond Presence Genesis</strong> - &lt;100ms latency, 1080p avatars, most human-like.
                    Premium pricing but unmatched quality.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-lg p-4 border border-orange-700/50">
                  <h4 className="font-semibold text-orange-400 mb-2">Best for Self-Hosting/Free</h4>
                  <p className="text-sm text-gray-300">
                    <strong>TalkingHead + OpenAI Realtime</strong> - Open source, full control,
                    only pay for OpenAI API usage. Used by MIT researchers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Providers Tab */}
        {activeTab === 'providers' && (
          <div className="space-y-4">
            {providers.map(provider => (
              <div
                key={provider.name}
                className={`bg-gray-900 rounded-xl border overflow-hidden ${
                  provider.recommended ? 'border-green-500' : 'border-gray-800'
                }`}
              >
                <button
                  onClick={() => setExpandedProvider(expandedProvider === provider.name ? null : provider.name)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {provider.recommended && (
                      <span className="bg-green-500 text-black text-xs px-2 py-1 rounded font-bold">RECOMMENDED</span>
                    )}
                    <div className="text-left">
                      <h3 className="font-bold text-lg">{provider.name}</h3>
                      <p className="text-sm text-gray-400">{provider.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-green-400 bg-green-900/30 px-2 py-1 rounded">{provider.latency}</span>
                    {expandedProvider === provider.name ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {expandedProvider === provider.name && (
                  <div className="p-4 pt-0 border-t border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Technology</h4>
                        <p className="text-sm text-gray-300">{provider.technology}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">API Type</h4>
                        <p className="text-sm text-gray-300">{provider.apiType}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Pricing</h4>
                        <p className="text-sm text-green-400">{provider.pricing}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Best For</h4>
                        <div className="flex flex-wrap gap-1">
                          {provider.bestFor.map(use => (
                            <span key={use} className="text-xs bg-gray-700 px-2 py-1 rounded">{use}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-green-400 mb-2">Pros</h4>
                        <ul className="space-y-1">
                          {provider.pros.map(pro => (
                            <li key={pro} className="text-sm text-gray-300 flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-red-400 mb-2">Cons</h4>
                        <ul className="space-y-1">
                          {provider.cons.map(con => (
                            <li key={con} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-red-400 flex-shrink-0">-</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <a
                        href={provider.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={provider.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Code className="w-4 h-4" />
                        Documentation
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Voice APIs Tab */}
        {activeTab === 'voice' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-700/50 p-6">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Mic className="w-6 h-6 text-purple-400" />
                Understanding Voice AI Options
              </h2>
              <p className="text-gray-300">
                The voice component is separate from the avatar. You need to choose a voice AI provider and connect it to your avatar renderer.
                The best combinations depend on your latency requirements and budget.
              </p>
            </div>

            {voiceProviders.map(provider => (
              <div key={provider.name} className={`bg-gray-900 rounded-xl border p-6 ${
                provider.recommended ? 'border-green-500' : 'border-gray-800'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      {provider.name}
                      {provider.recommended && (
                        <span className="bg-green-500 text-black text-xs px-2 py-1 rounded font-bold">RECOMMENDED</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-400">{provider.description}</p>
                  </div>
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                  >
                    Docs <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Technology</h4>
                    <p className="text-sm text-gray-300">{provider.technology}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Latency</h4>
                    <p className="text-sm text-green-400">{provider.latency}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Pricing</h4>
                    <p className="text-sm text-yellow-400">{provider.pricing}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Key Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {provider.features.map(feature => (
                      <span key={feature} className="text-xs bg-gray-700 px-2 py-1 rounded">{feature}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-cyan-400 mb-1">Best Used With</h4>
                  <p className="text-sm text-gray-300">{provider.useWith}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Open Source Tab */}
        {activeTab === 'opensource' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-xl border border-orange-700/50 p-6">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Code className="w-6 h-6 text-orange-400" />
                Open Source Options
              </h2>
              <p className="text-gray-300">
                For full control, self-hosting, or budget-conscious projects. These require more technical setup but offer complete flexibility.
              </p>
            </div>

            {openSourceOptions.map(option => (
              <div key={option.name} className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{option.name}</h3>
                    <p className="text-sm text-gray-400">{option.description}</p>
                  </div>
                  <a
                    href={option.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-colors"
                  >
                    GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Technology</h4>
                  <p className="text-sm text-purple-400">{option.technology}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-green-400 mb-2">Pros</h4>
                    <ul className="space-y-1">
                      {option.pros.map(pro => (
                        <li key={pro} className="text-sm text-gray-300 flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-red-400 mb-2">Cons</h4>
                    <ul className="space-y-1">
                      {option.cons.map(con => (
                        <li key={con} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-red-400 flex-shrink-0">-</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Implementation Tab */}
        {activeTab === 'implementation' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-xl border border-cyan-700/50 p-6">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Settings className="w-6 h-6 text-cyan-400" />
                Implementation Roadmap
              </h2>
              <p className="text-gray-300">
                Step-by-step guide to implementing live avatars in your projects.
              </p>
            </div>

            {/* Recommended Stack */}
            <div className="bg-gray-900 rounded-xl border border-green-500 p-6">
              <h3 className="font-bold text-lg text-green-400 mb-4">Recommended Stack for BrandVoice</h3>

              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Option A: Fastest to Deploy</h4>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-blue-900/50 border border-blue-500 px-3 py-1 rounded text-blue-300 text-sm">Simli</span>
                    <span className="text-gray-500">+</span>
                    <span className="bg-purple-900/50 border border-purple-500 px-3 py-1 rounded text-purple-300 text-sm">ElevenLabs</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Simli provides a no-code widget. ElevenLabs has pre-built integrations. Can be live in hours.
                  </p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Option B: Most Control</h4>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-blue-900/50 border border-blue-500 px-3 py-1 rounded text-blue-300 text-sm">D-ID API</span>
                    <span className="text-gray-500">+</span>
                    <span className="bg-green-900/50 border border-green-500 px-3 py-1 rounded text-green-300 text-sm">OpenAI Realtime</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    D-ID allows custom LLMs. OpenAI Realtime is native speech-to-speech. More setup but full control.
                  </p>
                </div>
              </div>
            </div>

            {/* Code Examples */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="font-bold text-lg mb-4">Quick Start Code</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-400">Simli Client (TypeScript)</h4>
                    <button
                      onClick={() => copyToClipboard(`import { SimliClient } from 'simli-client';

const client = new SimliClient();

await client.initialize({
  apiKey: 'your-api-key',
  faceId: 'your-face-id',
});

// Start streaming audio to avatar
client.sendAudioData(audioBuffer);`, 'simli-code')}
                      className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded flex items-center gap-1"
                    >
                      {copiedField === 'simli-code' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </button>
                  </div>
                  <pre className="bg-gray-800 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
{`import { SimliClient } from 'simli-client';

const client = new SimliClient();

await client.initialize({
  apiKey: 'your-api-key',
  faceId: 'your-face-id',
});

// Start streaming audio to avatar
client.sendAudioData(audioBuffer);`}
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-400">OpenAI Realtime (WebSocket)</h4>
                    <button
                      onClick={() => copyToClipboard(`const ws = new WebSocket('wss://api.openai.com/v1/realtime');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'session.update',
    session: {
      model: 'gpt-4o-realtime-preview',
      voice: 'alloy',
      modalities: ['audio', 'text']
    }
  }));
};

// Send audio input
ws.send(JSON.stringify({
  type: 'input_audio_buffer.append',
  audio: base64AudioData
}));`, 'openai-code')}
                      className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded flex items-center gap-1"
                    >
                      {copiedField === 'openai-code' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </button>
                  </div>
                  <pre className="bg-gray-800 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
{`const ws = new WebSocket('wss://api.openai.com/v1/realtime');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'session.update',
    session: {
      model: 'gpt-4o-realtime-preview',
      voice: 'alloy',
      modalities: ['audio', 'text']
    }
  }));
};

// Send audio input
ws.send(JSON.stringify({
  type: 'input_audio_buffer.append',
  audio: base64AudioData
}));`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl border border-yellow-700/50 p-6">
              <h3 className="font-bold text-lg text-yellow-400 mb-4">Project Ideas for BrandVoice</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-900/50 rounded-full flex items-center justify-center text-yellow-400 font-bold">1</div>
                  <div>
                    <h4 className="font-medium">AI Sales Rep Widget</h4>
                    <p className="text-sm text-gray-400">Embed on client websites - avatar answers product questions 24/7</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-900/50 rounded-full flex items-center justify-center text-yellow-400 font-bold">2</div>
                  <div>
                    <h4 className="font-medium">Interactive Demo Builder</h4>
                    <p className="text-sm text-gray-400">Let prospects talk to an AI version of the spokesperson before buying</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-900/50 rounded-full flex items-center justify-center text-yellow-400 font-bold">3</div>
                  <div>
                    <h4 className="font-medium">Training & Onboarding</h4>
                    <p className="text-sm text-gray-400">Interactive avatar coaches for client employee training</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-900/50 rounded-full flex items-center justify-center text-yellow-400 font-bold">4</div>
                  <div>
                    <h4 className="font-medium">Live Event Moderator</h4>
                    <p className="text-sm text-gray-400">AI avatar that can host webinars and answer live Q&A</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
