// Script type enum values
export const SCRIPT_TYPES = {
  FAQ: 'FAQ',
  SERVICE: 'SERVICE',
  PROMO: 'PROMO',
  TESTIMONIAL: 'TESTIMONIAL',
  TIP: 'TIP',
  BRAND: 'BRAND',
} as const

export type ScriptType = typeof SCRIPT_TYPES[keyof typeof SCRIPT_TYPES]

// Script status values
export const SCRIPT_STATUS = {
  DRAFT: 'draft',
  APPROVED: 'approved',
  EXPORTED: 'exported',
} as const

export type ScriptStatus = typeof SCRIPT_STATUS[keyof typeof SCRIPT_STATUS]

// 30-Day Content Structure
export const CONTENT_STRUCTURE = {
  FAQ: 8,
  SERVICE: 8,
  PROMO: 4,
  TESTIMONIAL: 4,
  TIP: 4,
  BRAND: 2,
} as const

// Type for script generation response
export interface GeneratedScript {
  title: string
  script: string
}

export interface LLMScriptResponse {
  faqs: GeneratedScript[]
  services: GeneratedScript[]
  promos: GeneratedScript[]
  testimonials: GeneratedScript[]
  tips: GeneratedScript[]
  brand: GeneratedScript[]
}

// Client with relations
export interface ClientWithRelations {
  id: string
  createdAt: Date
  updatedAt: Date
  businessName: string
  contactName: string
  email: string
  phone: string | null
  website: string | null
  niche: string
  tone: string
  goals: string
  notes: string | null
  intake: IntakeData | null
  scripts: ScriptData[]
  // Payment tracking
  paymentStatus: string
  paymentAmount: number | null
  paymentDate: Date | null
  paymentMethod: string | null
  // Package tracking
  package: string | null
  packagePrice: number | null
  isSubscription: boolean
  subscriptionStartDate: Date | null
  subscriptionEndDate: Date | null
  // Add-ons tracking
  addOns: string | null
  addOnsTotal: number | null
  // Project status workflow
  projectStatus: string
  projectStartDate: Date | null
  projectDeliveryDate: Date | null
  // Avatar/Voice tracking
  avatarId: string | null
  voiceId: string | null
  voicePreference: string | null
}

export interface IntakeData {
  id: string
  createdAt: Date
  updatedAt: Date
  clientId: string
  rawFaqs: string
  rawOffers: string
  rawTestimonials: string
  rawPromos: string
  brandVoiceNotes: string
  references: string
  assetsFolder: string | null
  brandColors: string | null
  logoUrl: string | null
}

export interface ScriptData {
  id: string
  createdAt: Date
  updatedAt: Date
  clientId: string
  type: string
  title: string
  scriptText: string
  durationSeconds: number | null
  status: string
  notes: string | null
}

// Form data types
export interface ClientFormData {
  businessName: string
  contactName: string
  email: string
  phone?: string
  website?: string
  niche: string
  tone: string
  goals: string
  notes?: string
}

export interface IntakeFormData {
  rawFaqs: string
  rawOffers: string
  rawTestimonials: string
  rawPromos: string
  brandVoiceNotes: string
  references: string
  brandColors?: string
  logoUrl?: string
}

export interface FullIntakeFormData extends ClientFormData, IntakeFormData {}
