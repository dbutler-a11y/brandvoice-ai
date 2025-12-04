# PayPal Subscription Webhook Handlers

This module provides webhook handlers for PayPal subscription events.

## Overview

The handlers automatically update client records in response to PayPal subscription lifecycle events.

## Files

- `handlers.ts` - Main webhook handler functions

## Handlers

### 1. `handleSubscriptionActivated(payload)`

Triggered when a subscription is activated.

**Actions:**
- Finds client by payer email
- Sets `isSubscription = true`
- Sets `subscriptionStartDate` to current time
- Updates `projectStatus` to "onboarding"
- Sets `paymentStatus` to "paid"
- Stores PayPal subscription ID for future lookups
- Resets failed payment tracking

**Payload fields used:**
- `resource.id` - Subscription ID
- `resource.subscriber.email_address` - Payer email
- `resource.start_time` - Subscription start time

### 2. `handleSubscriptionCancelled(payload)`

Triggered when a subscription is cancelled by the customer.

**Actions:**
- Finds client by subscription ID or email
- Sets `subscriptionEndDate` to cancellation time
- Sets `needsWinBack = true` for marketing automation

**Payload fields used:**
- `resource.id` - Subscription ID
- `resource.subscriber.email_address` - Payer email
- `create_time` or `event_time` - Cancellation timestamp

### 3. `handleSubscriptionPaymentFailed(payload)`

Triggered when a subscription payment fails.

**Actions:**
- Finds client by subscription ID or email
- Increments `failedPaymentCount`
- Sets `paymentStatus = "failed"`
- Logs warning if count >= 3 (at-risk client)

**Payload fields used:**
- `resource.id` - Subscription ID
- `resource.subscriber.email_address` - Payer email
- `resource.status_update_reason` - Failure reason

### 4. `handleSubscriptionSuspended(payload)`

Triggered when a subscription is suspended (usually due to payment issues).

**Actions:**
- Finds client by subscription ID or email
- Updates `projectStatus` to "paused"

**Payload fields used:**
- `resource.id` - Subscription ID
- `resource.subscriber.email_address` - Payer email
- `resource.status_update_reason` - Suspension reason

## Usage Example

### Create API Route

Create a file at `app/api/webhooks/paypal/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { handlePayPalWebhook } from '@/lib/webhooks/paypal/handlers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.event_type;

    // Optional: Verify webhook signature here
    // See PayPal docs for webhook verification

    // Route to appropriate handler
    const result = await handlePayPalWebhook(eventType, body);

    if (result) {
      return NextResponse.json({ 
        success: true, 
        message: 'Webhook processed',
        clientId: result.id 
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook received (no action taken)' 
    });

  } catch (error) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
```

### Configure PayPal Webhooks

1. Go to PayPal Developer Dashboard
2. Select your app
3. Click "Add Webhook"
4. Enter your webhook URL: `https://yourdomain.com/api/webhooks/paypal`
5. Select these events:
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`
   - `BILLING.SUBSCRIPTION.PAYMENT.FAILED`
   - `BILLING.SUBSCRIPTION.SUSPENDED`

## Database Schema Changes

The following fields were added to the `Client` model:

```prisma
model Client {
  // ... existing fields ...

  paypalSubscriptionId  String?   // PayPal subscription ID for webhook lookups
  failedPaymentCount    Int       @default(0) // Track failed payment attempts
  needsWinBack          Boolean   @default(false) // Flag for win-back campaigns
  
  // Updated field
  paymentStatus String   @default("unpaid") // Added "failed" status
}
```

Run migration after schema changes:
```bash
npx prisma migrate dev --name add_paypal_subscription_fields
npx prisma generate
```

## Testing

You can test webhooks locally using PayPal's webhook simulator in the Developer Dashboard, or use tools like ngrok to expose your local server:

```bash
ngrok http 3000
```

Then use the ngrok URL in your PayPal webhook configuration.

## Logging

All handlers include comprehensive logging with the `[PayPal Webhook]` prefix for easy filtering:

- Info logs for normal operations
- Error logs for missing clients or data
- Warning logs for at-risk clients (3+ failed payments)
- Action required logs for manual follow-up needs

## Error Handling

All handlers:
- Return `null` if client not found (logged as error)
- Throw errors for database issues (will return 500 to PayPal)
- PayPal will retry failed webhooks automatically

## Security Considerations

1. **Webhook Verification**: Implement PayPal webhook signature verification in your API route
2. **Environment**: Use environment variables for PayPal credentials
3. **Rate Limiting**: Consider adding rate limiting to webhook endpoint
4. **Logging**: Ensure sensitive data is not logged (use sanitization)

## Future Enhancements

Potential additions:
- Email notifications for failed payments
- Automatic reminder creation for follow-ups
- Integration with CRM systems
- Dunning management for failed payments
- Win-back email automation
