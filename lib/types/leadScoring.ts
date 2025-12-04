/**
 * Type definitions for Lead Scoring System
 */

import { Lead, VoiceConversation } from '@prisma/client';

export interface LeadWithConversations extends Lead {
  conversations: VoiceConversation[];
}

export interface ScoreBreakdown {
  total: number;
  profileCompleteness: ProfileCompletenessScore;
  engagementSignals: EngagementSignalsScore;
  businessFit: BusinessFitScore;
  intentSignals: IntentSignalsScore;
  grade: LeadGrade;
  shouldAutoQualify: boolean;
  calculatedAt: string;
}

export interface ProfileCompletenessScore {
  score: number;
  maxScore: 25;
  details: {
    hasEmail: boolean;
    hasPhone: boolean;
    hasBusinessName: boolean;
    hasWebsite: boolean;
    hasBudgetInfo: boolean;
  };
}

export interface EngagementSignalsScore {
  score: number;
  maxScore: 25;
  details: {
    visitedPricingPage: boolean;
    startedCheckout: boolean;
    hadVoiceConversation: boolean;
    multipleConversations: boolean;
    conversationCount: number;
  };
}

export interface BusinessFitScore {
  score: number;
  maxScore: 25;
  details: {
    budgetMatchesPackages: boolean;
    timelineIsImmediate: boolean;
    hasVideoMarketingGoals: boolean;
  };
}

export interface IntentSignalsScore {
  score: number;
  maxScore: 25;
  details: {
    expressedPurchaseIntent: boolean;
    bookedCall: boolean;
    requestedProposal: boolean;
  };
}

export type LeadGrade = 'A' | 'B' | 'C' | 'D';

export interface BatchUpdateResults {
  processed: number;
  updated: number;
  errors: Array<{
    leadId: string;
    error: string;
  }>;
}

export interface LeadScoringStats {
  totalLeads: number;
  averageScore: number;
  gradeDistribution: Record<LeadGrade, number>;
  autoQualifiedCount: number;
  needsReview: number;
}

// API Response Types

export interface GetLeadScoreResponse {
  leadId: string;
  fullName: string | null;
  email: string | null;
  status: string;
  currentScore: number;
  currentGrade: LeadGrade;
  lastScoredAt: Date | null;
  isQualified: boolean;
  qualifiedAt: Date | null;
  liveScoreBreakdown: ScoreBreakdown;
  storedScoreBreakdown: ScoreBreakdown | null;
  needsUpdate: boolean;
}

export interface UpdateLeadScoreResponse {
  success: boolean;
  message: string;
  lead: {
    id: string;
    fullName: string | null;
    email: string | null;
    status: string;
    score: number;
    grade: LeadGrade;
    scoreBreakdown: ScoreBreakdown;
    lastScoredAt: Date | null;
    isQualified: boolean;
    qualifiedAt: Date | null;
  };
  conversations: Array<{
    id: string;
    createdAt: Date;
    durationSeconds: number | null;
    sentiment: string | null;
    intentDetected: string | null;
    outcome: string | null;
    callBooked: boolean;
  }>;
  statusChanged: boolean;
  autoQualified: boolean;
}

export interface BatchScoreInfoResponse {
  stats: LeadScoringStats;
  leadsNeedingUpdate: {
    count: number;
    leads: Array<{
      id: string;
      fullName: string | null;
      email: string | null;
      status: string;
      score: number;
      lastScoredAt: Date | null;
      createdAt: Date;
    }>;
  };
}

export interface BatchUpdateScoreResponse {
  success: boolean;
  message: string;
  results: BatchUpdateResults;
}

// Utility Types

export interface LeadScoreFilter {
  minScore?: number;
  maxScore?: number;
  grade?: LeadGrade;
  isQualified?: boolean;
  status?: string[];
}

export interface ScoringConfiguration {
  profileCompleteness: {
    email: number;
    phone: number;
    businessName: number;
    website: number;
    budgetInfo: number;
  };
  engagementSignals: {
    visitedPricingPage: number;
    startedCheckout: number;
    hadVoiceConversation: number;
    multipleConversations: number;
  };
  businessFit: {
    budgetMatchesPackages: number;
    timelineIsImmediate: number;
    hasVideoMarketingGoals: number;
  };
  intentSignals: {
    expressedPurchaseIntent: number;
    bookedCall: number;
    requestedProposal: number;
  };
  autoQualifyThreshold: number;
}

// Default scoring configuration
export const DEFAULT_SCORING_CONFIG: ScoringConfiguration = {
  profileCompleteness: {
    email: 5,
    phone: 5,
    businessName: 5,
    website: 5,
    budgetInfo: 5
  },
  engagementSignals: {
    visitedPricingPage: 10,
    startedCheckout: 15,
    hadVoiceConversation: 10,
    multipleConversations: 5
  },
  businessFit: {
    budgetMatchesPackages: 15,
    timelineIsImmediate: 10,
    hasVideoMarketingGoals: 5
  },
  intentSignals: {
    expressedPurchaseIntent: 15,
    bookedCall: 20,
    requestedProposal: 10
  },
  autoQualifyThreshold: 70
};

// Grade thresholds
export const GRADE_THRESHOLDS = {
  A: 80,
  B: 60,
  C: 40,
  D: 0
} as const;

// Helper type guards
export function isHighValueLead(score: number): boolean {
  return score >= GRADE_THRESHOLDS.A;
}

export function isWarmLead(score: number): boolean {
  return score >= GRADE_THRESHOLDS.B && score < GRADE_THRESHOLDS.A;
}

export function isColdLead(score: number): boolean {
  return score < GRADE_THRESHOLDS.C;
}

export function meetsAutoQualifyThreshold(
  score: number,
  threshold: number = DEFAULT_SCORING_CONFIG.autoQualifyThreshold
): boolean {
  return score >= threshold;
}
