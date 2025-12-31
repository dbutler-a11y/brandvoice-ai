// BrandVoice Sales Bot - Discord Implementation

import {
  Client,
  GatewayIntentBits,
  Message,
  Partials,
  Events,
  REST,
  Routes,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ChannelType
} from 'discord.js';
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
import { MESSAGES, getDaysUntilSaleEnds } from '../shared/messages';

// Initialize client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [
    Partials.Channel, // Required for DMs
    Partials.Message
  ]
});

const token = CONFIG.DISCORD_BOT_TOKEN;
const clientId = CONFIG.DISCORD_CLIENT_ID;

if (!token || !clientId) {
  console.error('DISCORD_BOT_TOKEN or DISCORD_CLIENT_ID is not set!');
  process.exit(1);
}

// ============================================
// SLASH COMMANDS REGISTRATION
// ============================================

const commands = [
  new SlashCommandBuilder()
    .setName('start')
    .setDescription('Start a conversation with BrandVoice'),

  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get help with BrandVoice bot commands'),

  new SlashCommandBuilder()
    .setName('pricing')
    .setDescription('View all BrandVoice packages and pricing'),

  new SlashCommandBuilder()
    .setName('samples')
    .setDescription('See our portfolio of AI spokesperson videos'),

  new SlashCommandBuilder()
    .setName('book')
    .setDescription('Book a discovery call'),

  new SlashCommandBuilder()
    .setName('sale')
    .setDescription('Get New Year\'s sale details'),

  new SlashCommandBuilder()
    .setName('faq')
    .setDescription('View frequently asked questions'),

  new SlashCommandBuilder()
    .setName('stats')
    .setDescription('View bot statistics (admin only)')
].map(command => command.toJSON());

async function registerCommands(): Promise<void> {
  const rest = new REST({ version: '10' }).setToken(token!);

  try {
    console.log('Registering Discord slash commands...');

    await rest.put(
      Routes.applicationCommands(clientId!),
      { body: commands }
    );

    console.log('Slash commands registered!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

// ============================================
// BOT READY
// ============================================

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Discord bot logged in as ${readyClient.user.tag}!`);
  registerCommands();
});

// ============================================
// DM MESSAGE HANDLER
// ============================================

client.on(Events.MessageCreate, async (message: Message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Only handle DMs for sales flow
  if (message.channel.type !== ChannelType.DM) return;

  const userId = message.author.id;
  const username = message.author.username;
  const text = message.content.trim();

  if (!text) return;

  console.log(`[Discord DM] ${username}: ${text}`);

  try {
    // Get or create lead
    const lead = getOrCreateLead('discord', userId, username);

    // Increment message count
    incrementMessageCount(lead.id);

    // Show typing while processing
    await message.channel.sendTyping();

    // Process message through flow engine WITH AI support
    const response = await FlowEngine.processMessageWithAI(lead, text);

    if (response.usedAI) {
      console.log(`[Discord] AI response for ${username}`);
    }

    // Update lead if needed
    if (response.updateLead) {
      updateLead(lead.id, response.updateLead);
    }

    // Update step
    updateLeadStep(lead.id, response.nextStep);

    // Send response messages with delays
    for (let i = 0; i < response.messages.length; i++) {
      const msg = response.messages[i];

      // Show typing indicator
      await message.channel.sendTyping();

      // Simulate typing delay (longer for AI responses)
      const baseDelay = response.usedAI ? 800 : 500;
      const delay = Math.min(3000, Math.max(baseDelay, msg.length * 5));
      await sleep(delay);

      // Send message
      await message.channel.send(msg);

      // Small delay between messages
      if (i < response.messages.length - 1) {
        await sleep(800);
      }
    }

  } catch (error) {
    console.error('Error processing Discord DM:', error);
    await message.channel.send(MESSAGES.FALLBACK);
  }
});

// ============================================
// SLASH COMMAND HANDLER
// ============================================

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const userId = interaction.user.id;
  const username = interaction.user.username;
  const commandName = interaction.commandName;

  console.log(`[Discord Command] ${username}: /${commandName}`);

  try {
    const lead = getOrCreateLead('discord', userId, username);

    switch (commandName) {
      case 'start':
        await handleStart(interaction, lead);
        break;

      case 'help':
        await handleHelp(interaction);
        break;

      case 'pricing':
        await handlePricing(interaction, lead);
        break;

      case 'samples':
        await handleSamples(interaction, lead);
        break;

      case 'book':
        await handleBook(interaction, lead);
        break;

      case 'sale':
        await handleSale(interaction, lead);
        break;

      case 'faq':
        await handleFaq(interaction);
        break;

      case 'stats':
        await handleStats(interaction);
        break;

      default:
        await interaction.reply('Unknown command. Try /help');
    }

  } catch (error) {
    console.error('Error handling command:', error);
    await interaction.reply({ content: 'Something went wrong. Please try again!', ephemeral: true });
  }
});

// ============================================
// COMMAND HANDLERS
// ============================================

async function handleStart(interaction: ChatInputCommandInteraction, lead: any): Promise<void> {
  // Reset lead for fresh start
  updateLead(lead.id, {
    currentFlow: null,
    currentStep: 'welcome'
  });

  await interaction.reply(MESSAGES.WELCOME_GENERIC);

  // Prompt to continue in DMs
  if (interaction.channel?.type !== ChannelType.DM) {
    await interaction.followUp({
      content: '💬 *Tip: DM me for a private conversation!*',
      ephemeral: true
    });
  }
}

async function handleHelp(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.reply(MESSAGES.CMD_HELP);
}

async function handlePricing(interaction: ChatInputCommandInteraction, lead: any): Promise<void> {
  const response = FlowEngine.handleCommand('/pricing', lead);
  await interaction.reply(response.messages[0]);
}

async function handleSamples(interaction: ChatInputCommandInteraction, lead: any): Promise<void> {
  const response = FlowEngine.handleCommand('/samples', lead);
  await interaction.reply(response.messages[0]);
}

async function handleBook(interaction: ChatInputCommandInteraction, lead: any): Promise<void> {
  const response = FlowEngine.handleCommand('/book', lead);

  if (response.updateLead) {
    updateLead(lead.id, response.updateLead);
  }

  await interaction.reply(response.messages[0]);
}

async function handleSale(interaction: ChatInputCommandInteraction, lead: any): Promise<void> {
  const response = FlowEngine.handleCommand('/sale', lead);
  await interaction.reply(response.messages[0]);
}

async function handleFaq(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.reply(MESSAGES.CMD_FAQ);
}

async function handleStats(interaction: ChatInputCommandInteraction): Promise<void> {
  const adminIds = process.env.ADMIN_DISCORD_IDS?.split(',') || [];

  if (!adminIds.includes(interaction.user.id)) {
    await interaction.reply({ content: 'This command is admin-only.', ephemeral: true });
    return;
  }

  const stats = getStats();

  const statsMessage = `📊 **BrandVoice Bot Stats**

**Total Leads:** ${stats.total}

**By Status:**
• New: ${stats.byStatus.new}
• Engaged: ${stats.byStatus.engaged}
• Qualified: ${stats.byStatus.qualified}
• Calendly Sent: ${stats.byStatus.calendly_sent}
• Call Booked: ${stats.byStatus.call_booked}
• Checkout Sent: ${stats.byStatus.checkout_sent}
• Converted: ${stats.byStatus.converted}
• Lost: ${stats.byStatus.lost}

**By Platform:**
• Telegram: ${stats.byPlatform.telegram}
• Discord: ${stats.byPlatform.discord}

**Conversion Rate:** ${stats.conversionRate.toFixed(1)}%`;

  await interaction.reply({ content: statsMessage, ephemeral: true });
}

// ============================================
// FOLLOW-UP SCHEDULER
// ============================================

async function sendFollowUps(): Promise<void> {
  const leadsToFollowUp = getLeadsNeedingFollowUp(24);

  for (const lead of leadsToFollowUp) {
    if (lead.platform !== 'discord') continue;

    try {
      const product = lead.currentFlow;
      if (!product || product === 'discovery') continue;

      const user = await client.users.fetch(lead.oddy);
      if (!user) continue;

      const daysLeft = getDaysUntilSaleEnds();
      const followUpMessage = MESSAGES.FOLLOW_UP_24H(product as any, daysLeft);

      await user.send(followUpMessage);

      // Update lead to avoid re-sending
      updateLead(lead.id, { lastMessageAt: new Date() });

      console.log(`[Follow-up] Sent to Discord user ${lead.username || lead.oddy}`);

      // Rate limit
      await sleep(2000);

    } catch (error) {
      console.error(`Error sending Discord follow-up to ${lead.id}:`, error);
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

client.on(Events.Error, (error) => {
  console.error('Discord client error:', error);
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

process.on('SIGINT', () => {
  console.log('Shutting down Discord bot...');
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down Discord bot...');
  client.destroy();
  process.exit(0);
});

// ============================================
// START BOT
// ============================================

client.login(token);

console.log('BrandVoice Discord Bot is starting...');
console.log('Commands: /start, /help, /pricing, /samples, /book, /sale, /faq');

export { client };
