import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This endpoint is called by Vercel Cron (or external scheduler) daily
// It triggers the blog generation for the next scheduled topic

export const maxDuration = 300; // 5 minutes for AI generation

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (Vercel cron sets this automatically)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Allow Vercel cron (Bearer token) or direct API key
    const isVercelCron = authHeader === `Bearer ${cronSecret}`;
    const isApiKey = request.headers.get('x-api-key') === cronSecret;

    if (!isVercelCron && !isApiKey && cronSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if there's a topic ready to generate
    const nextTopic = await prisma.blogTopic.findFirst({
      where: {
        status: 'queued',
        scheduledFor: { lte: new Date() },
      },
      orderBy: [
        { priority: 'desc' },
        { scheduledFor: 'asc' },
      ],
    });

    if (!nextTopic) {
      console.log('Daily blog cron: No topics ready for generation');
      return NextResponse.json({
        success: true,
        message: 'No topics scheduled for today',
        generated: false,
      });
    }

    console.log(`Daily blog cron: Generating "${nextTopic.title}"`);

    // Call the generate endpoint internally
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const generateResponse = await fetch(`${baseUrl}/api/blog/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': cronSecret || '',
      },
      body: JSON.stringify({ topicId: nextTopic.id }),
    });

    const result = await generateResponse.json();

    if (!generateResponse.ok) {
      console.error('Daily blog cron: Generation failed', result);
      return NextResponse.json({
        success: false,
        error: result.error || 'Generation failed',
        topic: nextTopic.title,
      }, { status: 500 });
    }

    console.log(`Daily blog cron: Published "${result.post?.title}" -> /blog/${result.post?.slug}`);

    return NextResponse.json({
      success: true,
      generated: true,
      post: result.post,
      topic: {
        id: nextTopic.id,
        title: nextTopic.title,
        pillar: nextTopic.pillar,
      },
    });

  } catch (error) {
    console.error('Daily blog cron error:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
}
