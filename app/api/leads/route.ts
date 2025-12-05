import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { applyRateLimit } from '@/lib/ratelimit';
import { validateLeadData } from '@/lib/validation';
import { notifyNewLead } from '@/lib/email';

// GET - List all leads with filtering
export async function GET(request: Request) {
  // Apply relaxed rate limiting to prevent abuse
  const rateLimitCheck = applyRateLimit(request, 'RELAXED');
  if (rateLimitCheck.response) {
    return rateLimitCheck.response;
  }
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
  // Apply standard rate limiting (30 requests per minute)
  const rateLimitCheck = applyRateLimit(request, 'STANDARD');
  if (rateLimitCheck.response) {
    return rateLimitCheck.response;
  }

  try {
    const data = await request.json();

    // Validate and sanitize input data
    const validation = validateLeadData(data);

    if (!validation.valid) {
      console.error('[Leads API] Validation errors:', validation.errors);
      return NextResponse.json(
        {
          error: 'Invalid input data',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    // Check for duplicate email if provided
    if (validation.sanitized.email) {
      const existingLead = await prisma.lead.findFirst({
        where: { email: validation.sanitized.email },
      });

      if (existingLead) {
        return NextResponse.json(
          {
            error: 'Duplicate lead',
            message: 'A lead with this email already exists',
            leadId: existingLead.id,
          },
          { status: 409 }
        );
      }
    }

    // Create lead with sanitized data
    const lead = await prisma.lead.create({
      data: {
        fullName: validation.sanitized.fullName || null,
        email: validation.sanitized.email || null,
        phone: validation.sanitized.phone || null,
        businessName: validation.sanitized.businessName || null,
        businessType: validation.sanitized.businessType || null,
        website: validation.sanitized.website || null,
        productsServices: validation.sanitized.productsServices || null,
        targetAudience: validation.sanitized.targetAudience || null,
        videoGoals: validation.sanitized.videoGoals || null,
        currentVideoStrategy: validation.sanitized.currentVideoStrategy || null,
        timeline: validation.sanitized.timeline || null,
        budgetAllocated: validation.sanitized.budgetAllocated || null,
        budgetRange: validation.sanitized.budgetRange || null,
        socialPlatforms: validation.sanitized.socialPlatforms || null,
        contentTopics: validation.sanitized.contentTopics || null,
        competitorExamples: validation.sanitized.competitorExamples || null,
        spokespersonGender: validation.sanitized.spokespersonGender || null,
        spokespersonAge: validation.sanitized.spokespersonAge || null,
        spokespersonTone: validation.sanitized.spokespersonTone || null,
        interestedAddOns: validation.sanitized.interestedAddOns || null,
        packageInterest: validation.sanitized.packageInterest || null,
        howHeardAboutUs: validation.sanitized.howHeardAboutUs || null,
        biggestChallenge: validation.sanitized.biggestChallenge || null,
        questionsOrConcerns: validation.sanitized.questionsOrConcerns || null,
        preferredCallTime: validation.sanitized.preferredCallTime || null,
        source: validation.sanitized.source || 'manual',
        utmSource: validation.sanitized.utmSource || null,
        utmMedium: validation.sanitized.utmMedium || null,
        utmCampaign: validation.sanitized.utmCampaign || null,
      },
    });

    // Send email notification for new lead (non-blocking)
    notifyNewLead({
      name: validation.sanitized.fullName || 'Unknown',
      email: validation.sanitized.email || 'No email',
      phone: validation.sanitized.phone ?? undefined,
      company: validation.sanitized.businessName ?? undefined,
      source: validation.sanitized.source || 'website',
      message: validation.sanitized.questionsOrConcerns ?? undefined,
    }).catch(err => console.error('Failed to send lead notification:', err));

    return NextResponse.json({ success: true, lead });

  } catch (error) {
    console.error('[Leads API] Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
