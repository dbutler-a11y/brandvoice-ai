// BrandVoice Sales Bot - AI Conversation Handler
// Uses OpenAI API for natural language understanding and response generation

import 'dotenv/config';
import OpenAI from 'openai';
import { Lead, ProductTier, PRODUCTS, CONFIG } from './types';
import { getDaysUntilSaleEnds } from './messages';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// System prompt that defines the bot's personality and knowledge
function getSystemPrompt(lead: Lead): string {
  const daysLeft = getDaysUntilSaleEnds();

  return `You are the BrandVoice AI Sales Assistant - a friendly, helpful sales rep for BrandVoice.studio.

YOUR ROLE:
- Help potential customers understand our AI spokesperson video services
- Answer questions naturally and conversationally
- Guide them toward the right product for their needs
- Create urgency around our New Year's Sale (50% off, ends in ${daysLeft} days - January 7th)

PRODUCTS & PRICING (New Year's Sale - 50% OFF):

1. Brand Starter Kit - $497 (normally $997)
   - Logo & brand identity
   - Custom website design
   - 30 days of social media content
   - Telegram or Discord bot setup
   - Best for: New businesses starting fresh

2. AI Spokesperson Launch Kit - $1,497 (normally $2,997)
   - Custom AI avatar that looks real
   - 30 professional spokesperson videos
   - Your brand voice and style
   - Viral-style captions included
   - 7-day delivery
   - Best for: Businesses wanting video content without filming

3. Content Engine Monthly - $997/mo (normally $1,997/mo)
   - 30 fresh AI spokesperson videos every month
   - New scripts tailored to your business
   - Monthly strategy call
   - All ad-ready formats (9:16, 1:1, 16:9)
   - Priority delivery
   - 3-month minimum, then month-to-month
   - Best for: Businesses needing consistent content

4. Content Engine PRO - $1,997/mo (normally $3,997/mo)
   - 30-40 videos per month
   - Up to 2 custom avatars
   - Hook & CTA variations
   - Multi-format delivery
   - Best for: Serious content creators

5. AUTHORITY Engine - $3,997/mo (normally $7,997/mo)
   - 60+ videos per month
   - Up to 3 custom avatars
   - Multi-language versions
   - Full funnel scripting
   - Best for: Agencies and high-volume creators

KEY SELLING POINTS:
- AI videos look incredibly real - most can't tell the difference
- No filming, no editing, no being on camera
- 7-day delivery (fast turnaround)
- 2 revision rounds included
- Works great for: Real Estate, Coaching, Med Spas, E-commerce, Agencies

OBJECTION RESPONSES:
- "Too expensive" → Compare to hiring a videographer ($500+/video = $15,000 for 30 videos)
- "AI looks fake" → Our tech is cutting-edge, check samples at brandvoice.studio/portfolio
- "Not ready" → No pressure, but 50% off ends January 7th
- "How long?" → 7 days from kickoff to delivery

LINKS:
- Portfolio: https://brandvoice.studio/portfolio
- Book a call: ${CONFIG.CALENDLY_URL}
- Starter checkout: https://brandvoice.studio/checkout?pkg=starter

CONVERSATION GUIDELINES:
1. Be warm, friendly, and conversational - not robotic
2. Keep responses concise (2-4 short paragraphs max)
3. Ask qualifying questions naturally
4. Always include a clear next step or call-to-action
5. Use emojis sparingly (1-2 per message max)
6. Create urgency naturally - the sale ends soon!
7. If they seem ready, give them the appropriate link

CURRENT LEAD CONTEXT:
${lead.currentFlow ? `- Interested in: ${lead.currentFlow}` : '- New lead, interest unknown'}
${lead.industry ? `- Industry: ${lead.industry}` : ''}
${lead.painPoint ? `- Pain point: ${lead.painPoint}` : ''}
${lead.businessStage ? `- Business stage: ${lead.businessStage}` : ''}
${lead.currentVideoVolume ? `- Current video volume: ${lead.currentVideoVolume}` : ''}

Remember: Your goal is to be genuinely helpful while guiding them toward a purchase. Be a trusted advisor, not a pushy salesperson.`;
}

// Detect intent from natural language
export interface IntentResult {
  intent: 'product_inquiry' | 'pricing_question' | 'objection' | 'ready_to_buy' | 'general_question' | 'greeting' | 'off_topic';
  product?: ProductTier | 'discovery';
  confidence: number;
  extractedInfo?: {
    industry?: string;
    painPoint?: string;
    businessStage?: string;
  };
}

export async function detectIntent(message: string, lead: Lead): Promise<IntentResult> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 200,
      messages: [
        {
          role: 'system',
          content: `You are an intent classifier for a sales bot. Analyze the user message and return JSON only.

Products: starter ($497 brand kit), launch ($1497 AI videos), engine ($997/mo monthly videos), pro ($1997/mo), authority ($3997/mo)

Return format:
{
  "intent": "product_inquiry" | "pricing_question" | "objection" | "ready_to_buy" | "general_question" | "greeting" | "off_topic",
  "product": "starter" | "launch" | "engine" | "pro" | "authority" | "discovery" | null,
  "confidence": 0.0-1.0,
  "extractedInfo": { "industry": "...", "painPoint": "...", "businessStage": "new|existing|exploring" }
}`
        },
        { role: 'user', content: message }
      ],
      response_format: { type: 'json_object' }
    });

    const text = response.choices[0]?.message?.content || '{}';
    const json = JSON.parse(text);

    return {
      intent: json.intent || 'general_question',
      product: json.product || undefined,
      confidence: json.confidence || 0.5,
      extractedInfo: json.extractedInfo
    };
  } catch (error) {
    console.error('Intent detection error:', error);
    return {
      intent: 'general_question',
      confidence: 0.5
    };
  }
}

// Generate natural language response
export async function generateResponse(
  message: string,
  lead: Lead,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<{
  response: string;
  suggestedUpdates?: Partial<Lead>;
}> {
  try {
    // Build messages array with history
    const messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [
      { role: 'system', content: getSystemPrompt(lead) },
      ...conversationHistory.slice(-10).map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      })),
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 500,
      messages
    });

    const text = response.choices[0]?.message?.content || '';

    // Detect if we should update lead info based on conversation
    const intent = await detectIntent(message, lead);
    let suggestedUpdates: Partial<Lead> | undefined;

    if (intent.extractedInfo) {
      suggestedUpdates = {};
      if (intent.extractedInfo.industry) {
        suggestedUpdates.industry = intent.extractedInfo.industry;
      }
      if (intent.extractedInfo.painPoint) {
        suggestedUpdates.painPoint = intent.extractedInfo.painPoint;
      }
      if (intent.extractedInfo.businessStage) {
        suggestedUpdates.businessStage = intent.extractedInfo.businessStage as Lead['businessStage'];
      }
    }

    if (intent.product && intent.product !== 'discovery') {
      suggestedUpdates = suggestedUpdates || {};
      suggestedUpdates.currentFlow = intent.product;
      suggestedUpdates.status = 'engaged';
    }

    // Detect if calendly or checkout link was sent
    if (text.includes(CONFIG.CALENDLY_URL)) {
      suggestedUpdates = suggestedUpdates || {};
      suggestedUpdates.calendarlyLinkSent = true;
      suggestedUpdates.status = 'calendly_sent';
    }
    if (text.includes('checkout')) {
      suggestedUpdates = suggestedUpdates || {};
      suggestedUpdates.checkoutLinkSent = true;
      suggestedUpdates.status = 'checkout_sent';
    }

    return {
      response: text,
      suggestedUpdates
    };

  } catch (error) {
    console.error('AI response generation error:', error);

    // Fallback response
    return {
      response: `Thanks for reaching out! I'd love to help you learn more about BrandVoice.

We create professional AI spokesperson videos for businesses - no filming required!

What brings you here today? Are you looking for:
• A complete brand starter kit ($497)
• AI spokesperson videos ($1,497)
• Monthly video content ($997/mo)

Or feel free to ask me anything!`
    };
  }
}

// Check if message should use AI vs scripted flow
export function shouldUseAI(message: string, lead: Lead): boolean {
  const normalized = message.toLowerCase().trim();

  // Always use scripted flow for:
  // - Commands
  if (normalized.startsWith('/')) return false;

  // - Single number responses (1, 2, 3)
  if (/^[1-6]$/.test(normalized)) return false;

  // - Simple yes/no
  if (['yes', 'no', 'y', 'n'].includes(normalized)) return false;

  // - Exact trigger words when no flow is active
  const triggers = ['starter', 'video', 'content', 'engine', 'pricing', 'samples', 'book'];
  if (!lead.currentFlow && triggers.some(t => normalized === t)) return false;

  // Use AI for everything else (natural conversation)
  return true;
}

// Conversation history storage (in-memory, keyed by lead ID)
const conversationHistories: Map<string, Array<{ role: 'user' | 'assistant'; content: string }>> = new Map();

export function getConversationHistory(leadId: string): Array<{ role: 'user' | 'assistant'; content: string }> {
  return conversationHistories.get(leadId) || [];
}

export function addToConversationHistory(leadId: string, role: 'user' | 'assistant', content: string): void {
  const history = conversationHistories.get(leadId) || [];
  history.push({ role, content });

  // Keep last 20 messages
  if (history.length > 20) {
    history.shift();
  }

  conversationHistories.set(leadId, history);
}

export function clearConversationHistory(leadId: string): void {
  conversationHistories.delete(leadId);
}
