import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

// Force dynamic - don't prerender
export const dynamic = 'force-dynamic'

// GET /api/disputes - Get all disputes
export async function GET() {
  // Check authentication
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) return authResult

  try {
    const disputes = await prisma.dispute.findMany({
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        order: {
          select: {
            paypalOrderId: true,
            packageName: true,
          },
        },
        client: {
          select: {
            businessName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(disputes);
  } catch (error) {
    console.error('Error fetching disputes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch disputes' },
      { status: 500 }
    );
  }
}
