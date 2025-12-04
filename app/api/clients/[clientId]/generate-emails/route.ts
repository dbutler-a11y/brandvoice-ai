import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface EmailSequence {
  subject: string
  body: string
  sendDay: number
}

interface EmailSequenceResponse {
  emails: EmailSequence[]
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

// POST /api/clients/[clientId]/generate-emails - Generate 5-email cold outreach sequence
export async function POST(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    // Fetch client data
    const client = await prisma.client.findUnique({
      where: { id: params.clientId },
      include: {
        intake: true,
      },
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey || apiKey === 'sk-your-openai-api-key-here') {
      // Return mock data for development/testing
      console.log('No valid OpenAI API key found. Returning mock email sequence.')
      return NextResponse.json(getMockEmailSequence(client.businessName), { status: 200 })
    }

    // Build the prompt for OpenAI
    const prompt = buildEmailPrompt(client)

    // Call OpenAI API
    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: 'You are an expert B2B cold email copywriter specializing in AI and video marketing. Always respond with valid JSON only, no markdown formatting.',
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
        max_tokens: 4000,
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

    // Parse the JSON response
    const parsed = parseEmailResponse(content)

    if (!validateEmailResponse(parsed)) {
      throw new Error('Invalid email response structure from LLM')
    }

    return NextResponse.json(parsed, { status: 200 })
  } catch (error) {
    console.error('Error generating cold email sequence:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate email sequence',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

interface ClientData {
  businessName: string
  niche: string
  tone: string
  goals: string
}

function buildEmailPrompt(client: ClientData): string {
  const businessName = client.businessName
  const niche = client.niche
  const tone = client.tone
  const goals = client.goals

  return `Generate a 5-email cold outreach sequence for ${businessName}, a business in the ${niche} industry.

Business Context:
- Business Name: ${businessName}
- Niche: ${niche}
- Brand Tone: ${tone}
- Goals: ${goals}

The client has just created professional AI spokesperson videos (short-form video content featuring an AI-generated spokesperson) and wants to use them for marketing and client engagement.

Generate 5 emails with the following purposes:
1. Introduction (Day 1) - Introduce the business and hint at the AI spokesperson content
2. Value Proposition (Day 3) - Explain how AI spokesperson videos solve a problem for the prospect
3. Social Proof (Day 5) - Share success stories or testimonials related to video marketing
4. Urgency/Scarcity (Day 7) - Create urgency with limited-time offer or exclusive opportunity
5. Final Follow-up (Day 10) - Last chance to engage, offer to answer questions

Email Requirements:
- Match the brand tone: ${tone}
- Keep emails concise (150-250 words max)
- Include clear CTAs (call-to-action)
- Reference AI spokesperson videos naturally
- Be appropriate for cold B2B outreach
- Use personalization placeholders like {{firstName}} and {{companyName}} where appropriate
- Subject lines should be 40-60 characters
- Avoid spam trigger words

Return the response as a JSON object with this exact structure:
{
  "emails": [
    {
      "subject": "Email subject line here",
      "body": "Email body text here",
      "sendDay": 1
    }
  ]
}

The emails array should contain exactly 5 email objects with sendDay values of 1, 3, 5, 7, and 10.`
}

function parseEmailResponse(content: string): unknown {
  // Try to extract JSON from the response
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
    // Try to find JSON object in the string
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('Failed to parse JSON from LLM response')
  }
}

function validateEmailResponse(parsed: unknown): parsed is EmailSequenceResponse {
  if (!parsed || typeof parsed !== 'object') return false

  const candidate = parsed as Record<string, unknown>
  if (!Array.isArray(candidate.emails)) return false
  if (candidate.emails.length !== 5) return false

  for (const email of candidate.emails) {
    if (typeof email.subject !== 'string') return false
    if (typeof email.body !== 'string') return false
    if (typeof email.sendDay !== 'number') return false
  }

  return true
}

function getMockEmailSequence(businessName: string): EmailSequenceResponse {
  return {
    emails: [
      {
        subject: 'Quick question about your video content',
        body: `Hi {{firstName}},

I noticed {{companyName}} is in the ${businessName} space, and I wanted to reach out about something that might interest you.

We've recently developed AI spokesperson videos that help businesses like yours create engaging video content at scale - without the need for expensive production crews or on-camera talent.

The results have been impressive: higher engagement rates, more consistent content output, and significant time savings.

Would you be open to a quick 10-minute call to see if this might work for your team?

Best regards,
${businessName}`,
        sendDay: 1,
      },
      {
        subject: 'How we solved the video content problem',
        body: `Hi {{firstName}},

Following up on my last email - I wanted to share exactly how our AI spokesperson videos work.

The problem: Creating quality video content is expensive, time-consuming, and requires ongoing resources.

The solution: Our AI spokesperson videos allow you to:
- Create professional videos in minutes, not days
- Maintain consistent brand messaging across all content
- Scale video production without scaling costs
- Engage your audience with authentic, professional delivery

Think of it as having a professional spokesperson available 24/7, ready to deliver your message perfectly every time.

Interested in seeing how this could work for {{companyName}}?

Best,
${businessName}`,
        sendDay: 3,
      },
      {
        subject: 'Results our clients are seeing',
        body: `Hi {{firstName}},

I wanted to share some quick wins our clients are experiencing with AI spokesperson videos:

One client in your industry saw a 3x increase in video content output while cutting production costs by 60%. Another reported that their email engagement doubled when they started including personalized video messages.

The common thread? They all struggled with the same challenge: creating enough quality video content to stay competitive.

Our AI spokesperson videos gave them the solution they needed.

Would a brief demo make sense for you? I can show you exactly how it works.

Best,
${businessName}`,
        sendDay: 5,
      },
      {
        subject: 'Limited spots for onboarding this month',
        body: `Hi {{firstName}},

Quick heads up - we're limiting our new client onboarding to 5 businesses this month to ensure quality implementation.

We currently have 2 spots remaining.

I don't want to pressure you, but if AI spokesperson videos are something you've been considering, now would be the time to move forward.

The onboarding includes:
- Custom AI spokesperson setup
- Brand voice training
- Template library for your industry
- 30-day support package

Can we schedule a quick call this week to see if this is a fit?

Best,
${businessName}`,
        sendDay: 7,
      },
      {
        subject: 'Last chance - should I close your file?',
        body: `Hi {{firstName}},

I haven't heard back from you, so I'm assuming AI spokesperson videos aren't a priority for {{companyName}} right now.

Before I close your file, I wanted to ask:

Are you still interested in exploring this? If so, I'm happy to answer any questions you might have.

Or should I check back in a few months when you might have more bandwidth?

Either way, I appreciate your time and hope we can connect in the future.

Best,
${businessName}

P.S. If you know someone else at {{companyName}} who might be interested in this, feel free to forward this email their way.`,
        sendDay: 10,
      },
    ],
  }
}
