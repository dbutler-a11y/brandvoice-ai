import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, rateLimitResponse, addRateLimitHeaders, RateLimitTier } from '@/lib/rate-limit';

// Force dynamic - don't prerender
export const dynamic = 'force-dynamic';

// ElevenLabs Conversational AI Text Mode API
// Uses the same agent and knowledge base as Samira's voice widget
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Apply STANDARD rate limiting (30 requests/min)
    // This endpoint calls ElevenLabs Conversational AI which costs money
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

    const { message, conversationId } = body;

    // SECURITY: Validate required fields
    if (!message) {
      return NextResponse.json(
        { error: 'message is required' },
        { status: 400 }
      );
    }

    // SECURITY: Validate message type and length
    if (typeof message !== 'string') {
      return NextResponse.json(
        { error: 'message must be a string' },
        { status: 400 }
      );
    }

    if (message.length === 0) {
      return NextResponse.json(
        { error: 'message cannot be empty' },
        { status: 400 }
      );
    }

    // SECURITY: Validate message length (max 2000 chars for chat)
    if (message.length > 2000) {
      return NextResponse.json(
        { error: `message exceeds maximum length of 2000 characters (got ${message.length})` },
        { status: 400 }
      );
    }

    // SECURITY: Validate conversationId if provided
    if (conversationId !== undefined && conversationId !== null && typeof conversationId !== 'string') {
      return NextResponse.json(
        { error: 'conversationId must be a string' },
        { status: 400 }
      );
    }

    const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!agentId) {
      return NextResponse.json(
        { error: 'ElevenLabs agent ID not configured' },
        { status: 500 }
      );
    }

    if (!apiKey) {
      // Fallback response when API key is not configured
      const fallbackResponse = NextResponse.json({
        response: getFallbackResponse(message),
        conversationId: conversationId || 'fallback-' + Date.now(),
      });
      return addRateLimitHeaders(fallbackResponse, rateLimitResult);
    }

    // Call ElevenLabs Conversational AI text endpoint
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/text`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          agent_id: agentId,
          text: message,
          ...(conversationId && { conversation_id: conversationId }),
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('ElevenLabs API error:', errorData);

      // Return fallback response on API error
      const errorFallbackResponse = NextResponse.json({
        response: getFallbackResponse(message),
        conversationId: conversationId || 'fallback-' + Date.now(),
      });
      return addRateLimitHeaders(errorFallbackResponse, rateLimitResult);
    }

    const data = await response.json();

    // SECURITY: Add rate limit headers to successful response
    const successResponse = NextResponse.json({
      response: data.response || data.text || data.message || data.output,
      conversationId: data.conversation_id || conversationId,
    });

    return addRateLimitHeaders(successResponse, rateLimitResult);
  } catch (error) {
    console.error('Samira chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Fallback responses when ElevenLabs API is not available
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('package')) {
    return "Great question! We offer three main packages: The Video Launch Kit at $1,500 (perfect for getting started with 5 videos), the Content Engine at $2,997/month (30 videos monthly for consistent content), and the Authority Builder at $4,997/month (full content suite with 50+ videos). Each package includes professional AI spokesperson videos, scripts, and fast turnaround. Would you like me to help you choose the right package for your needs?";
  }

  if (lowerMessage.includes('turnaround') || lowerMessage.includes('how long') || lowerMessage.includes('delivery')) {
    return "Our turnaround times are designed for fast-moving businesses! The Video Launch Kit delivers in 5-7 business days, and our monthly packages deliver new content weekly. We understand you need content quickly, so we prioritize fast, quality delivery.";
  }

  if (lowerMessage.includes('how') && (lowerMessage.includes('work') || lowerMessage.includes('process'))) {
    return "Here's how it works: 1) Book a free strategy call where we discuss your needs, 2) Choose your package and share your brand details, 3) We create your custom AI spokesperson and scripts, 4) You receive professional videos ready to use! The whole process is simple and hands-off for you.";
  }

  if (lowerMessage.includes('book') || lowerMessage.includes('call') || lowerMessage.includes('schedule')) {
    return "I'd love to help you book a strategy call! You can click the 'Book a Call' button to schedule a free 15-minute consultation. We'll discuss your content needs and help you find the perfect solution for your business.";
  }

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hey there! I'm Samira, your AI assistant here at BrandVoice Studio. I can help you learn about our AI spokesperson video services, pricing packages, and answer any questions you have. What would you like to know?";
  }

  // Default response
  return "Thanks for reaching out! I'm here to help you learn about our AI spokesperson video services. We create professional, engaging video content using cutting-edge AI technology. Would you like to know about our packages, pricing, or how the process works?";
}
