import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, rateLimitResponse, addRateLimitHeaders, RateLimitTier } from '@/lib/rate-limit'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const SYSTEM_PROMPT = `You are a helpful AI assistant for an AI Spokesperson video production studio. You help the business owner:

1. Brainstorm video script ideas for different industries (med spa, real estate, legal, fitness, etc.)
2. Generate FAQ questions that businesses commonly receive
3. Create marketing copy, ad headlines, and promotional content
4. Develop cold email sequences and outreach strategies
5. Suggest pricing strategies and package ideas
6. Help craft brand voice and tone guidelines
7. Generate social media captions and hooks
8. Create testimonial scripts and case study outlines
9. **CREATE AI SPOKESPERSON CHARACTER CONCEPTS** - Design new AI actors/presenters with:
   - Name and persona
   - Industry specialization (what niches they're best for)
   - Visual description (age range, gender, appearance, clothing style)
   - Voice characteristics (tone, accent, energy level)
   - Personality traits and speaking style
   - Background/setting recommendations
   - Sample intro script in their voice
10. **CUSTOMIZE EXISTING SPOKESPERSONS** - Suggest modifications for:
    - Different industries/niches
    - Clothing variations
    - Background scenes
    - Hair/appearance options
    - Voice tone adjustments

When generating AI SPOKESPERSON concepts, provide:
- **Name**: A memorable, professional name
- **Tagline**: e.g., "Sarah - The Beauty Expert"
- **Best For**: Industries/niches they'd excel in
- **Age Range**: e.g., 30-40
- **Gender**: Male/Female/Non-binary
- **Appearance**: Physical description, style
- **Wardrobe**: Clothing recommendations
- **Voice Style**: Tone, pace, energy
- **Personality**: Key traits (warm, authoritative, energetic, etc.)
- **Sample Script**: A 30-second intro in their voice/style

When generating scripts, keep them:
- 30-60 seconds (50-100 words)
- Conversational and natural for video
- Hook-focused (grab attention in first 3 seconds)
- Clear call-to-action at the end

Be creative, practical, and business-focused. Provide actionable ideas.`

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Apply STANDARD rate limiting (30 requests/min)
    // This endpoint calls OpenAI API which costs money
    const rateLimitResult = rateLimit(request, RateLimitTier.STANDARD);
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult);
    }

    // SECURITY: Validate request body exists and is JSON
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { messages, context } = body;

    // SECURITY: Validate required fields
    if (!messages) {
      return NextResponse.json(
        { error: 'messages array is required' },
        { status: 400 }
      );
    }

    // SECURITY: Validate messages is an array
    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'messages must be an array' },
        { status: 400 }
      );
    }

    // SECURITY: Validate messages array is not empty
    if (messages.length === 0) {
      return NextResponse.json(
        { error: 'messages array cannot be empty' },
        { status: 400 }
      );
    }

    // SECURITY: Validate messages array length (prevent abuse)
    if (messages.length > 50) {
      return NextResponse.json(
        { error: 'messages array exceeds maximum length of 50' },
        { status: 400 }
      );
    }

    // SECURITY: Validate each message has required structure
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (!msg || typeof msg !== 'object') {
        return NextResponse.json(
          { error: `Message at index ${i} must be an object` },
          { status: 400 }
        );
      }
      if (!msg.content || typeof msg.content !== 'string') {
        return NextResponse.json(
          { error: `Message at index ${i} must have a content string` },
          { status: 400 }
        );
      }
      // SECURITY: Validate message content length (max 2000 chars)
      if (msg.content.length > 2000) {
        return NextResponse.json(
          { error: `Message at index ${i} exceeds maximum length of 2000 characters` },
          { status: 400 }
        );
      }
    }

    // SECURITY: Validate context if provided
    if (context !== undefined && context !== null) {
      if (typeof context !== 'string') {
        return NextResponse.json(
          { error: 'context must be a string' },
          { status: 400 }
        );
      }
      if (context.length > 2000) {
        return NextResponse.json(
          { error: `context exceeds maximum length of 2000 characters (got ${context.length})` },
          { status: 400 }
        );
      }
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey === 'sk-your-openai-api-key-here') {
      // Return mock response for development
      const mockResponse = NextResponse.json({
        message: {
          role: 'assistant',
          content: getMockResponse(messages[messages.length - 1]?.content || '')
        }
      });
      return addRateLimitHeaders(mockResponse, rateLimitResult);
    }

    // Build messages array with system prompt
    const apiMessages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT + (context ? `\n\nAdditional context: ${context}` : '') },
      ...messages
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: apiMessages,
        temperature: 0.8,
        max_tokens: 2048,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI API error:', error)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const assistantMessage = data.choices[0]?.message

    // SECURITY: Add rate limit headers to successful response
    const successResponse = NextResponse.json({ message: assistantMessage });
    return addRateLimitHeaders(successResponse, rateLimitResult);
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    )
  }
}

function getMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase()

  if (lower.includes('actor') || lower.includes('spokesperson') || lower.includes('character') || lower.includes('lineup')) {
    return `**AI Spokesperson Concept: Marcus - The Real Estate Pro**

---

**Name:** Marcus
**Tagline:** "Marcus - Your Trusted Real Estate Guide"
**Best For:** Real Estate, Property Management, Mortgage, Home Services

**Age Range:** 38-45
**Gender:** Male
**Appearance:** Clean-cut, salt-and-pepper hair (adds credibility), warm brown eyes, approachable smile. Athletic build. Well-groomed.

**Wardrobe:**
- Primary: Navy blue blazer over crisp white shirt (no tie - approachable yet professional)
- Casual: Light blue oxford shirt, rolled sleeves
- Upscale: Charcoal suit for luxury listings

**Voice Style:** Warm baritone, confident but not pushy. Conversational pace. Uses "you" frequently to connect with viewer.

**Personality:** Trustworthy, knowledgeable, patient, genuine. Like a friend who happens to be a real estate expert.

**Sample Intro Script:**
*"Hey there! If you're thinking about buying or selling a home, you've probably got a million questions running through your head. Am I getting a fair price? What's the market really like right now? I get it - this is one of the biggest decisions you'll ever make. That's exactly why I'm here - to cut through the noise and give you the real answers. No pressure, no sales pitch. Just honest advice. Let's dive in..."*

---

Want me to create more characters or customize Marcus for different sub-niches?`
  }

  if (lower.includes('script') || lower.includes('video')) {
    return `Here's a sample video script idea:

**Hook:** "Stop scrolling - this could change everything for your [business type]..."

**Body:** "I know what you're thinking - another [service] that promises the world. But here's what makes us different..."

**Call to Action:** "Ready to see real results? Click the link in bio to book your free consultation. No pressure, just answers."

---

Want me to customize this for a specific industry? Just tell me the niche!`
  }

  if (lower.includes('faq') || lower.includes('question')) {
    return `Here are 5 common FAQs I'd suggest for a service business:

1. "How much does [service] cost?" - Address pricing transparency
2. "How long until I see results?" - Set realistic expectations
3. "What makes you different from competitors?" - Unique value proposition
4. "Is [service] right for me?" - Qualification/fit question
5. "What's the process/what should I expect?" - Reduce anxiety

Want me to write the actual script answers for any of these?`
  }

  if (lower.includes('email') || lower.includes('outreach')) {
    return `Here's a 5-email cold sequence framework:

**Email 1 (Day 1):** The Curiosity Hook - Ask a question about their pain point
**Email 2 (Day 3):** The Value Drop - Share a quick tip or insight
**Email 3 (Day 5):** The Social Proof - Share a client result
**Email 4 (Day 7):** The Urgency Play - Limited time/spots
**Email 5 (Day 10):** The Breakup - "Should I stop emailing?"

Want me to write out any of these in full?`
  }

  return `Great question! I'm here to help you brainstorm ideas for your AI spokesperson business.

I can help with:
- 🎭 Create new AI actor/spokesperson characters
- 👥 Design a full lineup of diverse spokespersons
- 🔄 Customize actors for different industries
- 📝 Video script ideas
- ❓ FAQ content
- 📧 Email sequences
- 📱 Social media hooks
- 💰 Pricing strategies
- 🎯 Marketing copy

What would you like to explore? Just tell me the industry or topic!`
}
