/**
 * API endpoint to test email system
 * POST /api/email/test
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  sendTestEmail,
  sendWelcomeEmail,
  sendPaymentFailedEmail,
  sendWinBackEmail,
  sendDisputeAlertEmail,
  sendPaymentReceivedEmail,
  isEmailConfigured,
} from '@/lib/email';

export async function GET() {
  return NextResponse.json({
    configured: isEmailConfigured(),
    message: isEmailConfigured()
      ? 'Email system is configured and ready'
      : 'Email system not configured - check RESEND_API_KEY and EMAIL_FROM',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, email, ...params } = body;

    // Validate email configuration
    if (!isEmailConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email system not configured. Set RESEND_API_KEY and EMAIL_FROM in .env',
        },
        { status: 500 }
      );
    }

    // Validate email address
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid email address required',
        },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'test':
        result = await sendTestEmail(email);
        break;

      case 'welcome':
        result = await sendWelcomeEmail(
          email,
          params.clientName || 'Test Client',
          params.packageName || 'Pro Package'
        );
        break;

      case 'payment-failed':
        result = await sendPaymentFailedEmail(
          email,
          params.clientName || 'Test Client',
          params.updatePaymentLink || `${process.env.NEXT_PUBLIC_BASE_URL}/billing/update`
        );
        break;

      case 'win-back':
        result = await sendWinBackEmail(
          email,
          params.clientName || 'Test Client',
          params.specialOfferCode
        );
        break;

      case 'dispute-alert':
        result = await sendDisputeAlertEmail(
          email,
          params.clientName || 'Test Client',
          params.caseId || 'PP-D-TEST-12345',
          params.amount || 297.00
        );
        break;

      case 'payment-received':
        result = await sendPaymentReceivedEmail(
          email,
          params.clientName || 'Test Client',
          params.amount || 297.00,
          params.orderId || 'ORDER-TEST-12345'
        );
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown email type: ${type}. Valid types: test, welcome, payment-failed, win-back, dispute-alert, payment-received`,
          },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in email test endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
