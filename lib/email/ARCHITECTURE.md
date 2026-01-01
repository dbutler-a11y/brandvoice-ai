# Email System Architecture

## Overview

The BrandVoice Studio email notification system is designed to be simple, reliable, and scalable. It uses Resend for email delivery and provides a clean API for sending transactional emails.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    BrandVoice Studio Application                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   API Routes │  │   Webhooks   │  │  Cron Jobs   │      │
│  │              │  │              │  │              │      │
│  │  - Signup    │  │  - PayPal    │  │  - Win-back  │      │
│  │  - Billing   │  │  - Stripe    │  │  - Reports   │      │
│  │  - Admin     │  │  - Disputes  │  │  - Reminders │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │               │
│         └─────────────────┼─────────────────┘               │
│                           │                                 │
│                    ┌──────▼───────┐                         │
│                    │               │                         │
│                    │  Email System │                         │
│                    │  (/lib/email) │                         │
│                    │               │                         │
│                    └──────┬───────┘                         │
│                           │                                 │
└───────────────────────────┼─────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │                │
                    │  Resend API    │
                    │  (3rd Party)   │
                    │                │
                    └───────┬────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
        ┌───────▼────────┐      ┌──────▼──────┐
        │                │      │             │
        │  Email Servers │      │  Analytics  │
        │  (Gmail, etc)  │      │  Dashboard  │
        │                │      │             │
        └───────┬────────┘      └─────────────┘
                │
        ┌───────▼────────┐
        │                │
        │  End Users     │
        │  (Clients)     │
        │                │
        └────────────────┘
```

## System Components

### 1. Email Functions (`/lib/email/index.ts`)

Core email sending functions:
- `sendWelcomeEmail()` - New client onboarding
- `sendPaymentFailedEmail()` - Payment failure notifications
- `sendPaymentReceivedEmail()` - Payment confirmations
- `sendWinBackEmail()` - Churn prevention campaigns
- `sendDisputeAlertEmail()` - Admin dispute alerts
- `sendTestEmail()` - System testing
- `isEmailConfigured()` - Configuration check

### 2. Email Templates (`/lib/email/templates.ts`)

HTML email templates with:
- Inline CSS for compatibility
- Mobile-responsive design
- Brand colors and styling
- Clear call-to-action buttons
- Professional layouts

### 3. Type Definitions (`/lib/email/types.ts`)

TypeScript interfaces:
- `EmailResponse` - Return type for all email functions
- `EmailConfig` - Configuration structure
- Email parameter interfaces
- Email log structure

### 4. API Endpoint (`/app/api/email/test/route.ts`)

HTTP API for testing emails:
- `GET /api/email/test` - Check configuration
- `POST /api/email/test` - Send test emails

### 5. Test Script (`/scripts/test-email.ts`)

Command-line testing tool:
- Tests all email types
- Color-coded output
- Summary report
- Easy to run: `npm run email:test`

### 6. Examples (`/lib/email/examples.ts`)

Integration patterns:
- PayPal webhook handlers
- Subscription lifecycle
- Bulk email sending
- Error handling patterns

## Data Flow

### Sending a Welcome Email

```
1. User signs up
   │
   ▼
2. API route creates user record
   │
   ▼
3. Call sendWelcomeEmail(email, name, package)
   │
   ▼
4. Generate HTML from template
   │
   ▼
5. Send via Resend API
   │
   ▼
6. Return { success: true, messageId: "..." }
   │
   ▼
7. Log result (optional)
   │
   ▼
8. User receives email
```

### Handling Payment Failures

```
1. PayPal webhook triggered
   │
   ▼
2. Webhook handler validates event
   │
   ▼
3. Extract customer info
   │
   ▼
4. Generate update payment link
   │
   ▼
5. Call sendPaymentFailedEmail()
   │
   ▼
6. Update customer status in DB
   │
   ▼
7. Return webhook response
```

## Email Types & Use Cases

| Email Type | Trigger | Recipient | Purpose |
|------------|---------|-----------|---------|
| Welcome | Subscription created | Client | Onboarding & next steps |
| Payment Received | Payment successful | Client | Confirmation & receipt |
| Payment Failed | Payment declined | Client | Update payment method |
| Win-Back | 30 days after churn | Former client | Re-engagement offer |
| Dispute Alert | Dispute filed | Admin | Immediate action required |
| Test | Manual/automated | Developer/Admin | System verification |

## Error Handling Strategy

### 1. Return Standard Response

```typescript
interface EmailResponse {
  success: boolean;
  messageId?: string;  // On success
  error?: string;      // On failure
}
```

### 2. Always Check Results

```typescript
const result = await sendWelcomeEmail(email, name, package);

if (!result.success) {
  // Log error
  console.error('Email failed:', result.error);

  // Store for retry
  await logFailedEmail(email, 'welcome', result.error);

  // Continue processing (don't block user flow)
}
```

### 3. Graceful Degradation

Email failures should NOT block critical operations:
- User signup should complete even if welcome email fails
- Payment processing should complete even if confirmation fails
- Admin should be notified of email failures separately

## Configuration

### Environment Variables

```env
# Required
RESEND_API_KEY="re_xxxxx"           # Resend API key
EMAIL_FROM="Name <email@domain.com>" # Sender address

# Optional
ADMIN_EMAIL="admin@domain.com"      # Default admin email
NEXT_PUBLIC_BASE_URL="https://..."  # Base URL for links
NEXT_PUBLIC_CALENDLY_URL="https://..." # Calendly link
```

### Configuration Check

```typescript
import { isEmailConfigured } from '@/lib/email';

if (!isEmailConfigured()) {
  console.warn('Email system not configured');
  // Show admin warning or disable email features
}
```

## Rate Limits & Quotas

### Resend Free Tier
- 3,000 emails/month
- 100 emails/day
- Good for: MVP, testing, small businesses

### Recommendations
- Monitor daily usage
- Implement queuing for bulk sends
- Space out emails (1 second between sends)
- Use batch sending for campaigns

### Example: Rate Limited Sending

```typescript
async function sendBulkEmails(clients: Client[]) {
  for (const client of clients) {
    await sendWelcomeEmail(client.email, client.name, client.package);
    await delay(1000); // Wait 1 second between emails
  }
}
```

## Security Considerations

### 1. API Key Protection
- Never commit `.env` to git
- Use environment variables only
- Rotate keys if compromised
- Use separate keys for dev/prod

### 2. Email Validation
```typescript
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

### 3. Rate Limiting
- Implement API rate limits
- Prevent abuse of email sending
- Monitor for suspicious patterns

### 4. Content Security
- Sanitize user input in emails
- Validate all URLs
- Prevent email injection
- Use parameterized templates

## Monitoring & Logging

### What to Track

1. **Email Sends**
   - Type, recipient, timestamp
   - Success/failure status
   - Message ID from Resend
   - Error messages

2. **Delivery Metrics**
   - Sent count
   - Delivered count
   - Bounce rate
   - Open rate (if tracking enabled)

3. **Error Patterns**
   - Common failure reasons
   - Problematic domains
   - API issues

### Recommended Logging

```typescript
interface EmailLog {
  id: string;
  type: EmailType;
  recipient: string;
  subject: string;
  status: 'sent' | 'failed' | 'bounced';
  messageId?: string;
  error?: string;
  sentAt: Date;
}

// Log to database or logging service
await logEmail({
  type: 'welcome',
  recipient: email,
  status: result.success ? 'sent' : 'failed',
  messageId: result.messageId,
  error: result.error,
});
```

## Testing Strategy

### 1. Unit Tests
Test individual email functions with mocked Resend API

### 2. Integration Tests
Test with Resend's test email addresses:
- `delivered@resend.dev` - Always succeeds
- `bounced@resend.dev` - Simulates bounce
- `complained@resend.dev` - Simulates complaint

### 3. Manual Testing
Use the test script:
```bash
npm run email:test your-email@example.com
```

### 4. Email Client Testing
Test on:
- Gmail (web & mobile)
- Outlook (web & desktop)
- Apple Mail (iOS & macOS)
- Yahoo Mail
- Other popular clients

## Deployment Checklist

- [ ] Sign up for Resend
- [ ] Get API key
- [ ] Set environment variables
- [ ] Verify domain (for production)
- [ ] Test all email types
- [ ] Check on multiple email clients
- [ ] Verify links work correctly
- [ ] Set up monitoring/logging
- [ ] Configure webhooks for bounces
- [ ] Document for team

## Future Enhancements

### Potential Improvements

1. **Email Queue System**
   - Queue failed emails for retry
   - Batch sending for campaigns
   - Priority-based sending

2. **Analytics Dashboard**
   - Delivery rates
   - Open rates (with tracking pixels)
   - Click-through rates
   - Bounce analysis

3. **Template Management**
   - Database-stored templates
   - Visual template editor
   - A/B testing
   - Personalization tokens

4. **Advanced Features**
   - Scheduled sending
   - Drip campaigns
   - Segmentation
   - Unsubscribe management
   - Email preferences

5. **Integrations**
   - Multiple email providers (fallback)
   - SMS notifications
   - Push notifications
   - Slack/Discord alerts

## Performance Optimization

### Current Performance
- Single email: ~100-300ms
- Includes API call to Resend
- Template generation is fast (<1ms)

### Optimization Strategies

1. **Async Processing**
   ```typescript
   // Don't block user response
   sendWelcomeEmail(email, name, package).catch(err => {
     console.error('Background email failed:', err);
   });
   ```

2. **Queue Processing**
   - Use job queue (Bull, BullMQ)
   - Process emails in background
   - Automatic retries

3. **Caching**
   - Cache compiled templates
   - Reuse Resend client
   - Connection pooling

## Support & Resources

- **Resend Documentation**: https://resend.com/docs
- **Resend API Reference**: https://resend.com/docs/api-reference
- **Resend Status Page**: https://status.resend.com
- **Email Standards**: https://www.emailstandards.org

## License

Part of BrandVoice Studio project.
