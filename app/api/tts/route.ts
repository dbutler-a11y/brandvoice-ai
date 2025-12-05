import { NextResponse } from 'next/server';
import { applyRateLimit } from '@/lib/ratelimit';
import { validateTTSRequest } from '@/lib/validation';
import { textToSpeech } from '@/lib/elevenlabs';

/**
 * POST /api/tts
 * Simple Text-to-Speech endpoint using ElevenLabs
 *
 * Request body:
 * - text: string (max 500 characters, required)
 * - voiceId: string (required)
 * - stability?: number (0-1, optional, default: 0.5)
 * - similarityBoost?: number (0-1, optional, default: 0.75)
 *
 * Returns: Audio file (MP3)
 *
 * Rate limit: STRICT (5 requests per minute)
 */
export async function POST(request: Request) {
  try {
    // Apply strict rate limiting (5 requests per minute)
    const rateLimitCheck = applyRateLimit(request, 'STRICT');
    if (rateLimitCheck.response) {
      console.warn('[TTS API] Rate limit exceeded');
      return rateLimitCheck.response;
    }

    // Parse request body
    let data: Record<string, unknown>;
    try {
      data = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    // Validate input
    const validation = validateTTSRequest(data);

    if (!validation.valid) {
      console.error('[TTS API] Validation error:', validation.error);
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Extract validated parameters
    const { text, voiceId } = validation;
    const stability = typeof data.stability === 'number' ? data.stability : 0.5;
    const similarityBoost = typeof data.similarityBoost === 'number' ? data.similarityBoost : 0.75;

    // Validate optional parameters
    if (stability < 0 || stability > 1) {
      return NextResponse.json(
        { error: 'Stability must be between 0 and 1' },
        { status: 400 }
      );
    }

    if (similarityBoost < 0 || similarityBoost > 1) {
      return NextResponse.json(
        { error: 'Similarity boost must be between 0 and 1' },
        { status: 400 }
      );
    }

    // Generate speech
    console.log(`[TTS API] Generating speech: ${text.substring(0, 50)}... (voice: ${voiceId})`);

    const audioBuffer = await textToSpeech({
      text: text!,
      voiceId: voiceId!,
      stability,
      similarityBoost,
    });

    // Return audio file
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'X-RateLimit-Limit': rateLimitCheck.result.limit.toString(),
        'X-RateLimit-Remaining': rateLimitCheck.result.remaining.toString(),
        'X-RateLimit-Reset': rateLimitCheck.result.reset.toString(),
      },
    });

  } catch (error) {
    console.error('[TTS API] Error generating speech:', error);

    // Handle ElevenLabs API errors
    if (error instanceof Error) {
      if (error.message.includes('ELEVENLABS_API_KEY')) {
        return NextResponse.json(
          { error: 'TTS service not configured' },
          { status: 503 }
        );
      }

      if (error.message.includes('Failed to generate speech')) {
        return NextResponse.json(
          { error: 'Failed to generate speech', details: error.message },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tts
 * API documentation and status endpoint
 */
export async function GET() {
  const isConfigured = !!process.env.ELEVENLABS_API_KEY;

  return NextResponse.json({
    name: 'Text-to-Speech API',
    version: '1.0.0',
    status: isConfigured ? 'operational' : 'not_configured',
    rateLimit: {
      type: 'STRICT',
      requests: 5,
      window: '60 seconds',
    },
    usage: {
      method: 'POST',
      endpoint: '/api/tts',
      contentType: 'application/json',
      body: {
        text: 'string (required, max 500 characters)',
        voiceId: 'string (required)',
        stability: 'number (optional, 0-1, default: 0.5)',
        similarityBoost: 'number (optional, 0-1, default: 0.75)',
      },
      response: {
        success: 'audio/mpeg (MP3 file)',
        error: 'application/json',
      },
    },
    example: {
      curl: `curl -X POST https://yourdomain.com/api/tts \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Hello, world!", "voiceId": "21m00Tcm4TlvDq8ikWAM"}' \\
  --output speech.mp3`,
    },
  });
}
