# Complete Email System Setup Guide

This guide walks you through the complete setup of the BrandVoice Studio email notification system.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Testing](#testing)
5. [Integration](#integration)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Node.js 18+ installed
- BrandVoice Studio application set up
- A domain you control (for production)
- 10 minutes of your time

## Installation

### Step 1: Install Dependencies

The Resend package has already been added to your project. Verify with:

```bash
npm list resend
```

You should see:
```
ai-spokesperson-studio@0.1.0
└── resend@6.5.2
```

If not installed:
```bash
npm install resend
```

### Step 2: Verify File Structure

Check that all email system files are present:

```bash
ls -la lib/email/
```

You should see:
```
ARCHITECTURE.md    # System architecture documentation
README.md          # Main documentation
QUICKSTART.md      # Quick start guide
SETUP.md          # This file
examples.ts       # Integration examples
index.ts          # Main email functions
templates.ts      # HTML email templates
types.ts          # TypeScript types
```

---

## Configuration

### Step 1: Sign Up for Resend

1. Visit [resend.com](https://resend.com)
2. Click "Sign Up" (no credit card required)
3. Verify your email address
4. Log in to your dashboard

**Free Tier Benefits:**
- 3,000 emails per month
- 100 emails per day
- Perfect for getting started
- No expiration

### Step 2: Get Your API Key

1. In Resend dashboard, click **"API Keys"** in the sidebar
2. Click **"Create API Key"**
3. Name it: `BrandVoice Studio Development`
4. Permission: Select **"Sending access"**
5. Click **"Add"**
6. **IMPORTANT:** Copy the API key immediately (starts with `re_`)
   - You won't be able to see it again!
   - Store it securely

### Step 3: Set Up Environment Variables

#### Development (.env.local or .env)

Create or edit your `.env` file in the project root:

```bash
# Email Configuration (Resend)
RESEND_API_KEY="re_your_actual_api_key_here"
EMAIL_FROM="BrandVoice Studio <onboarding@resend.dev>"
ADMIN_EMAIL="your-email@example.com"
```

**Notes:**
- Use `onboarding@resend.dev` for development (no domain verification needed)
- Replace `your-email@example.com` with your actual email for admin alerts
- The `.env` file is already in `.gitignore` - don't commit it!

#### Production (.env.production)

For production, you'll use your verified domain:

```bash
# Email Configuration (Resend)
RESEND_API_KEY="re_your_production_api_key"
EMAIL_FROM="BrandVoice Studio <hello@brandvoice.studio>"
ADMIN_EMAIL="admin@brandvoice.studio"
```

### Step 4: Verify Configuration

Check if your configuration is correct:

```bash
# Method 1: Via API (start dev server first)
npm run dev

# In another terminal:
curl http://localhost:3000/api/email/test

# Should return:
# {"configured": true, "message": "Email system is configured and ready"}
```

```bash
# Method 2: Via test script
npm run email:test

# Should show configuration status
```

---

## Testing

### Quick Test (Recommended)

Send all test emails to your inbox:

```bash
npm run email:test your-email@example.com
```

This will send 6 test emails:
1. Basic test email
2. Welcome email
3. Payment failed notification
4. Payment received confirmation
5. Win-back email
6. Dispute alert

**Expected Results:**
- All 6 emails should succeed
- Check your inbox within 1-2 minutes
- Check spam folder if not in inbox
- All links should work correctly

### Test Individual Email Types

#### Via Command Line

```bash
# Just the basic test
npm run email:test
```

#### Via API Endpoint

Start your dev server:
```bash
npm run dev
```

Test each email type:

```bash
# 1. Basic test email
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "type": "test",
    "email": "your-email@example.com"
  }'

# 2. Welcome email
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "type": "welcome",
    "email": "your-email@example.com",
    "clientName": "John Doe",
    "packageName": "Pro Package"
  }'

# 3. Payment failed
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment-failed",
    "email": "your-email@example.com",
    "clientName": "John Doe",
    "updatePaymentLink": "https://brandvoice.studio/billing/update"
  }'

# 4. Payment received
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment-received",
    "email": "your-email@example.com",
    "clientName": "John Doe",
    "amount": 297,
    "orderId": "ORDER-12345"
  }'

# 5. Win-back email
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "type": "win-back",
    "email": "your-email@example.com",
    "clientName": "John Doe",
    "specialOfferCode": "WELCOME20"
  }'

# 6. Dispute alert
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "type": "dispute-alert",
    "email": "your-email@example.com",
    "clientName": "John Doe",
    "caseId": "PP-D-12345",
    "amount": 297
  }'
```

#### Via Code

Create a test file `test-emails.ts`:

```typescript
import {
  sendWelcomeEmail,
  sendPaymentReceivedEmail,
  sendTestEmail,
} from '@/lib/email';

async function testEmails() {
  const testEmail = 'your-email@example.com';

  // Test 1: Basic test
  const test1 = await sendTestEmail(testEmail);
  console.log('Test email:', test1);

  // Test 2: Welcome
  const test2 = await sendWelcomeEmail(
    testEmail,
    'John Doe',
    'Pro Package'
  );
  console.log('Welcome email:', test2);

  // Test 3: Payment
  const test3 = await sendPaymentReceivedEmail(
    testEmail,
    'John Doe',
    297.00,
    'ORDER-12345'
  );
  console.log('Payment email:', test3);
}

testEmails();
```

Run it:
```bash
npx tsx test-emails.ts
```

### Email Client Testing

Test your emails on different clients:

1. **Gmail** (web & mobile)
   - Check inbox and spam
   - Verify mobile rendering
   - Test all links

2. **Outlook** (web & desktop)
   - Check formatting
   - Verify images load
   - Test buttons

3. **Apple Mail** (iOS & macOS)
   - Check on iPhone
   - Check on Mac
   - Verify dark mode

4. **Yahoo Mail**
   - Less common but good to check
   - Verify basic rendering

### Using Resend Test Addresses

Resend provides special test email addresses:

```typescript
// Always succeeds
await sendTestEmail('delivered@resend.dev');

// Simulates bounce
await sendTestEmail('bounced@resend.dev');

// Simulates spam complaint
await sendTestEmail('complained@resend.dev');
```

---

## Integration

### Basic Integration

Import email functions anywhere in your app:

```typescript
import {
  sendWelcomeEmail,
  sendPaymentFailedEmail,
  sendPaymentReceivedEmail,
  sendWinBackEmail,
  sendDisputeAlertEmail,
  isEmailConfigured,
} from '@/lib/email';
```

### Common Integration Points

#### 1. New User Signup

```typescript
// app/api/auth/signup/route.ts
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  const { email, name, package } = await request.json();

  // Create user in database
  const user = await prisma.user.create({
    data: { email, name, package }
  });

  // Send welcome email (non-blocking)
  sendWelcomeEmail(email, name, package).catch(err => {
    console.error('Welcome email failed:', err);
    // Don't block user creation if email fails
  });

  return Response.json({ success: true, user });
}
```

#### 2. PayPal Webhook Handler

```typescript
// app/api/webhooks/paypal/route.ts
import {
  sendPaymentReceivedEmail,
  sendPaymentFailedEmail,
  sendDisputeAlertEmail,
} from '@/lib/email';

export async function POST(request: Request) {
  const event = await request.json();

  switch (event.event_type) {
    case 'PAYMENT.SALE.COMPLETED':
      await sendPaymentReceivedEmail(
        event.resource.payer.email_address,
        event.resource.payer.payer_info.first_name,
        parseFloat(event.resource.amount.total),
        event.resource.id
      );
      break;

    case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
      await sendPaymentFailedEmail(
        event.resource.subscriber.email_address,
        event.resource.subscriber.name.given_name,
        `${process.env.NEXT_PUBLIC_BASE_URL}/billing/update`
      );
      break;

    case 'CUSTOMER.DISPUTE.CREATED':
      await sendDisputeAlertEmail(
        process.env.ADMIN_EMAIL!,
        event.resource.disputed_transactions[0].buyer.name,
        event.resource.dispute_id,
        parseFloat(event.resource.dispute_amount.value)
      );
      break;
  }

  return Response.json({ received: true });
}
```

#### 3. Scheduled Win-Back Campaign

```typescript
// app/api/cron/win-back/route.ts
import { sendWinBackEmail } from '@/lib/email';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Find churned clients (canceled 30+ days ago)
  const churnedClients = await prisma.client.findMany({
    where: {
      status: 'CANCELLED',
      canceledAt: {
        lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    }
  });

  // Send win-back emails
  const results = [];
  for (const client of churnedClients) {
    const result = await sendWinBackEmail(
      client.email,
      client.name,
      'COMEBACK20'
    );
    results.push({ client: client.name, success: result.success });

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return Response.json({ success: true, results });
}
```

### Error Handling Best Practices

Always handle email errors gracefully:

```typescript
const result = await sendWelcomeEmail(email, name, package);

if (!result.success) {
  // Log the error
  console.error('Email failed:', result.error);

  // Store for retry (optional)
  await prisma.failedEmail.create({
    data: {
      type: 'welcome',
      recipient: email,
      error: result.error,
      attemptedAt: new Date(),
    }
  });

  // Notify admin if critical (optional)
  if (isCriticalEmail) {
    await notifyAdminOfEmailFailure(email, result.error);
  }

  // Don't block the main operation
  // User signup should succeed even if email fails
}
```

---

## Production Deployment

### Step 1: Domain Verification

To send emails from your domain in production:

1. **Add Your Domain in Resend**
   - Go to Resend dashboard
   - Click "Domains" → "Add Domain"
   - Enter your domain: `brandvoice.studio`

2. **Add DNS Records**

   Resend will provide 3 DNS records to add:

   ```
   # DKIM Record (for authentication)
   Type: TXT
   Name: resend._domainkey
   Value: [provided by Resend]

   # SPF Record (for sender verification)
   Type: TXT
   Name: @
   Value: v=spf1 include:_spf.resend.com ~all

   # DMARC Record (for email policy)
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:admin@brandvoice.studio
   ```

3. **Add Records to Your DNS Provider**
   - Log in to your domain registrar (Namecheap, GoDaddy, etc.)
   - Go to DNS settings
   - Add the 3 TXT records provided by Resend
   - Save changes

4. **Verify Domain**
   - Return to Resend dashboard
   - Click "Verify" next to your domain
   - Verification usually takes 5-15 minutes
   - You'll receive an email when verified

### Step 2: Update Production Environment Variables

On Vercel, Railway, or your hosting platform:

```bash
RESEND_API_KEY="re_your_production_key"
EMAIL_FROM="BrandVoice Studio <hello@brandvoice.studio>"
ADMIN_EMAIL="admin@brandvoice.studio"
NEXT_PUBLIC_BASE_URL="https://brandvoice.studio"
```

### Step 3: Test Production Setup

After deploying:

```bash
# Test via your production API
curl -X POST https://brandvoice.studio/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "type": "test",
    "email": "your-email@example.com"
  }'
```

### Step 4: Monitor Email Delivery

1. **Resend Dashboard**
   - Check "Emails" tab for delivery status
   - Monitor bounce rates
   - Track opens (if enabled)

2. **Set Up Alerts**
   - Configure alerts for high bounce rates
   - Monitor for spam complaints
   - Track delivery failures

3. **Log Emails in Your Database** (Recommended)

```typescript
// After sending email
if (result.success) {
  await prisma.emailLog.create({
    data: {
      type: 'welcome',
      recipient: email,
      messageId: result.messageId,
      status: 'sent',
      sentAt: new Date(),
    }
  });
}
```

### Step 5: Set Up Webhooks (Optional but Recommended)

Resend can notify you of bounces, complaints, and deliveries:

1. In Resend dashboard, go to "Webhooks"
2. Add webhook endpoint: `https://brandvoice.studio/api/webhooks/resend`
3. Select events: `email.delivered`, `email.bounced`, `email.complained`
4. Save the webhook signing secret

Create webhook handler:

```typescript
// app/api/webhooks/resend/route.ts
export async function POST(request: Request) {
  const event = await request.json();

  switch (event.type) {
    case 'email.delivered':
      // Mark as delivered in database
      break;

    case 'email.bounced':
      // Mark email as invalid
      // Maybe notify admin
      break;

    case 'email.complained':
      // Unsubscribe user from future emails
      break;
  }

  return Response.json({ received: true });
}
```

---

## Troubleshooting

### Issue: "Email system not configured"

**Cause:** Missing environment variables

**Solution:**
```bash
# Check your .env file
cat .env | grep RESEND
cat .env | grep EMAIL

# Should show:
# RESEND_API_KEY="re_..."
# EMAIL_FROM="..."
# ADMIN_EMAIL="..."
```

If missing, add them and restart your dev server.

### Issue: Emails not being received

**Possible causes:**

1. **In Spam Folder**
   - Check spam/junk folder
   - Mark as "Not Spam"
   - For production, verify domain to improve deliverability

2. **Wrong Email Address**
   - Double-check the recipient email
   - Test with multiple email providers

3. **API Key Issues**
   - Verify API key starts with `re_`
   - Check key hasn't expired
   - Try regenerating key

4. **Rate Limits**
   - Free tier: 100 emails/day
   - Check Resend dashboard for limits

5. **Domain Not Verified** (Production)
   - Can only send from verified domains in production
   - Use `onboarding@resend.dev` for development

### Issue: "401 Unauthorized" Error

**Cause:** Invalid API key

**Solution:**
1. Check API key is correct
2. Regenerate API key in Resend dashboard
3. Update `.env` file
4. Restart application

### Issue: Emails Going to Spam

**Solutions:**

1. **Verify Your Domain**
   - Add SPF, DKIM, DMARC records
   - Follow Step 1 of Production Deployment

2. **Improve Email Content**
   - Avoid spam trigger words
   - Include unsubscribe link
   - Use clear, professional language
   - Don't use URL shorteners

3. **Build Sender Reputation**
   - Start with low volume
   - Gradually increase sending
   - Monitor bounce rates
   - Remove invalid emails promptly

### Issue: Slow Email Delivery

**Normal behavior:**
- Development: 1-2 minutes
- Production: Usually < 30 seconds

**If slower:**
- Check Resend status page: https://status.resend.com
- Try sending to different email providers
- Contact Resend support

### Issue: Template Not Rendering Correctly

**Solution:**

1. **Test in Multiple Email Clients**
   - Gmail, Outlook, Apple Mail

2. **Use Inline Styles**
   - Already done in templates
   - Don't use external CSS

3. **Test HTML Validity**
   - Use HTML validator
   - Check for unclosed tags

### Getting Help

1. **Check Resend Documentation**
   - https://resend.com/docs

2. **Resend Status Page**
   - https://status.resend.com

3. **Resend Support**
   - Email: support@resend.com
   - Response time: Usually within 24 hours

4. **Project Issues**
   - Check `lib/email/README.md`
   - Review `lib/email/examples.ts`
   - Consult `lib/email/ARCHITECTURE.md`

---

## Next Steps

After setup is complete:

1. ✅ **Verify all emails work** - Send test emails
2. ✅ **Integrate into your app** - Add to signup, payment flows
3. ✅ **Set up monitoring** - Track delivery rates
4. ✅ **Plan for production** - Verify domain, update env vars
5. ✅ **Train your team** - Share documentation

## Quick Reference

```bash
# Test email system
npm run email:test your-email@example.com

# Check configuration
curl http://localhost:3000/api/email/test

# Send individual test email
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"type": "test", "email": "your@email.com"}'
```

---

**You're all set! 🎉**

Your email notification system is ready to use. Start sending emails with:

```typescript
import { sendWelcomeEmail } from '@/lib/email';

await sendWelcomeEmail('user@example.com', 'John Doe', 'Pro Package');
```
