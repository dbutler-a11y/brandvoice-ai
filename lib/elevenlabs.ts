// ElevenLabs API Integration
// Docs: https://elevenlabs.io/docs/api-reference

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';

export interface Voice {
  voice_id: string;
  name: string;
  category: string;
  description: string;
  preview_url: string;
  labels: {
    accent?: string;
    description?: string;
    age?: string;
    gender?: string;
    use_case?: string;
  };
}

export interface VoicesResponse {
  voices: Voice[];
}

export interface TextToSpeechOptions {
  text: string;
  voiceId: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

// Get all available voices
export async function getVoices(): Promise<Voice[]> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY is not configured');
  }

  const response = await fetch(`${ELEVENLABS_BASE_URL}/voices`, {
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch voices: ${response.statusText}`);
  }

  const data: VoicesResponse = await response.json();
  return data.voices;
}

// Get a specific voice by ID
export async function getVoice(voiceId: string): Promise<Voice> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY is not configured');
  }

  const response = await fetch(`${ELEVENLABS_BASE_URL}/voices/${voiceId}`, {
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch voice: ${response.statusText}`);
  }

  return response.json();
}

// Generate speech from text
export async function textToSpeech(options: TextToSpeechOptions): Promise<ArrayBuffer> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY is not configured');
  }

  const {
    text,
    voiceId,
    modelId = 'eleven_monolingual_v1',
    stability = 0.5,
    similarityBoost = 0.75,
    style = 0,
    useSpeakerBoost = true,
  } = options;

  const response = await fetch(
    `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
          style,
          use_speaker_boost: useSpeakerBoost,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to generate speech: ${error}`);
  }

  return response.arrayBuffer();
}

// Stream speech (for real-time playback)
export async function textToSpeechStream(options: TextToSpeechOptions): Promise<ReadableStream<Uint8Array>> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY is not configured');
  }

  const {
    text,
    voiceId,
    modelId = 'eleven_monolingual_v1',
    stability = 0.5,
    similarityBoost = 0.75,
  } = options;

  const response = await fetch(
    `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}/stream`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
        },
      }),
    }
  );

  if (!response.ok || !response.body) {
    throw new Error(`Failed to stream speech: ${response.statusText}`);
  }

  return response.body;
}

// Get voice sample/preview URL (useful for spokesperson selection)
export function getVoicePreviewUrl(voice: Voice): string {
  return voice.preview_url;
}
