/**
 * PayPal Webhook Event Types and Payload Interfaces
 * 
 * These types help with TypeScript type safety when handling PayPal webhooks
 */

export type PayPalWebhookEventType =
  | 'BILLING.SUBSCRIPTION.ACTIVATED'
  | 'BILLING.SUBSCRIPTION.CANCELLED'
  | 'BILLING.SUBSCRIPTION.PAYMENT.FAILED'
  | 'BILLING.SUBSCRIPTION.SUSPENDED'
  | 'BILLING.SUBSCRIPTION.UPDATED'
  | 'BILLING.SUBSCRIPTION.EXPIRED'
  | 'BILLING.SUBSCRIPTION.RE-ACTIVATED';

export interface PayPalSubscriber {
  email_address?: string;
  payer_id?: string;
  name?: {
    given_name?: string;
    surname?: string;
  };
  shipping_address?: {
    address?: {
      address_line_1?: string;
      address_line_2?: string;
      admin_area_2?: string; // City
      admin_area_1?: string; // State
      postal_code?: string;
      country_code?: string;
    };
  };
}

export interface PayPalSubscriptionResource {
  id?: string; // Subscription ID
  plan_id?: string;
  start_time?: string;
  quantity?: string;
  shipping_amount?: {
    currency_code?: string;
    value?: string;
  };
  subscriber?: PayPalSubscriber;
  billing_info?: {
    outstanding_balance?: {
      currency_code?: string;
      value?: string;
    };
    cycle_executions?: Array<{
      tenure_type?: string;
      sequence?: number;
      cycles_completed?: number;
      cycles_remaining?: number;
      total_cycles?: number;
    }>;
    last_payment?: {
      amount?: {
        currency_code?: string;
        value?: string;
      };
      time?: string;
    };
    next_billing_time?: string;
    failed_payments_count?: number;
  };
  create_time?: string;
  update_time?: string;
  status?: string; // ACTIVE, CANCELLED, SUSPENDED, EXPIRED
  status_update_reason?: string;
}

export interface PayPalWebhookPayload {
  id: string; // Event ID
  event_version: string;
  create_time: string;
  resource_type: string;
  event_type: PayPalWebhookEventType;
  summary: string;
  resource: PayPalSubscriptionResource;
  links?: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

/**
 * Webhook handler result
 */
export interface WebhookHandlerResult {
  success: boolean;
  clientId?: string;
  message?: string;
  error?: string;
}

/**
 * Type guard to check if a string is a valid PayPal webhook event type
 */
export function isPayPalWebhookEventType(
  eventType: string
): eventType is PayPalWebhookEventType {
  const validTypes: PayPalWebhookEventType[] = [
    'BILLING.SUBSCRIPTION.ACTIVATED',
    'BILLING.SUBSCRIPTION.CANCELLED',
    'BILLING.SUBSCRIPTION.PAYMENT.FAILED',
    'BILLING.SUBSCRIPTION.SUSPENDED',
    'BILLING.SUBSCRIPTION.UPDATED',
    'BILLING.SUBSCRIPTION.EXPIRED',
    'BILLING.SUBSCRIPTION.RE-ACTIVATED',
  ];
  return validTypes.includes(eventType as PayPalWebhookEventType);
}

/**
 * Extract payer email from webhook payload
 */
export function extractPayerEmail(payload: PayPalWebhookPayload): string | null {
  return payload.resource?.subscriber?.email_address || null;
}

/**
 * Extract subscription ID from webhook payload
 */
export function extractSubscriptionId(payload: PayPalWebhookPayload): string | null {
  return payload.resource?.id || null;
}

/**
 * Extract subscription status from webhook payload
 */
export function extractSubscriptionStatus(payload: PayPalWebhookPayload): string | null {
  return payload.resource?.status || null;
}
