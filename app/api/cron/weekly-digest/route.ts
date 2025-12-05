import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWeeklyDigest } from '@/lib/email';

// Vercel Cron secret to prevent unauthorized access
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  // Verify cron secret in production
  const authHeader = request.headers.get('authorization');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Calculate date range (last 7 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    // Get new leads this week
    const newLeads = await prisma.lead.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Get payments this week
    const payments = await prisma.order.findMany({
      where: {
        status: 'paid',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        totalAmount: true,
      },
    });

    const paymentsReceived = payments.length;
    const totalRevenue = payments.reduce((sum, p) => sum + (p.totalAmount || 0), 0) / 100;

    // Calculate conversion rate
    const totalLeadsAllTime = await prisma.lead.count();
    const convertedLeads = await prisma.lead.count({
      where: { status: 'WON' },
    });
    const conversionRate = totalLeadsAllTime > 0
      ? (convertedLeads / totalLeadsAllTime) * 100
      : 0;

    // Send the weekly digest email
    await sendWeeklyDigest({
      startDate,
      endDate,
      totalVisitors: 0, // Would need analytics integration for this
      newLeads,
      paymentsReceived,
      totalRevenue,
      topPages: [], // Would need analytics integration for this
      conversionRate,
    });

    console.log('[Cron] Weekly digest sent successfully');

    return NextResponse.json({
      success: true,
      message: 'Weekly digest sent',
      data: {
        newLeads,
        paymentsReceived,
        totalRevenue,
        conversionRate: conversionRate.toFixed(1),
      },
    });

  } catch (error) {
    console.error('[Cron] Failed to send weekly digest:', error);
    return NextResponse.json(
      { error: 'Failed to send weekly digest' },
      { status: 500 }
    );
  }
}
