# PayPal Integration - Quick Start Guide

## Quick Setup (5 minutes)

### 1. Get PayPal Sandbox Credentials

1. Visit [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Sign in with your PayPal account
3. Go to **Apps & Credentials** > **Sandbox**
4. Click **"Create App"**
5. Name it "AI Spokesperson Studio Sandbox"
6. Copy the **Client ID** and **Secret**

### 2. Update Environment Variables

Add these to your `.env` file:

```bash
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-sandbox-client-id-here"
PAYPAL_CLIENT_SECRET="your-sandbox-secret-here"
PAYPAL_MODE="sandbox"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 3. Restart Your Dev Server

```bash
npm run dev
```

### 4. Test the Integration

1. Visit: `http://localhost:3000/pricing`
2. Click **"Get Started"** on any package
3. Click the **PayPal button** on checkout page
4. Use PayPal's test credentials to complete payment
5. Verify success page appears

## Test Buyer Account

Get test buyer credentials from:
- PayPal Dashboard > Sandbox > Accounts
- Or create a new Personal (buyer) account

## Package URLs

Direct checkout links:
- `http://localhost:3000/checkout?package=launch-kit`
- `http://localhost:3000/checkout?package=content-engine-monthly`
- `http://localhost:3000/checkout?package=content-engine-pro`
- `http://localhost:3000/checkout?package=authority-engine`

## What Works Now

- Complete checkout flow
- PayPal payment processing
- Success confirmation page
- Error handling
- Responsive design

## What's Next (for production)

See `PAYPAL_SETUP.md` for:
- Going live with production credentials
- Implementing true subscriptions
- Adding webhooks
- Database integration
- Email notifications
- Client portal access

## Need Help?

- Check `PAYPAL_SETUP.md` for detailed documentation
- Review [PayPal Developer Docs](https://developer.paypal.com/docs/)
- Check browser console for errors
- Verify environment variables are set correctly
