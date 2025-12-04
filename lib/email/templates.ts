/**
 * Email Templates for BrandVoice.AI
 * All templates use inline styles for maximum email client compatibility
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com';

// Common email styles
const emailStyles = {
  container: 'max-width: 600px; margin: 0 auto; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;',
  card: 'background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 40px; margin-bottom: 20px;',
  header: 'color: #2563eb; font-size: 28px; font-weight: bold; margin-bottom: 20px; margin-top: 0;',
  subheader: 'color: #1f2937; font-size: 20px; font-weight: 600; margin-bottom: 16px; margin-top: 24px;',
  text: 'color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 16px;',
  button: 'display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 16px; margin-top: 20px; margin-bottom: 20px;',
  buttonDanger: 'display: inline-block; background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 16px; margin-top: 20px; margin-bottom: 20px;',
  buttonSuccess: 'display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 16px; margin-top: 20px; margin-bottom: 20px;',
  list: 'color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 16px; padding-left: 20px;',
  divider: 'border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;',
  footer: 'color: #9ca3af; font-size: 14px; text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;',
  highlight: 'background-color: #fef3c7; padding: 20px; border-radius: 6px; border-left: 4px solid #f59e0b; margin: 20px 0;',
  alert: 'background-color: #fee2e2; padding: 20px; border-radius: 6px; border-left: 4px solid #dc2626; margin: 20px 0;',
  success: 'background-color: #d1fae5; padding: 20px; border-radius: 6px; border-left: 4px solid #059669; margin: 20px 0;',
  code: 'background-color: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 14px; color: #1f2937;',
};

/**
 * Welcome Email Template
 */
export function getWelcomeEmailTemplate(
  clientName: string,
  packageName: string
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to BrandVoice.AI</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb;">
  <div style="${emailStyles.container}">
    <div style="${emailStyles.card}">
      <h1 style="${emailStyles.header}">Welcome to BrandVoice.AI, ${clientName}! 🎉</h1>

      <p style="${emailStyles.text}">
        We're thrilled to have you on board! You've just taken the first step towards transforming your brand's digital presence with AI-powered spokesperson videos.
      </p>

      <div style="${emailStyles.success}">
        <strong style="color: #065f46;">Your ${packageName} package is now active!</strong>
      </div>

      <h2 style="${emailStyles.subheader}">What Happens Next?</h2>

      <ol style="${emailStyles.list}">
        <li><strong>Complete Your Intake Form</strong> - Tell us about your brand, target audience, and goals</li>
        <li><strong>Book Your Strategy Call</strong> - Let's align on your vision and messaging</li>
        <li><strong>We Create Your Content</strong> - Our team will craft your AI spokesperson videos</li>
        <li><strong>Review & Launch</strong> - Approve your content and watch your engagement soar!</li>
      </ol>

      <h2 style="${emailStyles.subheader}">Ready to Get Started?</h2>

      <a href="${BASE_URL}/intake" style="${emailStyles.button}">
        Complete Intake Form
      </a>

      <br />

      <a href="${CALENDLY_URL}" style="${emailStyles.buttonSuccess}">
        Schedule Strategy Call
      </a>

      <div style="${emailStyles.highlight}">
        <p style="margin: 0; color: #92400e;">
          <strong>💡 Pro Tip:</strong> The more details you provide in the intake form, the better we can tailor your content to your brand voice and goals.
        </p>
      </div>

      <hr style="${emailStyles.divider}" />

      <h2 style="${emailStyles.subheader}">What to Expect</h2>

      <p style="${emailStyles.text}">
        <strong>Timeline:</strong> Most clients see their first videos within 7-10 business days after the strategy call.
      </p>

      <p style="${emailStyles.text}">
        <strong>Support:</strong> Have questions? Reply to this email anytime. Our team is here to help!
      </p>

      <p style="${emailStyles.text}">
        <strong>Dashboard Access:</strong> Track your content creation progress and view all your videos at <a href="${BASE_URL}/dashboard" style="color: #2563eb;">your dashboard</a>.
      </p>

      <p style="${emailStyles.text}; margin-top: 30px;">
        We can't wait to help you amplify your brand voice!
      </p>

      <p style="${emailStyles.text}">
        Best regards,<br />
        <strong>The BrandVoice.AI Team</strong>
      </p>
    </div>

    <div style="${emailStyles.footer}">
      <p>BrandVoice.AI - Amplify Your Brand with AI-Powered Video</p>
      <p>You're receiving this email because you signed up for BrandVoice.AI</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Payment Failed Email Template
 */
export function getPaymentFailedEmailTemplate(
  clientName: string,
  updatePaymentLink: string
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Failed - Action Required</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb;">
  <div style="${emailStyles.container}">
    <div style="${emailStyles.card}">
      <h1 style="${emailStyles.header}">Payment Update Required</h1>

      <p style="${emailStyles.text}">
        Hi ${clientName},
      </p>

      <div style="${emailStyles.alert}">
        <p style="margin: 0; color: #991b1b;">
          <strong>⚠️ We couldn't process your recent payment.</strong>
        </p>
      </div>

      <p style="${emailStyles.text}">
        This can happen for several reasons:
      </p>

      <ul style="${emailStyles.list}">
        <li>Expired credit card</li>
        <li>Insufficient funds</li>
        <li>Bank declined the transaction</li>
        <li>Changed billing address</li>
      </ul>

      <h2 style="${emailStyles.subheader}">What You Need to Do</h2>

      <p style="${emailStyles.text}">
        Please update your payment method within the next <strong>7 days</strong> to continue enjoying uninterrupted service.
      </p>

      <a href="${updatePaymentLink}" style="${emailStyles.buttonDanger}">
        Update Payment Method
      </a>

      <div style="${emailStyles.highlight}">
        <p style="margin: 0; color: #92400e;">
          <strong>Grace Period:</strong> You have 7 days to update your payment information before your service is paused. Don't worry - your content and data will be safe!
        </p>
      </div>

      <hr style="${emailStyles.divider}" />

      <h2 style="${emailStyles.subheader}">Need Help?</h2>

      <p style="${emailStyles.text}">
        If you're experiencing issues updating your payment or have questions about your account, please don't hesitate to reach out. Reply to this email or contact our support team.
      </p>

      <p style="${emailStyles.text}; margin-top: 30px;">
        We appreciate your business and look forward to continuing to serve you!
      </p>

      <p style="${emailStyles.text}">
        Best regards,<br />
        <strong>The BrandVoice.AI Team</strong>
      </p>
    </div>

    <div style="${emailStyles.footer}">
      <p>BrandVoice.AI - Amplify Your Brand with AI-Powered Video</p>
      <p>Questions? Reply to this email or visit our <a href="${BASE_URL}/support" style="color: #6b7280;">support center</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Win-Back Email Template
 */
export function getWinBackEmailTemplate(
  clientName: string,
  specialOfferCode?: string
): string {
  const hasOffer = !!specialOfferCode;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We Miss You!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb;">
  <div style="${emailStyles.container}">
    <div style="${emailStyles.card}">
      <h1 style="${emailStyles.header}">We Miss You, ${clientName}! 💙</h1>

      <p style="${emailStyles.text}">
        It's been a while since we've seen you on BrandVoice.AI, and we wanted to reach out to see how you're doing.
      </p>

      <p style="${emailStyles.text}">
        We understand that priorities change and budgets shift. But we also know how important maintaining a strong digital presence is for your brand.
      </p>

      ${hasOffer ? `
      <div style="${emailStyles.highlight}">
        <p style="margin: 0 0 10px 0; color: #92400e;">
          <strong>🎁 Special Welcome Back Offer</strong>
        </p>
        <p style="margin: 0; color: #92400e;">
          We'd love to have you back! Use code <strong style="${emailStyles.code}">${specialOfferCode}</strong> to get <strong>20% off your first month</strong> when you return.
        </p>
      </div>
      ` : ''}

      <h2 style="${emailStyles.subheader}">What You're Missing</h2>

      <ul style="${emailStyles.list}">
        <li><strong>Consistent Content:</strong> Fresh, engaging AI spokesperson videos delivered on schedule</li>
        <li><strong>Increased Engagement:</strong> Video content that converts 3x better than text alone</li>
        <li><strong>Time Saved:</strong> No more scrambling to create content - we handle it all</li>
        <li><strong>Brand Growth:</strong> Professional videos that establish authority and trust</li>
      </ul>

      <p style="${emailStyles.text}">
        Since you've been gone, we've also added:
      </p>

      <ul style="${emailStyles.list}">
        <li>✨ Enhanced AI voice quality and naturalness</li>
        <li>📊 Advanced analytics dashboard</li>
        <li>🎨 More customization options</li>
        <li>⚡ Faster turnaround times</li>
      </ul>

      <h2 style="${emailStyles.subheader}">Ready to Come Back?</h2>

      <p style="${emailStyles.text}">
        We've kept your account ready for you. Just click below to reactivate and pick up right where you left off.
      </p>

      <a href="${BASE_URL}/reactivate${hasOffer ? `?code=${specialOfferCode}` : ''}" style="${emailStyles.button}">
        Reactivate My Account
      </a>

      <hr style="${emailStyles.divider}" />

      <h2 style="${emailStyles.subheader}">Not Ready Yet?</h2>

      <p style="${emailStyles.text}">
        No problem! We'd still love to hear from you. Reply to this email and let us know:
      </p>

      <ul style="${emailStyles.list}">
        <li>What could we do better?</li>
        <li>What features would make you want to return?</li>
        <li>Is there anything we can help with?</li>
      </ul>

      <p style="${emailStyles.text}">
        Your feedback helps us improve and serve you better.
      </p>

      <p style="${emailStyles.text}; margin-top: 30px;">
        Hope to see you back soon!
      </p>

      <p style="${emailStyles.text}">
        Best regards,<br />
        <strong>The BrandVoice.AI Team</strong>
      </p>
    </div>

    <div style="${emailStyles.footer}">
      <p>BrandVoice.AI - Amplify Your Brand with AI-Powered Video</p>
      <p>Not interested? <a href="${BASE_URL}/unsubscribe" style="color: #6b7280;">Unsubscribe from win-back emails</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Dispute Alert Email Template (For Admin)
 */
export function getDisputeAlertEmailTemplate(
  clientName: string,
  caseId: string,
  amount: number
): string {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Dispute Alert</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb;">
  <div style="${emailStyles.container}">
    <div style="${emailStyles.card}">
      <h1 style="color: #dc2626; font-size: 28px; font-weight: bold; margin-bottom: 20px; margin-top: 0;">
        🚨 URGENT: Payment Dispute Alert
      </h1>

      <div style="${emailStyles.alert}">
        <p style="margin: 0; color: #991b1b;">
          <strong>A payment dispute has been filed and requires immediate attention.</strong>
        </p>
      </div>

      <h2 style="${emailStyles.subheader}">Dispute Details</h2>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600; width: 40%;">
            Client Name:
          </td>
          <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e7eb;">
            ${clientName}
          </td>
        </tr>
        <tr>
          <td style="padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600;">
            Case ID:
          </td>
          <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e7eb;">
            <code style="${emailStyles.code}">${caseId}</code>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600;">
            Disputed Amount:
          </td>
          <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e7eb;">
            <strong style="color: #dc2626; font-size: 18px;">${formattedAmount}</strong>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600;">
            Date Received:
          </td>
          <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e7eb;">
            ${new Date().toLocaleString('en-US', {
              dateStyle: 'full',
              timeStyle: 'short'
            })}
          </td>
        </tr>
      </table>

      <h2 style="${emailStyles.subheader}">Required Actions</h2>

      <ol style="${emailStyles.list}">
        <li><strong>Review the case immediately</strong> in your PayPal Resolution Center</li>
        <li><strong>Gather evidence:</strong>
          <ul style="margin-top: 8px;">
            <li>Service delivery proof (videos created, emails sent)</li>
            <li>Client communication history</li>
            <li>Terms of service acceptance</li>
            <li>Usage logs and analytics</li>
          </ul>
        </li>
        <li><strong>Respond within the deadline</strong> (typically 7-10 days)</li>
        <li><strong>Consider reaching out</strong> to the client directly to resolve</li>
      </ol>

      <div style="${emailStyles.highlight}">
        <p style="margin: 0; color: #92400e;">
          <strong>⏰ Time-Sensitive:</strong> Payment disputes must be responded to quickly. Failure to respond can result in automatic refund and additional fees.
        </p>
      </div>

      <a href="https://www.paypal.com/disputes/" style="${emailStyles.buttonDanger}">
        View in PayPal Resolution Center
      </a>

      <hr style="${emailStyles.divider}" />

      <h2 style="${emailStyles.subheader}">Next Steps</h2>

      <p style="${emailStyles.text}">
        1. Log into PayPal and review the dispute details<br />
        2. Check the client's account status and usage history<br />
        3. Prepare your response with supporting documentation<br />
        4. Consider contacting the client to resolve amicably<br />
        5. Submit your response through PayPal's Resolution Center
      </p>

      <p style="${emailStyles.text}">
        <strong>Client Account Link:</strong> <a href="${BASE_URL}/admin/clients/${encodeURIComponent(clientName)}" style="color: #2563eb;">${BASE_URL}/admin/clients/${encodeURIComponent(clientName)}</a>
      </p>

      <p style="${emailStyles.text}; margin-top: 30px; color: #dc2626; font-weight: 600;">
        This requires immediate attention!
      </p>
    </div>

    <div style="${emailStyles.footer}">
      <p>BrandVoice.AI - Admin Alert System</p>
      <p style="color: #dc2626;">This is an automated alert. Do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Payment Received Email Template
 */
export function getPaymentReceivedEmailTemplate(
  clientName: string,
  amount: number,
  orderId: string
): string {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb;">
  <div style="${emailStyles.container}">
    <div style="${emailStyles.card}">
      <h1 style="${emailStyles.header}">Payment Received - Thank You! ✅</h1>

      <p style="${emailStyles.text}">
        Hi ${clientName},
      </p>

      <div style="${emailStyles.success}">
        <p style="margin: 0; color: #065f46;">
          <strong>✓ Your payment has been successfully processed!</strong>
        </p>
      </div>

      <p style="${emailStyles.text}">
        Thank you for your payment. This email confirms that we've received your payment and your subscription is active.
      </p>

      <h2 style="${emailStyles.subheader}">Payment Details</h2>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600; width: 40%;">
            Amount Paid:
          </td>
          <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e7eb;">
            <strong style="color: #059669; font-size: 18px;">${formattedAmount}</strong>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600;">
            Transaction ID:
          </td>
          <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e7eb;">
            <code style="${emailStyles.code}">${orderId}</code>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600;">
            Payment Date:
          </td>
          <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e7eb;">
            ${new Date().toLocaleString('en-US', {
              dateStyle: 'full',
              timeStyle: 'short'
            })}
          </td>
        </tr>
        <tr>
          <td style="padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; font-weight: 600;">
            Payment Method:
          </td>
          <td style="padding: 12px; background-color: #ffffff; border: 1px solid #e5e7eb;">
            PayPal
          </td>
        </tr>
      </table>

      <h2 style="${emailStyles.subheader}">What's Next?</h2>

      <p style="${emailStyles.text}">
        Your subscription is now active and we're ready to create amazing content for you! Here's what you can expect:
      </p>

      <ul style="${emailStyles.list}">
        <li><strong>Access:</strong> Full access to all your package features</li>
        <li><strong>Content:</strong> Your next batch of videos will be delivered on schedule</li>
        <li><strong>Support:</strong> Our team is here to help if you need anything</li>
      </ul>

      <a href="${BASE_URL}/dashboard" style="${emailStyles.button}">
        View Your Dashboard
      </a>

      <div style="${emailStyles.highlight}">
        <p style="margin: 0; color: #92400e;">
          <strong>📧 Receipt:</strong> Keep this email for your records. You can also download a detailed receipt from your <a href="${BASE_URL}/billing" style="color: #92400e; text-decoration: underline;">billing page</a>.
        </p>
      </div>

      <hr style="${emailStyles.divider}" />

      <h2 style="${emailStyles.subheader}">Need Help?</h2>

      <p style="${emailStyles.text}">
        If you have any questions about this payment or your account, please don't hesitate to reach out. We're here to help!
      </p>

      <p style="${emailStyles.text}">
        <strong>Quick Links:</strong>
      </p>

      <ul style="${emailStyles.list}">
        <li><a href="${BASE_URL}/billing" style="color: #2563eb;">View Billing History</a></li>
        <li><a href="${BASE_URL}/support" style="color: #2563eb;">Contact Support</a></li>
        <li><a href="${BASE_URL}/settings" style="color: #2563eb;">Account Settings</a></li>
      </ul>

      <p style="${emailStyles.text}; margin-top: 30px;">
        Thank you for being a valued BrandVoice.AI customer!
      </p>

      <p style="${emailStyles.text}">
        Best regards,<br />
        <strong>The BrandVoice.AI Team</strong>
      </p>
    </div>

    <div style="${emailStyles.footer}">
      <p>BrandVoice.AI - Amplify Your Brand with AI-Powered Video</p>
      <p>Questions about this payment? Reply to this email or visit our <a href="${BASE_URL}/support" style="color: #6b7280;">support center</a></p>
    </div>
  </div>
</body>
</html>
  `;
}
