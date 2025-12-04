/**
 * Type definitions for Email Notification System
 */

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailConfig {
  apiKey: string;
  from: string;
  adminEmail: string;
}

export type EmailType =
  | 'welcome'
  | 'payment-failed'
  | 'payment-received'
  | 'win-back'
  | 'dispute-alert'
  | 'test';

export interface WelcomeEmailParams {
  to: string;
  clientName: string;
  packageName: string;
}

export interface PaymentFailedEmailParams {
  to: string;
  clientName: string;
  updatePaymentLink: string;
}

export interface PaymentReceivedEmailParams {
  to: string;
  clientName: string;
  amount: number;
  orderId: string;
}

export interface WinBackEmailParams {
  to: string;
  clientName: string;
  specialOfferCode?: string;
}

export interface DisputeAlertEmailParams {
  adminEmail: string;
  clientName: string;
  caseId: string;
  amount: number;
}

export interface EmailTemplateParams {
  clientName: string;
  [key: string]: string | number | boolean | undefined;
}

export interface EmailLog {
  id: string;
  type: EmailType;
  recipient: string;
  subject: string;
  status: 'sent' | 'failed' | 'bounced';
  messageId?: string;
  error?: string;
  sentAt: Date;
}
