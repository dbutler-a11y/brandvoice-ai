# PayPal Integration Setup Guide

This guide explains how to set up and configure PayPal checkout for the AI Spokesperson Studio.

## Overview

The PayPal integration supports:
- **One-time payments** (AI Spokesperson Launch Kit - $1,500)
- **Monthly subscriptions** (Content Engine packages - $997, $2,497, $4,997/month)

## Files Created/Modified

### New Files:
1. `/components/PayPalProvider.tsx` - PayPal context provider wrapper
2. `/app/(public)/checkout/page.tsx` - Main checkout page with PayPal buttons
3. `/app/(public)/checkout/success/page.tsx` - Payment success confirmation page
4. `/app/api/paypal/create-order/route.ts` - API route to create PayPal orders
5. `/app/api/paypal/capture-order/route.ts` - API route to capture/complete payments

### Modified Files:
1. `/app/(public)/pricing/page.tsx` - Updated "Get Started" buttons to link to checkout
2. `/.env.example` - Added PayPal environment variables
3. `/package.json` - Added @paypal/react-paypal-js dependency

## Setup Instructions

### 1. Create PayPal Developer Account

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Sign in or create a developer account
3. Navigate to **Dashboard** > **Apps & Credentials**

### 2. Create Sandbox App (for testing)

1. Click on **"Create App"** under Sandbox
2. Give your app a name (e.g., "AI Spokesperson Studio Sandbox")
3. Copy the **Client ID** and **Secret** from the sandbox credentials

### 3. Configure Environment Variables

Update your `.env` file (or `.env.local`) with the PayPal credentials:

```bash
# PayPal Sandbox Credentials (for testing)
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-sandbox-client-id"
PAYPAL_CLIENT_SECRET="your-sandbox-client-secret"
PAYPAL_MODE="sandbox"

# Required for return URLs
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 4. Test with Sandbox Accounts

PayPal provides test buyer accounts for sandbox testing:

1. Go to **Dashboard** > **Sandbox** > **Accounts**
2. Find a Personal (buyer) account or create a new one
3. Copy the email and password
4. Use these credentials to test payments

### 5. Go Live (Production)

When ready for production:

1. Create a **Live App** in the PayPal Developer Dashboard
2. Complete PayPal's verification process
3. Update environment variables with live credentials:

```bash
# PayPal Live Credentials (production)
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-live-client-id"
PAYPAL_CLIENT_SECRET="your-live-client-secret"
PAYPAL_MODE="live"

# Production URL
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
```

## Package URLs

The checkout page accepts the following package IDs via URL parameter:

- Launch Kit: `/checkout?package=launch-kit`
- Content Engine Monthly: `/checkout?package=content-engine-monthly`
- Content Engine PRO: `/checkout?package=content-engine-pro`
- AUTHORITY Engine: `/checkout?package=authority-engine`

## Payment Flow

1. **User selects package** on pricing page
2. **Redirected to checkout** with package parameter
3. **PayPal buttons displayed** with package details
4. **User authenticates** with PayPal and approves payment
5. **Order created** via `/api/paypal/create-order`
6. **Payment captured** via `/api/paypal/capture-order`
7. **Redirected to success page** with order confirmation

## Testing

### Test Payment Flow:

1. Start the development server: `npm run dev`
2. Navigate to: `http://localhost:3000/pricing`
3. Click "Get Started" on any package
4. On checkout page, click "PayPal" button
5. Log in with sandbox buyer account
6. Complete the test payment
7. Verify redirect to success page

### Sandbox Test Accounts:

You can create multiple test accounts in the PayPal Sandbox for different scenarios:
- Personal accounts (buyers)
- Business accounts (sellers)
- Accounts with different balances
- Accounts in different countries/currencies

## Important Notes

### Subscriptions vs One-Time Payments

Currently, the integration treats both one-time and monthly packages as one-time payments. To implement true recurring subscriptions:

1. Create subscription plans in PayPal Dashboard
2. Use the PayPal Subscriptions API instead of Orders API
3. Update the `create-order` route to create subscription instead of order
4. Implement webhook handlers for subscription events (renewal, cancellation, etc.)

### Webhooks (Recommended for Production)

For production use, implement PayPal webhooks to handle:
- Payment completed
- Subscription created/cancelled
- Payment failed/refunded
- Disputes

Webhook setup:
1. Go to PayPal Dashboard > Webhooks
2. Create webhook endpoint: `https://yourdomain.com/api/paypal/webhook`
3. Select events to subscribe to
4. Implement webhook handler route

### Security Considerations

- Never expose `PAYPAL_CLIENT_SECRET` to the client
- Always verify payment status server-side before granting access
- Implement proper error handling and logging
- Use HTTPS in production
- Validate webhook signatures to prevent fraud

## Next Steps for Production

1. **Database Integration**
   - Save orders to database in `capture-order` route
   - Create client records for new customers
   - Track payment history

2. **Email Notifications**
   - Send order confirmation emails
   - Send welcome emails with portal access
   - Notify admin of new purchases

3. **Client Portal Access**
   - Create user account upon successful payment
   - Grant portal access automatically
   - Link payment to client dashboard

4. **Subscription Management**
   - Implement subscription plans in PayPal
   - Build subscription management UI
   - Handle subscription lifecycle events

5. **Analytics & Reporting**
   - Track conversion rates
   - Monitor payment success/failure rates
   - Generate revenue reports

## Troubleshooting

### "PayPal Client ID is not configured"
- Ensure `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set in `.env`
- Restart the development server after adding environment variables

### Payment creation fails
- Check that `PAYPAL_CLIENT_SECRET` is correct
- Verify you're using the right credentials (sandbox vs live)
- Check API error messages in browser console and server logs

### Buttons not appearing
- Check browser console for JavaScript errors
- Verify PayPal SDK is loaded correctly
- Ensure PayPalProvider wraps the checkout page

### Redirect URL issues
- Verify `NEXT_PUBLIC_BASE_URL` is set correctly
- Check that return/cancel URLs are accessible

## Support Resources

- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal REST API Reference](https://developer.paypal.com/api/rest/)
- [PayPal React SDK Documentation](https://paypal.github.io/react-paypal-js/)
- [PayPal Sandbox Testing](https://developer.paypal.com/tools/sandbox/)

## Contact

For questions about the integration, contact the development team or refer to the project documentation.
