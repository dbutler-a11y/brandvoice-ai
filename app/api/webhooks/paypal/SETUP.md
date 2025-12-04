# PayPal Webhook Quick Setup Guide

This guide will help you get the PayPal webhook endpoint up and running in 5 minutes.

## Prerequisites

- PayPal Business Account (Sandbox or Live)
- Access to PayPal Developer Dashboard
- Application deployed and accessible via HTTPS

## Step-by-Step Setup

### 1. Add Environment Variables

Copy these to your `.env` file and fill in the values:

```bash
# Required: PayPal API Credentials
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
NEXT_PUBLIC_PAYPAL_MODE="sandbox"  # or "live"

# Required: Webhook ID (get this from step 2)
PAYPAL_WEBHOOK_ID="your-webhook-id"
```

**Where to find these values:**
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Select your app
3. **Client ID** and **Client Secret** are shown in "App Credentials"

### 2. Create Webhook in PayPal Dashboard

1. In PayPal Developer Dashboard, click "Webhooks" in left sidebar
2. Click "Add Webhook"
3. **Webhook URL**: Enter your full webhook URL
   ```
   https://your-domain.com/api/webhooks/paypal
   ```

4. **Event types**: Select these 9 events:
   - [x] Checkout order completed
   - [x] Payment capture completed
   - [x] Payment capture refunded
   - [x] Billing subscription activated
   - [x] Billing subscription cancelled
   - [x] Billing subscription suspended
   - [x] Billing subscription payment failed
   - [x] Customer dispute created
   - [x] Customer dispute resolved

5. Click "Save"
6. Copy the **Webhook ID** from the webhook details page
7. Add it to your `.env` file as `PAYPAL_WEBHOOK_ID`

### 3. Test the Webhook

#### Option A: Check Webhook Status
```bash
curl https://your-domain.com/api/webhooks/paypal
```

Expected response:
```json
{
  "message": "PayPal webhook endpoint is active",
  "endpoint": "/api/webhooks/paypal",
  "supportedEvents": [...],
  "configuration": {
    "webhookIdConfigured": true,
    "clientIdConfigured": true,
    "clientSecretConfigured": true,
    "mode": "sandbox"
  }
}
```

#### Option B: Send Test Event from PayPal
1. In PayPal webhook settings, click your webhook
2. Click "Webhook Simulator" tab
3. Select event type (e.g., "Checkout order completed")
4. Click "Send Test Event"
5. Check your database `WebhookLog` table for the logged event

### 4. Verify Database Setup

Make sure the `WebhookLog` model exists:

```bash
npx prisma db push
```

If already pushed, this will show:
```
Your database is now in sync with your Prisma schema
```

### 5. Monitor Webhook Activity

Query recent webhook logs:

```typescript
import { prisma } from '@/lib/prisma';

const logs = await prisma.webhookLog.findMany({
  where: { source: 'paypal' },
  orderBy: { createdAt: 'desc' },
  take: 10
});

console.log(logs);
```

Or use Prisma Studio:
```bash
npx prisma studio
```

Then navigate to `WebhookLog` table.

## Common Issues

### "Invalid signature" error

**Problem**: Webhook signature verification failing

**Solutions**:
1. Check `PAYPAL_WEBHOOK_ID` matches the ID in PayPal dashboard
2. Verify `PAYPAL_CLIENT_SECRET` is correct
3. Ensure `NEXT_PUBLIC_PAYPAL_MODE` matches environment (sandbox/live)
4. Make sure you're using the correct PayPal app credentials

### "Webhook not receiving events"

**Problem**: PayPal events not reaching your endpoint

**Solutions**:
1. Verify webhook URL is correct and accessible
2. Ensure your server accepts POST requests at the webhook URL
3. Check your domain uses HTTPS (required by PayPal)
4. Look at webhook delivery logs in PayPal dashboard

### "Handler errors"

**Problem**: Events received but handler fails

**Solutions**:
1. Check `WebhookLog` table for error details
2. Verify database records exist (Order, Client, etc.)
3. Review server logs for detailed error messages
4. Ensure Prisma client is up to date (`npx prisma generate`)

## Development vs Production

### Sandbox (Development)
- Use sandbox credentials from PayPal Developer Dashboard
- Set `NEXT_PUBLIC_PAYPAL_MODE="sandbox"`
- Create webhook at sandbox URL
- Test with fake PayPal transactions

### Live (Production)
- Use live credentials from PayPal Developer Dashboard
- Set `NEXT_PUBLIC_PAYPAL_MODE="live"`
- Create webhook at production URL
- Real money transactions

**Important**: Never use live credentials in development!

## Testing Checklist

- [ ] Environment variables configured
- [ ] Webhook created in PayPal dashboard
- [ ] Webhook ID added to `.env`
- [ ] GET request to webhook returns configuration
- [ ] Test event sent from PayPal simulator
- [ ] Event appears in `WebhookLog` table
- [ ] Event status is "processed" (not "failed")
- [ ] Database records updated correctly

## Next Steps

Once setup is complete:

1. **Test each event type** using PayPal simulator
2. **Monitor production webhooks** for the first few days
3. **Set up alerts** for failed webhooks
4. **Review handler logic** and customize for your needs
5. **Implement TODOs** in handlers (email notifications, etc.)

## Getting Help

- **PayPal Documentation**: https://developer.paypal.com/api/rest/webhooks/
- **Event Reference**: https://developer.paypal.com/api/rest/webhooks/event-names/
- **PayPal Forums**: https://www.paypal-community.com/t5/REST-APIs/bd-p/rest-api

For implementation-specific issues, check:
- `WebhookLog` table for error details
- Server logs for handler execution details
- `README.md` in this directory for detailed documentation
