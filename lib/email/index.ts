/**
 * Email Notification System for BrandVoice Studio
 * Using Resend for reliable email delivery
 */

import { Resend } from 'resend';
import {
  getWelcomeEmailTemplate,
  getPaymentFailedEmailTemplate,
  getWinBackEmailTemplate,
  getDisputeAlertEmailTemplate,
  getPaymentReceivedEmailTemplate,
} from './templates';

// Lazy-load Resend client to avoid build-time initialization errors
let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY || 'placeholder');
  }
  return resendClient;
}

// Email configuration
const EMAIL_FROM = process.env.EMAIL_FROM || 'BrandVoice Studio <hello@brandvoice.studio>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@brandvoice.studio';

// Type definitions
interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send welcome email to new clients
 * @param to - Client email address
 * @param clientName - Client's name
 * @param packageName - Subscription package name
 * @returns Promise with email send result
 */
export async function sendWelcomeEmail(
  to: string,
  clientName: string,
  packageName: string
): Promise<EmailResponse> {
  try {
    const { data, error } = await getResendClient().emails.send({
      from: EMAIL_FROM,
      to: [to],
      subject: `Welcome to BrandVoice Studio, ${clientName}!`,
      html: getWelcomeEmailTemplate(clientName, packageName),
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }

    console.log(`Welcome email sent to ${to}:`, data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Exception sending welcome email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Send payment failed notification
 * @param to - Client email address
 * @param clientName - Client's name
 * @param updatePaymentLink - Link to update payment method
 * @returns Promise with email send result
 */
export async function sendPaymentFailedEmail(
  to: string,
  clientName: string,
  updatePaymentLink: string
): Promise<EmailResponse> {
  try {
    const { data, error } = await getResendClient().emails.send({
      from: EMAIL_FROM,
      to: [to],
      subject: 'Payment Failed - Action Required',
      html: getPaymentFailedEmailTemplate(clientName, updatePaymentLink),
    });

    if (error) {
      console.error('Error sending payment failed email:', error);
      return { success: false, error: error.message };
    }

    console.log(`Payment failed email sent to ${to}:`, data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Exception sending payment failed email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Send win-back email to churned clients
 * @param to - Client email address
 * @param clientName - Client's name
 * @param specialOfferCode - Optional promo code
 * @returns Promise with email send result
 */
export async function sendWinBackEmail(
  to: string,
  clientName: string,
  specialOfferCode?: string
): Promise<EmailResponse> {
  try {
    const { data, error } = await getResendClient().emails.send({
      from: EMAIL_FROM,
      to: [to],
      subject: `We Miss You, ${clientName}! Special Offer Inside`,
      html: getWinBackEmailTemplate(clientName, specialOfferCode),
    });

    if (error) {
      console.error('Error sending win-back email:', error);
      return { success: false, error: error.message };
    }

    console.log(`Win-back email sent to ${to}:`, data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Exception sending win-back email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Send dispute alert to admin
 * @param adminEmail - Admin email address (defaults to env var)
 * @param clientName - Client's name
 * @param caseId - Dispute case ID
 * @param amount - Disputed amount
 * @returns Promise with email send result
 */
export async function sendDisputeAlertEmail(
  adminEmail: string,
  clientName: string,
  caseId: string,
  amount: number
): Promise<EmailResponse> {
  try {
    const recipient = adminEmail || ADMIN_EMAIL;

    const { data, error } = await getResendClient().emails.send({
      from: EMAIL_FROM,
      to: [recipient],
      subject: `🚨 URGENT: Payment Dispute Alert - ${clientName}`,
      html: getDisputeAlertEmailTemplate(clientName, caseId, amount),
    });

    if (error) {
      console.error('Error sending dispute alert email:', error);
      return { success: false, error: error.message };
    }

    console.log(`Dispute alert email sent to ${recipient}:`, data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Exception sending dispute alert email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Send payment received confirmation
 * @param to - Client email address
 * @param clientName - Client's name
 * @param amount - Payment amount
 * @param orderId - Order/transaction ID
 * @returns Promise with email send result
 */
export async function sendPaymentReceivedEmail(
  to: string,
  clientName: string,
  amount: number,
  orderId: string
): Promise<EmailResponse> {
  try {
    const { data, error } = await getResendClient().emails.send({
      from: EMAIL_FROM,
      to: [to],
      subject: 'Payment Received - Thank You!',
      html: getPaymentReceivedEmailTemplate(clientName, amount, orderId),
    });

    if (error) {
      console.error('Error sending payment received email:', error);
      return { success: false, error: error.message };
    }

    console.log(`Payment received email sent to ${to}:`, data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Exception sending payment received email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Utility function to validate email configuration
 * @returns boolean indicating if email is properly configured
 */
export function isEmailConfigured(): boolean {
  return !!(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

/**
 * Send a test email to verify configuration
 * @param testEmail - Email address to send test to
 * @returns Promise with email send result
 */
export async function sendTestEmail(testEmail: string): Promise<EmailResponse> {
  try {
    const { data, error } = await getResendClient().emails.send({
      from: EMAIL_FROM,
      to: [testEmail],
      subject: 'BrandVoice Studio Email System Test',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Test Email</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            <div style="max-width: 600px; margin: 40px auto; padding: 20px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h1 style="color: #2563eb; margin-bottom: 20px;">Email System Test</h1>
              <p style="color: #333333; line-height: 1.6;">
                Your BrandVoice Studio email notification system is configured correctly and working!
              </p>
              <p style="color: #666666; font-size: 14px; margin-top: 30px;">
                Timestamp: ${new Date().toISOString()}
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending test email:', error);
      return { success: false, error: error.message };
    }

    console.log(`Test email sent to ${testEmail}:`, data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Exception sending test email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
