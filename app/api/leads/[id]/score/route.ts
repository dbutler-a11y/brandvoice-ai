import { NextResponse } from 'next/server';
import {
  updateLeadScore,
  calculateLeadScore,
  getLeadGrade,
  shouldAutoQualifyLead
} from '@/lib/leadScoring';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/leads/[id]/score
 * Get current score breakdown for a lead
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const leadId = params.id;

    // Fetch lead with conversations and current score
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        conversations: true
      }
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Calculate current score (without updating DB)
    const scoreBreakdown = calculateLeadScore(lead as any);

    return NextResponse.json({
      leadId: lead.id,
      fullName: lead.fullName,
      email: lead.email,
      status: lead.status,
      currentScore: lead.score,
      currentGrade: getLeadGrade(lead.score),
      lastScoredAt: lead.lastScoredAt,
      isQualified: lead.isQualified,
      qualifiedAt: lead.qualifiedAt,
      // Live calculated breakdown
      liveScoreBreakdown: scoreBreakdown,
      // Stored breakdown from last calculation
      storedScoreBreakdown: lead.scoreBreakdown || null,
      // Indicate if score needs updating
      needsUpdate: !lead.lastScoredAt ||
        lead.score !== scoreBreakdown.total ||
        Math.abs(new Date().getTime() - new Date(lead.lastScoredAt).getTime()) > 7 * 24 * 60 * 60 * 1000
    });

  } catch (error) {
    console.error('Error fetching lead score:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch lead score',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/leads/[id]/score
 * Recalculate and update lead score in database
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const leadId = params.id;

    // Check if lead exists first
    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId }
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Update score
    const updatedLead = await updateLeadScore(leadId);

    // Fetch updated lead with full breakdown
    const leadWithConversations = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        conversations: {
          select: {
            id: true,
            createdAt: true,
            durationSeconds: true,
            sentiment: true,
            intentDetected: true,
            outcome: true,
            callBooked: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Lead score updated successfully',
      lead: {
        id: updatedLead.id,
        fullName: updatedLead.fullName,
        email: updatedLead.email,
        status: updatedLead.status,
        score: updatedLead.score,
        grade: getLeadGrade(updatedLead.score),
        scoreBreakdown: updatedLead.scoreBreakdown,
        lastScoredAt: updatedLead.lastScoredAt,
        isQualified: updatedLead.isQualified,
        qualifiedAt: updatedLead.qualifiedAt
      },
      conversations: leadWithConversations?.conversations || [],
      statusChanged: existingLead.status !== updatedLead.status,
      autoQualified: !existingLead.isQualified && updatedLead.isQualified
    });

  } catch (error) {
    console.error('Error updating lead score:', error);
    return NextResponse.json(
      {
        error: 'Failed to update lead score',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/leads/[id]/score
 * Alias for POST - recalculate and update score
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return POST(request, { params });
}
