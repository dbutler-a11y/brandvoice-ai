/**
 * Script to pre-generate voice preview audio files
 *
 * Run with: node scripts/generate-voice-previews.js
 *
 * Requires ELEVENLABS_API_KEY in .env file
 */

const fs = require('fs');
const path = require('path');

// Read .env file manually
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

let ELEVENLABS_API_KEY = '';
for (const line of envLines) {
  if (line.startsWith('ELEVENLABS_API_KEY=')) {
    ELEVENLABS_API_KEY = line.split('=')[1].replace(/["']/g, '').trim();
    break;
  }
}

if (!ELEVENLABS_API_KEY) {
  console.error('ERROR: ELEVENLABS_API_KEY not found in .env file');
  process.exit(1);
}

// Voice configurations - matching the voices in app/api/voices/route.ts
// Using real ElevenLabs voice IDs from their library
const VOICES = [
  // Already downloaded
  {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'sarah',
    previewText: "Hi, I'm Sarah, and I'm excited to be your AI spokesperson. I'll help you connect with your audience in a warm and professional way that builds trust and drives results.",
    skip: true, // Already have this one
  },
  {
    id: '21m00Tcm4TlvDq8ikWAM',
    name: 'rachel',
    previewText: "Good day, I'm Rachel. With a sophisticated and elegant tone, I bring a touch of refinement to your brand's message, perfect for luxury and high-end markets.",
    skip: true,
  },
  {
    id: 'IKne3meq5aSn9XLyUdCD',
    name: 'charlie',
    previewText: "Hey! I'm Charlie, ready to bring energy and excitement to your brand's message!",
    skip: true,
  },
  {
    id: 'TX3LPaxmHKxFdv7VOQHJ',
    name: 'liam',
    previewText: "Hello, I'm Liam. I bring a sense of trust and reliability to every message I deliver.",
    skip: true,
  },
  {
    id: 'XB0fDUnXU5powFXDhCwa',
    name: 'charlotte',
    previewText: "Good day. I'm Charlotte, bringing sophistication and elegance to your brand communication.",
    skip: true,
  },
  {
    id: 'pFZP5JQG7iQjIQuC4Bku',
    name: 'lily',
    previewText: "Hey! I'm Lily, and I'm all about keeping things real and relatable for your audience.",
    skip: true,
  },
  // New voices to download
  {
    id: 'TxGEqnHWrfWFTfGW9XjX',
    name: 'michael',
    previewText: "Hi, I'm Michael. With a clear and authoritative voice, I'll deliver your message with confidence and credibility, perfect for professional services and B2B communications.",
  },
  {
    id: 'pNInz6obpgDQGcFmaJgB',
    name: 'david',
    previewText: "Hello, I'm David. With a calm and reassuring presence, I help your audience feel comfortable and informed, making complex topics easy to understand.",
  },
  {
    id: 'ErXwobaYiN019PkySvjV',
    name: 'james',
    previewText: "What's up! I'm James, and I'm here to motivate and inspire your audience to take action. Let's turn your message into a movement!",
  },
  {
    id: 'jsCqWAovK2LkecY7zXl4',
    name: 'olivia',
    previewText: "Hello, I'm Olivia. My caring and compassionate voice creates a safe space for your audience, perfect for sensitive topics and healthcare communications.",
  },
  {
    id: 'onwK4e9ZLuTAKqWW03F9',
    name: 'alex',
    previewText: "Hey, I'm Alex. With a modern and tech-savvy approach, I speak the language of innovation and help your cutting-edge brand connect with forward-thinking audiences.",
  },
  {
    id: 'jBpfuIE2acCO8z3wKNLl',
    name: 'sophia',
    previewText: "Hi, I'm Sophia. My natural and authentic voice resonates with audiences who value genuine connections and sustainable living. Let's tell your story in a real way.",
  },
  {
    id: 'flq6f7yk4E4fJM5XTYuZ',
    name: 'marcus',
    previewText: "I'm Marcus, and I deliver your message with power and command. Perfect for industries that need a bold, strong voice that demands attention.",
  },
  {
    id: 'XrExE9yKIg1WjnnlVkGX',
    name: 'jessica',
    previewText: "Hi! I'm Jessica, and I love having real conversations with your audience. My friendly and approachable style makes everyone feel right at home.",
  },
  {
    id: 'iP95p4xoKVk53GoZ742B',
    name: 'chris',
    previewText: "Hi, I'm Chris. My versatile voice adapts to any message or audience, making me perfect for tech companies and businesses that need flexibility.",
  },
  {
    id: '9BWtsMINqrJLrRacOk9x',
    name: 'emily',
    previewText: "Hey there! I'm Emily, and I bring energy and enthusiasm to every message. Let's get your audience excited about what you have to offer!",
  },
];

// Output directory
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audio', 'voices');

async function generateVoicePreview(voice) {
  if (voice.skip) {
    console.log(`Skipping ${voice.name} (already exists)...`);
    return true;
  }

  // Check if file already exists
  const outputPath = path.join(OUTPUT_DIR, `${voice.name}.mp3`);
  if (fs.existsSync(outputPath)) {
    console.log(`Skipping ${voice.name} (file exists)...`);
    return true;
  }

  console.log(`Generating preview for ${voice.name}...`);

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice.id}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: voice.previewText,
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
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();

    fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
    console.log(`  ✓ Saved: ${outputPath}`);

    return true;
  } catch (error) {
    console.error(`  ✗ Failed for ${voice.name}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('========================================');
  console.log('Voice Preview Generator');
  console.log('========================================\n');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created directory: ${OUTPUT_DIR}\n`);
  }

  // Filter to only new voices
  const newVoices = VOICES.filter(v => !v.skip);
  console.log(`Found ${newVoices.length} new voices to generate\n`);

  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (const voice of VOICES) {
    if (voice.skip) {
      skipCount++;
      continue;
    }

    const success = await generateVoicePreview(voice);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // Small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  console.log('\n========================================');
  console.log(`Complete! ${successCount} generated, ${skipCount} skipped, ${failCount} failed`);
  console.log('========================================');

  if (successCount > 0) {
    console.log('\nAudio files saved to: public/audio/voices/');
    console.log('These will be served at: /audio/voices/{name}.mp3');
  }
}

main().catch(console.error);
