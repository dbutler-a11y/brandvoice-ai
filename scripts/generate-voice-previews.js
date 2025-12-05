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

// Voice configurations - same as in the API
const VOICES = [
  {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'sarah',
    previewText: "Hi there! I'm Sarah, and I'm here to help your brand connect with your audience in an authentic, engaging way.",
  },
  {
    id: '21m00Tcm4TlvDq8ikWAM',
    name: 'rachel',
    previewText: "Welcome! I'm Rachel. Let me show you how AI spokespersons can transform your content strategy.",
  },
  {
    id: 'IKne3meq5aSn9XLyUdCD',
    name: 'charlie',
    previewText: "Hey! I'm Charlie, ready to bring energy and excitement to your brand's message!",
  },
  {
    id: 'TX3LPaxmHKxFdv7VOQHJ',
    name: 'liam',
    previewText: "Hello, I'm Liam. I bring a sense of trust and reliability to every message I deliver.",
  },
  {
    id: 'XB0fDUnXU5powFXDhCwa',
    name: 'charlotte',
    previewText: "Good day. I'm Charlotte, bringing sophistication and elegance to your brand communication.",
  },
  {
    id: 'pFZP5JQG7iQjIQuC4Bku',
    name: 'lily',
    previewText: "Hey! I'm Lily, and I'm all about keeping things real and relatable for your audience.",
  },
];

// Output directory
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audio', 'voices');

async function generateVoicePreview(voice) {
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
    const outputPath = path.join(OUTPUT_DIR, `${voice.name}.mp3`);

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

  let successCount = 0;
  let failCount = 0;

  for (const voice of VOICES) {
    const success = await generateVoicePreview(voice);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // Small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n========================================');
  console.log(`Complete! ${successCount} succeeded, ${failCount} failed`);
  console.log('========================================');

  if (successCount > 0) {
    console.log('\nAudio files saved to: public/audio/voices/');
    console.log('These will be served at: /audio/voices/{name}.mp3');
  }
}

main().catch(console.error);
