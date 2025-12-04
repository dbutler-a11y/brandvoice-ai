import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ValidationResult {
  leadId: string;
  isValid: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
  missingCritical: string[];
  missingOptional: string[];
}

// Critical fields that should ideally be filled
const CRITICAL_FIELDS = [
  { field: 'fullName', label: 'Full Name' },
  { field: 'email', label: 'Email Address' },
  { field: 'phone', label: 'Phone Number' },
  { field: 'businessName', label: 'Business Name' },
  { field: 'businessType', label: 'Business Type/Industry' },
];

// Important but not critical
const IMPORTANT_FIELDS = [
  { field: 'videoGoals', label: 'Video Marketing Goals' },
  { field: 'timeline', label: 'Timeline/When to Start' },
  { field: 'packageInterest', label: 'Package Interest' },
  { field: 'targetAudience', label: 'Target Audience' },
];

// Optional fields for validation guidance - exported for reference
export const OPTIONAL_FIELDS = [
  { field: 'website', label: 'Website URL' },
  { field: 'productsServices', label: 'Products/Services' },
  { field: 'currentVideoStrategy', label: 'Current Video Strategy' },
  { field: 'budgetAllocated', label: 'Budget Allocated' },
  { field: 'budgetRange', label: 'Budget Range' },
  { field: 'socialPlatforms', label: 'Social Platforms' },
  { field: 'contentTopics', label: 'Content Topics' },
  { field: 'competitorExamples', label: 'Competitor Examples' },
  { field: 'spokespersonGender', label: 'Spokesperson Gender Preference' },
  { field: 'spokespersonAge', label: 'Spokesperson Age Preference' },
  { field: 'spokespersonTone', label: 'Spokesperson Tone Preference' },
  { field: 'interestedAddOns', label: 'Interested Add-ons' },
  { field: 'howHeardAboutUs', label: 'How They Heard About Us' },
  { field: 'biggestChallenge', label: 'Biggest Challenge' },
  { field: 'questionsOrConcerns', label: 'Questions or Concerns' },
  { field: 'preferredCallTime', label: 'Preferred Call Time' },
];

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone format (basic)
function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10;
}

// Validate URL format
function isValidUrl(url: string): boolean {
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
}

// Validate a single lead
async function validateLead(leadId: string): Promise<ValidationResult> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId }
  });

  if (!lead) {
    return {
      leadId,
      isValid: false,
      score: 0,
      issues: ['Lead not found'],
      suggestions: [],
      missingCritical: [],
      missingOptional: []
    };
  }

  const issues: string[] = [];
  const suggestions: string[] = [];
  const missingCritical: string[] = [];
  const missingOptional: string[] = [];
  let score = 100;

  // Check critical fields
  for (const { field, label } of CRITICAL_FIELDS) {
    const value = (lead as Record<string, unknown>)[field];
    if (!value) {
      missingCritical.push(label);
      score -= 15;
    }
  }

  // Check important fields
  for (const { field, label } of IMPORTANT_FIELDS) {
    const value = (lead as Record<string, unknown>)[field];
    if (!value) {
      missingOptional.push(label);
      score -= 5;
    }
  }

  // Validate email format if present
  if (lead.email && !isValidEmail(lead.email)) {
    issues.push(`Invalid email format: ${lead.email}`);
    suggestions.push('Verify the email address spelling');
    score -= 10;
  }

  // Validate phone format if present
  if (lead.phone && !isValidPhone(lead.phone)) {
    issues.push(`Phone number may be incomplete: ${lead.phone}`);
    suggestions.push('Confirm the phone number has area code');
    score -= 5;
  }

  // Validate website if present
  if (lead.website && !isValidUrl(lead.website)) {
    issues.push(`Website URL may be invalid: ${lead.website}`);
    suggestions.push('Verify the website URL is correct');
    score -= 3;
  }

  // Check for potential duplicates
  if (lead.email) {
    const duplicates = await prisma.lead.count({
      where: {
        email: lead.email,
        id: { not: leadId }
      }
    });
    if (duplicates > 0) {
      issues.push(`Possible duplicate: ${duplicates} other lead(s) with same email`);
      suggestions.push('Consider merging duplicate leads');
    }
  }

  // Generate suggestions based on missing data
  if (missingCritical.length > 0) {
    suggestions.push(`Follow up to collect: ${missingCritical.join(', ')}`);
  }

  if (!lead.packageInterest) {
    suggestions.push('Ask about which package they are most interested in');
  }

  if (!lead.timeline) {
    suggestions.push('Determine their timeline for getting started');
  }

  if (!lead.budgetAllocated && !lead.budgetRange) {
    suggestions.push('Qualify budget readiness');
  }

  // Ensure score doesn't go negative
  score = Math.max(0, score);

  const isValid = score >= 50 && missingCritical.length <= 2;

  return {
    leadId,
    isValid,
    score,
    issues,
    suggestions,
    missingCritical,
    missingOptional
  };
}

// POST - Validate specific leads
export async function POST(request: Request) {
  try {
    const { leadIds, validateAll } = await request.json();

    let leadsToValidate: string[] = [];

    if (validateAll) {
      // Get all leads that need validation
      const leads = await prisma.lead.findMany({
        where: {
          validationStatus: { in: ['pending', 'needs_review'] }
        },
        select: { id: true }
      });
      leadsToValidate = leads.map(l => l.id);
    } else if (leadIds && Array.isArray(leadIds)) {
      leadsToValidate = leadIds;
    } else {
      return NextResponse.json(
        { error: 'Provide leadIds array or set validateAll: true' },
        { status: 400 }
      );
    }

    const results: ValidationResult[] = [];

    for (const leadId of leadsToValidate) {
      const result = await validateLead(leadId);
      results.push(result);

      // Update lead with validation results
      await prisma.lead.update({
        where: { id: leadId },
        data: {
          dataQualityScore: result.score,
          validationStatus: result.isValid ? 'validated' : 'needs_review',
          validationNotes: JSON.stringify({
            issues: result.issues,
            suggestions: result.suggestions,
            missingCritical: result.missingCritical,
            missingOptional: result.missingOptional,
            validatedAt: new Date().toISOString()
          }),
          validatedAt: new Date()
        }
      });
    }

    // Summary statistics
    const summary = {
      total: results.length,
      valid: results.filter(r => r.isValid).length,
      needsReview: results.filter(r => !r.isValid).length,
      averageScore: results.length > 0
        ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
        : 0
    };

    return NextResponse.json({
      success: true,
      summary,
      results
    });

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate leads' },
      { status: 500 }
    );
  }
}

// GET - Get validation status for all leads
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // pending, validated, needs_review

    const where = status ? { validationStatus: status } : {};

    const leads = await prisma.lead.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        email: true,
        businessName: true,
        score: true,
        dataQualityScore: true,
        validationStatus: true,
        validationNotes: true,
        validatedAt: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Parse validation notes
    const leadsWithNotes = leads.map(lead => ({
      ...lead,
      validationNotes: lead.validationNotes ? JSON.parse(lead.validationNotes) : null
    }));

    const summary = {
      total: leads.length,
      pending: leads.filter(l => l.validationStatus === 'pending').length,
      validated: leads.filter(l => l.validationStatus === 'validated').length,
      needsReview: leads.filter(l => l.validationStatus === 'needs_review').length
    };

    return NextResponse.json({
      summary,
      leads: leadsWithNotes
    });

  } catch (error) {
    console.error('Error fetching validation status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch validation status' },
      { status: 500 }
    );
  }
}
