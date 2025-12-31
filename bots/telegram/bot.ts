// BrandVoice Sales Bot - Telegram Implementation

import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import { CONFIG } from '../shared/types';
import { FlowEngine } from '../shared/flow-engine';
import {
  getOrCreateLead,
  updateLead,
  updateLeadStep,
  incrementMessageCount,
  getLeadsNeedingFollowUp,
  getStats
} from '../shared/database';
import { MESSAGES } from '../shared/messages';

// Initialize bot
const token = CONFIG.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('TELEGRAM_BOT_TOKEN is not set!');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log('BrandVoice Telegram Bot starting...');

// ============================================
// MESSAGE HANDLER
// ============================================

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id.toString() || chatId.toString();
  const username = msg.from?.username;
  const text = msg.text?.trim();

  // Ignore non-text messages
  if (!text) return;

  // Skip commands - they're handled by onText handlers below
  if (text.startsWith('/')) return;

  console.log(`[Telegram] ${username || userId}: ${text}`);

  try {
    // Get or create lead
    const lead = getOrCreateLead('telegram', userId, username);

    // Increment message count
    incrementMessageCount(lead.id);

    // Show typing while processing
    await bot.sendChatAction(chatId, 'typing');

    // Process message through flow engine WITH AI support
    const response = await FlowEngine.processMessageWithAI(lead, text);

    if (response.usedAI) {
      console.log(`[Telegram] AI response for ${username || userId}`);
    }

    // Update lead if needed
    if (response.updateLead) {
      updateLead(lead.id, response.updateLead);
    }

    // Update step
    updateLeadStep(lead.id, response.nextStep);

    // Send response messages with delays
    for (let i = 0; i < response.messages.length; i++) {
      const message = response.messages[i];

      // Add typing indicator
      await bot.sendChatAction(chatId, 'typing');

      // Wait a bit to simulate typing (longer for AI responses)
      const baseDelay = response.usedAI ? 800 : 500;
      const delay = Math.min(3000, Math.max(baseDelay, message.length * 5));
      await sleep(delay);

      // Send message with markdown
      await bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        disable_web_page_preview: false
      });

      // Small delay between messages
      if (i < response.messages.length - 1) {
        await sleep(800);
      }
    }

  } catch (error) {
    console.error('Error processing message:', error);
    await bot.sendMessage(chatId, MESSAGES.FALLBACK);
  }
});

// ============================================
// CALLBACK QUERY HANDLER (for inline buttons)
// ============================================

bot.on('callback_query', async (query) => {
  const chatId = query.message?.chat.id;
  const userId = query.from.id.toString();
  const username = query.from.username;
  const data = query.data;

  if (!chatId || !data) return;

  console.log(`[Telegram Callback] ${username || userId}: ${data}`);

  try {
    // Acknowledge the callback
    await bot.answerCallbackQuery(query.id);

    // Get lead and process as regular message
    const lead = getOrCreateLead('telegram', userId, username);
    incrementMessageCount(lead.id);

    const response = FlowEngine.processMessage(lead, data);

    if (response.updateLead) {
      updateLead(lead.id, response.updateLead);
    }
    updateLeadStep(lead.id, response.nextStep);

    for (const message of response.messages) {
      await bot.sendChatAction(chatId, 'typing');
      await sleep(500);
      await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    }

  } catch (error) {
    console.error('Error processing callback:', error);
  }
});

// ============================================
// BOT COMMANDS
// ============================================

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id.toString() || chatId.toString();
  const username = msg.from?.username;

  const lead = getOrCreateLead('telegram', userId, username);

  // Reset lead flow for fresh start
  updateLead(lead.id, {
    currentFlow: null,
    currentStep: 'welcome'
  });

  await bot.sendMessage(chatId, MESSAGES.WELCOME_GENERIC, { parse_mode: 'Markdown' });
});

bot.onText(/\/help/, async (msg) => {
  await bot.sendMessage(msg.chat.id, MESSAGES.CMD_HELP, { parse_mode: 'Markdown' });
});

bot.onText(/\/pricing/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id.toString() || chatId.toString();
  const username = msg.from?.username;

  const lead = getOrCreateLead('telegram', userId, username);
  const response = FlowEngine.handleCommand('/pricing', lead);

  for (const message of response.messages) {
    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }
});

bot.onText(/\/samples/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id.toString() || chatId.toString();
  const username = msg.from?.username;

  const lead = getOrCreateLead('telegram', userId, username);
  const response = FlowEngine.handleCommand('/samples', lead);

  for (const message of response.messages) {
    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }
});

bot.onText(/\/book/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id.toString() || chatId.toString();
  const username = msg.from?.username;

  const lead = getOrCreateLead('telegram', userId, username);
  const response = FlowEngine.handleCommand('/book', lead);

  if (response.updateLead) {
    updateLead(lead.id, response.updateLead);
  }

  for (const message of response.messages) {
    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }
});

bot.onText(/\/sale/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id.toString() || chatId.toString();
  const username = msg.from?.username;

  const lead = getOrCreateLead('telegram', userId, username);
  const response = FlowEngine.handleCommand('/sale', lead);

  for (const message of response.messages) {
    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }
});

bot.onText(/\/faq/, async (msg) => {
  await bot.sendMessage(msg.chat.id, MESSAGES.CMD_FAQ, { parse_mode: 'Markdown' });
});

// Admin command: Get stats (only for authorized users)
bot.onText(/\/stats/, async (msg) => {
  const chatId = msg.chat.id;
  const adminIds = process.env.ADMIN_TELEGRAM_IDS?.split(',') || [];

  if (!adminIds.includes(msg.from?.id.toString() || '')) {
    return; // Silently ignore non-admin
  }

  const stats = getStats();

  const statsMessage = `📊 *BrandVoice Bot Stats*

*Total Leads:* ${stats.total}

*By Status:*
• New: ${stats.byStatus.new}
• Engaged: ${stats.byStatus.engaged}
• Qualified: ${stats.byStatus.qualified}
• Calendly Sent: ${stats.byStatus.calendly_sent}
• Call Booked: ${stats.byStatus.call_booked}
• Checkout Sent: ${stats.byStatus.checkout_sent}
• Converted: ${stats.byStatus.converted}
• Lost: ${stats.byStatus.lost}

*By Platform:*
• Telegram: ${stats.byPlatform.telegram}
• Discord: ${stats.byPlatform.discord}

*Conversion Rate:* ${stats.conversionRate.toFixed(1)}%`;

  await bot.sendMessage(chatId, statsMessage, { parse_mode: 'Markdown' });
});

// ============================================
// FOLLOW-UP SCHEDULER
// ============================================

async function sendFollowUps(): Promise<void> {
  const leadsToFollowUp = getLeadsNeedingFollowUp(24);

  for (const lead of leadsToFollowUp) {
    if (lead.platform !== 'telegram') continue;

    try {
      const product = lead.currentFlow;
      if (!product || product === 'discovery') continue;

      // Get days until sale ends for the message
      const now = new Date();
      const saleEnd = new Date('2025-01-07T23:59:59');
      const daysLeft = Math.max(0, Math.ceil((saleEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

      const followUpMessage = MESSAGES.FOLLOW_UP_24H(product as any, daysLeft);

      await bot.sendMessage(parseInt(lead.oddy), followUpMessage, {
        parse_mode: 'Markdown'
      });

      // Update lead to avoid re-sending
      updateLead(lead.id, { lastMessageAt: new Date() });

      console.log(`[Follow-up] Sent to ${lead.username || lead.oddy}`);

      // Rate limit
      await sleep(2000);

    } catch (error) {
      console.error(`Error sending follow-up to ${lead.id}:`, error);
    }
  }
}

// Run follow-ups every 6 hours
setInterval(sendFollowUps, 6 * 60 * 60 * 1000);

// ============================================
// UTILITIES
// ============================================

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// ERROR HANDLING
// ============================================

bot.on('polling_error', (error) => {
  console.error('Telegram polling error:', error);
});

bot.on('error', (error) => {
  console.error('Telegram bot error:', error);
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

process.on('SIGINT', () => {
  console.log('Shutting down Telegram bot...');
  bot.stopPolling();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down Telegram bot...');
  bot.stopPolling();
  process.exit(0);
});

console.log('BrandVoice Telegram Bot is running!');
console.log('Commands: /start, /help, /pricing, /samples, /book, /sale, /faq');

export { bot };
