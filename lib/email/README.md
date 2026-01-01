# Email Notification System

Email notification system for BrandVoice Studio using Resend for reliable, transactional email delivery.

## Features

- **Welcome Emails** - Onboard new clients with next steps
- **Payment Notifications** - Confirmations and failure alerts
- **Win-Back Campaigns** - Re-engage churned customers
- **Admin Alerts** - Dispute notifications and critical events
- **Professional Templates** - Mobile-responsive HTML emails with inline styles

## Setup

### 1. Install Dependencies

Already included in package.json:
```bash
npm install resend
```

### 2. Get Your Resend API Key

1. Sign up at [resend.com](https://resend.com) (free tier: 3,000 emails/month)
2. Verify your domain or use the test domain for development
3. Generate an API key from the dashboard

### 3. Configure Environment Variables

Add to your `.env` file:

```env
RESEND_API_KEY="re_your_api_key_here"
EMAIL_FROM="BrandVoice Studio <hello@brandvoice.studio>"
ADMIN_EMAIL="admin@brandvoice.studio"
```

### 4. Domain Verification (Production)

For production, you'll need to verify your domain:

1. Go to Resend dashboard > Domains
2. Add your domain (e.g., brandvoice.studio)
3. Add the provided DNS records to your domain registrar
4. Wait for verification (usually a few minutes)
5. Update `EMAIL_FROM` to use your verified domain

## Usage

### Import Email Functions

```typescript
import {
  sendWelcomeEmail,
  sendPaymentFailedEmail,
  sendWinBackEmail,
  sendDisputeAlertEmail,
  sendPaymentReceivedEmail,
  sendTestEmail,
  isEmailConfigured,
} from '@/lib/email';
```

### Send Welcome Email

```typescript
// When a new client subscribes
const result = await sendWelcomeEmail(
  'client@example.com',
  'John Smith',
  'Pro Package'
);

if (result.success) {
  console.log('Welcome email sent!', result.messageId);
} else {
  console.error('Failed to send email:', result.error);
}
```

### Send Payment Failed Email

```typescript
// When a payment fails
const result = await sendPaymentFailedEmail(
  'client@example.com',
  'John Smith',
  'https://brandvoice.studio/billing/update-payment'
);
```

### Send Win-Back Email

```typescript
// For churned customers
const result = await sendWinBackEmail(
  'client@example.com',
  'John Smith',
  'WELCOME20' // Optional promo code
);
```

### Send Dispute Alert

```typescript
// Alert admin about payment disputes
const result = await sendDisputeAlertEmail(
  'admin@brandvoice.studio', // or use default from env
  'John Smith',
  'PP-D-12345',
  297.00
);
```

### Send Payment Confirmation

```typescript
// After successful payment
const result = await sendPaymentReceivedEmail(
  'client@example.com',
  'John Smith',
  297.00,
  'ORDER-12345'
);
```

### Test Your Configuration

```typescript
// Send a test email
const result = await sendTestEmail('your-email@example.com');

if (result.success) {
  console.log('Email system is working!');
}

// Check if email is configured
if (isEmailConfigured()) {
  console.log('Email system is ready');
} else {
  console.error('Email not configured - check environment variables');
}
```

## Integration Examples

### PayPal Webhook Handler

```typescript
// app/api/webhooks/paypal/route.ts
import { sendPaymentReceivedEmail, sendPaymentFailedEmail } from '@/lib/email';

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

    case 'PAYMENT.SALE.DENIED':
      await sendPaymentFailedEmail(
        event.resource.payer.email_address,
        event.resource.payer.payer_info.first_name,
        `${process.env.NEXT_PUBLIC_BASE_URL}/billing/update`
      );
      break;
  }

  return Response.json({ received: true });
}
```

### Client Registration

```typescript
// app/api/clients/route.ts
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  const { email, name, package } = await request.json();

  // Create client in database
  const client = await prisma.client.create({
    data: { email, name, package }
  });

  // Send welcome email
  await sendWelcomeEmail(email, name, package);

  return Response.json(client);
}
```

### Churn Management

```typescript
// lib/churn/win-back.ts
import { sendWinBackEmail } from '@/lib/email';

export async function runWinBackCampaign() {
  // Find churned clients (canceled > 30 days ago)
  const churnedClients = await prisma.client.findMany({
    where: {
      status: 'CANCELLED',
      canceledAt: {
        lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    }
  });

  // Send win-back emails
  for (const client of churnedClients) {
    await sendWinBackEmail(
      client.email,
      client.name,
      'COMEBACK20' // 20% off promo
    );
  }
}
```

## Email Templates

All email templates are located in `templates.ts` and use:

- Inline CSS for maximum email client compatibility
- Responsive design that works on mobile and desktop
- Professional branding with BrandVoice Studio colors
- Clear call-to-action buttons
- Helpful links and next steps

### Customizing Templates

To customize email templates, edit the functions in `templates.ts`:

```typescript
export function getWelcomeEmailTemplate(
  clientName: string,
  packageName: string
): string {
  // Modify HTML and styles here
  return `<!DOCTYPE html>...`;
}
```

## Error Handling

All email functions return a standardized response:

```typescript
interface EmailResponse {
  success: boolean;
  messageId?: string;  // Resend message ID if successful
  error?: string;      // Error message if failed
}
```

Always check the response:

```typescript
const result = await sendWelcomeEmail('user@example.com', 'John', 'Pro');

if (!result.success) {
  // Log error, retry, or notify admin
  console.error('Email failed:', result.error);

  // Maybe store in database for manual follow-up
  await prisma.failedEmail.create({
    data: {
      type: 'welcome',
      recipient: 'user@example.com',
      error: result.error,
    }
  });
}
```

## Testing

### Development Testing

Use Resend's test mode with `@resend.dev` email addresses:

```typescript
await sendTestEmail('delivered@resend.dev'); // Always succeeds
await sendTestEmail('bounced@resend.dev');   // Simulates bounce
```

### Production Testing

1. Use your own email address first
2. Check spam folders
3. Test on multiple email clients (Gmail, Outlook, Apple Mail)
4. Verify links work correctly
5. Check mobile rendering

## Rate Limits

### Resend Free Tier
- 3,000 emails per month
- 100 emails per day
- No credit card required

### Resend Paid Plans
- Pro: $20/month - 50,000 emails
- Scale: Custom pricing for higher volumes

## Best Practices

1. **Always handle errors** - Email delivery can fail
2. **Log all email sends** - Keep records for debugging
3. **Use test mode in development** - Don't spam real users
4. **Monitor delivery rates** - Check Resend dashboard regularly
5. **Respect unsubscribes** - Implement opt-out links
6. **Personalize content** - Use client names and relevant data
7. **Keep it concise** - People skim emails
8. **Mobile-first** - Most emails are read on phones
9. **Clear CTAs** - Make next steps obvious
10. **Test before sending** - Always preview emails

## Troubleshooting

### Email not sending

```typescript
// Check configuration
if (!isEmailConfigured()) {
  console.error('Missing RESEND_API_KEY or EMAIL_FROM');
}

// Send test email
const test = await sendTestEmail('your-email@example.com');
console.log('Test result:', test);
```

### Emails going to spam

1. Verify your domain with Resend
2. Set up SPF, DKIM, and DMARC records
3. Avoid spammy language
4. Include unsubscribe links
5. Don't use URL shorteners

### API Key Issues

- Make sure the key starts with `re_`
- Check that it's properly set in `.env`
- Don't commit API keys to git
- Regenerate if compromised

## Support

- **Resend Docs**: https://resend.com/docs
- **Resend Status**: https://status.resend.com
- **Email this repo's maintainer**: See main README

## License

Part of BrandVoice Studio project.
