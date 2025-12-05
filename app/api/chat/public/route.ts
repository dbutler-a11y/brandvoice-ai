import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, rateLimitResponse, addRateLimitHeaders, RateLimitTier } from '@/lib/rate-limit';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_PROMPT = `You are a friendly and helpful AI assistant for AI Spokesperson Studio, a done-for-you AI video production service. Your job is to answer questions from potential customers and help guide them towards booking a call.

ABOUT THE SERVICE:
- We create custom AI spokesperson videos for businesses
- Clients get a personalized AI avatar that looks and sounds professional
- We deliver 30 days of viral-ready video content in just 7 days
- Perfect for businesses that want video marketing without filming themselves
- Industries served: Med Spas, Real Estate, Legal, Fitness, Coaching, Healthcare, and more

PACKAGES (guide them to book a call for exact pricing):
- Launch Kit: AI spokesperson + 10 videos - great for getting started
- Content Engine: AI spokesperson + 30 videos - our most popular package
- Content Engine Pro: AI spokesperson + 30 videos + posting service
- Authority Engine: Premium package with custom avatar and ongoing content

KEY BENEFITS:
- Never film yourself again
- Professional quality videos
- Quick 7-day turnaround
- Consistent brand presence
- Works 24/7 unlike human spokespersons

PREMIUM ADD-ON FEATURES (proactively mention these when relevant):
1. Voice Cloning - Record yourself once, and we transform it into your AI spokesperson's voice. Your authentic voice, zero effort!
2. Multi-Language Dubbing - Expand your reach globally! We can automatically translate and dub your videos into Spanish, French, German, and 20+ other languages.
3. Audio Cleanup - Have existing recordings with background noise? We can clean them up with AI-powered audio isolation for crystal clear sound.
4. Custom Sound Effects - Add professional sound effects to your videos - whooshes, transitions, background music beds, and more.

When customers ask about customization, international audiences, or how to make videos more professional, mention these add-ons as ways to enhance their package!

HOW IT WORKS:
1. Book a discovery call to discuss your needs
2. We gather your brand info and create your AI spokesperson
3. Our team writes scripts tailored to your business
4. We produce and deliver your videos
5. You post and watch your engagement grow!

GUIDELINES:
- Be warm, friendly, and conversational
- Keep responses concise (2-4 sentences max unless they ask for details)
- Always encourage booking a free call for personalized answers
- Don't give exact prices - say "pricing varies based on your needs" and encourage a call
- If they seem ready to move forward, suggest booking a call
- If they ask about competitors, stay positive and focus on our benefits
- For technical questions you don't know, say you'd be happy to connect them with the team
- Proactively mention relevant add-on features when the conversation opens an opportunity

CALL TO ACTION:
When appropriate, encourage them to "Book a free discovery call" to get personalized answers and see if we're a good fit.`;

function getMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
    return "Great question! Our pricing varies based on your specific needs - the number of videos, type of AI spokesperson, and any add-ons you might want. The best way to get accurate pricing is to book a free discovery call where we can understand your goals and give you a custom quote. Would you like to schedule that?";
  }

  if (lower.includes('how') && (lower.includes('work') || lower.includes('process'))) {
    return "Here's how it works: First, we hop on a quick discovery call to understand your business and goals. Then we create your custom AI spokesperson and write scripts tailored to your brand. Within 7 days, you'll have 30 professional videos ready to post! Want me to help you book that discovery call?";
  }

  if (lower.includes('long') || lower.includes('time') || lower.includes('turnaround')) {
    return "We deliver your complete video package in just 7 days! That includes your custom AI spokesperson and all your videos. Pretty fast, right? Book a call to get started and we can discuss your timeline.";
  }

  if (lower.includes('example') || lower.includes('sample') || lower.includes('see')) {
    return "Absolutely! We have sample videos you can check out. During your free discovery call, we can show you examples specific to your industry and even do a quick demo. Want to book a time to see them?";
  }

  if (lower.includes('industry') || lower.includes('business') || lower.includes('niche')) {
    return "We work with all kinds of businesses! Med spas, real estate agents, lawyers, fitness coaches, healthcare providers, consultants - you name it. Our AI spokespersons can be customized to match any brand voice. What industry are you in?";
  }

  if (lower.includes('call') || lower.includes('book') || lower.includes('schedule') || lower.includes('talk')) {
    return "Perfect! You can book a free discovery call using the 'Book a Call' button on our site. We'll discuss your goals, show you examples, and create a custom plan for your business. No pressure, just a friendly chat to see if we're a good fit!";
  }

  return "Thanks for your question! I'd love to help. For the most accurate and personalized answer, I'd recommend booking a quick discovery call with our team. They can dive deep into your specific needs and show you exactly how our AI spokesperson service can work for your business. Would you like to schedule one?";
}

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

    const { messages } = body;

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

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey === 'sk-your-openai-api-key-here') {
      // Return mock response for development
      const lastUserMessage = messages[messages.length - 1]?.content || '';
      const mockResponse = NextResponse.json({
        message: {
          role: 'assistant',
          content: getMockResponse(lastUserMessage),
        },
      });
      return addRateLimitHeaders(mockResponse, rateLimitResult);
    }

    // Build messages array with system prompt
    const apiMessages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message;

    // SECURITY: Add rate limit headers to successful response
    const successResponse = NextResponse.json({ message: assistantMessage });
    return addRateLimitHeaders(successResponse, rateLimitResult);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    );
  }
}
