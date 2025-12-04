import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/disputes - Get all disputes
export async function GET() {
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
