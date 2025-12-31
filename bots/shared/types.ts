// BrandVoice Sales Bot - Shared Types

export type Platform = 'telegram' | 'discord';

export type ProductTier =
  | 'starter'      // $497 Brand Starter Kit
  | 'launch'       // $1,497 AI Spokesperson Launch Kit
  | 'engine'       // $997/mo Content Engine Monthly
  | 'pro'          // $1,997/mo Content Engine PRO
  | 'authority';   // $3,997/mo AUTHORITY Engine

export type FlowStep =
  | 'welcome'
  | 'qualify_business'
  | 'qualify_industry'
  | 'qualify_volume'
  | 'value_stack'
  | 'show_samples'
  | 'price_reveal'
  | 'calendly_pitch'
  | 'checkout'
  | 'objection_handling'
  | 'follow_up'
  | 'completed';

export type LeadStatus =
  | 'new'
  | 'engaged'
  | 'qualified'
  | 'calendly_sent'
  | 'call_booked'
  | 'checkout_sent'
  | 'converted'
  | 'lost';

export interface Lead {
  id: string;
  oddy: string;          // Platform user ID
  platform: Platform;
  username?: string;

  // Conversation state
  currentFlow: ProductTier | 'discovery' | null;
  currentStep: FlowStep;

  // Qualification data
  businessStage?: 'new' | 'existing' | 'exploring';
  industry?: string;
  currentVideoVolume?: '0-5' | '5-15' | '15+';
  painPoint?: string;
  budget?: 'low' | 'medium' | 'high';

  // Tracking
  status: LeadStatus;
  messagesReceived: number;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;

  // Conversion
  calendarlyLinkSent: boolean;
  checkoutLinkSent: boolean;
  convertedAt?: Date;
  convertedProduct?: ProductTier;
}

export interface Message {
  text: string;
  buttons?: Button[];
  delay?: number; // ms to wait before sending
}

export interface Button {
  label: string;
  value: string;
}

export interface FlowConfig {
  product: ProductTier;
  steps: FlowStepConfig[];
  conversionType: 'checkout' | 'calendly';
}

export interface FlowStepConfig {
  step: FlowStep;
  message: (lead: Lead) => Message;
  expectedResponses?: string[];
  nextStep: (response: string, lead: Lead) => FlowStep;
}

// Product configuration
export const PRODUCTS: Record<ProductTier, {
  name: string;
  originalPrice: number;
  salePrice: number;
  conversionType: 'checkout' | 'calendly';
  checkoutUrl?: string;
  features: string[];
}> = {
  starter: {
    name: 'Brand Starter Kit',
    originalPrice: 997,
    salePrice: 497,
    conversionType: 'checkout',
    checkoutUrl: 'https://brandvoice.studio/checkout?pkg=starter',
    features: [
      'Logo & brand colors',
      'Custom website',
      '30 days of content',
      'Telegram/Discord bot',
      'Auto-response templates'
    ]
  },
  launch: {
    name: 'AI Spokesperson Launch Kit',
    originalPrice: 2997,
    salePrice: 1497,
    conversionType: 'calendly',
    features: [
      'Custom AI avatar',
      '30 professional videos',
      'Your brand voice',
      'Viral-style captions',
      '7-day delivery'
    ]
  },
  engine: {
    name: 'Content Engine Monthly',
    originalPrice: 1997,
    salePrice: 997,
    conversionType: 'calendly',
    features: [
      '30 new videos every month',
      'Fresh scripts monthly',
      'Monthly strategy call',
      'Ad-ready formats',
      'Priority delivery'
    ]
  },
  pro: {
    name: 'Content Engine PRO',
    originalPrice: 3997,
    salePrice: 1997,
    conversionType: 'calendly',
    features: [
      '30-40 videos per month',
      'Up to 2 custom avatars',
      'Up to 2 brand voices',
      'Hook & CTA variations',
      'Multi-format delivery'
    ]
  },
  authority: {
    name: 'AUTHORITY Engine',
    originalPrice: 7997,
    salePrice: 3997,
    conversionType: 'calendly',
    features: [
      '60+ videos per month',
      'Up to 3 custom avatars',
      'Up to 3 brand voices',
      'Multi-language versions',
      'Full funnel scripting'
    ]
  }
};

// Trigger words for flow detection
export const FLOW_TRIGGERS: Record<string, ProductTier | 'discovery'> = {
  // Starter Kit triggers
  '2025': 'starter',
  'starter': 'starter',
  'brand': 'starter',
  'logo': 'starter',
  'website': 'starter',

  // Launch Kit triggers
  'video': 'launch',
  'ai': 'launch',
  'spokesperson': 'launch',
  'avatar': 'launch',

  // Content Engine triggers
  'content': 'engine',
  'engine': 'engine',
  'monthly': 'engine',

  // Discovery triggers
  'info': 'discovery',
  'pricing': 'discovery',
  'packages': 'discovery',
  'help': 'discovery',
  'price': 'discovery',
  'cost': 'discovery'
};

// Environment configuration
export const CONFIG = {
  CALENDLY_URL: process.env.CALENDLY_URL || 'https://calendly.com/brandvoice/discovery',
  PORTFOLIO_URL: 'https://brandvoice.studio/portfolio',
  SALE_END_DATE: new Date('2025-01-07T23:59:59'),
  FOLLOW_UP_DELAY_HOURS: 24,

  // Database
  DATABASE_URL: process.env.DATABASE_URL,

  // Telegram
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,

  // Discord
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID
};
