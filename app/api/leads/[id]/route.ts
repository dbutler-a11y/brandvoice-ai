import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/leads/[id] - Get a single lead
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
      include: {
        conversations: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

// PATCH /api/leads/[id] - Update a lead
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    // Build update object dynamically
    const updateData: Record<string, any> = {};

    // Handle status updates
    if (data.status) {
      updateData.status = data.status;

      // Update timestamps based on status
      if (data.status === 'QUALIFIED' && !data.qualifiedAt) {
        updateData.qualifiedAt = new Date();
        updateData.isQualified = true;
      }
      if (data.status === 'WON') {
        updateData.convertedAt = new Date();
      }
    }

    // Handle other field updates
    const allowedFields = [
      'fullName', 'email', 'phone', 'businessName', 'businessType',
      'website', 'productsServices', 'targetAudience', 'videoGoals',
      'currentVideoStrategy', 'timeline', 'budgetAllocated', 'budgetRange',
      'socialPlatforms', 'contentTopics', 'competitorExamples',
      'spokespersonGender', 'spokespersonAge', 'spokespersonTone',
      'interestedAddOns', 'packageInterest', 'howHeardAboutUs',
      'biggestChallenge', 'questionsOrConcerns', 'preferredCallTime',
      'score', 'isQualified', 'convertedToClientId',
      'lastContactedAt', 'nextFollowUpAt', 'followUpNotes',
      'validationStatus', 'validationNotes'
    ];

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    });

    const lead = await prisma.lead.update({
      where: { id: params.id },
      data: updateData
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

// DELETE /api/leads/[id] - Delete a lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.lead.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
