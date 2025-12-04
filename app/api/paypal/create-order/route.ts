import { NextRequest, NextResponse } from 'next/server';

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
 * Create PayPal order
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packageId, packageName, price, isSubscription } = body;

    if (!packageId || !packageName || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get access token
    const accessToken = await generateAccessToken();

    // For now, we'll create a one-time payment for both one-time and subscription packages
    // To implement true subscriptions, you'd need to create subscription plans in PayPal dashboard
    // and use the Subscriptions API instead

    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: packageId,
          description: packageName,
          custom_id: packageId,
          amount: {
            currency_code: 'USD',
            value: price.toString(),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: price.toString(),
              },
            },
          },
          items: [
            {
              name: packageName,
              description: isSubscription
                ? `${packageName} - Monthly Subscription`
                : `${packageName} - One-time Payment`,
              unit_amount: {
                currency_code: 'USD',
                value: price.toString(),
              },
              quantity: '1',
              category: isSubscription ? 'DIGITAL_GOODS' : 'DIGITAL_GOODS',
            },
          ],
        },
      ],
      application_context: {
        brand_name: 'AI Spokesperson Studio',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?package=${packageId}`,
      },
    };

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('PayPal order creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create PayPal order', details: error },
        { status: response.status }
      );
    }

    const order = await response.json();

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
