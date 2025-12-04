/**
 * React hooks for Lead Scoring System
 */

import { useState, useCallback } from 'react';
import {
  ScoreBreakdown,
  GetLeadScoreResponse,
  UpdateLeadScoreResponse,
  BatchScoreInfoResponse,
  BatchUpdateScoreResponse,
  LeadScoringStats
} from '@/lib/types/leadScoring';

/**
 * Hook to fetch and update a single lead's score
 */
export function useLeadScore(leadId: string | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scoreData, setScoreData] = useState<GetLeadScoreResponse | null>(null);

  const fetchScore = useCallback(async () => {
    if (!leadId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/leads/${leadId}/score`);

      if (!response.ok) {
        throw new Error(`Failed to fetch score: ${response.statusText}`);
      }

      const data: GetLeadScoreResponse = await response.json();
      setScoreData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  const updateScore = useCallback(async () => {
    if (!leadId) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/leads/${leadId}/score`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`Failed to update score: ${response.statusText}`);
      }

      const data: UpdateLeadScoreResponse = await response.json();

      // Refresh the score data
      await fetchScore();

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [leadId, fetchScore]);

  return {
    scoreData,
    loading,
    error,
    fetchScore,
    updateScore
  };
}

/**
 * Hook for batch scoring operations
 */
export function useBatchScoring() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<LeadScoringStats | null>(null);

  const fetchStats = useCallback(async (daysOld: number = 7) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/leads/score/batch?daysOld=${daysOld}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      const data: BatchScoreInfoResponse = await response.json();
      setStats(data.stats);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const batchUpdate = useCallback(
    async (options?: {
      leadIds?: string[];
      onlyStale?: boolean;
      daysOld?: number;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/leads/score/batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(options || {})
        });

        if (!response.ok) {
          throw new Error(`Failed to batch update: ${response.statusText}`);
        }

        const data: BatchUpdateScoreResponse = await response.json();

        // Refresh stats after update
        await fetchStats();

        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchStats]
  );

  return {
    stats,
    loading,
    error,
    fetchStats,
    batchUpdate
  };
}

/**
 * Hook to calculate score grade and color
 */
export function useScoreGrade(score: number) {
  const getGrade = (): 'A' | 'B' | 'C' | 'D' => {
    if (score >= 80) return 'A';
    if (score >= 60) return 'B';
    if (score >= 40) return 'C';
    return 'D';
  };

  const getColor = (): string => {
    const grade = getGrade();
    switch (grade) {
      case 'A':
        return 'text-green-600 bg-green-100';
      case 'B':
        return 'text-blue-600 bg-blue-100';
      case 'C':
        return 'text-yellow-600 bg-yellow-100';
      case 'D':
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getLabel = (): string => {
    const grade = getGrade();
    switch (grade) {
      case 'A':
        return 'Hot Lead';
      case 'B':
        return 'Warm Lead';
      case 'C':
        return 'Cool Lead';
      case 'D':
        return 'Cold Lead';
    }
  };

  const getPriority = (): 'high' | 'medium' | 'low' => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  return {
    grade: getGrade(),
    color: getColor(),
    label: getLabel(),
    priority: getPriority()
  };
}

/**
 * Hook for real-time score calculation (client-side)
 * Useful for showing live score updates as user fills out forms
 */
export function useScoreCalculator() {
  const calculateProfileScore = (profile: {
    email?: string;
    phone?: string;
    businessName?: string;
    website?: string;
    budgetRange?: string;
  }): number => {
    let score = 0;
    if (profile.email) score += 5;
    if (profile.phone) score += 5;
    if (profile.businessName) score += 5;
    if (profile.website) score += 5;
    if (profile.budgetRange) score += 5;
    return score;
  };

  const calculateEngagementScore = (engagement: {
    hasPackageInterest?: boolean;
    hasPackageAndBudget?: boolean;
    conversationCount?: number;
  }): number => {
    let score = 0;
    if (engagement.hasPackageInterest) score += 10;
    if (engagement.hasPackageAndBudget) score += 15;
    if (engagement.conversationCount && engagement.conversationCount > 0) score += 10;
    if (engagement.conversationCount && engagement.conversationCount > 1) score += 5;
    return score;
  };

  const calculateBusinessFitScore = (fit: {
    hasBudget?: boolean;
    hasImmediateTimeline?: boolean;
    hasVideoGoals?: boolean;
  }): number => {
    let score = 0;
    if (fit.hasBudget) score += 15;
    if (fit.hasImmediateTimeline) score += 10;
    if (fit.hasVideoGoals) score += 5;
    return score;
  };

  const calculateIntentScore = (intent: {
    hasPurchaseIntent?: boolean;
    hasBookedCall?: boolean;
    hasRequestedProposal?: boolean;
  }): number => {
    let score = 0;
    if (intent.hasPurchaseIntent) score += 15;
    if (intent.hasBookedCall) score += 20;
    if (intent.hasRequestedProposal) score += 10;
    return score;
  };

  return {
    calculateProfileScore,
    calculateEngagementScore,
    calculateBusinessFitScore,
    calculateIntentScore
  };
}

/**
 * Format score breakdown for display
 */
export function useScoreFormatter() {
  const formatBreakdown = (breakdown: ScoreBreakdown | null) => {
    if (!breakdown) return null;

    return {
      sections: [
        {
          title: 'Profile Completeness',
          score: breakdown.profileCompleteness.score,
          maxScore: breakdown.profileCompleteness.maxScore,
          percentage: Math.round(
            (breakdown.profileCompleteness.score / breakdown.profileCompleteness.maxScore) * 100
          ),
          items: [
            {
              label: 'Email',
              value: breakdown.profileCompleteness.details.hasEmail,
              points: 5
            },
            {
              label: 'Phone',
              value: breakdown.profileCompleteness.details.hasPhone,
              points: 5
            },
            {
              label: 'Business Name',
              value: breakdown.profileCompleteness.details.hasBusinessName,
              points: 5
            },
            {
              label: 'Website',
              value: breakdown.profileCompleteness.details.hasWebsite,
              points: 5
            },
            {
              label: 'Budget Info',
              value: breakdown.profileCompleteness.details.hasBudgetInfo,
              points: 5
            }
          ]
        },
        {
          title: 'Engagement Signals',
          score: breakdown.engagementSignals.score,
          maxScore: breakdown.engagementSignals.maxScore,
          percentage: Math.round(
            (breakdown.engagementSignals.score / breakdown.engagementSignals.maxScore) * 100
          ),
          items: [
            {
              label: 'Visited Pricing Page',
              value: breakdown.engagementSignals.details.visitedPricingPage,
              points: 10
            },
            {
              label: 'Started Checkout',
              value: breakdown.engagementSignals.details.startedCheckout,
              points: 15
            },
            {
              label: 'Had Conversation',
              value: breakdown.engagementSignals.details.hadVoiceConversation,
              points: 10
            },
            {
              label: `Multiple Conversations (${breakdown.engagementSignals.details.conversationCount})`,
              value: breakdown.engagementSignals.details.multipleConversations,
              points: 5
            }
          ]
        },
        {
          title: 'Business Fit',
          score: breakdown.businessFit.score,
          maxScore: breakdown.businessFit.maxScore,
          percentage: Math.round((breakdown.businessFit.score / breakdown.businessFit.maxScore) * 100),
          items: [
            {
              label: 'Budget Matches Packages',
              value: breakdown.businessFit.details.budgetMatchesPackages,
              points: 15
            },
            {
              label: 'Immediate Timeline',
              value: breakdown.businessFit.details.timelineIsImmediate,
              points: 10
            },
            {
              label: 'Has Marketing Goals',
              value: breakdown.businessFit.details.hasVideoMarketingGoals,
              points: 5
            }
          ]
        },
        {
          title: 'Intent Signals',
          score: breakdown.intentSignals.score,
          maxScore: breakdown.intentSignals.maxScore,
          percentage: Math.round((breakdown.intentSignals.score / breakdown.intentSignals.maxScore) * 100),
          items: [
            {
              label: 'Purchase Intent',
              value: breakdown.intentSignals.details.expressedPurchaseIntent,
              points: 15
            },
            {
              label: 'Booked Call',
              value: breakdown.intentSignals.details.bookedCall,
              points: 20
            },
            {
              label: 'Requested Proposal',
              value: breakdown.intentSignals.details.requestedProposal,
              points: 10
            }
          ]
        }
      ]
    };
  };

  return { formatBreakdown };
}
