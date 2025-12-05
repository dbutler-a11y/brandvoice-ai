import nodemailer from 'nodemailer';

// Create reusable transporter using Zoho SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtppro.zoho.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, // SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const FROM_EMAIL = process.env.EMAIL_FROM || 'hello@brandvoice.studio';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@brandvoice.studio';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"BrandVoice Studio" <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });
    console.log(`Email sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// ==========================================
// LEAD NOTIFICATIONS
// ==========================================

export async function notifyNewLead(lead: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: string;
  message?: string;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">🎉 New Lead!</h1>
      </div>
      <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Name:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${lead.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Email:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
              <a href="mailto:${lead.email}" style="color: #4f46e5;">${lead.email}</a>
            </td>
          </tr>
          ${lead.phone ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Phone:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
              <a href="tel:${lead.phone}" style="color: #4f46e5;">${lead.phone}</a>
            </td>
          </tr>
          ` : ''}
          ${lead.company ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Company:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${lead.company}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Source:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${lead.source}</td>
          </tr>
          ${lead.message ? `
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #374151; vertical-align: top;">Message:</td>
            <td style="padding: 10px 0; color: #111827;">${lead.message}</td>
          </tr>
          ` : ''}
        </table>
        <div style="margin-top: 20px; text-align: center;">
          <a href="https://brandvoice.studio/admin/crm" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            View in CRM →
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `🎉 New Lead: ${lead.name} from ${lead.source}`,
    html,
  });
}

export async function notifyAbandonedCart(data: {
  email: string;
  packageName: string;
  amount: number;
  timestamp: Date;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">⚠️ Abandoned Checkout</h1>
      </div>
      <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
        <p style="color: #374151; font-size: 16px;">Someone started checkout but didn't complete:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Email:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
              <a href="mailto:${data.email}" style="color: #4f46e5;">${data.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Package:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${data.packageName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Amount:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: bold;">$${data.amount.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #374151;">Time:</td>
            <td style="padding: 10px 0; color: #111827;">${data.timestamp.toLocaleString()}</td>
          </tr>
        </table>
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
          Consider sending a follow-up email to recover this potential sale.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `⚠️ Abandoned Checkout: ${data.packageName} ($${data.amount})`,
    html,
  });
}

// ==========================================
// PAYMENT NOTIFICATIONS
// ==========================================

export async function notifyPaymentSuccess(data: {
  orderId: string;
  customerEmail: string;
  customerName?: string;
  packageName: string;
  amount: number;
  isSubscription: boolean;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">💰 Payment Received!</h1>
      </div>
      <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
        <div style="background: #d1fae5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #065f46; margin: 0; font-size: 18px; font-weight: bold;">
            $${data.amount.toLocaleString()} ${data.isSubscription ? '/month' : 'one-time'}
          </p>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Order ID:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-family: monospace;">${data.orderId}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Customer:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${data.customerName || data.customerEmail}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Email:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
              <a href="mailto:${data.customerEmail}" style="color: #4f46e5;">${data.customerEmail}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #374151;">Package:</td>
            <td style="padding: 10px 0; color: #111827;">${data.packageName}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; text-align: center;">
          <a href="https://brandvoice.studio/admin/clients" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            View in Admin →
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `💰 Payment: $${data.amount} from ${data.customerName || data.customerEmail}`,
    html,
  });
}

export async function notifyPaymentFailed(data: {
  customerEmail: string;
  packageName: string;
  amount: number;
  errorMessage?: string;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">❌ Payment Failed</h1>
      </div>
      <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Customer:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
              <a href="mailto:${data.customerEmail}" style="color: #4f46e5;">${data.customerEmail}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Package:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${data.packageName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Amount:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">$${data.amount.toLocaleString()}</td>
          </tr>
          ${data.errorMessage ? `
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #374151;">Error:</td>
            <td style="padding: 10px 0; color: #ef4444;">${data.errorMessage}</td>
          </tr>
          ` : ''}
        </table>
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
          The customer may retry or reach out for support.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `❌ Payment Failed: ${data.customerEmail} - ${data.packageName}`,
    html,
  });
}

export async function notifyRefundProcessed(data: {
  orderId: string;
  customerEmail: string;
  amount: number;
  reason?: string;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #6366f1, #4f46e5); padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">🔄 Refund Processed</h1>
      </div>
      <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Order ID:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-family: monospace;">${data.orderId}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Customer:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
              <a href="mailto:${data.customerEmail}" style="color: #4f46e5;">${data.customerEmail}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Amount:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #ef4444; font-weight: bold;">-$${data.amount.toLocaleString()}</td>
          </tr>
          ${data.reason ? `
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #374151;">Reason:</td>
            <td style="padding: 10px 0; color: #111827;">${data.reason}</td>
          </tr>
          ` : ''}
        </table>
      </div>
    </div>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `🔄 Refund: $${data.amount} to ${data.customerEmail}`,
    html,
  });
}

// ==========================================
// WEEKLY DIGEST
// ==========================================

export async function sendWeeklyDigest(data: {
  startDate: Date;
  endDate: Date;
  totalVisitors: number;
  newLeads: number;
  paymentsReceived: number;
  totalRevenue: number;
  topPages: { path: string; views: number }[];
  conversionRate: number;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">📊 Weekly Digest</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0;">
          ${data.startDate.toLocaleDateString()} - ${data.endDate.toLocaleDateString()}
        </p>
      </div>
      <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">

        <!-- Key Metrics -->
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
          <div style="flex: 1; min-width: 120px; background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">Visitors</p>
            <p style="color: #111827; font-size: 24px; font-weight: bold; margin: 5px 0 0 0;">${data.totalVisitors.toLocaleString()}</p>
          </div>
          <div style="flex: 1; min-width: 120px; background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">New Leads</p>
            <p style="color: #10b981; font-size: 24px; font-weight: bold; margin: 5px 0 0 0;">${data.newLeads}</p>
          </div>
          <div style="flex: 1; min-width: 120px; background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">Payments</p>
            <p style="color: #4f46e5; font-size: 24px; font-weight: bold; margin: 5px 0 0 0;">${data.paymentsReceived}</p>
          </div>
        </div>

        <!-- Revenue -->
        <div style="background: #d1fae5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
          <p style="color: #065f46; font-size: 14px; margin: 0;">Total Revenue</p>
          <p style="color: #065f46; font-size: 32px; font-weight: bold; margin: 5px 0 0 0;">$${data.totalRevenue.toLocaleString()}</p>
        </div>

        <!-- Top Pages -->
        ${data.topPages.length > 0 ? `
        <h3 style="color: #374151; margin: 20px 0 10px 0;">Top Pages</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${data.topPages.map((page, i) => `
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${i + 1}.</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${page.path}</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #4f46e5; text-align: right;">${page.views} views</td>
          </tr>
          `).join('')}
        </table>
        ` : ''}

        <!-- Conversion Rate -->
        <div style="margin-top: 20px; padding: 15px; background: #ede9fe; border-radius: 8px; text-align: center;">
          <p style="color: #5b21b6; font-size: 14px; margin: 0;">Visitor → Lead Conversion</p>
          <p style="color: #5b21b6; font-size: 28px; font-weight: bold; margin: 5px 0 0 0;">${data.conversionRate.toFixed(1)}%</p>
        </div>

        <div style="margin-top: 20px; text-align: center;">
          <a href="https://brandvoice.studio/admin" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            View Full Dashboard →
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `📊 Weekly Digest: ${data.newLeads} leads, $${data.totalRevenue.toLocaleString()} revenue`,
    html,
  });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if email is properly configured
 */
export function isEmailConfigured(): boolean {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

/**
 * Send a test email to verify configuration
 */
export async function sendTestEmail(testEmail: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">✅ Email System Test</h1>
      </div>
      <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
        <p style="color: #374151; font-size: 16px;">Your BrandVoice email system is configured correctly!</p>
        <p style="color: #6b7280; font-size: 14px;">Timestamp: ${new Date().toISOString()}</p>
      </div>
    </div>
  `;

  const success = await sendEmail({
    to: testEmail,
    subject: '✅ BrandVoice Email Test',
    html,
  });

  return { success, messageId: success ? 'sent' : undefined };
}

/**
 * Send welcome email to new clients
 */
export async function sendWelcomeEmail(
  to: string,
  clientName: string,
  packageName: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">🎉 Welcome to BrandVoice, ${clientName}!</h1>
      </div>
      <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
        <p style="color: #374151; font-size: 16px;">Thank you for choosing the <strong>${packageName}</strong> package!</p>
        <p style="color: #374151; font-size: 16px;">We're excited to help you create amazing AI spokesperson videos for your business.</p>
        <div style="margin-top: 20px; text-align: center;">
          <a href="https://brandvoice.studio/portal" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Access Your Portal →
          </a>
        </div>
      </div>
    </div>
  `;

  const success = await sendEmail({
    to,
    subject: `Welcome to BrandVoice, ${clientName}!`,
    html,
  });

  return { success, messageId: success ? 'sent' : undefined };
}

/**
 * Send payment failed notification
 */
export async function sendPaymentFailedEmail(
  to: string,
  clientName: string,
  updatePaymentLink: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">⚠️ Payment Issue</h1>
      </div>
      <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
        <p style="color: #374151; font-size: 16px;">Hi ${clientName},</p>
        <p style="color: #374151; font-size: 16px;">We weren't able to process your recent payment. Please update your payment method to continue your service.</p>
        <div style="margin-top: 20px; text-align: center;">
          <a href="${updatePaymentLink}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Update Payment Method →
          </a>
        </div>
      </div>
    </div>
  `;

  const success = await sendEmail({
    to,
    subject: 'Payment Failed - Action Required',
    html,
  });

  return { success, messageId: success ? 'sent' : undefined };
}

/**
 * Send win-back email to churned clients
 */
export async function sendWinBackEmail(
  to: string,
  clientName: string,
  specialOfferCode?: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">We Miss You, ${clientName}!</h1>
      </div>
      <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
        <p style="color: #374151; font-size: 16px;">It's been a while since we've seen you. We'd love to have you back!</p>
        ${specialOfferCode ? `
        <div style="background: #ede9fe; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="color: #5b21b6; font-size: 14px; margin: 0;">Special offer code:</p>
          <p style="color: #5b21b6; font-size: 24px; font-weight: bold; margin: 5px 0;">${specialOfferCode}</p>
        </div>
        ` : ''}
        <div style="margin-top: 20px; text-align: center;">
          <a href="https://brandvoice.studio/pricing" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            See Our Packages →
          </a>
        </div>
      </div>
    </div>
  `;

  const success = await sendEmail({
    to,
    subject: `We Miss You, ${clientName}! Special Offer Inside`,
    html,
  });

  return { success, messageId: success ? 'sent' : undefined };
}

/**
 * Send dispute alert to admin
 */
export async function sendDisputeAlertEmail(
  adminEmail: string,
  clientName: string,
  caseId: string,
  amount: number
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">🚨 Payment Dispute Alert</h1>
      </div>
      <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Client:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${clientName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Case ID:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-family: monospace;">${caseId}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #374151;">Amount:</td>
            <td style="padding: 10px 0; color: #ef4444; font-weight: bold;">$${amount.toLocaleString()}</td>
          </tr>
        </table>
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Please respond to this dispute within 10 days.</p>
      </div>
    </div>
  `;

  const success = await sendEmail({
    to: adminEmail || ADMIN_EMAIL,
    subject: `🚨 URGENT: Payment Dispute Alert - ${clientName}`,
    html,
  });

  return { success, messageId: success ? 'sent' : undefined };
}

/**
 * Send payment received confirmation
 */
export async function sendPaymentReceivedEmail(
  to: string,
  clientName: string,
  amount: number,
  orderId: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">💰 Payment Received!</h1>
      </div>
      <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
        <p style="color: #374151; font-size: 16px;">Thank you, ${clientName}!</p>
        <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="color: #065f46; font-size: 14px; margin: 0;">Payment Amount</p>
          <p style="color: #065f46; font-size: 32px; font-weight: bold; margin: 5px 0;">$${amount.toLocaleString()}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #374151;">Order ID:</td>
            <td style="padding: 10px 0; color: #111827; font-family: monospace;">${orderId}</td>
          </tr>
        </table>
      </div>
    </div>
  `;

  const success = await sendEmail({
    to,
    subject: 'Payment Received - Thank You!',
    html,
  });

  return { success, messageId: success ? 'sent' : undefined };
}
