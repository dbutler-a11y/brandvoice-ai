# PayPal Integration - Quick Reference

## Environment Variables

```bash
# Required
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-client-id"
PAYPAL_CLIENT_SECRET="your-secret"
PAYPAL_MODE="sandbox" # or "live"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## Package URLs

```
Launch Kit:         /checkout?package=launch-kit
Monthly:            /checkout?package=content-engine-monthly
PRO:                /checkout?package=content-engine-pro
AUTHORITY:          /checkout?package=authority-engine
```

## File Locations

```
Component:          /components/PayPalProvider.tsx
Checkout Page:      /app/(public)/checkout/page.tsx
Success Page:       /app/(public)/checkout/success/page.tsx
Create Order API:   /app/api/paypal/create-order/route.ts
Capture Order API:  /app/api/paypal/capture-order/route.ts
```

## Quick Commands

```bash
# Install dependencies (already done)
npm install @paypal/react-paypal-js

# Start dev server
npm run dev

# Build for production
npm run build
npm start
```

## Testing Flow

1. Start server: `npm run dev`
2. Visit: `http://localhost:3000/pricing`
3. Click "Get Started" on any package
4. Complete PayPal sandbox payment
5. Verify success page shows order details

## Get Sandbox Credentials

1. Visit: https://developer.paypal.com/dashboard/
2. Go to: Apps & Credentials > Sandbox
3. Create App or use existing
4. Copy Client ID and Secret

## Get Test Buyer Account

1. Visit: https://developer.paypal.com/dashboard/
2. Go to: Sandbox > Accounts
3. Use Personal account credentials
4. Or create new test account

## Common Issues

**Buttons not showing:**
- Check `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set
- Restart dev server after setting env vars
- Check browser console for errors

**Payment fails:**
- Verify `PAYPAL_CLIENT_SECRET` is correct
- Check you're using sandbox credentials in sandbox mode
- Check server logs for detailed errors

**Wrong package shows:**
- Verify URL parameter matches package ID
- Check package IDs in checkout page code

## Production Deployment

1. Create live app in PayPal Dashboard
2. Update env vars with live credentials
3. Set `PAYPAL_MODE="live"`
4. Update `NEXT_PUBLIC_BASE_URL` to production domain
5. Deploy and test with small real payment

## Support Links

- Setup Guide: `PAYPAL_SETUP.md`
- Quick Start: `PAYPAL_QUICKSTART.md`
- Full Summary: `PAYPAL_INTEGRATION_SUMMARY.md`
- PayPal Docs: https://developer.paypal.com/docs/

## Package Pricing

| Package | Price | Billing |
|---------|-------|---------|
| Launch Kit | $1,500 | One-time |
| Content Engine Monthly | $997 | Monthly |
| Content Engine PRO | $2,497 | Monthly |
| AUTHORITY Engine | $4,997 | Monthly |

## API Endpoints

**POST** `/api/paypal/create-order`
- Creates PayPal order
- Body: `{ packageId, packageName, price, isSubscription }`
- Returns: `{ orderId, status }`

**POST** `/api/paypal/capture-order`
- Captures completed payment
- Body: `{ orderId, packageId }`
- Returns: `{ success, orderId, status, payer, payment }`

## Next Steps (Production)

- [ ] Database integration
- [ ] Email notifications
- [ ] Client account creation
- [ ] Portal access
- [ ] Webhook handlers
- [ ] True subscription support
- [ ] Analytics tracking

---

**Status**: Ready for Testing
**Mode**: Sandbox (development)
