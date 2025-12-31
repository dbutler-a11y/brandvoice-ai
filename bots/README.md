# BrandVoice Sales Bots

Automated sales bots for Telegram and Discord that guide leads through the BrandVoice sales funnel.

## Features

- **Multi-platform**: Works on both Telegram and Discord
- **Smart Flow Detection**: Automatically routes users to the right product based on keywords
- **Qualification Funnels**: Asks the right questions to qualify leads
- **Objection Handling**: Built-in responses for common objections
- **Follow-up Automation**: Sends follow-ups to engaged leads after 24 hours
- **Lead Tracking**: Stores all lead data with conversion tracking
- **Admin Stats**: View conversion metrics with `/stats` command

## Product Flows

| Product | Trigger Words | Conversion Type |
|---------|---------------|-----------------|
| Starter Kit ($497) | starter, brand, logo, website, 2025 | Checkout |
| Launch Kit ($1,497) | video, ai, spokesperson, avatar | Calendly |
| Content Engine ($997/mo) | content, engine, monthly | Calendly |

## Quick Start

### 1. Install Dependencies

```bash
cd bots
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your bot tokens
```

### 3. Get Bot Tokens

**Telegram:**
1. Message @BotFather on Telegram
2. Send `/newbot` and follow prompts
3. Copy the token to `TELEGRAM_BOT_TOKEN`

**Discord:**
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create New Application
3. Go to Bot tab, click "Add Bot"
4. Copy token to `DISCORD_BOT_TOKEN`
5. Copy Application ID to `DISCORD_CLIENT_ID`
6. Enable "Message Content Intent" in Bot settings
7. Generate invite URL with `bot` and `applications.commands` scopes

### 4. Run Bots

```bash
# Run both bots
npm run dev

# Run only Telegram
npm run dev:telegram

# Run only Discord
npm run dev:discord

# Production
npm run build
npm start
```

## Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Start conversation |
| `/help` | Show all commands |
| `/pricing` | View all packages |
| `/samples` | See portfolio |
| `/book` | Book discovery call |
| `/sale` | Current sale details |
| `/faq` | Common questions |
| `/stats` | Admin stats (authorized only) |

## Conversation Flow

```
User Message → Flow Detection → Qualification Questions → Value Stack → CTA
     ↓
[Starter Kit]  → Business Stage → Show Value → Checkout Link
[Launch Kit]   → Goals → Industry → Volume → Sample → Calendly
[Engine]       → Pain Points → Value Stack → Calendly
```

## Lead Storage

Leads are stored in `bots/data/leads.json` with:
- User ID and platform
- Conversation state (current flow, step)
- Qualification data (industry, pain points)
- Status tracking (new → engaged → qualified → converted)
- Conversion tracking

## File Structure

```
bots/
├── index.ts           # Combined runner
├── package.json       # Dependencies
├── tsconfig.json      # TypeScript config
├── .env.example       # Environment template
├── README.md          # This file
├── shared/
│   ├── types.ts       # TypeScript types, product config
│   ├── messages.ts    # All message templates
│   ├── flow-engine.ts # Core flow processing logic
│   └── database.ts    # Lead storage layer
├── telegram/
│   └── bot.ts         # Telegram bot implementation
├── discord/
│   └── bot.ts         # Discord bot implementation
└── data/
    └── leads.json     # Lead storage (auto-created)
```

## Customization

### Update Pricing/Products
Edit `shared/types.ts` → `PRODUCTS` object

### Update Messages
Edit `shared/messages.ts` → `MESSAGES` object

### Update Flow Logic
Edit `shared/flow-engine.ts` → Handler methods

### Add New Trigger Words
Edit `shared/types.ts` → `FLOW_TRIGGERS` object
