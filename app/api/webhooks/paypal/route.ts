import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  handleOrderCompleted,
  handlePaymentCaptured,
  handlePaymentRefunded,
  handleSubscriptionActivated,
  handleSubscriptionCancelled,
  handleSubscriptionSuspended,
  handlePaymentFailed,
  handleDisputeCreated,
  handleDisputeResolved,
} from './handlers';

// PayPal webhook event types we handle
const SUPPORTED_EVENT_TYPES = [
  'CHECKOUT.ORDER.COMPLETED',
  'PAYMENT.CAPTURE.COMPLETED',
  'PAYMENT.CAPTURE.REFUNDED',
  'BILLING.SUBSCRIPTION.ACTIVATED',
  'BILLING.SUBSCRIPTION.CANCELLED',
  'BILLING.SUBSCRIPTION.SUSPENDED',
  'BILLING.SUBSCRIPTION.PAYMENT.FAILED',
  'CUSTOMER.DISPUTE.CREATED',
  'CUSTOMER.DISPUTE.RESOLVED',
] as const;

type PayPalEventType = typeof SUPPORTED_EVENT_TYPES[number];

// PayPal webhook payload structure
interface PayPalWebhookPayload {
  id: string;
  event_type: string;
  create_time: string;
  resource_type: string;
  resource_version?: string;
  resource: Record<string, unknown>;
  summary?: string;
  links?: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

/**
 * Verify PayPal webhook signature
 *
 * PayPal webhook verification requires:
 * 1. The webhook ID (from PayPal dashboard)
 * 2. The transmission ID (from x-paypal-transmission-id header)
 * 3. The transmission time (from x-paypal-transmission-time header)
 * 4. The cert URL (from x-paypal-cert-url header)
 * 5. The auth algo (from x-paypal-auth-algo header)
 * 6. The actual signature (from x-paypal-transmission-sig header)
 * 7. The webhook event body
 *
 * @see https://developer.paypal.com/api/rest/webhooks/
 */
async function verifyPayPalSignature(
  request: Request,
  body: string
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  // Always require webhook ID - no bypass in any environment
  if (!webhookId) {
    console.error('[PayPal Webhook Security] PAYPAL_WEBHOOK_ID not configured - signature verification required');
    return false;
  }

  const transmissionId = request.headers.get('paypal-transmission-id');
  const transmissionTime = request.headers.get('paypal-transmission-time');
  const transmissionSig = request.headers.get('paypal-transmission-sig');
  const certUrl = request.headers.get('paypal-cert-url');
  const authAlgo = request.headers.get('paypal-auth-algo');

  if (!transmissionId || !transmissionTime || !transmissionSig || !certUrl || !authAlgo) {
    console.error('[PayPal Webhook Security] Missing required webhook headers:', {
      hasTransmissionId: !!transmissionId,
      hasTransmissionTime: !!transmissionTime,
      hasTransmissionSig: !!transmissionSig,
      hasCertUrl: !!certUrl,
      hasAuthAlgo: !!authAlgo,
    });
    return false;
  }

  try {
    // Get PayPal OAuth token
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('[PayPal Webhook Security] PayPal credentials not configured');
      return false;
    }

    const mode = process.env.NEXT_PUBLIC_PAYPAL_MODE || 'sandbox';
    const baseUrl = mode === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    // Get access token
    const authResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error('[PayPal Webhook Security] Failed to get access token:', {
        status: authResponse.status,
        error: errorText,
      });
      return false;
    }

    const { access_token } = await authResponse.json();

    // Verify webhook signature
    const verifyResponse = await fetch(`${baseUrl}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        transmission_id: transmissionId,
        transmission_time: transmissionTime,
        cert_url: certUrl,
        auth_algo: authAlgo,
        transmission_sig: transmissionSig,
        webhook_id: webhookId,
        webhook_event: JSON.parse(body),
      }),
    });

    if (!verifyResponse.ok) {
      const errorText = await verifyResponse.text();
      console.error('[PayPal Webhook Security] Signature verification failed:', {
        status: verifyResponse.status,
        error: errorText,
      });
      return false;
    }

    const verifyData = await verifyResponse.json();
    const isValid = verifyData.verification_status === 'SUCCESS';

    if (!isValid) {
      console.error('[PayPal Webhook Security] Verification status not SUCCESS:', verifyData);
    }

    return isValid;

  } catch (error) {
    console.error('[PayPal Webhook Security] Error verifying signature:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return false;
  }
}

/**
 * Log webhook event to database
 */
async function logWebhookEvent(
  eventType: string,
  eventId: string,
  payload: Record<string, unknown>,
  status: 'received' | 'processed' | 'failed' = 'received',
  error?: string
) {
  try {
    await prisma.webhookLog.create({
      data: {
        source: 'paypal',
        eventType,
        eventId,
        payload: JSON.stringify(payload),
        status,
        error: error || null,
        processedAt: status === 'processed' ? new Date() : null,
      },
    });
  } catch (err) {
    console.error('Failed to log webhook event:', err);
    // Don't throw - we don't want logging failures to break webhook processing
  }
}

/**
 * Main webhook handler
 */
export async function POST(request: Request) {
  let webhookPayload: PayPalWebhookPayload | null = null;
  let rawBody = '';

  try {
    // Get raw body for signature verification
    rawBody = await request.text();
    webhookPayload = JSON.parse(rawBody) as PayPalWebhookPayload;

    if (!webhookPayload || !webhookPayload.event_type || !webhookPayload.id) {
      throw new Error('Invalid webhook payload: missing required fields');
    }

    console.log(`[PayPal Webhook] Received event: ${webhookPayload.event_type} (${webhookPayload.id})`);

    // Verify webhook signature
    const isValid = await verifyPayPalSignature(request, rawBody);

    if (!isValid) {
      console.error('[PayPal Webhook] Invalid signature');
      await logWebhookEvent(
        webhookPayload.event_type,
        webhookPayload.id,
        webhookPayload,
        'failed',
        'Invalid webhook signature'
      );
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Log the webhook event
    await logWebhookEvent(
      webhookPayload.event_type,
      webhookPayload.id,
      webhookPayload
    );

    // Check if we support this event type
    if (!SUPPORTED_EVENT_TYPES.includes(webhookPayload.event_type as PayPalEventType)) {
      console.log(`[PayPal Webhook] Unsupported event type: ${webhookPayload.event_type}`);
      return NextResponse.json({
        message: 'Event type not supported',
        eventType: webhookPayload.event_type,
      });
    }

    // Route to appropriate handler
    let result;
    try {
      switch (webhookPayload.event_type) {
        case 'CHECKOUT.ORDER.COMPLETED':
          result = await handleOrderCompleted(webhookPayload);
          break;

        case 'PAYMENT.CAPTURE.COMPLETED':
          result = await handlePaymentCaptured(webhookPayload);
          break;

        case 'PAYMENT.CAPTURE.REFUNDED':
          result = await handlePaymentRefunded(webhookPayload);
          break;

        case 'BILLING.SUBSCRIPTION.ACTIVATED':
          result = await handleSubscriptionActivated(webhookPayload);
          break;

        case 'BILLING.SUBSCRIPTION.CANCELLED':
          result = await handleSubscriptionCancelled(webhookPayload);
          break;

        case 'BILLING.SUBSCRIPTION.SUSPENDED':
          result = await handleSubscriptionSuspended(webhookPayload);
          break;

        case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
          result = await handlePaymentFailed(webhookPayload);
          break;

        case 'CUSTOMER.DISPUTE.CREATED':
          result = await handleDisputeCreated(webhookPayload);
          break;

        case 'CUSTOMER.DISPUTE.RESOLVED':
          result = await handleDisputeResolved(webhookPayload);
          break;

        default:
          throw new Error(`Unhandled event type: ${webhookPayload.event_type}`);
      }

      // Update webhook log to processed
      await prisma.webhookLog.update({
        where: { eventId: webhookPayload.id },
        data: {
          status: 'processed',
          processedAt: new Date(),
        },
      });

      console.log(`[PayPal Webhook] Successfully processed: ${webhookPayload.event_type}`);

      return NextResponse.json({
        success: true,
        eventType: webhookPayload.event_type,
        eventId: webhookPayload.id,
        result,
      });

    } catch (handlerError) {
      console.error(`[PayPal Webhook] Handler error for ${webhookPayload.event_type}:`, handlerError);

      // Update webhook log to failed
      await prisma.webhookLog.update({
        where: { eventId: webhookPayload.id },
        data: {
          status: 'failed',
          error: handlerError instanceof Error ? handlerError.message : 'Unknown error',
          processedAt: new Date(),
        },
      });

      throw handlerError;
    }

  } catch (error) {
    console.error('[PayPal Webhook] Processing error:', error);

    // Try to log the error if we have the payload
    if (webhookPayload) {
      await logWebhookEvent(
        webhookPayload.event_type,
        webhookPayload.id,
        webhookPayload,
        'failed',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to process webhook',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for webhook status/testing
 */
export async function GET() {
  try {
    // Get recent webhook logs
    const recentLogs = await prisma.webhookLog.findMany({
      where: { source: 'paypal' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        createdAt: true,
        eventType: true,
        status: true,
        error: true,
      },
    });

    return NextResponse.json({
      message: 'PayPal webhook endpoint is active',
      endpoint: '/api/webhooks/paypal',
      method: 'POST',
      supportedEvents: SUPPORTED_EVENT_TYPES,
      configuration: {
        webhookIdConfigured: !!process.env.PAYPAL_WEBHOOK_ID,
        clientIdConfigured: !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        clientSecretConfigured: !!process.env.PAYPAL_CLIENT_SECRET,
        mode: process.env.NEXT_PUBLIC_PAYPAL_MODE || 'sandbox',
      },
      recentEvents: recentLogs,
    });
  } catch {
    return NextResponse.json({
      message: 'PayPal webhook endpoint is active',
      endpoint: '/api/webhooks/paypal',
      error: 'Could not fetch recent logs',
    });
  }
}
