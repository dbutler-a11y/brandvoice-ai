# PayPal Webhook Handlers - Quick Reference

## Import & Usage

```typescript
import { handlePayPalWebhook } from '@/lib/webhooks/paypal/handlers';

// In your API route:
const result = await handlePayPalWebhook(eventType, payload);
```

## Handler Functions

| Function | Event Type | Actions |
|----------|-----------|---------|
| `handleSubscriptionActivated()` | `BILLING.SUBSCRIPTION.ACTIVATED` | Set subscription active, status="onboarding" |
| `handleSubscriptionCancelled()` | `BILLING.SUBSCRIPTION.CANCELLED` | Record end date, needsWinBack=true |
| `handleSubscriptionPaymentFailed()` | `BILLING.SUBSCRIPTION.PAYMENT.FAILED` | Increment failedPaymentCount, status="failed" |
| `handleSubscriptionSuspended()` | `BILLING.SUBSCRIPTION.SUSPENDED` | Set projectStatus="paused" |

## Client Field Updates

### Subscription Activated
```typescript
{
  isSubscription: true,
  subscriptionStartDate: new Date(),
  projectStatus: 'onboarding',
  paymentStatus: 'paid',
  paymentMethod: 'paypal',
  paypalSubscriptionId: 'I-XXXXX',
  failedPaymentCount: 0,
  needsWinBack: false
}
```

### Subscription Cancelled
```typescript
{
  subscriptionEndDate: new Date(),
  needsWinBack: true
}
```

### Payment Failed
```typescript
{
  paymentStatus: 'failed',
  failedPaymentCount: client.failedPaymentCount + 1
}
```

### Subscription Suspended
```typescript
{
  projectStatus: 'paused'
}
```

## PayPal Event Types

```typescript
'BILLING.SUBSCRIPTION.ACTIVATED'       // ✓ Implemented
'BILLING.SUBSCRIPTION.CANCELLED'       // ✓ Implemented
'BILLING.SUBSCRIPTION.PAYMENT.FAILED'  // ✓ Implemented
'BILLING.SUBSCRIPTION.SUSPENDED'       // ✓ Implemented
'BILLING.SUBSCRIPTION.UPDATED'         // Not implemented
'BILLING.SUBSCRIPTION.EXPIRED'         // Not implemented
'BILLING.SUBSCRIPTION.RE-ACTIVATED'    // Not implemented
```

## Database Schema

```prisma
model Client {
  // New fields
  paypalSubscriptionId  String?  // Subscription ID from PayPal
  failedPaymentCount    Int      @default(0)
  needsWinBack          Boolean  @default(false)
  
  // Updated field
  paymentStatus String @default("unpaid") // Added "failed"
}
```

## Client Lookup Strategy

1. **By Subscription ID** (preferred):
   ```typescript
   prisma.client.findFirst({
     where: { paypalSubscriptionId: subscriptionId }
   })
   ```

2. **Fallback to Email**:
   ```typescript
   prisma.client.findFirst({
     where: { email: payerEmail }
   })
   ```

## Logging Patterns

```typescript
// Standard log
console.log(`[PayPal Webhook] Processing subscription activation for ${email}`);

// Success log
console.log(`[PayPal Webhook] ✓ Subscription activated for client ${id}`);

// Error log
console.error(`[PayPal Webhook] Client not found for email: ${email}`);

// Warning log (at-risk client)
console.warn(`[PayPal Webhook] ⚠️  CLIENT AT RISK: ${name} has ${count} failed payments`);

// Action required
console.log(`[PayPal Webhook]   - ACTION REQUIRED: Follow up with client`);
```

## Error Handling

| Scenario | Handler Returns | HTTP Status | PayPal Behavior |
|----------|----------------|-------------|-----------------|
| Client not found | `null` | 200 | Won't retry |
| Database error | Throws exception | 500 | Will retry |
| Success | Client object | 200 | Won't retry |
| Unknown event | `null` | 200 | Won't retry |

## API Route Template

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { handlePayPalWebhook } from '@/lib/webhooks/paypal/handlers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await handlePayPalWebhook(body.event_type, body);
    
    return NextResponse.json({ 
      success: true, 
      clientId: result?.id 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Processing failed' },
      { status: 500 }
    );
  }
}
```

## Testing

### Local Testing (ngrok)
```bash
ngrok http 3000
# Use: https://abc123.ngrok.io/api/webhooks/paypal
```

### PayPal Simulator
1. PayPal Dashboard > Webhooks
2. Select webhook
3. Webhook events simulator
4. Choose event type & send

## Common Queries

### Find clients needing win-back
```typescript
const clients = await prisma.client.findMany({
  where: { 
    needsWinBack: true,
    subscriptionEndDate: {
      gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
    }
  }
});
```

### Find at-risk clients
```typescript
const clients = await prisma.client.findMany({
  where: { 
    failedPaymentCount: { gte: 2 },
    isSubscription: true
  }
});
```

### Find paused subscriptions
```typescript
const clients = await prisma.client.findMany({
  where: { 
    projectStatus: 'paused',
    isSubscription: true
  }
});
```

## Environment Setup

```bash
# 1. Run migration
npx prisma migrate dev --name add_paypal_subscription_fields

# 2. Generate client
npx prisma generate

# 3. Create API route
# Copy example-route.ts to app/api/webhooks/paypal/route.ts

# 4. Configure PayPal
# Add webhook URL in PayPal Developer Dashboard
```

## File Locations

```
/lib/webhooks/paypal/
├── handlers.ts          ← Import from here
├── types.ts             ← TypeScript types
├── example-route.ts     ← Copy to app/api/webhooks/paypal/
├── README.md            ← Full documentation
├── MIGRATION.md         ← Deployment guide
└── QUICK_REFERENCE.md   ← This file
```

## Support

- Check logs: Filter by `[PayPal Webhook]`
- PayPal events: Developer Dashboard > Webhooks > Event history
- Test endpoint: `GET /api/webhooks/paypal` should return 200

---

**Last Updated:** December 4, 2025
