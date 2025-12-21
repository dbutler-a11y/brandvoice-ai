'use client'

import { useState } from 'react'
import { BookOpen, Key, Video, Cpu, ExternalLink, Copy, Check, Plus } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ResearchNote {
  id: string
  category: 'auth' | 'video' | 'ai' | 'other'
  title: string
  date: string
  content: string
  links?: { title: string; url: string }[]
  tags?: string[]
}

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState<'auth' | 'video' | 'ai' | 'other'>('video')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const researchNotes: ResearchNote[] = [
    // Authentication Notes
    {
      id: 'auth-providers-2025',
      category: 'auth',
      title: 'Authentication Providers Comparison',
      date: '2025-12-18',
      content: `## Why Auth is Hard

**Supabase + OAuth Complexity:**
- OAuth flows require precise state management
- PKCE (Proof Key for Code Exchange) adds security but complexity
- Redirect URI mismatches, cookie issues, session sync
- Next.js App Router + Server Components add layers

## Top Paid Providers

| Provider | Free Tier | Paid | Best For |
|----------|-----------|------|----------|
| **Clerk** | 10,000 MAU | ~$25/mo | Best DX, Next.js native |
| **Kinde** | 10,500 MAU | ~$25/mo | Simple setup, good free tier |
| **Auth0** | 7,500 MAU | ~$23/mo | Enterprise features |
| **Stytch** | 5,000 MAU | Custom | Passwordless focus |
| **WorkOS** | Pay per user | Custom | B2B/Enterprise SSO |

## Recommendation: Clerk

- Pre-built components (<SignIn/>, <UserButton/>)
- Middleware is 5 lines vs 60
- No PKCE/callback issues
- Works perfectly with App Router

\`\`\`tsx
// Clerk middleware - that's it!
import { clerkMiddleware } from '@clerk/nextjs/server'
export default clerkMiddleware()
\`\`\``,
      links: [
        { title: 'Clerk Docs', url: 'https://clerk.com/docs' },
        { title: 'Kinde Docs', url: 'https://kinde.com/docs' },
        { title: 'Auth0 Docs', url: 'https://auth0.com/docs' },
      ],
      tags: ['auth', 'clerk', 'supabase', 'oauth'],
    },

    // Video AI Notes
    {
      id: 'wan-2-6-overview',
      category: 'video',
      title: 'Wan 2.6 - Alibaba AI Video Model (Dec 2025)',
      date: '2025-12-18',
      content: `## Overview

Wan 2.6 is Alibaba's latest AI video model, released December 16, 2025. China's first AI video model with role-playing capabilities.

## Key Capabilities

### Multi-Shot Video Generation
- First model to generate multi-shot narratives from simple prompts
- Maintains character, scene, and element consistency across shots
- Converts prompts into multi-shot scripts automatically

### Specifications
- **Duration:** Up to 15 seconds
- **Resolution:** 1080p
- **Audio:** Native audio-visual synchronization
- **Lip-sync:** Precise lip-sync capability

### Model Variants
- **Wan2.6-T2V:** Text-to-Video
- **Wan2.6-I2V:** Image-to-Video
- **Wan2.6-R2V:** Reference-to-Video (use your likeness/voice)
- **Wan2.6-image:** Image generation
- **Wan2.6-T2I:** Text-to-Image

### Reference-to-Video (R2V)
- Insert yourself into AI-generated scenes
- Maintains visual likeness AND voice
- Works with people, animals, objects
- Consistent across scenes

## For UGC Content

**YES - Highly Suitable for UGC:**
- Multi-shot = hook + content + CTA in one generation
- Character consistency = same "creator" across shots
- Audio sync = natural lip movement
- B-roll generation with scene consistency

## Access
- Alibaba Cloud Bailian
- Wanxiang website
- Kie.ai API`,
      links: [
        { title: 'Wan 2.6 Official', url: 'https://wan2.video/wan2.6' },
        { title: 'Kie.ai (API Access)', url: 'https://kie.ai' },
        { title: 'WaveSpeed AI', url: 'https://wavespeed.ai' },
        { title: 'Alibaba Cloud Blog', url: 'https://www.alibabacloud.com/blog/alibaba-unveils-wan2-6-series-enabling-everyone-to-star-in-videos_602742' },
        { title: 'Apatero Guide', url: 'https://apatero.com/blog/wan-2-6-complete-guide-multi-shot-video-generation-2025' },
      ],
      tags: ['wan', 'alibaba', 'video-ai', 'ugc', 'multi-shot'],
    },
    {
      id: 'wan-2-6-ugc-test',
      category: 'video',
      title: 'Wan 2.6 UGC Test Prompts',
      date: '2025-12-18',
      content: `## Test Instructions for Wan 2.6 UGC

### Step 1: Access Kie.ai
1. Go to https://kie.ai
2. Create account or sign in
3. Navigate to Wan 2.6 API or playground

### Step 2: Test Multi-Shot UGC Prompt

**Prompt Template for Fitness UGC:**
\`\`\`
A female fitness coach in her 30s with athletic build, wearing a black sports top and leggings. Modern gym setting with clean equipment.

SHOT 1 (Hook - 3s): Close-up of her face, looking directly at camera with confident expression. She says "Stop wasting time on exercises that don't work."

SHOT 2 (Problem - 4s): Medium shot showing her demonstrating a common mistake - doing crunches incorrectly. Slightly frustrated expression.

SHOT 3 (Solution - 5s): Wide shot of her performing a proper plank variation. Smooth controlled movement, professional form.

SHOT 4 (CTA - 3s): Close-up again, warm smile, points at camera. "Link in bio for the full workout."

Style: Professional but authentic, natural lighting, handheld camera feel, 9:16 vertical format.
\`\`\`

### Step 3: Test B-Roll Prompts

**B-Roll 1 - Product Shot:**
\`\`\`
Cinematic close-up of a premium protein shake bottle on a gym bench. Morning light streaming through windows. Slight condensation on bottle. Shallow depth of field. 4 seconds.
\`\`\`

**B-Roll 2 - Lifestyle:**
\`\`\`
Slow motion shot of hands tying athletic shoes. Clean modern aesthetic. Soft natural light. The anticipation of a workout. 3 seconds.
\`\`\`

**B-Roll 3 - Results:**
\`\`\`
Time-lapse style transformation. Before: tired person on couch. After: Same person energetically working out. Split screen or transition. 4 seconds.
\`\`\`

### Step 4: Test I2V (Image-to-Video)

Upload your avatar image and prompt:
\`\`\`
The woman in the image speaks directly to camera with enthusiasm. She gestures naturally with her hands while explaining something exciting. Warm genuine smile. Professional but approachable. 5 seconds.
\`\`\`

### What to Evaluate

1. **Character Consistency** - Does the person look the same across shots?
2. **Lip Sync Quality** - Is audio sync natural or robotic?
3. **Motion Realism** - Do movements look human or AI-generated?
4. **Scene Consistency** - Does the environment stay coherent?
5. **B-Roll Quality** - Is it "stock footage" quality or better?
6. **Overall Engagement** - Would you stop scrolling?

### Cost Comparison

| Platform | Approximate Cost |
|----------|-----------------|
| Kie.ai | ~$0.02-0.05 per second |
| WaveSpeed AI | Similar pricing |
| Alibaba Cloud | Variable by region |

### Next Steps if Results are Good

1. Create avatar reference images for each brand
2. Develop prompt templates for different content types
3. Set up batch generation workflow
4. Integrate into UGC Studio pipeline`,
      links: [
        { title: 'Kie.ai Playground', url: 'https://kie.ai' },
        { title: 'WaveSpeed AI', url: 'https://wavespeed.ai' },
      ],
      tags: ['wan', 'ugc', 'prompts', 'testing'],
    },
    {
      id: 'veo-vs-wan',
      category: 'video',
      title: 'Veo 3 vs Wan 2.6 Comparison',
      date: '2025-12-18',
      content: `## Head-to-Head Comparison

| Feature | Veo 3 (Google) | Wan 2.6 (Alibaba) |
|---------|---------------|-------------------|
| Max Duration | 8 seconds | 15 seconds |
| Resolution | 1080p | 1080p |
| Multi-Shot | No (single clip) | Yes (native) |
| Audio Sync | Yes | Yes |
| Character Consistency | Good | Excellent |
| B-Roll Quality | Excellent | Very Good |
| Reference-to-Video | No | Yes (R2V) |
| API Access | Limited | Kie.ai, Alibaba |
| Open Source | No | Partial |
| Cost | Premium | Affordable |

## Recommendation

**Use Both:**
- **Veo 3**: Best for cinematic B-roll, high-quality single shots
- **Wan 2.6**: Best for multi-shot UGC, character consistency

## Workflow
1. Generate avatar/spokesperson shots with Wan 2.6 (multi-shot)
2. Generate premium B-roll with Veo 3
3. Combine in CapCut with audio`,
      tags: ['veo', 'wan', 'comparison'],
    },

    // Live Avatar Notes
    {
      id: 'live-avatar-tech',
      category: 'ai',
      title: 'Live Avatar Technology Stack',
      date: '2025-12-18',
      content: `## What Powers ChatGPT Voice Mode & ElevenLabs Agents

### The Technology Stack

1. **Speech-to-Speech (S2S)** - OpenAI's gpt-realtime model
2. **Voice Synthesis** - Real-time TTS with emotion
3. **Avatar Lip-Sync** - Neural rendering for visual

### Key Providers

**Avatar Providers:**
| Provider | Latency | Best For |
|----------|---------|----------|
| Simli | <300ms | Fastest, recommended |
| D-ID | 500-800ms | Agents 2.0 |
| HeyGen | 800ms+ | Best quality |
| Beyond Presence | <100ms | Enterprise |

**Voice Providers:**
| Provider | Technology | Notes |
|----------|------------|-------|
| OpenAI Realtime | S2S | Best latency |
| ElevenLabs | Conversational AI 2.0 | Turn-taking |
| Cartesia | Sonic | Speed optimized |

### Implementation

\`\`\`typescript
// Simli + OpenAI Realtime API
const simliClient = new SimliClient({
  apiKey: process.env.SIMLI_API_KEY,
  faceId: 'your-avatar-id'
})

const openaiRealtime = new RealtimeSession({
  model: 'gpt-4o-realtime-preview',
  voice: 'alloy'
})

// Connect audio streams
openaiRealtime.on('audio', (audioChunk) => {
  simliClient.sendAudio(audioChunk)
})
\`\`\`

See full research at /dev-portal/live-avatar-research`,
      links: [
        { title: 'Simli', url: 'https://simli.com' },
        { title: 'OpenAI Realtime API', url: 'https://platform.openai.com/docs/guides/realtime' },
        { title: 'ElevenLabs Conversational AI', url: 'https://elevenlabs.io/conversational-ai' },
      ],
      tags: ['avatar', 'realtime', 'voice', 'lip-sync'],
    },
  ]

  const filteredNotes = researchNotes.filter(note => note.category === activeTab)

  const tabConfig = {
    auth: { label: 'Authentication', icon: Key, color: 'text-yellow-500' },
    video: { label: 'Video AI', icon: Video, color: 'text-purple-500' },
    ai: { label: 'Live Avatar', icon: Cpu, color: 'text-blue-500' },
    other: { label: 'Other', icon: BookOpen, color: 'text-gray-500' },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Research Notes</h1>
          <p className="text-gray-600">Technical research and documentation for BrandVoice projects</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        {(Object.keys(tabConfig) as Array<keyof typeof tabConfig>).map((tab) => {
          const { label, icon: Icon, color } = tabConfig[tab]
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${activeTab === tab ? 'text-white' : color}`} />
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab ? 'bg-white/20' : 'bg-gray-200'
              }`}>
                {researchNotes.filter(n => n.category === tab).length}
              </span>
            </button>
          )
        })}
      </div>

      {/* Notes Grid */}
      <div className="space-y-6">
        {filteredNotes.map((note) => (
          <div key={note.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Note Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{note.title}</h2>
                <p className="text-sm text-gray-500">{note.date}</p>
              </div>
              <div className="flex gap-2">
                {note.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Note Content */}
            <div className="p-6">
              <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-h2:text-xl prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-4 prose-h3:mb-2 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:my-1 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-purple-600 prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-table:text-sm prose-th:bg-gray-100 prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-td:border prose-td:border-gray-200">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {note.content}
                </ReactMarkdown>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => copyToClipboard(note.content, note.id)}
                className="mt-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {copiedId === note.id ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy content
                  </>
                )}
              </button>
            </div>

            {/* Links */}
            {note.links && note.links.length > 0 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Resources</h4>
                <div className="flex flex-wrap gap-2">
                  {note.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-full transition-colors"
                    >
                      {link.title}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700">No notes in this category</h3>
          <p className="text-gray-500">Add a new note to get started</p>
        </div>
      )}
    </div>
  )
}
