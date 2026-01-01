/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Example PayPal Webhook API Route
 *
 * Copy this to: app/api/webhooks/paypal/route.ts
 * 
 * This demonstrates how to integrate the PayPal webhook handlers
 * into a Next.js API route.
 */

import { NextRequest, NextResponse } from 'next/server';
import { handlePayPalWebhook } from '@/lib/webhooks/paypal/handlers';
import { 
  isPayPalWebhookEventType, 
  type PayPalWebhookPayload 
} from '@/lib/webhooks/paypal/types';

/**
 * POST handler for PayPal webhooks
 * 
 * PayPal will send webhook events to this endpoint
 */
export async function POST(req: NextRequest) {
  try {
    // Parse the webhook payload
    const body: PayPalWebhookPayload = await req.json();
    const eventType = body.event_type;

    console.log(`[PayPal Webhook API] Received event: ${eventType}`);
    console.log(`[PayPal Webhook API] Event ID: ${body.id}`);

    // Validate event type
    if (!isPayPalWebhookEventType(eventType)) {
      console.warn(`[PayPal Webhook API] Unknown event type: ${eventType}`);
      return NextResponse.json(
        { 
          success: true, 
          message: 'Event type not handled' 
        },
        { status: 200 } // Still return 200 so PayPal doesn't retry
      );
    }

    // Optional: Verify webhook signature
    // See: https://developer.paypal.com/api/rest/webhooks/
    // const isValid = await verifyPayPalSignature(req, body);
    // if (!isValid) {
    //   console.error('[PayPal Webhook API] Invalid webhook signature');
    //   return NextResponse.json(
    //     { error: 'Invalid signature' },
    //     { status: 401 }
    //   );
    // }

    // Route to appropriate handler
    const result = await handlePayPalWebhook(eventType, body);

    if (result) {
      const clientId = 'id' in result ? result.id : undefined;
      console.log(`[PayPal Webhook API] ✓ Successfully processed event${clientId ? ` for client ${clientId}` : ''}`);
      return NextResponse.json({
        success: true,
        message: 'Webhook processed successfully',
        clientId
      });
    }

    // Event received but no action needed (e.g., client not found)
    console.log('[PayPal Webhook API] Event received but no action taken');
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook received (no action required)' 
    });

  } catch (error) {
    console.error('[PayPal Webhook API] Error processing webhook:', error);
    
    // Log error details for debugging
    if (error instanceof Error) {
      console.error('[PayPal Webhook API] Error message:', error.message);
      console.error('[PayPal Webhook API] Error stack:', error.stack);
    }

    // Return 500 so PayPal will retry the webhook
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler (optional)
 * 
 * Useful for testing that the endpoint is accessible
 */
export async function GET(_req: NextRequest) {
  return NextResponse.json({ 
    message: 'PayPal webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}

/**
 * Optional: Verify PayPal webhook signature
 * 
 * This function should verify the webhook came from PayPal
 * See PayPal docs for implementation details
 */
async function _verifyPayPalSignature(
  _req: NextRequest,
  _body: PayPalWebhookPayload
): Promise<boolean> {
  // Implementation would go here
  // See: https://developer.paypal.com/api/rest/webhooks/rest/
  
  // For now, return true (IMPLEMENT THIS IN PRODUCTION!)
  return true;
}
