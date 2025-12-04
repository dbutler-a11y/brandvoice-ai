# Email System Quick Reference Card

## Import Email Functions

```typescript
import {
  sendWelcomeEmail,
  sendPaymentFailedEmail,
  sendPaymentReceivedEmail,
  sendWinBackEmail,
  sendDisputeAlertEmail,
  sendTestEmail,
  isEmailConfigured,
} from '@/lib/email';
```

## Function Signatures

### sendWelcomeEmail()
```typescript
sendWelcomeEmail(
  to: string,              // Client email
  clientName: string,      // Client's name
  packageName: string      // Subscription package
): Promise<EmailResponse>
```

**Example:**
```typescript
const result = await sendWelcomeEmail(
  'john@example.com',
  'John Doe',
  'Pro Package'
);
```

### sendPaymentFailedEmail()
```typescript
sendPaymentFailedEmail(
  to: string,              // Client email
  clientName: string,      // Client's name
  updatePaymentLink: string // Link to update payment
): Promise<EmailResponse>
```

**Example:**
```typescript
await sendPaymentFailedEmail(
  'john@example.com',
  'John Doe',
  'https://brandvoice.ai/billing/update'
);
```

### sendPaymentReceivedEmail()
```typescript
sendPaymentReceivedEmail(
  to: string,              // Client email
  clientName: string,      // Client's name
  amount: number,          // Payment amount
  orderId: string          // Order/transaction ID
): Promise<EmailResponse>
```

**Example:**
```typescript
await sendPaymentReceivedEmail(
  'john@example.com',
  'John Doe',
  297.00,
  'ORDER-12345'
);
```

### sendWinBackEmail()
```typescript
sendWinBackEmail(
  to: string,              // Client email
  clientName: string,      // Client's name
  specialOfferCode?: string // Optional promo code
): Promise<EmailResponse>
```

**Example:**
```typescript
await sendWinBackEmail(
  'john@example.com',
  'John Doe',
  'WELCOME20'  // Optional
);
```

### sendDisputeAlertEmail()
```typescript
sendDisputeAlertEmail(
  adminEmail: string,      // Admin email (or use env default)
  clientName: string,      // Client's name
  caseId: string,          // Dispute case ID
  amount: number           // Disputed amount
): Promise<EmailResponse>
```

**Example:**
```typescript
await sendDisputeAlertEmail(
  'admin@brandvoice.ai',
  'John Doe',
  'PP-D-12345',
  297.00
);
```

### sendTestEmail()
```typescript
sendTestEmail(
  testEmail: string        // Email to send test to
): Promise<EmailResponse>
```

**Example:**
```typescript
await sendTestEmail('your-email@example.com');
```

### isEmailConfigured()
```typescript
isEmailConfigured(): boolean
```

**Example:**
```typescript
if (isEmailConfigured()) {
  console.log('Email system ready');
}
```

## Return Type

All email functions return:

```typescript
interface EmailResponse {
  success: boolean;      // true if sent successfully
  messageId?: string;    // Resend message ID (on success)
  error?: string;        // Error message (on failure)
}
```

## Error Handling Pattern

```typescript
const result = await sendWelcomeEmail(email, name, package);

if (result.success) {
  console.log('Email sent!', result.messageId);
} else {
  console.error('Email failed:', result.error);
  // Handle error (log, retry, notify admin, etc.)
}
```

## Environment Variables

```env
# Required
RESEND_API_KEY="re_your_api_key"
EMAIL_FROM="BrandVoice.AI <hello@brandvoice.ai>"

# Optional (has defaults)
ADMIN_EMAIL="admin@brandvoice.ai"
NEXT_PUBLIC_BASE_URL="https://brandvoice.ai"
NEXT_PUBLIC_CALENDLY_URL="https://calendly.com/..."
```

## Testing Commands

```bash
# CLI test (all emails)
npm run email:test your-email@example.com

# Check configuration
curl http://localhost:3000/api/email/test

# Send specific email via API
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "type": "welcome",
    "email": "test@example.com",
    "clientName": "Test User",
    "packageName": "Pro Package"
  }'
```

## API Endpoint

### GET /api/email/test
Check if email system is configured

**Response:**
```json
{
  "configured": true,
  "message": "Email system is configured and ready"
}
```

### POST /api/email/test
Send test emails

**Request Body:**
```json
{
  "type": "welcome",          // Email type
  "email": "test@example.com", // Recipient
  "clientName": "John Doe",   // Optional params...
  "packageName": "Pro Package"
}
```

**Email Types:**
- `test` - Basic test email
- `welcome` - Welcome email
- `payment-failed` - Payment failure
- `payment-received` - Payment confirmation
- `win-back` - Win-back campaign
- `dispute-alert` - Admin dispute alert

**Response:**
```json
{
  "success": true,
  "messageId": "abc123..."
}
```

## Common Integration Patterns

### New User Signup
```typescript
// In signup API route
await sendWelcomeEmail(user.email, user.name, subscription.package);
```

### PayPal Webhook
```typescript
// In /api/webhooks/paypal/route.ts
switch (event.event_type) {
  case 'PAYMENT.SALE.COMPLETED':
    await sendPaymentReceivedEmail(
      customer.email, customer.name, amount, txnId
    );
    break;

  case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
    await sendPaymentFailedEmail(
      customer.email, customer.name, updateLink
    );
    break;
}
```

### Scheduled Churn Campaign
```typescript
// Cron job
const churnedClients = await getChurnedClients();

for (const client of churnedClients) {
  await sendWinBackEmail(client.email, client.name, 'WELCOME20');
  await delay(1000); // Rate limiting
}
```

## Rate Limits

**Resend Free Tier:**
- 3,000 emails/month
- 100 emails/day

**Best Practice:**
```typescript
// Space out bulk sends
for (const client of clients) {
  await sendEmail(client);
  await new Promise(resolve => setTimeout(resolve, 1000));
}
```

## Troubleshooting

### Check Configuration
```typescript
import { isEmailConfigured } from '@/lib/email';

if (!isEmailConfigured()) {
  console.error('Missing RESEND_API_KEY or EMAIL_FROM');
}
```

### Test Email Sending
```typescript
const result = await sendTestEmail('your-email@example.com');
console.log(result.success ? 'Working!' : 'Failed:', result.error);
```

### Check API Status
```bash
curl http://localhost:3000/api/email/test
```

## Documentation

- **Quick Start**: `lib/email/QUICKSTART.md`
- **Full Setup**: `lib/email/SETUP.md`
- **Architecture**: `lib/email/ARCHITECTURE.md`
- **Main Docs**: `lib/email/README.md`
- **Examples**: `lib/email/examples.ts`
- **This Card**: `lib/email/QUICK_REFERENCE.md`

## Support

- Resend Docs: https://resend.com/docs
- Resend Status: https://status.resend.com
- Email Standards: https://www.emailstandards.org

---

**Need more details?** See the full documentation in the files listed above.
