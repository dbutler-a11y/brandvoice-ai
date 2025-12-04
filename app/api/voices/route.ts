import { NextResponse } from 'next/server';

// Voice data structure
// This will later integrate with ElevenLabs API
interface Voice {
  id: string;
  name: string;
  displayName: string;
  gender: 'Male' | 'Female';
  characteristics: string[];
  industries: string[];
  category: string[];
  sampleText: string;
  audioUrl?: string;
  elevenLabsVoiceId?: string; // For future ElevenLabs integration
}

// Sample voice data
const voices: Voice[] = [
  {
    id: 'sarah-warm',
    name: 'Sarah',
    displayName: 'Sarah - Warm & Professional',
    gender: 'Female',
    characteristics: ['Warm', 'Articulate', 'American', 'Trustworthy'],
    industries: ['Med Spa', 'Wellness', 'Healthcare', 'Beauty'],
    category: ['Warm & Friendly', 'Professional & Authoritative'],
    sampleText: "Hi, I'm Sarah, and I'm excited to be your AI spokesperson. I'll help you connect with your audience in a warm and professional way that builds trust and drives results.",
    elevenLabsVoiceId: 'EXAVITQu4vr4xnSDxMaL', // Placeholder for ElevenLabs
  },
  {
    id: 'michael-authoritative',
    name: 'Michael',
    displayName: 'Michael - Authoritative & Clear',
    gender: 'Male',
    characteristics: ['Authoritative', 'Clear', 'American', 'Confident'],
    industries: ['Legal', 'Finance', 'B2B', 'Consulting'],
    category: ['Professional & Authoritative'],
    sampleText: "Hi, I'm Michael. With a clear and authoritative voice, I'll deliver your message with confidence and credibility, perfect for professional services and B2B communications.",
    elevenLabsVoiceId: 'TxGEqnHWrfWFTfGW9XjX', // Placeholder
  },
  {
    id: 'emily-energetic',
    name: 'Emily',
    displayName: 'Emily - Energetic & Upbeat',
    gender: 'Female',
    characteristics: ['Energetic', 'Upbeat', 'American', 'Youthful'],
    industries: ['Fitness', 'Retail', 'E-commerce', 'Events'],
    category: ['Energetic & Motivating', 'Warm & Friendly'],
    sampleText: "Hey there! I'm Emily, and I bring energy and enthusiasm to every message. Let's get your audience excited about what you have to offer!",
    elevenLabsVoiceId: '21m00Tcm4TlvDq8ikWAM', // Placeholder
  },
  {
    id: 'david-calm',
    name: 'David',
    displayName: 'David - Calm & Reassuring',
    gender: 'Male',
    characteristics: ['Calm', 'Reassuring', 'British', 'Soothing'],
    industries: ['Healthcare', 'Mental Health', 'Education', 'Non-Profit'],
    category: ['Calm & Reassuring', 'Professional & Authoritative'],
    sampleText: "Hello, I'm David. With a calm and reassuring presence, I help your audience feel comfortable and informed, making complex topics easy to understand.",
    elevenLabsVoiceId: 'pNInz6obpgDQGcFmaJgB', // Placeholder
  },
  {
    id: 'jessica-friendly',
    name: 'Jessica',
    displayName: 'Jessica - Friendly & Conversational',
    gender: 'Female',
    characteristics: ['Friendly', 'Conversational', 'American', 'Approachable'],
    industries: ['Hospitality', 'Real Estate', 'Coaching', 'Lifestyle'],
    category: ['Warm & Friendly'],
    sampleText: "Hi! I'm Jessica, and I love having real conversations with your audience. My friendly and approachable style makes everyone feel right at home.",
    elevenLabsVoiceId: 'XrExE9yKIg1WjnnlVkGX', // Placeholder
  },
  {
    id: 'james-motivating',
    name: 'James',
    displayName: 'James - Motivating & Inspiring',
    gender: 'Male',
    characteristics: ['Motivating', 'Inspiring', 'American', 'Dynamic'],
    industries: ['Coaching', 'Fitness', 'Personal Development', 'Business'],
    category: ['Energetic & Motivating', 'Professional & Authoritative'],
    sampleText: "What's up! I'm James, and I'm here to motivate and inspire your audience to take action. Let's turn your message into a movement!",
    elevenLabsVoiceId: 'ErXwobaYiN019PkySvjV', // Placeholder
  },
  {
    id: 'rachel-sophisticated',
    name: 'Rachel',
    displayName: 'Rachel - Sophisticated & Elegant',
    gender: 'Female',
    characteristics: ['Sophisticated', 'Elegant', 'British', 'Refined'],
    industries: ['Luxury', 'Fashion', 'High-End Services', 'Art'],
    category: ['Professional & Authoritative', 'Calm & Reassuring'],
    sampleText: "Good day, I'm Rachel. With a sophisticated and elegant tone, I bring a touch of refinement to your brand's message, perfect for luxury and high-end markets.",
    elevenLabsVoiceId: 'MF3mGyEYCl7XYWbV9V6O', // Placeholder
  },
  {
    id: 'chris-versatile',
    name: 'Chris',
    displayName: 'Chris - Versatile & Adaptable',
    gender: 'Male',
    characteristics: ['Versatile', 'Adaptable', 'American', 'Professional'],
    industries: ['Technology', 'SaaS', 'Marketing', 'General Business'],
    category: ['Professional & Authoritative', 'Warm & Friendly'],
    sampleText: "Hi, I'm Chris. My versatile voice adapts to any message or audience, making me perfect for tech companies and businesses that need flexibility.",
    elevenLabsVoiceId: 'iP95p4xoKVk53GoZ742B', // Placeholder
  },
  {
    id: 'olivia-caring',
    name: 'Olivia',
    displayName: 'Olivia - Caring & Compassionate',
    gender: 'Female',
    characteristics: ['Caring', 'Compassionate', 'American', 'Gentle'],
    industries: ['Healthcare', 'Senior Care', 'Counseling', 'Non-Profit'],
    category: ['Calm & Reassuring', 'Warm & Friendly'],
    sampleText: "Hello, I'm Olivia. My caring and compassionate voice creates a safe space for your audience, perfect for sensitive topics and healthcare communications.",
    elevenLabsVoiceId: 'jsCqWAovK2LkecY7zXl4', // Placeholder
  },
  {
    id: 'alex-modern',
    name: 'Alex',
    displayName: 'Alex - Modern & Tech-Savvy',
    gender: 'Male',
    characteristics: ['Modern', 'Tech-Savvy', 'American', 'Innovative'],
    industries: ['Tech Startups', 'AI/ML', 'SaaS', 'Innovation'],
    category: ['Energetic & Motivating', 'Professional & Authoritative'],
    sampleText: "Hey, I'm Alex. With a modern and tech-savvy approach, I speak the language of innovation and help your cutting-edge brand connect with forward-thinking audiences.",
    elevenLabsVoiceId: 'onwK4e9ZLuTAKqWW03F9', // Placeholder
  },
  {
    id: 'sophia-natural',
    name: 'Sophia',
    displayName: 'Sophia - Natural & Authentic',
    gender: 'Female',
    characteristics: ['Natural', 'Authentic', 'American', 'Genuine'],
    industries: ['Sustainability', 'Organic Products', 'Wellness', 'Lifestyle'],
    category: ['Warm & Friendly', 'Calm & Reassuring'],
    sampleText: "Hi, I'm Sophia. My natural and authentic voice resonates with audiences who value genuine connections and sustainable living. Let's tell your story in a real way.",
    elevenLabsVoiceId: 'jBpfuIE2acCO8z3wKNLl', // Placeholder
  },
  {
    id: 'marcus-powerful',
    name: 'Marcus',
    displayName: 'Marcus - Powerful & Commanding',
    gender: 'Male',
    characteristics: ['Powerful', 'Commanding', 'American', 'Bold'],
    industries: ['Automotive', 'Sports', 'Construction', 'Industrial'],
    category: ['Energetic & Motivating', 'Professional & Authoritative'],
    sampleText: "I'm Marcus, and I deliver your message with power and command. Perfect for industries that need a bold, strong voice that demands attention.",
    elevenLabsVoiceId: 'flq6f7yk4E4fJM5XTYuZ', // Placeholder
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');

    // If requesting ElevenLabs voices directly
    if (source === 'elevenlabs' && process.env.ELEVENLABS_API_KEY) {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          success: true,
          voices: data.voices,
          count: data.voices.length,
          source: 'elevenlabs',
        });
      }
    }

    // Return curated voices with ElevenLabs voice IDs
    return NextResponse.json({
      success: true,
      voices,
      count: voices.length,
      source: 'curated',
      message: 'Voice data retrieved successfully.',
    });
  } catch (error) {
    console.error('Error fetching voices:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch voices',
        voices: [],
      },
      { status: 500 }
    );
  }
}

// POST endpoint for voice generation with ElevenLabs
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { voiceId, text, stability = 0.5, similarityBoost = 0.75 } = body;

    if (!voiceId || !text) {
      return NextResponse.json(
        { success: false, error: 'voiceId and text are required' },
        { status: 400 }
      );
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'ElevenLabs API key not configured. Add ELEVENLABS_API_KEY to your .env file.',
      }, { status: 500 });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability,
            similarity_boost: similarityBoost,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('ElevenLabs API error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to generate speech' },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating voice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate voice' },
      { status: 500 }
    );
  }
}
