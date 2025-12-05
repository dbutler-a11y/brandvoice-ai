import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

// Force dynamic - don't prerender
export const dynamic = 'force-dynamic'

// GET /api/refunds - Get all refunds
export async function GET() {
  // Check authentication
  const authResult = await requireAdmin()
  if (authResult instanceof NextResponse) return authResult

  try {
    const refunds = await prisma.refund.findMany({
      orderBy: {
        createdAt: 'desc',
      },
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

    return NextResponse.json(refunds);
  } catch (error) {
    console.error('Error fetching refunds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch refunds' },
      { status: 500 }
    );
  }
}
