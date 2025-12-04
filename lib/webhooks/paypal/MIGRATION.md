# Migration Guide for PayPal Webhook Handlers

## Step 1: Update Database Schema

Run the Prisma migration to add the new fields:

```bash
npx prisma migrate dev --name add_paypal_subscription_fields
```

This will add:
- `paypalSubscriptionId` (String?)
- `failedPaymentCount` (Int, default: 0)
- `needsWinBack` (Boolean, default: false)
- Updates `paymentStatus` to include "failed" option

## Step 2: Regenerate Prisma Client

```bash
npx prisma generate
```

## Step 3: Create Webhook API Route

Create `app/api/webhooks/paypal/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { handlePayPalWebhook } from '@/lib/webhooks/paypal/handlers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.event_type;

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

## Step 4: Deploy and Test

1. Deploy your application
2. Get your production webhook URL: `https://yourdomain.com/api/webhooks/paypal`

## Step 5: Configure PayPal Developer Dashboard

1. Log into https://developer.paypal.com/
2. Go to Dashboard > My Apps & Credentials
3. Select your app (or create one)
4. Scroll to "Webhooks"
5. Click "Add Webhook"
6. Enter webhook URL: `https://yourdomain.com/api/webhooks/paypal`
7. Select these event types:
   - ✓ Billing subscription activated (`BILLING.SUBSCRIPTION.ACTIVATED`)
   - ✓ Billing subscription cancelled (`BILLING.SUBSCRIPTION.CANCELLED`)
   - ✓ Billing subscription payment failed (`BILLING.SUBSCRIPTION.PAYMENT.FAILED`)
   - ✓ Billing subscription suspended (`BILLING.SUBSCRIPTION.SUSPENDED`)
8. Click "Save"

## Step 6: Test Webhooks

### Option A: PayPal Webhook Simulator
1. In PayPal Developer Dashboard
2. Go to Webhooks > Webhook events simulator
3. Select your webhook
4. Choose event type and send test

### Option B: Local Testing with ngrok
```bash
# Start your dev server
npm run dev

# In another terminal
ngrok http 3000

# Use the ngrok URL in PayPal webhook configuration
# Example: https://abc123.ngrok.io/api/webhooks/paypal
```

## Step 7: Monitor Logs

Check your application logs for webhook processing:
- Look for `[PayPal Webhook]` prefix
- Verify client updates in database
- Monitor for any errors

## Rollback Plan

If you need to rollback:

```bash
# Revert the database migration
npx prisma migrate resolve --rolled-back add_paypal_subscription_fields

# Or create a new migration to remove the fields
```

## Verification Checklist

- [ ] Database schema updated (migration run)
- [ ] Prisma client regenerated
- [ ] Webhook API route created
- [ ] Application deployed
- [ ] PayPal webhooks configured
- [ ] Test webhooks sent successfully
- [ ] Client records updating correctly
- [ ] Logs showing proper processing

## Troubleshooting

### Client Not Found
- Ensure client email matches PayPal payer email exactly
- Check that client exists in database before subscription created

### Webhook Not Received
- Verify webhook URL is publicly accessible
- Check PayPal webhook event history for delivery status
- Ensure no firewall blocking PayPal IPs

### Database Errors
- Verify Prisma migration ran successfully
- Check database connection
- Ensure Prisma client regenerated after schema changes

## Support

For issues or questions:
1. Check application logs with `[PayPal Webhook]` filter
2. Review PayPal webhook event history in Developer Dashboard
3. Verify database schema matches expected structure
