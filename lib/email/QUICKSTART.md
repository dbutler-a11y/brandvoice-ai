# Email System Quick Start Guide

Get your BrandVoice Studio email notifications up and running in 5 minutes.

## Step 1: Sign Up for Resend (2 minutes)

1. Go to [resend.com](https://resend.com)
2. Sign up with your email (no credit card required)
3. Verify your email address
4. You'll get **3,000 emails/month FREE**

## Step 2: Get Your API Key (1 minute)

1. In Resend dashboard, click "API Keys"
2. Click "Create API Key"
3. Give it a name (e.g., "BrandVoice Studio Production")
4. Copy the API key (starts with `re_`)

## Step 3: Configure Environment Variables (1 minute)

Add to your `.env` file:

```env
RESEND_API_KEY="re_your_actual_api_key_here"
EMAIL_FROM="BrandVoice Studio <hello@brandvoice.studio>"
ADMIN_EMAIL="your-email@yourdomain.com"
```

**Important:**
- For development, you can use `onboarding@resend.dev` as the `EMAIL_FROM`
- For production, you'll need to verify your domain (see Step 5)

## Step 4: Test Your Setup (1 minute)

Run the test script:

```bash
# Test with your email
npm run email:test your-email@example.com

# Or just run the default
npm run email:test
```

Check your email inbox (and spam folder) for the test emails!

## Step 5: Production Setup (Optional - 5 minutes)

For production, verify your domain:

1. In Resend dashboard, go to "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., `brandvoice.studio`)
4. Add the DNS records to your domain registrar:
   - DKIM record (for authentication)
   - SPF record (for sender verification)
   - DMARC record (for email policy)
5. Wait for verification (usually 5-10 minutes)
6. Update your `EMAIL_FROM` to use your domain:
   ```env
   EMAIL_FROM="BrandVoice Studio <hello@yourdomain.com>"
   ```

## Quick Integration Examples

### Welcome Email on Signup

```typescript
import { sendWelcomeEmail } from '@/lib/email';

// In your signup API route
await sendWelcomeEmail(
  user.email,
  user.name,
  subscription.plan
);
```

### Payment Confirmation

```typescript
import { sendPaymentReceivedEmail } from '@/lib/email';

// In your PayPal webhook
await sendPaymentReceivedEmail(
  customer.email,
  customer.name,
  297.00,
  transaction.id
);
```

### Payment Failed Alert

```typescript
import { sendPaymentFailedEmail } from '@/lib/email';

// When payment fails
await sendPaymentFailedEmail(
  customer.email,
  customer.name,
  'https://brandvoice.studio/billing/update'
);
```

## Testing via API

You can also test emails via the API endpoint:

```bash
# Test email
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"type": "test", "email": "your-email@example.com"}'

# Welcome email
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "type": "welcome",
    "email": "test@example.com",
    "clientName": "John Doe",
    "packageName": "Pro Package"
  }'

# Payment received
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment-received",
    "email": "test@example.com",
    "clientName": "John Doe",
    "amount": 297,
    "orderId": "ORDER-123"
  }'
```

## Troubleshooting

### Emails not sending?

```bash
# Check if configured
curl http://localhost:3000/api/email/test

# Should return:
# {"configured": true, "message": "Email system is configured and ready"}
```

### Check your .env file:

```bash
# Make sure these are set:
grep RESEND .env
grep EMAIL_FROM .env
```

### Test with Resend's test addresses:

```typescript
// These always work in development:
await sendTestEmail('delivered@resend.dev');  // Always succeeds
await sendTestEmail('bounced@resend.dev');    // Simulates bounce
```

### Still not working?

1. Check your API key starts with `re_`
2. Make sure `.env` is in the root directory
3. Restart your dev server after changing `.env`
4. Check the console for error messages
5. Verify you're not hitting rate limits (100/day on free tier)

## Rate Limits

### Free Tier
- **3,000 emails/month**
- **100 emails/day**
- Perfect for getting started and small businesses

### If You Need More
- Pro Plan: $20/month for 50,000 emails
- Business Plan: Custom pricing for higher volumes

## Next Steps

1. ✅ Set up your email system (you just did this!)
2. 📧 Integrate welcome emails into your signup flow
3. 💳 Add payment notifications to your PayPal webhooks
4. 🎯 Set up win-back campaigns for churned customers
5. 🚨 Configure dispute alerts for admin notifications

## Need Help?

- **Resend Docs:** https://resend.com/docs
- **Resend Support:** support@resend.com
- **Project Issues:** Check the GitHub issues or README

## Pro Tips

1. **Always handle errors** - Email delivery can fail
2. **Log all sends** - Keep track of what you sent
3. **Test in production** - Use your own email first
4. **Monitor delivery rates** - Check Resend dashboard
5. **Personalize content** - Use client names and data
6. **Mobile-first** - Most emails are read on phones
7. **Clear CTAs** - Make next steps obvious
8. **A/B test** - Try different subject lines
9. **Track clicks** - Monitor engagement
10. **Respect privacy** - Include unsubscribe links

---

**That's it! Your email system is ready to use.** 🎉

Send your first email with:

```typescript
import { sendWelcomeEmail } from '@/lib/email';

await sendWelcomeEmail(
  'your-email@example.com',
  'Your Name',
  'Pro Package'
);
```
