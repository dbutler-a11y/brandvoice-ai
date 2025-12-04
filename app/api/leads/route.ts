import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List all leads with filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const qualified = searchParams.get('qualified');
    const source = searchParams.get('source');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    if (qualified !== null) {
      where.isQualified = qualified === 'true';
    }

    if (source) {
      where.source = source;
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          conversations: {
            select: {
              id: true,
              createdAt: true,
              durationSeconds: true,
              sentiment: true,
              outcome: true,
              summary: true
            },
            orderBy: { createdAt: 'desc' },
            take: 3
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.lead.count({ where })
    ]);

    // Stats
    const stats = await prisma.lead.groupBy({
      by: ['status'],
      _count: true
    });

    const qualifiedCount = await prisma.lead.count({
      where: { isQualified: true }
    });

    return NextResponse.json({
      leads,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + leads.length < total
      },
      stats: {
        byStatus: stats.reduce((acc, s) => {
          acc[s.status] = s._count;
          return acc;
        }, {} as Record<string, number>),
        qualified: qualifiedCount,
        total
      }
    });

  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// POST - Create a new lead manually
export async function POST(request: Request) {
  try {
    const data = await request.json();

    const lead = await prisma.lead.create({
      data: {
        fullName: data.fullName || null,
        email: data.email || null,
        phone: data.phone || null,
        businessName: data.businessName || null,
        businessType: data.businessType || null,
        website: data.website || null,
        productsServices: data.productsServices || null,
        targetAudience: data.targetAudience || null,
        videoGoals: data.videoGoals || null,
        currentVideoStrategy: data.currentVideoStrategy || null,
        timeline: data.timeline || null,
        budgetAllocated: data.budgetAllocated || null,
        budgetRange: data.budgetRange || null,
        socialPlatforms: data.socialPlatforms || null,
        contentTopics: data.contentTopics || null,
        competitorExamples: data.competitorExamples || null,
        spokespersonGender: data.spokespersonGender || null,
        spokespersonAge: data.spokespersonAge || null,
        spokespersonTone: data.spokespersonTone || null,
        interestedAddOns: data.interestedAddOns || null,
        packageInterest: data.packageInterest || null,
        howHeardAboutUs: data.howHeardAboutUs || null,
        biggestChallenge: data.biggestChallenge || null,
        questionsOrConcerns: data.questionsOrConcerns || null,
        preferredCallTime: data.preferredCallTime || null,
        source: data.source || 'manual',
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null,
      }
    });

    return NextResponse.json({ success: true, lead });

  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
