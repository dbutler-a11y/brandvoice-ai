# PayPal Webhook Integration

This directory contains the PayPal webhook endpoint implementation for handling payment events, subscriptions, and disputes.

## Overview

The PayPal webhook endpoint (`/api/webhooks/paypal`) receives and processes real-time notifications from PayPal about payment-related events. All events are logged to the database for audit and debugging purposes.

## Features

- **Signature Verification**: Validates webhook authenticity using PayPal's signature verification API
- **Event Logging**: All events stored in `WebhookLog` table with status tracking
- **Comprehensive Handlers**: Supports 9 critical PayPal event types
- **Idempotent Processing**: Safe to receive duplicate events
- **Error Recovery**: Failed events are logged with error details for manual review

## Supported Event Types

### Payment Events
- `CHECKOUT.ORDER.COMPLETED` - Customer completes checkout
- `PAYMENT.CAPTURE.COMPLETED` - Payment funds are captured
- `PAYMENT.CAPTURE.REFUNDED` - Payment is refunded to customer

### Subscription Events
- `BILLING.SUBSCRIPTION.ACTIVATED` - New subscription activated
- `BILLING.SUBSCRIPTION.CANCELLED` - Subscription cancelled by customer
- `BILLING.SUBSCRIPTION.SUSPENDED` - Subscription suspended (payment issues)
- `BILLING.SUBSCRIPTION.PAYMENT.FAILED` - Recurring payment failed

### Dispute Events
- `CUSTOMER.DISPUTE.CREATED` - Customer opens a dispute/chargeback
- `CUSTOMER.DISPUTE.RESOLVED` - Dispute is resolved (won or lost)

## Setup Instructions

### 1. PayPal Developer Dashboard Setup

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Select your app (Sandbox or Live)
3. Navigate to "Webhooks" section
4. Click "Add Webhook"
5. Enter your webhook URL:
   - **Development**: `https://your-dev-domain.com/api/webhooks/paypal`
   - **Production**: `https://your-domain.com/api/webhooks/paypal`
6. Select the following event types:
   - `CHECKOUT.ORDER.COMPLETED`
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.REFUNDED`
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`
   - `BILLING.SUBSCRIPTION.SUSPENDED`
   - `BILLING.SUBSCRIPTION.PAYMENT.FAILED`
   - `CUSTOMER.DISPUTE.CREATED`
   - `CUSTOMER.DISPUTE.RESOLVED`
7. Save the webhook
8. Copy the **Webhook ID** from the webhook details page

### 2. Environment Variables

Add these variables to your `.env` file:

```bash
# PayPal API Credentials
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
NEXT_PUBLIC_PAYPAL_MODE="sandbox"  # or "live" for production

# PayPal Webhook ID (from step 1)
PAYPAL_WEBHOOK_ID="your-webhook-id"
```

**Important**:
- The `PAYPAL_CLIENT_SECRET` is used for webhook signature verification
- Keep it secure and never commit to version control
- Use different credentials for sandbox and production

### 3. Database Migration

The `WebhookLog` model is required for tracking webhook events:

```bash
npx prisma db push
```

This creates the following table:
```prisma
model WebhookLog {
  id          String   @id @default(cuid())
  createdAt   DateTime @default(now())
  source      String   // "paypal", "elevenlabs", etc.
  eventType   String
  eventId     String?  @unique
  payload     String   @db.Text
  status      String   @default("received") // received, processed, failed
  error       String?  @db.Text
  processedAt DateTime?

  @@index([source])
  @@index([eventType])
  @@index([createdAt])
}
```

## Architecture

### Files

- **`route.ts`** - Main webhook endpoint
  - Receives POST requests from PayPal
  - Verifies webhook signature
  - Logs events to database
  - Routes to appropriate handler
  - Returns success/error response

- **`handlers.ts`** - Event handler functions
  - `handleOrderCompleted()` - Process completed orders
  - `handlePaymentCaptured()` - Process payment captures
  - `handlePaymentRefunded()` - Process refunds
  - `handleSubscriptionActivated()` - Activate subscriptions
  - `handleSubscriptionCancelled()` - Cancel subscriptions
  - `handleSubscriptionSuspended()` - Suspend subscriptions
  - `handlePaymentFailed()` - Track failed payments
  - `handleDisputeCreated()` - Log new disputes
  - `handleDisputeResolved()` - Process dispute resolutions

### Event Flow

```
PayPal Event → Webhook Endpoint → Signature Verification
                                         ↓
                                   Log to Database
                                         ↓
                                  Route to Handler
                                         ↓
                              Update Database Records
                                         ↓
                                Mark as Processed
```

## Testing

### Test Webhook Endpoint

```bash
# Check webhook status
curl https://your-domain.com/api/webhooks/paypal

# Response includes:
# - Configuration status
# - Supported events
# - Recent webhook logs
```

### Simulate Webhook Events (Development)

Use PayPal's webhook simulator in the Developer Dashboard:

1. Go to your webhook settings
2. Click "Webhook Simulator"
3. Select event type
4. Modify payload if needed
5. Send test event

### Debug Webhook Issues

All webhook events are logged to the `WebhookLog` table:

```typescript
// Query recent webhook logs
const logs = await prisma.webhookLog.findMany({
  where: { source: 'paypal' },
  orderBy: { createdAt: 'desc' },
  take: 20
});

// Query failed events
const failed = await prisma.webhookLog.findMany({
  where: {
    source: 'paypal',
    status: 'failed'
  },
  orderBy: { createdAt: 'desc' }
});
```

## Event Handler Details

### Order Completed
**Event**: `CHECKOUT.ORDER.COMPLETED`

**Actions**:
- Updates Order record status to 'paid'
- Links order to Lead if email matches
- Updates Lead status to 'WON' if converted

**Database Updates**:
```typescript
Order: paypalStatus, status
Lead: status, convertedAt
```

### Payment Captured
**Event**: `PAYMENT.CAPTURE.COMPLETED`

**Actions**:
- For one-time: Confirms payment received
- For subscription: Extends subscription period by 1 month
- Resets failed payment counter

**Database Updates**:
```typescript
Client: paymentStatus, paymentDate, subscriptionEndDate, failedPaymentCount
```

### Payment Refunded
**Event**: `PAYMENT.CAPTURE.REFUNDED`

**Actions**:
- Marks Order as 'refunded'
- Updates Client payment status
- Logs refund details

**Database Updates**:
```typescript
Order: status, notes
Client: paymentStatus
```

### Subscription Activated
**Event**: `BILLING.SUBSCRIPTION.ACTIVATED`

**Actions**:
- Links PayPal subscription ID to Client
- Sets subscription start and end dates
- Marks payment as successful

**Database Updates**:
```typescript
Client: isSubscription, paypalSubscriptionId, subscriptionStartDate, subscriptionEndDate, paymentStatus
```

### Subscription Cancelled
**Event**: `BILLING.SUBSCRIPTION.CANCELLED`

**Actions**:
- Marks subscription as inactive
- Flags for win-back campaign
- Logs cancellation date

**Database Updates**:
```typescript
Client: isSubscription, needsWinBack, notes
```

### Subscription Suspended
**Event**: `BILLING.SUBSCRIPTION.SUSPENDED`

**Actions**:
- Updates payment status to 'failed'
- Flags for follow-up
- Triggers payment update notification

**Database Updates**:
```typescript
Client: paymentStatus, needsWinBack, notes
```

### Payment Failed
**Event**: `BILLING.SUBSCRIPTION.PAYMENT.FAILED`

**Actions**:
- Increments failed payment counter
- After 3 failures, flags for suspension
- Sends payment update request

**Database Updates**:
```typescript
Client: paymentStatus, failedPaymentCount, needsWinBack, notes
```

### Dispute Created
**Event**: `CUSTOMER.DISPUTE.CREATED`

**Actions**:
- Logs dispute details
- Flags order as under dispute
- Alerts admin for response

**Database Updates**:
```typescript
Order: status, notes
```

### Dispute Resolved
**Event**: `CUSTOMER.DISPUTE.RESOLVED`

**Actions**:
- If won: Marks order as fulfilled
- If lost: Marks order as refunded, updates Client
- Logs resolution outcome

**Database Updates**:
```typescript
Order: status, notes
Client: paymentStatus (if lost)
```

## Security Considerations

### Signature Verification

The webhook endpoint verifies every request using PayPal's verification API. This ensures:
- Request is from PayPal
- Payload hasn't been tampered with
- Event is fresh (prevents replay attacks)

**Never skip signature verification in production!**

### Environment-Specific Behavior

- **Development**: Signature verification skipped if `PAYPAL_WEBHOOK_ID` not set
- **Production**: All requests must have valid signature

### Best Practices

1. **Use HTTPS**: PayPal requires HTTPS for webhook URLs
2. **Rotate Secrets**: Periodically rotate PayPal API credentials
3. **Monitor Logs**: Review failed webhooks regularly
4. **Test Events**: Use PayPal simulator to test all event types
5. **Idempotency**: Handlers check for existing records before creating new ones

## Troubleshooting

### Webhook Not Receiving Events

1. Verify webhook URL is correct and accessible
2. Check PayPal Developer Dashboard for webhook delivery status
3. Ensure your server accepts POST requests at the webhook URL
4. Check firewall rules allow PayPal IPs

### Signature Verification Failing

1. Verify `PAYPAL_WEBHOOK_ID` matches the one in PayPal dashboard
2. Check `PAYPAL_CLIENT_SECRET` is correct
3. Ensure `NEXT_PUBLIC_PAYPAL_MODE` matches environment (sandbox/live)
4. Verify webhook headers are being passed correctly

### Events Marked as Failed

1. Query `WebhookLog` table for error details
2. Check handler logic for specific event type
3. Verify database records exist (Order, Client, etc.)
4. Review handler console logs for detailed error info

### Common Issues

**Issue**: "Order not found in database"
- **Cause**: Webhook fired before order creation completed
- **Solution**: Orders should be created during checkout flow before PayPal redirect

**Issue**: "Client not found for subscription"
- **Cause**: No matching email or subscription ID
- **Solution**: Ensure Client email matches PayPal payer email

**Issue**: "Invalid signature"
- **Cause**: Incorrect webhook ID or client secret
- **Solution**: Double-check environment variables

## Monitoring

### Webhook Health Dashboard

Query webhook statistics:

```typescript
// Get webhook stats
const stats = await prisma.webhookLog.groupBy({
  by: ['status', 'eventType'],
  where: {
    source: 'paypal',
    createdAt: {
      gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
    }
  },
  _count: true
});
```

### Alerts to Set Up

1. Failed webhook events (status = 'failed')
2. Disputes created
3. Multiple failed payments (>= 3)
4. High refund rate
5. Webhook endpoint downtime

## Future Enhancements

The handlers include TODO comments for future implementation:

- [ ] Email notifications for payment failures
- [ ] Admin dashboard alerts for disputes
- [ ] Automated win-back campaigns
- [ ] Churn prediction analytics
- [ ] Refund policy automation
- [ ] Revenue recognition tracking

## Support

For PayPal webhook issues:
- [PayPal Webhooks Documentation](https://developer.paypal.com/api/rest/webhooks/)
- [PayPal Developer Forums](https://www.paypal-community.com/t5/REST-APIs/bd-p/rest-api)

For implementation issues:
- Check `WebhookLog` table for detailed error messages
- Review server logs for handler execution details
- Test with PayPal webhook simulator
