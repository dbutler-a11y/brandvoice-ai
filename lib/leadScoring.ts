import { prisma } from './prisma';
import { Lead, VoiceConversation } from '@prisma/client';

/**
 * Lead Scoring System
 *
 * Evaluates leads on a 0-100 scale across 4 categories:
 * 1. Profile Completeness (0-25 points)
 * 2. Engagement Signals (0-25 points)
 * 3. Business Fit (0-25 points)
 * 4. Intent Signals (0-25 points)
 */

// Types
export interface LeadWithConversations extends Lead {
  conversations: VoiceConversation[];
}

export interface ScoreBreakdown {
  total: number;
  profileCompleteness: {
    score: number;
    maxScore: 25;
    details: {
      hasEmail: boolean;
      hasPhone: boolean;
      hasBusinessName: boolean;
      hasWebsite: boolean;
      hasBudgetInfo: boolean;
    };
  };
  engagementSignals: {
    score: number;
    maxScore: 25;
    details: {
      visitedPricingPage: boolean;
      startedCheckout: boolean;
      hadVoiceConversation: boolean;
      multipleConversations: boolean;
      conversationCount: number;
    };
  };
  businessFit: {
    score: number;
    maxScore: 25;
    details: {
      budgetMatchesPackages: boolean;
      timelineIsImmediate: boolean;
      hasVideoMarketingGoals: boolean;
    };
  };
  intentSignals: {
    score: number;
    maxScore: 25;
    details: {
      expressedPurchaseIntent: boolean;
      bookedCall: boolean;
      requestedProposal: boolean;
    };
  };
  grade: 'A' | 'B' | 'C' | 'D';
  shouldAutoQualify: boolean;
  calculatedAt: string;
}

// Constants for budget ranges that match our packages
const PACKAGE_BUDGETS = {
  'launch-kit': { min: 497, max: 997 },
  'content-engine': { min: 997, max: 2497 },
  'content-engine-pro': { min: 2497, max: 4997 },
  'authority-engine': { min: 4997, max: 10000 }
};

const IMMEDIATE_TIMELINE_KEYWORDS = ['immediate', 'asap', 'now', 'this week', 'this month', 'urgent'];

/**
 * Calculate profile completeness score (0-25 points)
 */
function calculateProfileCompletenessScore(lead: Lead): ScoreBreakdown['profileCompleteness'] {
  const details = {
    hasEmail: !!lead.email,
    hasPhone: !!lead.phone,
    hasBusinessName: !!lead.businessName,
    hasWebsite: !!lead.website,
    hasBudgetInfo: !!(lead.budgetRange || lead.budgetAllocated)
  };

  let score = 0;
  if (details.hasEmail) score += 5;
  if (details.hasPhone) score += 5;
  if (details.hasBusinessName) score += 5;
  if (details.hasWebsite) score += 5;
  if (details.hasBudgetInfo) score += 5;

  return {
    score,
    maxScore: 25,
    details
  };
}

/**
 * Calculate engagement signals score (0-25 points)
 */
function calculateEngagementSignalsScore(
  lead: Lead,
  conversations: VoiceConversation[]
): ScoreBreakdown['engagementSignals'] {
  const conversationCount = conversations.length;

  // Check if visited pricing page (would need tracking implementation)
  // For now, we'll infer from package interest
  const visitedPricingPage = !!lead.packageInterest;

  // Check if started checkout (would need tracking implementation)
  // For now, we'll check if they expressed budget and package interest
  const startedCheckout = !!lead.packageInterest && !!lead.budgetRange;

  const hadVoiceConversation = conversationCount > 0;
  const multipleConversations = conversationCount > 1;

  const details = {
    visitedPricingPage,
    startedCheckout,
    hadVoiceConversation,
    multipleConversations,
    conversationCount
  };

  let score = 0;
  if (details.visitedPricingPage) score += 10;
  if (details.startedCheckout) score += 15;
  if (details.hadVoiceConversation) score += 10;
  if (details.multipleConversations) score += 5;

  return {
    score,
    maxScore: 25,
    details
  };
}

/**
 * Calculate business fit score (0-25 points)
 */
function calculateBusinessFitScore(lead: Lead): ScoreBreakdown['businessFit'] {
  // Check if budget matches our packages
  let budgetMatchesPackages = false;
  if (lead.budgetRange) {
    const budgetLower = lead.budgetRange.toLowerCase();
    // Extract numbers from budget range
    const numbers = budgetLower.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      const minBudget = parseInt(numbers[0]);
      // Check if it falls within any of our package ranges
      budgetMatchesPackages = Object.values(PACKAGE_BUDGETS).some(
        range => minBudget >= range.min && minBudget <= range.max
      );
    }
    // Also check for specific package mentions
    if (budgetLower.includes('launch') || budgetLower.includes('content') ||
        budgetLower.includes('authority') || budgetLower.includes('500') ||
        budgetLower.includes('1000') || budgetLower.includes('2500')) {
      budgetMatchesPackages = true;
    }
  }

  // Check if timeline is immediate
  const timelineIsImmediate = !!lead.timeline &&
    IMMEDIATE_TIMELINE_KEYWORDS.some(keyword =>
      lead.timeline!.toLowerCase().includes(keyword)
    );

  // Check if they have defined video marketing goals
  const hasVideoMarketingGoals = !!lead.videoGoals && lead.videoGoals.length > 10;

  const details = {
    budgetMatchesPackages,
    timelineIsImmediate,
    hasVideoMarketingGoals
  };

  let score = 0;
  if (details.budgetMatchesPackages) score += 15;
  if (details.timelineIsImmediate) score += 10;
  if (details.hasVideoMarketingGoals) score += 5;

  return {
    score,
    maxScore: 25,
    details
  };
}

/**
 * Calculate intent signals score (0-25 points)
 */
function calculateIntentSignalsScore(
  lead: Lead,
  conversations: VoiceConversation[]
): ScoreBreakdown['intentSignals'] {
  // Check if expressed purchase intent in conversations
  const expressedPurchaseIntent = conversations.some(conv => {
    const intent = conv.intentDetected?.toLowerCase();
    return intent?.includes('purchase') || intent?.includes('buy') || intent?.includes('ready');
  }) || conversations.some(conv => {
    const transcript = conv.transcript?.toLowerCase();
    return transcript?.includes('i want to buy') ||
           transcript?.includes('ready to purchase') ||
           transcript?.includes('let\'s move forward') ||
           transcript?.includes('sign up') ||
           transcript?.includes('get started');
  });

  // Check if booked a call
  const bookedCall = conversations.some(conv => conv.callBooked) ||
                     conversations.some(conv => conv.outcome === 'booked_call');

  // Check if requested proposal
  const requestedProposal = lead.status === 'PROPOSAL_SENT' ||
    conversations.some(conv => {
      const transcript = conv.transcript?.toLowerCase();
      return transcript?.includes('send proposal') ||
             transcript?.includes('quote') ||
             transcript?.includes('pricing details');
    });

  const details = {
    expressedPurchaseIntent,
    bookedCall,
    requestedProposal
  };

  let score = 0;
  if (details.expressedPurchaseIntent) score += 15;
  if (details.bookedCall) score += 20;
  if (details.requestedProposal) score += 10;

  return {
    score,
    maxScore: 25,
    details
  };
}

/**
 * Calculate total lead score with detailed breakdown
 * @param lead - Lead object with conversations
 * @returns Score breakdown with total score (0-100)
 */
export function calculateLeadScore(lead: LeadWithConversations): ScoreBreakdown {
  const profileCompleteness = calculateProfileCompletenessScore(lead);
  const engagementSignals = calculateEngagementSignalsScore(lead, lead.conversations);
  const businessFit = calculateBusinessFitScore(lead);
  const intentSignals = calculateIntentSignalsScore(lead, lead.conversations);

  const total =
    profileCompleteness.score +
    engagementSignals.score +
    businessFit.score +
    intentSignals.score;

  const grade = getLeadGrade(total);
  const shouldAutoQualify = shouldAutoQualifyLead(lead, total);

  return {
    total,
    profileCompleteness,
    engagementSignals,
    businessFit,
    intentSignals,
    grade,
    shouldAutoQualify,
    calculatedAt: new Date().toISOString()
  };
}

/**
 * Get letter grade based on score
 * A = 80-100, B = 60-79, C = 40-59, D = 0-39
 */
export function getLeadGrade(score: number): 'A' | 'B' | 'C' | 'D' {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  return 'D';
}

/**
 * Determine if lead should be auto-qualified
 * Auto-qualify if score >= 70 AND has minimum contact info
 */
export function shouldAutoQualifyLead(lead: Lead, score: number): boolean {
  const hasMinimumContactInfo = !!(lead.email || lead.phone);
  const hasHighScore = score >= 70;

  return hasHighScore && hasMinimumContactInfo;
}

/**
 * Update lead score in database
 * Fetches lead with conversations, calculates score, and updates DB
 */
export async function updateLeadScore(leadId: string): Promise<Lead> {
  // Fetch lead with conversations
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      conversations: true
    }
  });

  if (!lead) {
    throw new Error(`Lead with ID ${leadId} not found`);
  }

  // Calculate score
  const scoreBreakdown = calculateLeadScore(lead as LeadWithConversations);

  // Determine if should be qualified
  const shouldQualify = scoreBreakdown.shouldAutoQualify;

  // Update lead in database
  const updatedLead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      score: scoreBreakdown.total,
      scoreBreakdown: scoreBreakdown as unknown as Record<string, unknown>, // Prisma Json type
      lastScoredAt: new Date(),
      isQualified: shouldQualify,
      qualifiedAt: shouldQualify && !lead.isQualified ? new Date() : lead.qualifiedAt,
      status: shouldQualify && lead.status === 'NEW' ? 'QUALIFIED' : lead.status
    }
  });

  return updatedLead;
}

/**
 * Batch update scores for multiple leads
 * Useful for recalculating scores across the entire database
 */
export async function batchUpdateLeadScores(leadIds?: string[]): Promise<{
  processed: number;
  updated: number;
  errors: Array<{ leadId: string; error: string }>;
}> {
  const leads = leadIds
    ? await prisma.lead.findMany({ where: { id: { in: leadIds } } })
    : await prisma.lead.findMany();

  const results = {
    processed: 0,
    updated: 0,
    errors: [] as Array<{ leadId: string; error: string }>
  };

  for (const lead of leads) {
    try {
      await updateLeadScore(lead.id);
      results.processed++;
      results.updated++;
    } catch (error) {
      results.processed++;
      results.errors.push({
        leadId: lead.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return results;
}

/**
 * Get leads that need score recalculation
 * Returns leads that have never been scored or were scored more than X days ago
 */
export async function getLeadsNeedingScoreUpdate(daysOld: number = 7): Promise<Lead[]> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  return prisma.lead.findMany({
    where: {
      OR: [
        { lastScoredAt: null },
        { lastScoredAt: { lt: cutoffDate } }
      ],
      status: {
        notIn: ['WON', 'LOST'] // Don't rescore closed leads
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * Get high-value leads for prioritization
 * Returns leads with scores above threshold
 */
export async function getHighValueLeads(minScore: number = 60): Promise<Lead[]> {
  return prisma.lead.findMany({
    where: {
      score: { gte: minScore },
      status: {
        notIn: ['WON', 'LOST']
      }
    },
    orderBy: { score: 'desc' }
  });
}

/**
 * Get scoring statistics
 */
export async function getLeadScoringStats(): Promise<{
  totalLeads: number;
  averageScore: number;
  gradeDistribution: Record<string, number>;
  autoQualifiedCount: number;
  needsReview: number;
}> {
  const leads = await prisma.lead.findMany({
    where: {
      status: {
        notIn: ['WON', 'LOST']
      }
    }
  });

  const totalLeads = leads.length;
  const averageScore = totalLeads > 0
    ? leads.reduce((sum, lead) => sum + lead.score, 0) / totalLeads
    : 0;

  const gradeDistribution = {
    A: leads.filter(l => l.score >= 80).length,
    B: leads.filter(l => l.score >= 60 && l.score < 80).length,
    C: leads.filter(l => l.score >= 40 && l.score < 60).length,
    D: leads.filter(l => l.score < 40).length
  };

  const autoQualifiedCount = leads.filter(l => l.isQualified).length;
  const needsReview = leads.filter(l => !l.lastScoredAt).length;

  return {
    totalLeads,
    averageScore: Math.round(averageScore * 10) / 10,
    gradeDistribution,
    autoQualifiedCount,
    needsReview
  };
}
