import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

// GET /api/alerts - Get all alerts
export async function GET() {
  // Check authentication
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) return authResult

  try {
    const alerts = await prisma.alert.findMany({
      orderBy: [
        { isRead: 'asc' },
        { severity: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 100,
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

// POST /api/alerts - Create a new alert
export async function POST(request: Request) {
  // Check authentication
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) return authResult

  try {
    const data = await request.json();

    const alert = await prisma.alert.create({
      data: {
        type: data.type,
        severity: data.severity || 'medium',
        title: data.title,
        message: data.message,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      },
    });

    return NextResponse.json(alert, { status: 201 });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}
