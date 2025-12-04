import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface FacebookAd {
  type: 'Awareness' | 'Engagement' | 'Lead Gen' | 'Retargeting'
  headline: string
  primaryText: string
  description: string
  callToAction: string
}

interface AdGenerationResponse {
  ads: FacebookAd[]
}

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

async function generateAdsWithLLM(prompt: string): Promise<AdGenerationResponse> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey || apiKey === 'sk-your-openai-api-key-here') {
    console.log('No valid OpenAI API key found. Returning mock ads.')
    return getMockAdsResponse()
  }

  try {
    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: 'You are an expert Facebook ads copywriter. Always respond with valid JSON only, no markdown formatting.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenAI API error: ${response.status} - ${error}`)
    }

    const data: OpenAIResponse = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content in OpenAI response')
    }

    const parsed = parseAdResponse(content)
    return parsed as AdGenerationResponse
  } catch (error) {
    console.error('LLM generation error:', error)
    throw error
  }
}

function parseAdResponse(content: string): unknown {
  let jsonString = content.trim()

  // Remove markdown code blocks if present
  if (jsonString.startsWith('```json')) {
    jsonString = jsonString.slice(7)
  } else if (jsonString.startsWith('```')) {
    jsonString = jsonString.slice(3)
  }

  if (jsonString.endsWith('```')) {
    jsonString = jsonString.slice(0, -3)
  }

  jsonString = jsonString.trim()

  try {
    return JSON.parse(jsonString)
  } catch {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('Failed to parse JSON from LLM response')
  }
}

function getMockAdsResponse(): AdGenerationResponse {
  return {
    ads: [
      {
        type: 'Awareness',
        headline: 'Meet Your AI Video Spokesperson',
        primaryText: 'Stop spending hours on video content. Let your AI spokesperson create engaging videos for you 24/7. Perfect for busy entrepreneurs!',
        description: 'AI-Powered Video Made Simple',
        callToAction: 'Learn More',
      },
      {
        type: 'Engagement',
        headline: 'Your Brand, Always On Camera',
        primaryText: 'What if you could be everywhere at once? Our AI spokesperson technology lets you scale your video presence without the camera fatigue.',
        description: 'See How It Works',
        callToAction: 'Watch Demo',
      },
      {
        type: 'Lead Gen',
        headline: 'Get Your Free AI Video Demo',
        primaryText: 'See your business brought to life with AI video technology. Get a personalized demo and discover how easy video marketing can be.',
        description: 'Limited Free Demos Available',
        callToAction: 'Sign Up',
      },
      {
        type: 'Retargeting',
        headline: 'Ready to Transform Your Content?',
        primaryText: 'You checked us out - now take the next step. Join successful businesses using AI spokespersons to engage customers daily.',
        description: 'Special offer for returning visitors',
        callToAction: 'Get Started',
      },
    ],
  }
}

function buildAdPrompt(client: {
  businessName: string
  niche: string
  tone: string
  goals: string
}): string {
  return `Generate 4 Facebook ad copy variations to promote AI spokesperson video services for this client:

Business: ${client.businessName}
Niche: ${client.niche}
Brand Tone: ${client.tone}
Goals: ${client.goals}

Create 4 ad variations with these exact types:
1. Awareness (building brand awareness)
2. Engagement (encouraging interaction)
3. Lead Gen (capturing leads)
4. Retargeting (re-engaging past visitors)

Each ad must follow Facebook's best practices and character limits:
- headline: Maximum 40 characters (must be punchy and attention-grabbing)
- primaryText: Maximum 125 characters (main ad copy, include value proposition)
- description: Maximum 30 characters (supporting tagline)
- callToAction: One of these exact options: "Learn More", "Sign Up", "Watch Video", "Get Started", "Contact Us", "Shop Now", "Download", "Watch Demo"

The ads should:
- Promote the value of the client's AI spokesperson video content
- Match the client's brand tone (${client.tone})
- Be appropriate for their niche (${client.niche})
- Include engaging hooks that stop the scroll
- Focus on benefits and transformations
- Use social proof or urgency where appropriate

IMPORTANT: Respond with ONLY a JSON object in this exact format (no other text):
{
  "ads": [
    {
      "type": "Awareness",
      "headline": "...",
      "primaryText": "...",
      "description": "...",
      "callToAction": "..."
    },
    {
      "type": "Engagement",
      "headline": "...",
      "primaryText": "...",
      "description": "...",
      "callToAction": "..."
    },
    {
      "type": "Lead Gen",
      "headline": "...",
      "primaryText": "...",
      "description": "...",
      "callToAction": "..."
    },
    {
      "type": "Retargeting",
      "headline": "...",
      "primaryText": "...",
      "description": "...",
      "callToAction": "..."
    }
  ]
}

Ensure all character limits are strictly followed.`
}

// POST /api/clients/[clientId]/generate-ads - Generate Facebook ad copy for a client
export async function POST(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    // Fetch client data
    const client = await prisma.client.findUnique({
      where: { id: params.clientId },
      select: {
        id: true,
        businessName: true,
        niche: true,
        tone: true,
        goals: true,
      },
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    // Build the prompt
    const prompt = buildAdPrompt(client)

    // Generate ads with LLM
    const adResponse = await generateAdsWithLLM(prompt)

    return NextResponse.json(adResponse, { status: 200 })
  } catch (error) {
    console.error('Error generating ads:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate ads',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
