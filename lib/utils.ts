import { type ClassValue, clsx } from 'clsx'

// Utility for combining class names
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Format date for display
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// Get first N lines of text
export function getFirstLines(text: string, lines: number): string {
  const split = text.split('\n')
  return split.slice(0, lines).join('\n')
}

// Get word count from text
export function getWordCount(text: string): number {
  if (!text || text.trim() === '') return 0
  return text.trim().split(/\s+/).length
}

// Estimate speaking duration in seconds (average ~150 words per minute)
export function estimateDuration(text: string): number {
  const wordCount = getWordCount(text)
  return Math.round((wordCount / 150) * 60)
}

// Format duration in seconds to readable format
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `~${seconds} sec`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (remainingSeconds === 0) {
    return `~${minutes}:00`
  }
  return `~${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Script type labels for display
export const SCRIPT_TYPE_LABELS: Record<string, string> = {
  FAQ: 'FAQ',
  SERVICE: 'Service/Explainer',
  PROMO: 'Promo',
  TESTIMONIAL: 'Testimonial',
  TIP: 'Tip/Educational',
  BRAND: 'Brand/Credibility',
}

// Niche options for dropdown
export const NICHE_OPTIONS = [
  'Real Estate Agent',
  'Med Spa / Aesthetics',
  'Dentist / Dental Practice',
  'Chiropractor',
  'Personal Injury Lawyer',
  'Financial Advisor',
  'Insurance Agent',
  'Home Services',
  'Fitness / Personal Training',
  'Restaurant / Food Service',
  'E-commerce / Retail',
  'SaaS / Tech',
  'Coaching / Consulting',
  'Other',
]

// Tone options for dropdown
export const TONE_OPTIONS = [
  'Warm and friendly',
  'Professional and authoritative',
  'High-energy and enthusiastic',
  'Calm and reassuring',
  'Casual and relatable',
  'Luxury and sophisticated',
  'Fun and playful',
  'Educational and informative',
]
