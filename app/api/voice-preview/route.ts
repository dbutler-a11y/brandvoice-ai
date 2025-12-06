import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, rateLimitResponse, addRateLimitHeaders, RateLimitTier } from '@/lib/rate-limit';

// Sample voices from ElevenLabs that represent different tones/styles
// All voices have static audio files pre-downloaded to /public/audio/voices/
const SAMPLE_VOICES = [
  {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Sarah',
    description: 'Warm & Professional',
    gender: 'female',
    age: '30s',
    tone: 'Friendly and approachable, perfect for coaching and wellness brands',
    previewText: "Hi, I'm Sarah, and I'm excited to be your AI spokesperson. I'll help you connect with your audience in a warm and professional way that builds trust and drives results.",
    audioFile: 'sarah.mp3',
  },
  {
    id: '21m00Tcm4TlvDq8ikWAM',
    name: 'Rachel',
    description: 'Sophisticated & Elegant',
    gender: 'female',
    age: '30s',
    tone: 'Refined and elegant, ideal for luxury and high-end brands',
    previewText: "Good day, I'm Rachel. With a sophisticated and elegant tone, I bring a touch of refinement to your brand's message, perfect for luxury and high-end markets.",
    audioFile: 'rachel.mp3',
  },
  {
    id: 'IKne3meq5aSn9XLyUdCD',
    name: 'Charlie',
    description: 'Energetic & Youthful',
    gender: 'male',
    age: '20s',
    tone: 'Dynamic and energetic, great for fitness and tech brands',
    previewText: "Hey! I'm Charlie, ready to bring energy and excitement to your brand's message!",
    audioFile: 'charlie.mp3',
  },
  {
    id: 'TX3LPaxmHKxFdv7VOQHJ',
    name: 'Liam',
    description: 'Deep & Trustworthy',
    gender: 'male',
    age: '40s',
    tone: 'Deep and reassuring, perfect for finance and healthcare',
    previewText: "Hello, I'm Liam. I bring a sense of trust and reliability to every message I deliver.",
    audioFile: 'liam.mp3',
  },
  {
    id: 'XB0fDUnXU5powFXDhCwa',
    name: 'Charlotte',
    description: 'Sophisticated & Elegant',
    gender: 'female',
    age: '40s',
    tone: 'Refined and elegant, ideal for luxury and high-end brands',
    previewText: "Good day. I'm Charlotte, bringing sophistication and elegance to your brand communication.",
    audioFile: 'charlotte.mp3',
  },
  {
    id: 'pFZP5JQG7iQjIQuC4Bku',
    name: 'Lily',
    description: 'Warm & Conversational',
    gender: 'female',
    age: '20s',
    tone: 'Casual and relatable, perfect for social media content',
    previewText: "Hey! I'm Lily, and I'm all about keeping things real and relatable for your audience.",
    audioFile: 'lily.mp3',
  },
  {
    id: 'TxGEqnHWrfWFTfGW9XjX',
    name: 'Michael',
    description: 'Authoritative & Clear',
    gender: 'male',
    age: '40s',
    tone: 'Clear and authoritative, perfect for professional services and B2B',
    previewText: "Hi, I'm Michael. With a clear and authoritative voice, I'll deliver your message with confidence and credibility, perfect for professional services and B2B communications.",
    audioFile: 'michael.mp3',
  },
  {
    id: 'pNInz6obpgDQGcFmaJgB',
    name: 'David',
    description: 'Calm & Reassuring',
    gender: 'male',
    age: '40s',
    tone: 'Calm and reassuring, ideal for healthcare and education',
    previewText: "Hello, I'm David. With a calm and reassuring presence, I help your audience feel comfortable and informed, making complex topics easy to understand.",
    audioFile: 'david.mp3',
  },
  {
    id: 'ErXwobaYiN019PkySvjV',
    name: 'James',
    description: 'Motivating & Inspiring',
    gender: 'male',
    age: '30s',
    tone: 'Motivating and inspiring, great for coaching and personal development',
    previewText: "What's up! I'm James, and I'm here to motivate and inspire your audience to take action. Let's turn your message into a movement!",
    audioFile: 'james.mp3',
  },
  {
    id: 'jsCqWAovK2LkecY7zXl4',
    name: 'Olivia',
    description: 'Caring & Compassionate',
    gender: 'female',
    age: '30s',
    tone: 'Caring and compassionate, perfect for healthcare and non-profits',
    previewText: "Hello, I'm Olivia. My caring and compassionate voice creates a safe space for your audience, perfect for sensitive topics and healthcare communications.",
    audioFile: 'olivia.mp3',
  },
  {
    id: 'onwK4e9ZLuTAKqWW03F9',
    name: 'Alex',
    description: 'Modern & Tech-Savvy',
    gender: 'male',
    age: '20s',
    tone: 'Modern and tech-savvy, ideal for startups and innovation',
    previewText: "Hey, I'm Alex. With a modern and tech-savvy approach, I speak the language of innovation and help your cutting-edge brand connect with forward-thinking audiences.",
    audioFile: 'alex.mp3',
  },
  {
    id: 'jBpfuIE2acCO8z3wKNLl',
    name: 'Sophia',
    description: 'Natural & Authentic',
    gender: 'female',
    age: '30s',
    tone: 'Natural and authentic, perfect for sustainability and wellness',
    previewText: "Hi, I'm Sophia. My natural and authentic voice resonates with audiences who value genuine connections and sustainable living. Let's tell your story in a real way.",
    audioFile: 'sophia.mp3',
  },
  {
    id: 'flq6f7yk4E4fJM5XTYuZ',
    name: 'Marcus',
    description: 'Powerful & Commanding',
    gender: 'male',
    age: '40s',
    tone: 'Powerful and commanding, great for automotive and sports',
    previewText: "I'm Marcus, and I deliver your message with power and command. Perfect for industries that need a bold, strong voice that demands attention.",
    audioFile: 'marcus.mp3',
  },
  {
    id: 'XrExE9yKIg1WjnnlVkGX',
    name: 'Jessica',
    description: 'Friendly & Conversational',
    gender: 'female',
    age: '30s',
    tone: 'Friendly and conversational, ideal for hospitality and real estate',
    previewText: "Hi! I'm Jessica, and I love having real conversations with your audience. My friendly and approachable style makes everyone feel right at home.",
    audioFile: 'jessica.mp3',
  },
  {
    id: 'iP95p4xoKVk53GoZ742B',
    name: 'Chris',
    description: 'Versatile & Adaptable',
    gender: 'male',
    age: '30s',
    tone: 'Versatile and adaptable, perfect for tech and general business',
    previewText: "Hi, I'm Chris. My versatile voice adapts to any message or audience, making me perfect for tech companies and businesses that need flexibility.",
    audioFile: 'chris.mp3',
  },
  {
    id: '9BWtsMINqrJLrRacOk9x',
    name: 'Emily',
    description: 'Energetic & Upbeat',
    gender: 'female',
    age: '20s',
    tone: 'Energetic and upbeat, great for fitness, retail, and events',
    previewText: "Hey there! I'm Emily, and I bring energy and enthusiasm to every message. Let's get your audience excited about what you have to offer!",
    audioFile: 'emily.mp3',
  },
];

// GET - Return list of available voices with static audio URLs
export async function GET() {
  return NextResponse.json({
    voices: SAMPLE_VOICES.map(({ id, name, description, gender, age, tone, previewText, audioFile }) => ({
      id,
      name,
      description,
      gender,
      age,
      tone,
      previewText,
      // Static audio file URL - no API call needed
      audioUrl: `/audio/voices/${audioFile}`,
    })),
  });
}

// POST - Generate audio preview for a specific voice
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Apply STRICT rate limiting (5 requests/min)
    // This endpoint calls ElevenLabs TTS which costs money
    const rateLimitResult = rateLimit(request, RateLimitTier.STRICT);
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

    // SECURITY: Validate required fields
    const { voiceId, text } = body;

    if (!voiceId) {
      return NextResponse.json(
        { error: 'voiceId is required' },
        { status: 400 }
      );
    }

    // SECURITY: Validate text length if provided (max 500 chars for voice preview)
    if (text !== undefined && text !== null) {
      if (typeof text !== 'string') {
        return NextResponse.json(
          { error: 'text must be a string' },
          { status: 400 }
        );
      }

      if (text.length > 500) {
        return NextResponse.json(
          { error: `text exceeds maximum length of 500 characters (got ${text.length})` },
          { status: 400 }
        );
      }
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    // Find the voice
    const voice = SAMPLE_VOICES.find(v => v.id === voiceId);
    if (!voice) {
      return NextResponse.json(
        { error: 'Voice not found' },
        { status: 404 }
      );
    }

    // Use provided text or default preview text
    const textToSpeak = text ? text.trim() : voice.previewText;

    // Call ElevenLabs TTS API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: textToSpeak,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs TTS error:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate audio' },
        { status: 500 }
      );
    }

    // Get audio buffer
    const audioBuffer = await response.arrayBuffer();

    // Return audio as base64
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    // SECURITY: Add rate limit headers to successful response
    const successResponse = NextResponse.json({
      audio: base64Audio,
      voice: {
        id: voice.id,
        name: voice.name,
      },
    });

    return addRateLimitHeaders(successResponse, rateLimitResult);

  } catch (error) {
    console.error('Voice preview error:', error);
    return NextResponse.json(
      { error: 'Failed to generate voice preview' },
      { status: 500 }
    );
  }
}
