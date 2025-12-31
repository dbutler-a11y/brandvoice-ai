# BrandVoice Sales Bot - Conversation Flows

## Overview

Sales funnel bot for Telegram & Discord that qualifies leads and converts them to customers or Calendly bookings.

---

## Lead Segmentation

| Trigger Word | Product | Flow |
|--------------|---------|------|
| `2025`, `STARTER`, `BRAND` | Brand Starter Kit ($497) | Direct to checkout |
| `VIDEO`, `AI`, `SPOKESPERSON` | Launch Kit ($1,497) | Qualify → Calendly |
| `CONTENT`, `ENGINE`, `MONTHLY` | Content Engine ($997/mo) | Qualify → Calendly |
| `INFO`, `PRICING`, `PACKAGES` | All packages | Discovery flow |

---

## FLOW 1: BRAND STARTER KIT ($497)
**Trigger**: User DMs "2025", "STARTER", or "BRAND"
**Goal**: Direct checkout (low-ticket impulse buy)

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: WELCOME + HOOK                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🎆 Hey! You caught our New Year's Sale!                     │
│                                                             │
│ The Brand Starter Kit is 50% OFF right now.                 │
│                                                             │
│ Quick question - what best describes you?                   │
│                                                             │
│ 1️⃣ Starting a brand new business                            │
│ 2️⃣ Have a business but need better branding                 │
│ 3️⃣ Just exploring options                                   │
│                                                             │
│ (Reply with 1, 2, or 3)                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: PERSONALIZED VALUE (Based on response)              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [IF 1 - New Business]                                       │
│ Perfect timing! Starting right is EVERYTHING.               │
│                                                             │
│ Most new businesses waste $5,000+ figuring out branding.    │
│ Logo designer: $500-2,000                                   │
│ Website: $3,000+                                            │
│ Content creator: $1,500/month                               │
│                                                             │
│ [IF 2 - Needs Better Branding]                              │
│ Smart move. Inconsistent branding costs you customers       │
│ every single day.                                           │
│                                                             │
│ People scroll past amateur-looking brands.                  │
│ They don't trust them with their money.                     │
│                                                             │
│ [IF 3 - Exploring]                                          │
│ No pressure! Let me show you what's included so you         │
│ can decide if it's right for you.                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: VALUE STACK                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Here's what you get in the Brand Starter Kit:               │
│                                                             │
│ ✅ YOUR LOOK                                                │
│    • Logo & brand colors                                    │
│    • Icons & graphics package                               │
│    • Ready-to-use files                                     │
│                                                             │
│ ✅ YOUR WEBSITE                                             │
│    • Custom design                                          │
│    • Mobile-friendly                                        │
│    • Ready to launch                                        │
│                                                             │
│ ✅ YOUR CONTENT                                             │
│    • 30 days of social posts                                │
│    • Scripts & captions                                     │
│    • Just copy and post                                     │
│                                                             │
│ ✅ YOUR AUTOMATION                                          │
│    • Telegram or Discord bot                                │
│    • Auto-response templates                                │
│    • Save hours every week                                  │
│                                                             │
│ Normal price: $997                                          │
│ NEW YEAR'S PRICE: $497 (50% OFF)                            │
│                                                             │
│ Want to see some examples first? (yes/no)                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
┌──────────────────────┐    ┌──────────────────────┐
│ [IF YES - Examples]  │    │ [IF NO - Ready]      │
├──────────────────────┤    ├──────────────────────┤
│                      │    │                      │
│ Here are some brands │    │ Love the energy! 🔥   │
│ we've built:         │    │                      │
│                      │    │ Here's your link:    │
│ 🔗 [Portfolio Link]  │    │                      │
│                      │    │ 🔗 brandvoice.studio │
│ Pretty clean, right? │    │    /checkout?pkg=    │
│                      │    │    starter           │
│ Ready to grab yours? │    │                      │
│                      │    │ ⏰ Sale ends Jan 7th │
│ 🔗 [Checkout Link]   │    │                      │
│                      │    │ Any questions before │
│ ⏰ Sale ends Jan 7th │    │ you checkout?        │
│                      │    │                      │
└──────────────────────┘    └──────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: OBJECTION HANDLING (If they ask questions)          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [Q: "How long does it take?"]                               │
│ A: "7 days from kickoff to delivery. You'll have           │
│     everything ready to launch."                            │
│                                                             │
│ [Q: "What if I don't like it?"]                             │
│ A: "We include 2 revision rounds. Most clients love        │
│     the first draft, but we've got you covered."            │
│                                                             │
│ [Q: "Can I see more examples?"]                             │
│ A: "Absolutely! Check out: brandvoice.studio/portfolio"    │
│                                                             │
│ [Q: "Is this legit?"]                                       │
│ A: "100%. We've helped dozens of businesses launch.        │
│     Check our reviews: [link]"                              │
│                                                             │
│ [Q: "Can I pay later?"]                                     │
│ A: "The 50% off ends January 7th. After that, it's $997.   │
│     Lock it in now while you can!"                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: FOLLOW-UP (If no response after 24 hours)           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Hey! Just checking in 👋                                    │
│                                                             │
│ The New Year's sale (50% off) ends in [X] hours.           │
│                                                             │
│ Don't want you to miss it if you're still interested!       │
│                                                             │
│ 🔗 brandvoice.studio/checkout?pkg=starter                  │
│                                                             │
│ Any questions I can answer?                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## FLOW 2: AI SPOKESPERSON LAUNCH KIT ($1,497)
**Trigger**: User DMs "VIDEO", "AI", "SPOKESPERSON"
**Goal**: Qualify → Book Calendly call

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: WELCOME + QUALIFY                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🎬 Hey! Interested in AI spokesperson videos?               │
│                                                             │
│ Quick question - what's your main goal?                     │
│                                                             │
│ 1️⃣ I need content but hate being on camera                  │
│ 2️⃣ I want to scale my video content                         │
│ 3️⃣ I'm curious how AI videos work                           │
│                                                             │
│ (Reply with 1, 2, or 3)                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: INDUSTRY QUALIFICATION                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Got it! What industry are you in?                           │
│                                                             │
│ 1️⃣ Real Estate                                              │
│ 2️⃣ Coaching / Consulting                                    │
│ 3️⃣ Med Spa / Healthcare                                     │
│ 4️⃣ E-commerce / Retail                                      │
│ 5️⃣ Agency / Marketing                                       │
│ 6️⃣ Other (tell me!)                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: CONTENT VOLUME CHECK                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Perfect! [Industry] is one of our best-performing niches.   │
│                                                             │
│ How many videos do you currently post per month?            │
│                                                             │
│ 1️⃣ 0-5 (struggling to stay consistent)                      │
│ 2️⃣ 5-15 (doing okay but want more)                          │
│ 3️⃣ 15+ (need to scale without burning out)                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: SHOW VALUE + SAMPLE                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [IF 0-5 videos]                                             │
│ You're leaving money on the table. Businesses posting       │
│ daily get 3-5x more leads than those posting weekly.        │
│                                                             │
│ [IF 5-15 videos]                                            │
│ You're ahead of most! But imagine doubling that without     │
│ any extra work on your end.                                 │
│                                                             │
│ [IF 15+ videos]                                             │
│ Impressive! But I bet you're spending 20+ hours/month       │
│ on content. What if you got that time back?                 │
│                                                             │
│ ───────────────────────────────────────────────             │
│                                                             │
│ Here's a sample AI spokesperson video for [Industry]:       │
│                                                             │
│ 🎥 [Industry-specific sample video link]                    │
│                                                             │
│ This took us 10 minutes to create. No filming. No editing.  │
│ Just AI magic.                                              │
│                                                             │
│ Want to see how this could work for YOUR business?          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: CALENDLY PITCH                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🔥 NEW YEAR'S SPECIAL: 50% OFF                              │
│                                                             │
│ The AI Spokesperson Launch Kit includes:                    │
│ • Custom AI avatar (looks real)                             │
│ • Your brand voice                                          │
│ • 30 professional videos                                    │
│ • Delivered in 7 days                                       │
│                                                             │
│ Normal: $2,997                                              │
│ Right now: $1,497 (50% off)                                 │
│                                                             │
│ Want to hop on a quick 15-min call to see if this          │
│ is right for your business?                                 │
│                                                             │
│ 📅 Book here: [CALENDLY LINK]                               │
│                                                             │
│ No pressure. Just a quick chat to see if we're a fit.       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: HANDLE OBJECTIONS                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [Q: "I'm not ready for a call"]                             │
│ A: "No worries! Here's more info you can review:           │
│     brandvoice.studio/how-it-works                         │
│     DM me when you're ready!"                               │
│                                                             │
│ [Q: "Too expensive"]                                        │
│ A: "I hear you. But consider: a single videographer        │
│     costs $500+ per video. That's $15,000 for 30 videos.   │
│     We're $1,497 total. It pays for itself in content      │
│     you'd have to create anyway."                           │
│                                                             │
│ [Q: "Does AI look fake?"]                                   │
│ A: "Great question! Check this sample: [link]              │
│     Most people can't tell the difference. And it's        │
│     getting better every month."                            │
│                                                             │
│ [Q: "What if I don't like the avatar?"]                     │
│ A: "You choose from our library OR we can customize.       │
│     Plus 2 revision rounds included."                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## FLOW 3: CONTENT ENGINE MONTHLY ($997/mo)
**Trigger**: User DMs "CONTENT", "ENGINE", "MONTHLY"
**Goal**: Qualify → Book Calendly call

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: WELCOME + PAIN POINT                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🚀 Hey! Looking for consistent content every month?         │
│                                                             │
│ Let me ask - what's your biggest content struggle?          │
│                                                             │
│ 1️⃣ I start strong then fall off                             │
│ 2️⃣ I don't have time to create content                      │
│ 3️⃣ My content isn't getting results                         │
│ 4️⃣ I need more volume than I can handle                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: EMPATHIZE + AGITATE                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [IF 1 - Falls off]                                          │
│ The dreaded content roller coaster. Post for 2 weeks,       │
│ disappear for 2 months. Your audience forgets you exist.    │
│ Your competitors stay top of mind. It's frustrating.        │
│                                                             │
│ [IF 2 - No time]                                            │
│ You're running a business. Content creation is a full-time  │
│ job on top of your actual full-time job. Something has      │
│ to give - and it's usually content.                         │
│                                                             │
│ [IF 3 - No results]                                         │
│ Creating content that doesn't convert is worse than no      │
│ content. All that effort for crickets. The algorithm        │
│ buries you. It feels pointless.                             │
│                                                             │
│ [IF 4 - Need volume]                                        │
│ You know quantity + quality wins. But producing 30+         │
│ videos a month while running a business? Impossible         │
│ without a team.                                             │
│                                                             │
│ What if you had a content ENGINE that never stopped?        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: SOLUTION + VALUE STACK                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Here's what the Content Engine delivers EVERY month:        │
│                                                             │
│ ✅ 30 new AI spokesperson videos                            │
│ ✅ Fresh scripts tailored to your business                  │
│ ✅ Viral-style captions included                            │
│ ✅ Ad-ready formats (9:16, 1:1, 16:9)                       │
│ ✅ Monthly strategy call                                    │
│ ✅ Priority delivery                                        │
│                                                             │
│ You just download and post. We handle everything else.      │
│                                                             │
│ 🔥 NEW YEAR'S SPECIAL:                                      │
│ Normal: $1,997/month                                        │
│ Right now: $997/month (50% off!)                            │
│ 3-month minimum, then month-to-month                        │
│                                                             │
│ That's $33 per video. Try getting that anywhere else.       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: CALENDLY PITCH                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Want to see if Content Engine is right for your business?   │
│                                                             │
│ Let's hop on a quick 15-min call.                          │
│ I'll show you:                                              │
│ • Sample videos in your industry                            │
│ • How the monthly process works                             │
│ • Answer any questions                                      │
│                                                             │
│ 📅 Book here: [CALENDLY LINK]                               │
│                                                             │
│ No pitch. Just seeing if we're a fit.                       │
│                                                             │
│ ⏰ Sale ends January 7th - lock in 50% off!                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## FLOW 4: GENERAL INQUIRY
**Trigger**: User DMs "INFO", "PRICING", "PACKAGES", or general question
**Goal**: Segment → Route to appropriate flow

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: WELCOME + DISCOVERY                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 👋 Hey! Thanks for reaching out to BrandVoice.              │
│                                                             │
│ We help businesses create professional content without      │
│ filming themselves.                                         │
│                                                             │
│ What are you most interested in?                            │
│                                                             │
│ 1️⃣ Brand Starter Kit ($497) - Logo, website, content,      │
│    automation - perfect for new businesses                  │
│                                                             │
│ 2️⃣ AI Spokesperson Videos ($1,497) - 30 videos with        │
│    your own AI avatar, delivered in 7 days                  │
│                                                             │
│ 3️⃣ Monthly Content Engine ($997/mo) - 30 fresh videos      │
│    delivered every month, ongoing                           │
│                                                             │
│ 4️⃣ Not sure yet - tell me more                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
         ┌──────────┬───────┴───────┬──────────┐
         ▼          ▼               ▼          ▼
    [Route to   [Route to     [Route to   [Discovery
     Flow 1]     Flow 2]       Flow 3]    Questions]
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────┐
│ DISCOVERY QUESTIONS (If "Not sure")                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ No problem! Let me help you figure out the best fit.        │
│                                                             │
│ Q1: Do you already have a brand/logo, or starting fresh?    │
│     → Starting fresh = Flow 1 (Starter Kit)                 │
│     → Have brand = Continue                                 │
│                                                             │
│ Q2: Do you need videos once, or ongoing every month?        │
│     → Once = Flow 2 (Launch Kit)                            │
│     → Ongoing = Flow 3 (Content Engine)                     │
│                                                             │
│ Q3: What's your monthly content budget?                     │
│     → Under $500 = Flow 1                                   │
│     → $500-2000 = Flow 2 or 3                               │
│     → $2000+ = Flow 3 or AUTHORITY pitch                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## COMMANDS (Both Platforms)

| Command | Function |
|---------|----------|
| `/start` or `/help` | Welcome message + options |
| `/pricing` | Show all package tiers |
| `/samples` | Portfolio link + sample videos |
| `/book` | Direct Calendly link |
| `/sale` | Current sale details |
| `/faq` | Common questions |

---

## AUTO-RESPONSES

### Greeting Detection
Triggers: "hi", "hello", "hey", "yo", "sup"
```
👋 Hey! Welcome to BrandVoice!

Are you here for the New Year's Sale? 50% off everything!

Reply with what interests you:
• "STARTER" - Brand kit ($497)
• "VIDEO" - AI spokesperson videos ($1,497)
• "CONTENT" - Monthly video engine ($997/mo)
• "INFO" - Tell me more about everything
```

### Price/Cost Detection
Triggers: "price", "cost", "how much", "$$"
```
💰 Here's our New Year's pricing (50% OFF):

Brand Starter Kit: $497 (was $997)
• Logo, website, 30 days content, automation

AI Spokesperson Launch Kit: $1,497 (was $2,997)
• 30 videos, custom avatar, 7-day delivery

Content Engine Monthly: $997/mo (was $1,997)
• 30 fresh videos every month

⏰ Sale ends January 7th!

Which one interests you most?
```

### Urgency/Sale Detection
Triggers: "sale", "discount", "deal", "offer", "promo"
```
🎆 NEW YEAR'S SALE - 50% OFF EVERYTHING!

Ends January 7th at midnight.

Brand Starter: $497 (normally $997)
Launch Kit: $1,497 (normally $2,997)
Content Engine: $997/mo (normally $1,997)

This is our biggest sale of the year.
After Jan 7th, prices go back up.

Ready to lock it in? Which package?
```

---

## FOLLOW-UP SEQUENCES

### 24-Hour No Response
```
👋 Hey! Just checking in.

Still interested in [product they asked about]?

The 50% off sale ends in [X] days.

Any questions I can help with?
```

### 48-Hour No Response
```
Last reminder! ⏰

The New Year's sale (50% off) ends soon.

After January 7th:
$497 → $997
$1,497 → $2,997
$997/mo → $1,997/mo

Don't want you to miss it if you're still interested!

[Checkout/Calendly link]
```

### Post-Purchase Welcome
```
🎉 Welcome to BrandVoice!

Your order is confirmed. Here's what happens next:

1️⃣ You'll receive an email with our intake form (check spam!)
2️⃣ Fill it out so we can learn about your business
3️⃣ We'll start production within 24 hours
4️⃣ Delivery in 7 days

Questions? Just reply here anytime.

We're excited to build something amazing for you! 🚀
```
