# BrandVoice Sales Bot - Complete Setup Guide

Step-by-step instructions for setting up your Telegram and Discord sales bots.

---

## Prerequisites

- Node.js 18+ installed
- An Anthropic API key (for AI conversations)
- A Telegram account
- A Discord account

---

## Step 1: Get Your OpenAI API Key

The bot uses GPT-4o for natural conversation. You should already have this in your main `.env` file.

1. Go to **https://platform.openai.com/api-keys**
2. Sign up or log in
3. Click **"Create new secret key"**
4. Name it "BrandVoice Bot"
5. Copy the key (starts with `sk-proj-...`)
6. Save it somewhere safe - you'll need it in Step 4

**Or** just copy your existing `OPENAI_API_KEY` from the main project `.env` file.

---

## Step 2: Create Telegram Bot with BotFather

### 2.1 Start BotFather

1. Open Telegram
2. Search for **@BotFather**
3. Click **Start** or send `/start`

### 2.2 Create New Bot

1. Send `/newbot` to BotFather
2. Enter a **name** for your bot (displayed to users):
   ```
   BrandVoice Sales
   ```
3. Enter a **username** (must end in `bot`):
   ```
   brandvoice_sales_bot
   ```
   (If taken, try: `brandvoice_ai_bot`, `brandvoicestudio_bot`, etc.)

4. BotFather will respond with your **bot token**:
   ```
   Done! Congratulations on your new bot...

   Use this token to access the HTTP API:
   7123456789:AAHxxx-your-token-here-xxx
   ```
5. **Copy this token** - you'll need it in Step 4

### 2.3 Configure Bot Settings

Send these commands to BotFather:

```
/setdescription
```
Then select your bot and enter:
```
🎬 BrandVoice AI - Professional AI spokesperson videos for your business. 50% OFF New Year's Sale!
```

```
/setabouttext
```
Then enter:
```
Get AI spokesperson videos without filming. Ask me about pricing, see samples, or book a call!
```

```
/setcommands
```
Then enter (copy exactly):
```
start - Start conversation
help - Show available commands
pricing - View packages & pricing
samples - See portfolio examples
book - Book discovery call
sale - Current sale details
faq - Frequently asked questions
```

### 2.4 Set Bot Profile Picture (Optional)

1. Send `/setuserpic` to BotFather
2. Select your bot
3. Send your BrandVoice logo image

---

## Step 3: Create Discord Bot

### 3.1 Create Discord Application

1. Go to **https://discord.com/developers/applications**
2. Log in with your Discord account
3. Click **"New Application"**
4. Name it: `BrandVoice Sales`
5. Click **Create**

### 3.2 Configure Bot

1. In left sidebar, click **"Bot"**
2. Click **"Add Bot"** → **"Yes, do it!"**
3. Under the bot's username, click **"Reset Token"**
4. **Copy the token** - you'll need it in Step 4

### 3.3 Enable Required Intents

Still on the Bot page, scroll down to **"Privileged Gateway Intents"**:

- ✅ Enable **MESSAGE CONTENT INTENT** (required for reading DMs)
- ✅ Enable **DIRECT MESSAGES** (if shown)

Click **Save Changes**

### 3.4 Get Client ID

1. In left sidebar, click **"OAuth2"** → **"General"**
2. Copy the **CLIENT ID** - you'll need it in Step 4

### 3.5 Generate Invite Link

1. Click **"OAuth2"** → **"URL Generator"**
2. Under **SCOPES**, check:
   - ✅ `bot`
   - ✅ `applications.commands`

3. Under **BOT PERMISSIONS**, check:
   - ✅ Send Messages
   - ✅ Send Messages in Threads
   - ✅ Embed Links
   - ✅ Read Message History
   - ✅ Use Slash Commands

4. Copy the **GENERATED URL** at the bottom
5. Paste it in your browser
6. Select your server and click **Authorize**

---

## Step 4: Configure Environment

1. Navigate to the bots folder:
   ```bash
   cd /Users/brittanymurphy/Desktop/Butler/Projects/ai-spokesperson-studio/bots
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your actual values:
   ```bash
   nano .env
   ```

4. Fill in your credentials:
   ```env
   # AI (REQUIRED) - copy from main project .env
   OPENAI_API_KEY=sk-proj-your-actual-key-here

   # Telegram
   TELEGRAM_BOT_TOKEN=7123456789:AAHxxx-your-token-here

   # Discord
   DISCORD_BOT_TOKEN=your-discord-bot-token
   DISCORD_CLIENT_ID=your-discord-client-id

   # Your Calendly link
   CALENDLY_URL=https://calendly.com/brandvoice/discovery

   # Your user IDs (for /stats command)
   ADMIN_TELEGRAM_IDS=your_telegram_user_id
   ADMIN_DISCORD_IDS=your_discord_user_id
   ```

5. Save and exit (Ctrl+X, then Y, then Enter)

### Finding Your Admin IDs

**Telegram:**
1. Message @userinfobot on Telegram
2. It will reply with your User ID

**Discord:**
1. Enable Developer Mode: User Settings → Advanced → Developer Mode
2. Right-click your username anywhere
3. Click "Copy User ID"

---

## Step 5: Install & Run

### 5.1 Install Dependencies

```bash
cd /Users/brittanymurphy/Desktop/Butler/Projects/ai-spokesperson-studio/bots
npm install
```

### 5.2 Run in Development Mode

```bash
# Run both bots
npm run dev

# Or run individually
npm run dev:telegram
npm run dev:discord
```

### 5.3 Run in Production

```bash
npm run build
npm start
```

---

## Step 6: Test Your Bots

### Test Telegram

1. Open Telegram
2. Search for your bot's username
3. Click **Start**
4. Try these messages:
   - `hello` - Should get welcome message
   - `I need AI videos for my real estate business` - Should use AI for natural response
   - `pricing` - Should show pricing
   - `/help` - Should show commands
   - `1` - Should answer qualification question

### Test Discord

1. Open Discord
2. Find your bot in the server member list
3. Click to open DM
4. Try same messages as above
5. Also test slash commands:
   - `/start`
   - `/pricing`
   - `/samples`

---

## How the Bot Works

### Conversation Flow

```
User sends message
        ↓
Is it a command (/help)?  →  Yes  →  Return scripted response
        ↓ No
Is it a simple response (1, 2, yes)?  →  Yes  →  Continue scripted flow
        ↓ No
Use Claude AI for natural conversation
        ↓
AI detects intent, extracts info, responds naturally
        ↓
Update lead record with extracted data
```

### What Triggers AI vs Scripted

**Scripted (fast, free):**
- Commands: `/pricing`, `/help`, etc.
- Number responses: `1`, `2`, `3`
- Simple yes/no: `yes`, `no`
- Exact triggers: `starter`, `video`, `pricing`

**AI-Powered (natural, smart):**
- "I run a med spa and need content"
- "What's the difference between packages?"
- "Is this worth the investment?"
- "Tell me more about AI videos"
- Any natural language question

---

## Troubleshooting

### Bot Not Responding (Telegram)

1. Check token is correct in `.env`
2. Ensure you started the bot: `npm run dev:telegram`
3. Check console for errors
4. Verify bot isn't blocked by user

### Bot Not Responding (Discord)

1. Check both token AND client ID in `.env`
2. Ensure Message Content Intent is enabled
3. Bot must be invited to a server
4. DMs only work after initial server interaction

### AI Not Working

1. Verify ANTHROPIC_API_KEY is set correctly
2. Check console for API errors
3. Ensure you have API credits

### "Polling error" (Telegram)

- Usually means invalid token
- Or another instance is running (kill it first)

---

## Monitoring

### View Logs

The console shows:
```
[Telegram] username: message
[Telegram] AI response for username
[Discord DM] username: message
[Discord] AI response for username
```

### View Stats

Send `/stats` in Telegram or Discord (admin only):
- Total leads
- Leads by status
- Leads by platform
- Conversion rate

### Lead Data

All leads are stored in:
```
bots/data/leads.json
```

---

## Updating the Bot

### Change Pricing

Edit `bots/shared/types.ts` → `PRODUCTS` object

### Change Messages

Edit `bots/shared/messages.ts` → `MESSAGES` object

### Change AI Personality

Edit `bots/shared/ai-handler.ts` → `getSystemPrompt()` function

### Add New Commands

1. Add to `bots/telegram/bot.ts` with `bot.onText()`
2. Add to `bots/discord/bot.ts` commands array
3. Add handler in flow-engine if needed

---

## Deployment (Production)

For 24/7 operation, deploy to a server:

### Option 1: VPS (DigitalOcean, Linode, etc.)

```bash
# On your server
git clone your-repo
cd bots
npm install
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start dist/index.js --name brandvoice-bots
pm2 save
pm2 startup
```

### Option 2: Railway.app

1. Push code to GitHub
2. Connect Railway to your repo
3. Set environment variables in Railway dashboard
4. Deploy

### Option 3: Render.com

1. Create new Web Service
2. Connect to GitHub repo
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables

---

## Questions?

The bot is designed to be self-contained. If you need changes:

1. **Pricing/Products**: `shared/types.ts`
2. **Message Templates**: `shared/messages.ts`
3. **AI Personality**: `shared/ai-handler.ts`
4. **Flow Logic**: `shared/flow-engine.ts`

Good luck with your BrandVoice sales! 🚀
