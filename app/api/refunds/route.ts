import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/refunds - Get all refunds
export async function GET() {
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
