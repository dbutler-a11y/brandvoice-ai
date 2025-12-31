// BrandVoice Sales Bot - Message Templates

import { Lead, PRODUCTS, ProductTier, CONFIG } from './types';

// Helper to calculate days until sale ends
export function getDaysUntilSaleEnds(): number {
  const now = new Date();
  const diff = CONFIG.SALE_END_DATE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getHoursUntilSaleEnds(): number {
  const now = new Date();
  const diff = CONFIG.SALE_END_DATE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60)));
}

// Format price with strikethrough
export function formatPrice(product: ProductTier): string {
  const p = PRODUCTS[product];
  const isMonthly = product === 'engine' || product === 'pro' || product === 'authority';
  const suffix = isMonthly ? '/mo' : '';
  return `~~$${p.originalPrice.toLocaleString()}~~ → $${p.salePrice.toLocaleString()}${suffix}`;
}

// ============================================
// WELCOME MESSAGES
// ============================================

export const MESSAGES = {
  // Generic welcome when user says hi
  WELCOME_GENERIC: `👋 Hey! Welcome to BrandVoice!

Are you here for the New Year's Sale? 50% off everything!

Reply with what interests you:
• "STARTER" - Brand kit ($497)
• "VIDEO" - AI spokesperson videos ($1,497)
• "CONTENT" - Monthly video engine ($997/mo)
• "INFO" - Tell me more about everything`,

  // ============================================
  // STARTER KIT FLOW ($497)
  // ============================================

  STARTER_WELCOME: `🎆 Hey! You caught our New Year's Sale!

The Brand Starter Kit is 50% OFF right now.

Quick question - what best describes you?

1️⃣ Starting a brand new business
2️⃣ Have a business but need better branding
3️⃣ Just exploring options

(Reply with 1, 2, or 3)`,

  STARTER_VALUE_NEW_BIZ: `Perfect timing! Starting right is EVERYTHING.

Most new businesses waste $5,000+ figuring out branding:
• Logo designer: $500-2,000
• Website: $3,000+
• Content creator: $1,500/month

You're smart to look for a better way.`,

  STARTER_VALUE_REBRAND: `Smart move. Inconsistent branding costs you customers every single day.

People scroll past amateur-looking brands. They don't trust them with their money.

Time to fix that.`,

  STARTER_VALUE_EXPLORING: `No pressure! Let me show you what's included so you can decide if it's right for you.`,

  STARTER_VALUE_STACK: `Here's what you get in the Brand Starter Kit:

✅ YOUR LOOK
   • Logo & brand colors
   • Icons & graphics package
   • Ready-to-use files

✅ YOUR WEBSITE
   • Custom design
   • Mobile-friendly
   • Ready to launch

✅ YOUR CONTENT
   • 30 days of social posts
   • Scripts & captions
   • Just copy and post

✅ YOUR AUTOMATION
   • Telegram or Discord bot
   • Auto-response templates
   • Save hours every week

Normal price: $997
NEW YEAR'S PRICE: $497 (50% OFF)

Want to see some examples first? (yes/no)`,

  STARTER_SAMPLES: (portfolioUrl: string) => `Here are some brands we've built:

🔗 ${portfolioUrl}

Pretty clean, right?

Ready to grab yours?`,

  STARTER_CHECKOUT: (checkoutUrl: string, daysLeft: number) => `Love the energy! 🔥

Here's your link:
🔗 ${checkoutUrl}

⏰ Sale ends in ${daysLeft} days (January 7th)

Any questions before you checkout?`,

  // ============================================
  // LAUNCH KIT FLOW ($1,497)
  // ============================================

  LAUNCH_WELCOME: `🎬 Hey! Interested in AI spokesperson videos?

Quick question - what's your main goal?

1️⃣ I need content but hate being on camera
2️⃣ I want to scale my video content
3️⃣ I'm curious how AI videos work

(Reply with 1, 2, or 3)`,

  LAUNCH_INDUSTRY: `Got it! What industry are you in?

1️⃣ Real Estate
2️⃣ Coaching / Consulting
3️⃣ Med Spa / Healthcare
4️⃣ E-commerce / Retail
5️⃣ Agency / Marketing
6️⃣ Other (tell me!)`,

  LAUNCH_VOLUME: (industry: string) => `Perfect! ${industry} is one of our best-performing niches.

How many videos do you currently post per month?

1️⃣ 0-5 (struggling to stay consistent)
2️⃣ 5-15 (doing okay but want more)
3️⃣ 15+ (need to scale without burning out)`,

  LAUNCH_VALUE_LOW_VOLUME: `You're leaving money on the table. Businesses posting daily get 3-5x more leads than those posting weekly.

The good news? You don't have to film anything.`,

  LAUNCH_VALUE_MED_VOLUME: `You're ahead of most! But imagine doubling your output without any extra work on your end.

That's what AI spokespersons do.`,

  LAUNCH_VALUE_HIGH_VOLUME: `Impressive! But I bet you're spending 20+ hours/month on content.

What if you got that time back AND increased your output?`,

  LAUNCH_SAMPLE: (industry: string, sampleUrl: string) => `Here's a sample AI spokesperson video for ${industry}:

🎥 ${sampleUrl}

This took us 10 minutes to create. No filming. No editing. Just AI magic.

Want to see how this could work for YOUR business?`,

  LAUNCH_CALENDLY: (calendlyUrl: string, daysLeft: number) => `🔥 NEW YEAR'S SPECIAL: 50% OFF

The AI Spokesperson Launch Kit includes:
• Custom AI avatar (looks real)
• Your brand voice
• 30 professional videos
• Delivered in 7 days

Normal: $2,997
Right now: $1,497 (50% off!)

Want to hop on a quick 15-min call to see if this is right for your business?

📅 Book here: ${calendlyUrl}

No pressure. Just a quick chat to see if we're a fit.

⏰ Sale ends in ${daysLeft} days!`,

  // ============================================
  // CONTENT ENGINE FLOW ($997/mo)
  // ============================================

  ENGINE_WELCOME: `🚀 Hey! Looking for consistent content every month?

Let me ask - what's your biggest content struggle?

1️⃣ I start strong then fall off
2️⃣ I don't have time to create content
3️⃣ My content isn't getting results
4️⃣ I need more volume than I can handle`,

  ENGINE_PAIN_FALLOFF: `The dreaded content roller coaster. 🎢

Post for 2 weeks, disappear for 2 months. Your audience forgets you exist. Your competitors stay top of mind.

It's frustrating. But fixable.`,

  ENGINE_PAIN_NO_TIME: `You're running a business. Content creation is a full-time job ON TOP of your actual full-time job.

Something has to give - and it's usually content.

What if it didn't have to?`,

  ENGINE_PAIN_NO_RESULTS: `Creating content that doesn't convert is worse than no content.

All that effort for crickets. The algorithm buries you. It feels pointless.

Let's change that.`,

  ENGINE_PAIN_VOLUME: `You know quantity + quality wins. But producing 30+ videos a month while running a business?

Impossible without a team.

...or a content ENGINE.`,

  ENGINE_VALUE_STACK: `Here's what the Content Engine delivers EVERY month:

✅ 30 new AI spokesperson videos
✅ Fresh scripts tailored to your business
✅ Viral-style captions included
✅ Ad-ready formats (9:16, 1:1, 16:9)
✅ Monthly strategy call
✅ Priority delivery

You just download and post. We handle everything else.

🔥 NEW YEAR'S SPECIAL:
Normal: $1,997/month
Right now: $997/month (50% off!)

3-month minimum, then month-to-month.

That's $33 per video. Try getting that anywhere else.`,

  ENGINE_CALENDLY: (calendlyUrl: string, daysLeft: number) => `Want to see if Content Engine is right for your business?

Let's hop on a quick 15-min call. I'll show you:
• Sample videos in your industry
• How the monthly process works
• Answer any questions

📅 Book here: ${calendlyUrl}

No pitch. Just seeing if we're a fit.

⏰ Sale ends in ${daysLeft} days - lock in 50% off!`,

  // ============================================
  // DISCOVERY FLOW
  // ============================================

  DISCOVERY_WELCOME: `👋 Hey! Thanks for reaching out to BrandVoice.

We help businesses create professional content without filming themselves.

What are you most interested in?

1️⃣ Brand Starter Kit ($497) - Logo, website, content, automation

2️⃣ AI Spokesperson Videos ($1,497) - 30 videos with custom avatar

3️⃣ Monthly Content Engine ($997/mo) - 30 fresh videos every month

4️⃣ Not sure yet - help me decide`,

  DISCOVERY_BUDGET: `No problem! Let me help you figure out the best fit.

Do you already have a logo/brand, or starting fresh?

1️⃣ Starting fresh (need everything)
2️⃣ Have a brand, need content`,

  // ============================================
  // PRICING OVERVIEW
  // ============================================

  PRICING_OVERVIEW: (daysLeft: number) => `💰 NEW YEAR'S PRICING (50% OFF):

🎨 Brand Starter Kit
   ${formatPrice('starter')} one-time
   Logo, website, 30 days content, automation

🎬 AI Spokesperson Launch Kit
   ${formatPrice('launch')} one-time
   30 videos, custom avatar, 7-day delivery

🚀 Content Engine Monthly
   ${formatPrice('engine')}
   30 fresh videos every month

⚡ Content Engine PRO
   ${formatPrice('pro')}
   30-40 videos, 2 avatars, multi-format

👑 AUTHORITY Engine
   ${formatPrice('authority')}
   60+ videos, 3 avatars, full funnel

⏰ Sale ends in ${daysLeft} days!

Which one interests you most?`,

  // ============================================
  // OBJECTION HANDLERS
  // ============================================

  OBJECTION_TOO_EXPENSIVE: (product: ProductTier) => {
    const p = PRODUCTS[product];
    if (product === 'starter') {
      return `I hear you. But consider what you'd pay separately:

• Logo design: $500-2,000
• Website: $3,000+
• 30 days content: $1,500
• Bot setup: $500

That's $5,500+ minimum.

You're getting it all for $${p.salePrice}. That's 90% savings.

And after January 7th, it goes back to $${p.originalPrice}.`;
    }
    return `I hear you. But consider: a single videographer costs $500+ per video.

That's $15,000+ for 30 videos.

We're $${p.salePrice.toLocaleString()} total. It pays for itself in content you'd have to create anyway.

Plus, after January 7th, it goes back to $${p.originalPrice.toLocaleString()}.`;
  },

  OBJECTION_NOT_READY: `No worries! Here's more info you can review:

🔗 ${CONFIG.PORTFOLIO_URL}

Take your time. Just remember - the 50% off ends January 7th.

DM me when you're ready!`,

  OBJECTION_AI_LOOKS_FAKE: `Great question! AI has come a LONG way.

Check out these samples:
🔗 ${CONFIG.PORTFOLIO_URL}

Most people can't tell the difference. And the tech gets better every month.

Want to see one for your specific industry?`,

  OBJECTION_WHAT_IF_DONT_LIKE: `You choose from our avatar library OR we can customize to your preference.

Plus, 2 revision rounds are included. Most clients love the first draft, but we've got you covered if you want changes.`,

  OBJECTION_HOW_LONG: `7 days from kickoff to delivery.

Once you fill out our intake form (takes 10 min), we start production within 24 hours. You'll have everything ready to post in a week.`,

  // ============================================
  // FOLLOW-UPS
  // ============================================

  FOLLOW_UP_24H: (product: ProductTier, daysLeft: number) => `👋 Hey! Just checking in.

Still interested in the ${PRODUCTS[product].name}?

The 50% off sale ends in ${daysLeft} days.

Any questions I can help with?`,

  FOLLOW_UP_48H: (product: ProductTier) => {
    const p = PRODUCTS[product];
    return `Last reminder! ⏰

The New Year's sale (50% off) ends soon.

After January 7th:
$${p.salePrice.toLocaleString()} → $${p.originalPrice.toLocaleString()}

Don't want you to miss it if you're still interested!`;
  },

  // ============================================
  // POST-PURCHASE
  // ============================================

  POST_PURCHASE: `🎉 Welcome to BrandVoice!

Your order is confirmed. Here's what happens next:

1️⃣ Check your email for our intake form (check spam!)
2️⃣ Fill it out so we can learn about your business
3️⃣ We start production within 24 hours
4️⃣ Delivery in 7 days

Questions? Just reply here anytime.

We're excited to build something amazing for you! 🚀`,

  // ============================================
  // ERROR / FALLBACK
  // ============================================

  FALLBACK: `I didn't quite catch that.

You can:
• Reply with a number (1, 2, 3, etc.)
• Say "PRICING" to see all packages
• Say "SAMPLES" to see our work
• Say "BOOK" to schedule a call

How can I help?`,

  // ============================================
  // COMMANDS
  // ============================================

  CMD_HELP: `🤖 BrandVoice Bot Commands:

/pricing - See all packages & prices
/samples - View our portfolio
/book - Schedule a discovery call
/sale - Current sale details
/faq - Common questions

Or just tell me what you're looking for!`,

  CMD_SALE: (daysLeft: number) => `🎆 NEW YEAR'S SALE - 50% OFF EVERYTHING!

⏰ Ends in ${daysLeft} days (January 7th)

Brand Starter: $497 (normally $997)
Launch Kit: $1,497 (normally $2,997)
Content Engine: $997/mo (normally $1,997)

This is our biggest sale of the year.

After Jan 7th, prices go back up. No exceptions.

Ready to lock it in? Which package interests you?`,

  CMD_FAQ: `❓ Frequently Asked Questions:

Q: How long does delivery take?
A: 7 days from kickoff to delivery.

Q: Can I see samples first?
A: Yes! brandvoice.studio/portfolio

Q: What if I don't like the result?
A: 2 revision rounds included.

Q: Do AI videos look real?
A: Yes! Check our samples - most can't tell.

Q: Can I use videos for ads?
A: Absolutely! All ad-ready formats included.

Q: Is the 50% off real?
A: Yes - but only until January 7th.

More questions? Just ask!`
};

// Industry-specific sample URLs (customize these)
export const INDUSTRY_SAMPLES: Record<string, string> = {
  'Real Estate': 'https://brandvoice.studio/samples/real-estate',
  'Coaching / Consulting': 'https://brandvoice.studio/samples/coaching',
  'Med Spa / Healthcare': 'https://brandvoice.studio/samples/medspa',
  'E-commerce / Retail': 'https://brandvoice.studio/samples/ecommerce',
  'Agency / Marketing': 'https://brandvoice.studio/samples/agency',
  'Other': 'https://brandvoice.studio/portfolio'
};
