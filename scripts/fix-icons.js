const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const gridPath = '/Users/brittanymurphy/Downloads/20251230_1847_BrandVoice Studio Icon Grid_simple_compose_01kdrxxvhweb6a8h43r1dtydvk.png';
const outputDir = '/Users/brittanymurphy/Desktop/Butler/Projects/ai-spokesperson-studio/public/images/icons';

// Grid is 6 columns x 5 rows = 30 icons
const COLS = 6;
const ROWS = 5;

// Icons to re-extract (the cut-off ones)
// Looking at the grid: Row 1, Col 3 = microphone (index 2)
// Row 5, Col 1 = megaphone (index 25)
// Row 5, Col 3 = globe (index 27 - was podcast-mic/video-camera)

async function extractIcon(imageBuffer, width, height, row, col, name) {
  const cellWidth = Math.floor(width / COLS);
  const cellHeight = Math.floor(height / ROWS);

  const left = col * cellWidth;
  const top = row * cellHeight;

  const outputPath = path.join(outputDir, `${name}.png`);

  // Extract with a bit of padding adjustment
  await sharp(imageBuffer)
    .extract({
      left: left,
      top: top,
      width: cellWidth,
      height: cellHeight
    })
    .toFile(outputPath + '.temp');

  // Remove background
  const { execSync } = require('child_process');
  try {
    execSync(`python3 -c "
from rembg import remove
from PIL import Image
with Image.open('${outputPath}.temp') as img:
    output = remove(img)
    output.save('${outputPath}')
"`);
    fs.unlinkSync(outputPath + '.temp');
    console.log('Extracted and cleaned:', name);
  } catch (e) {
    // If rembg fails, just rename the temp file
    fs.renameSync(outputPath + '.temp', outputPath);
    console.log('Extracted (no bg removal):', name);
  }
}

async function main() {
  const metadata = await sharp(gridPath).metadata();
  console.log('Grid dimensions:', metadata.width, 'x', metadata.height);

  const imageBuffer = await sharp(gridPath).toBuffer();

  // Re-extract all icons with correct names based on visual inspection
  const iconMap = [
    // Row 0
    { row: 0, col: 0, name: 'megaphone' },
    { row: 0, col: 1, name: 'play-button' },
    { row: 0, col: 2, name: 'microphone' },
    { row: 0, col: 3, name: 'waveform' },
    { row: 0, col: 4, name: 'voice-profile' },
    { row: 0, col: 5, name: 'broadcast-tower' },
    // Row 1
    { row: 1, col: 0, name: 'play-video' },
    { row: 1, col: 1, name: 'play-desktop' },
    { row: 1, col: 2, name: 'film-reel' },
    { row: 1, col: 3, name: 'presentation' },
    { row: 1, col: 4, name: 'clapperboard' },
    { row: 1, col: 5, name: 'record' },
    // Row 2
    { row: 2, col: 0, name: 'network-nodes' },
    { row: 2, col: 1, name: 'ai-brain' },
    { row: 2, col: 2, name: 'sparkle' },
    { row: 2, col: 3, name: 'lightning' },
    { row: 2, col: 4, name: 'infinity' },
    { row: 2, col: 5, name: 'gear-play' },
    // Row 3
    { row: 3, col: 0, name: 'rocket' },
    { row: 3, col: 1, name: 'chart-growth' },
    { row: 3, col: 2, name: 'target' },
    { row: 3, col: 3, name: 'crown' },
    { row: 3, col: 4, name: 'diamond' },
    { row: 3, col: 5, name: 'trophy' },
    // Row 4
    { row: 4, col: 0, name: 'bv-logo' },
    { row: 4, col: 1, name: 'megaphone-alt' },
    { row: 4, col: 2, name: 'audio-heart' },
    { row: 4, col: 3, name: 'globe' },
    { row: 4, col: 4, name: 'play-shield' },
    { row: 4, col: 5, name: 'starburst' },
  ];

  for (const icon of iconMap) {
    await extractIcon(imageBuffer, metadata.width, metadata.height, icon.row, icon.col, icon.name);
  }

  console.log('Done! All icons extracted.');
}

main().catch(console.error);
