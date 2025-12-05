/**
 * Input validation and sanitization utilities
 */

/**
 * Validate and sanitize email address
 */
export function validateEmail(email: string | null | undefined): string | null {
  if (!email || typeof email !== 'string') {
    return null;
  }

  // Trim whitespace
  const trimmed = email.trim().toLowerCase();

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    return null;
  }

  // Prevent email injection
  if (trimmed.includes('\n') || trimmed.includes('\r')) {
    return null;
  }

  // Max length check
  if (trimmed.length > 254) {
    return null;
  }

  return trimmed;
}

/**
 * Validate and sanitize phone number
 */
export function validatePhone(phone: string | null | undefined): string | null {
  if (!phone || typeof phone !== 'string') {
    return null;
  }

  // Remove all whitespace and common separators
  const cleaned = phone.trim().replace(/[\s\-\(\)\.]/g, '');

  // Allow + prefix for international numbers
  const phoneRegex = /^\+?[0-9]{10,15}$/;

  if (!phoneRegex.test(cleaned)) {
    return null;
  }

  return cleaned;
}

/**
 * Sanitize text input (removes control characters and excessive whitespace)
 */
export function sanitizeText(
  text: string | null | undefined,
  maxLength: number = 1000
): string | null {
  if (!text || typeof text !== 'string') {
    return null;
  }

  // Remove control characters except newlines and tabs
  let sanitized = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

  // Trim and collapse multiple spaces
  sanitized = sanitized.trim().replace(/\s+/g, ' ');

  // Enforce max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized || null;
}

/**
 * Validate URL
 */
export function validateUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);

    // Only allow http and https
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }

    return trimmed;
  } catch {
    // Try adding https://
    try {
      const parsed = new URL('https://' + trimmed);
      if (parsed.protocol === 'https:') {
        return 'https://' + trimmed;
      }
    } catch {
      return null;
    }

    return null;
  }
}

/**
 * Validate that a string is within allowed length
 */
export function validateLength(
  text: string | null | undefined,
  minLength: number = 0,
  maxLength: number = 10000
): boolean {
  if (!text || typeof text !== 'string') {
    return minLength === 0;
  }

  const length = text.trim().length;
  return length >= minLength && length <= maxLength;
}

/**
 * Validate lead data object
 */
export interface LeadDataValidation {
  valid: boolean;
  errors: string[];
  sanitized: Record<string, string | null>;
}

export function validateLeadData(data: Record<string, unknown>): LeadDataValidation {
  const errors: string[] = [];
  const sanitized: Record<string, string | null> = {};

  // Validate email (optional but must be valid if provided)
  if (data.email) {
    const email = validateEmail(data.email as string);
    if (email) {
      sanitized.email = email;
    } else {
      errors.push('Invalid email format');
    }
  }

  // Validate phone (optional but must be valid if provided)
  if (data.phone) {
    const phone = validatePhone(data.phone as string);
    if (phone) {
      sanitized.phone = phone;
    } else {
      errors.push('Invalid phone number format');
    }
  }

  // Validate website URL (optional but must be valid if provided)
  if (data.website) {
    const website = validateUrl(data.website as string);
    if (website) {
      sanitized.website = website;
    } else {
      errors.push('Invalid website URL');
    }
  }

  // Sanitize text fields
  const textFields = [
    'fullName',
    'businessName',
    'businessType',
    'productsServices',
    'targetAudience',
    'videoGoals',
    'currentVideoStrategy',
    'timeline',
    'budgetAllocated',
    'budgetRange',
    'socialPlatforms',
    'contentTopics',
    'competitorExamples',
    'spokespersonGender',
    'spokespersonAge',
    'spokespersonTone',
    'interestedAddOns',
    'packageInterest',
    'howHeardAboutUs',
    'biggestChallenge',
    'questionsOrConcerns',
    'preferredCallTime',
    'source',
    'utmSource',
    'utmMedium',
    'utmCampaign',
  ];

  textFields.forEach((field) => {
    if (data[field]) {
      const sanitized_value = sanitizeText(data[field] as string, 2000);
      if (sanitized_value) {
        sanitized[field] = sanitized_value;
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    sanitized,
  };
}

/**
 * Validate TTS request
 */
export interface TTSValidation {
  valid: boolean;
  error?: string;
  text?: string;
  voiceId?: string;
}

export function validateTTSRequest(data: Record<string, unknown>): TTSValidation {
  // Validate text
  if (!data.text || typeof data.text !== 'string') {
    return { valid: false, error: 'Text is required' };
  }

  const text = sanitizeText(data.text as string, 500);

  if (!text) {
    return { valid: false, error: 'Invalid text input' };
  }

  if (text.length < 1) {
    return { valid: false, error: 'Text is too short' };
  }

  if (text.length > 500) {
    return { valid: false, error: 'Text exceeds 500 character limit' };
  }

  // Validate voiceId
  if (!data.voiceId || typeof data.voiceId !== 'string') {
    return { valid: false, error: 'Voice ID is required' };
  }

  const voiceId = data.voiceId.trim();

  if (!/^[a-zA-Z0-9_-]+$/.test(voiceId)) {
    return { valid: false, error: 'Invalid voice ID format' };
  }

  return {
    valid: true,
    text,
    voiceId,
  };
}

/**
 * Validate webhook payload has required fields
 */
export function validateWebhookPayload(
  payload: Record<string, unknown>,
  requiredFields: string[]
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  for (const field of requiredFields) {
    if (!(field in payload) || payload[field] === null || payload[field] === undefined) {
      missing.push(field);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}
