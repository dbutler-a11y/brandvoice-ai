// BrandVoice Sales Bots - Combined Runner
// Run both Telegram and Discord bots from one process

import { loadLeads } from './shared/database';

console.log('═══════════════════════════════════════════');
console.log('  BrandVoice Sales Bots');
console.log('═══════════════════════════════════════════');
console.log('');

// Load leads database
console.log('Loading lead database...');
loadLeads();

// Determine which bots to run
const runTelegram = process.env.TELEGRAM_BOT_TOKEN && process.env.RUN_TELEGRAM !== 'false';
const runDiscord = process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_CLIENT_ID && process.env.RUN_DISCORD !== 'false';

if (runTelegram) {
  console.log('Starting Telegram bot...');
  require('./telegram/bot');
}

if (runDiscord) {
  console.log('Starting Discord bot...');
  require('./discord/bot');
}

if (!runTelegram && !runDiscord) {
  console.error('');
  console.error('No bots configured to run!');
  console.error('');
  console.error('Required environment variables:');
  console.error('  Telegram: TELEGRAM_BOT_TOKEN');
  console.error('  Discord:  DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID');
  console.error('');
  console.error('See .env.example for configuration.');
  process.exit(1);
}

console.log('');
console.log('Bots running:');
if (runTelegram) console.log('  ✓ Telegram');
if (runDiscord) console.log('  ✓ Discord');
console.log('');
console.log('Press Ctrl+C to stop.');
console.log('═══════════════════════════════════════════');
