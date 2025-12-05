import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, RateLimitTier } from '@/lib/rate-limit';

const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

/**
 * Generate PayPal access token
 */
async function generateAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are not configured');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('PayPal token error:', error);
    throw new Error('Failed to generate PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Capture PayPal order
 */
export async function POST(request: NextRequest) {
  // Apply rate limiting to prevent abuse
  const rateLimitResult = rateLimit(request, RateLimitTier.STRICT);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { orderId, packageId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing order ID' },
        { status: 400 }
      );
    }

    // Validate orderId format (PayPal order IDs are alphanumeric)
    if (typeof orderId !== 'string' || !/^[A-Za-z0-9]+$/.test(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID format' },
        { status: 400 }
      );
    }

    // Get access token
    const accessToken = await generateAccessToken();

    // Capture the order
    const response = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('PayPal capture error:', error);
      return NextResponse.json(
        { error: 'Failed to capture payment', details: error },
        { status: response.status }
      );
    }

    const captureData = await response.json();

    // Check if payment was successful
    if (captureData.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment was not completed', status: captureData.status },
        { status: 400 }
      );
    }

    // Extract payment details
    const purchaseUnit = captureData.purchase_units?.[0];
    const capture = purchaseUnit?.payments?.captures?.[0];
    const payer = captureData.payer;

    // Here you would typically:
    // 1. Save the order to your database
    // 2. Create a client account if new customer
    // 3. Send confirmation email
    // 4. Grant access to client portal
    // 5. Trigger any onboarding workflows

    // Log the successful payment (in production, save to database)
    console.log('Payment successful:', {
      orderId: captureData.id,
      packageId,
      amount: capture?.amount?.value,
      currency: capture?.amount?.currency_code,
      payerEmail: payer?.email_address,
      payerName: `${payer?.name?.given_name} ${payer?.name?.surname}`,
      timestamp: new Date().toISOString(),
    });

    // Return success response
    return NextResponse.json({
      success: true,
      orderId: captureData.id,
      status: captureData.status,
      payer: {
        email: payer?.email_address,
        name: `${payer?.name?.given_name} ${payer?.name?.surname}`,
      },
      payment: {
        amount: capture?.amount?.value,
        currency: capture?.amount?.currency_code,
      },
    });
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
