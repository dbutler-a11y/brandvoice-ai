import { NextResponse } from 'next/server';
import {
  batchUpdateLeadScores,
  getLeadsNeedingScoreUpdate,
  getLeadScoringStats
} from '@/lib/leadScoring';

/**
 * GET /api/leads/score/batch
 * Get statistics about lead scoring and identify leads needing updates
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const daysOld = parseInt(searchParams.get('daysOld') || '7');

    // Get scoring statistics
    const stats = await getLeadScoringStats();

    // Get leads needing score updates
    const leadsNeedingUpdate = await getLeadsNeedingScoreUpdate(daysOld);

    return NextResponse.json({
      stats,
      leadsNeedingUpdate: {
        count: leadsNeedingUpdate.length,
        leads: leadsNeedingUpdate.map(lead => ({
          id: lead.id,
          fullName: lead.fullName,
          email: lead.email,
          status: lead.status,
          score: lead.score,
          lastScoredAt: lead.lastScoredAt,
          createdAt: lead.createdAt
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching batch scoring info:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch batch scoring info',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/leads/score/batch
 * Batch update scores for multiple leads
 *
 * Body:
 * - leadIds?: string[] (optional - if not provided, updates all leads)
 * - onlyStale?: boolean (optional - only update leads needing update)
 * - daysOld?: number (optional - consider leads stale after X days, default 7)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadIds, onlyStale, daysOld = 7 } = body;

    let leadsToUpdate = leadIds;

    // If onlyStale flag is set, get leads needing updates
    if (onlyStale && !leadIds) {
      const staleLeads = await getLeadsNeedingScoreUpdate(daysOld);
      leadsToUpdate = staleLeads.map(lead => lead.id);
    }

    // Perform batch update
    const results = await batchUpdateLeadScores(leadsToUpdate);

    return NextResponse.json({
      success: true,
      message: `Batch score update completed`,
      results: {
        totalProcessed: results.processed,
        successfulUpdates: results.updated,
        failedUpdates: results.errors.length,
        errors: results.errors
      }
    });

  } catch (error) {
    console.error('Error performing batch score update:', error);
    return NextResponse.json(
      {
        error: 'Failed to perform batch score update',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
