import { NextResponse } from 'next/server';

// Sample voices from ElevenLabs that represent different tones/styles
// These are public voice IDs from ElevenLabs voice library
const SAMPLE_VOICES = [
  {
    id: 'EXAVITQu4vr4xnSDxMaL', // Sarah
    name: 'Sarah',
    description: 'Warm & Professional',
    gender: 'female',
    age: '30s',
    tone: 'Friendly and approachable, perfect for coaching and wellness brands',
    previewText: "Hi there! I'm Sarah, and I'm here to help your brand connect with your audience in an authentic, engaging way.",
  },
  {
    id: '21m00Tcm4TlvDq8ikWAM', // Rachel
    name: 'Rachel',
    description: 'Clear & Authoritative',
    gender: 'female',
    age: '30s',
    tone: 'Clear and confident, ideal for corporate and educational content',
    previewText: "Welcome! I'm Rachel. Let me show you how AI spokespersons can transform your content strategy.",
  },
  {
    id: 'IKne3meq5aSn9XLyUdCD', // Charlie
    name: 'Charlie',
    description: 'Energetic & Youthful',
    gender: 'male',
    age: '20s',
    tone: 'Dynamic and energetic, great for fitness and tech brands',
    previewText: "Hey! I'm Charlie, ready to bring energy and excitement to your brand's message!",
  },
  {
    id: 'TX3LPaxmHKxFdv7VOQHJ', // Liam
    name: 'Liam',
    description: 'Deep & Trustworthy',
    gender: 'male',
    age: '40s',
    tone: 'Deep and reassuring, perfect for finance and healthcare',
    previewText: "Hello, I'm Liam. I bring a sense of trust and reliability to every message I deliver.",
  },
  {
    id: 'XB0fDUnXU5powFXDhCwa', // Charlotte
    name: 'Charlotte',
    description: 'Sophisticated & Elegant',
    gender: 'female',
    age: '40s',
    tone: 'Refined and elegant, ideal for luxury and high-end brands',
    previewText: "Good day. I'm Charlotte, bringing sophistication and elegance to your brand communication.",
  },
  {
    id: 'pFZP5JQG7iQjIQuC4Bku', // Lily
    name: 'Lily',
    description: 'Warm & Conversational',
    gender: 'female',
    age: '20s',
    tone: 'Casual and relatable, perfect for social media content',
    previewText: "Hey! I'm Lily, and I'm all about keeping things real and relatable for your audience.",
  },
];

// GET - Return list of available voices
export async function GET() {
  return NextResponse.json({
    voices: SAMPLE_VOICES.map(({ id, name, description, gender, age, tone, previewText }) => ({
      id,
      name,
      description,
      gender,
      age,
      tone,
      previewText,
    })),
  });
}

// POST - Generate audio preview for a specific voice
export async function POST(request: Request) {
  try {
    const { voiceId, text } = await request.json();

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
    const textToSpeak = text || voice.previewText;

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

    return NextResponse.json({
      audio: base64Audio,
      voice: {
        id: voice.id,
        name: voice.name,
      },
    });

  } catch (error) {
    console.error('Voice preview error:', error);
    return NextResponse.json(
      { error: 'Failed to generate voice preview' },
      { status: 500 }
    );
  }
}
