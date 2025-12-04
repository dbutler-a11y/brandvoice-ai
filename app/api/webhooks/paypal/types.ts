/**
 * PayPal Webhook Type Definitions
 *
 * These types define the structure of webhook payloads from PayPal.
 * They are based on PayPal's REST API v2 webhook event structures.
 *
 * @see https://developer.paypal.com/api/rest/webhooks/event-names/
 */

// =============================================================================
// Base Structures
// =============================================================================

export interface PayPalAmount {
  currency_code: string;
  value: string;
}

export interface PayPalName {
  given_name?: string;
  surname?: string;
  full_name?: string;
}

export interface PayPalAddress {
  address_line_1?: string;
  address_line_2?: string;
  admin_area_1?: string; // State/Province
  admin_area_2?: string; // City
  postal_code?: string;
  country_code: string;
}

export interface PayPalPayer {
  email_address?: string;
  payer_id?: string;
  name?: PayPalName;
  phone?: {
    phone_type?: string;
    phone_number?: {
      national_number?: string;
    };
  };
  address?: PayPalAddress;
}

export interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

// =============================================================================
// Webhook Event Structure
// =============================================================================

export interface PayPalWebhookEvent<T = Record<string, unknown>> {
  id: string;
  create_time: string;
  resource_type: string;
  event_type: string;
  summary?: string;
  resource: T;
  links?: PayPalLink[];
  event_version?: string;
  resource_version?: string;
}

// =============================================================================
// Order Resources
// =============================================================================

export interface PayPalPurchaseUnit {
  reference_id?: string;
  amount: PayPalAmount;
  payee?: {
    email_address?: string;
    merchant_id?: string;
  };
  description?: string;
  custom_id?: string;
  invoice_id?: string;
  soft_descriptor?: string;
  items?: Array<{
    name: string;
    quantity: string;
    description?: string;
    sku?: string;
    unit_amount: PayPalAmount;
    tax?: PayPalAmount;
  }>;
  shipping?: {
    name?: PayPalName;
    address?: PayPalAddress;
  };
  payments?: {
    captures?: PayPalCapture[];
    refunds?: PayPalRefund[];
  };
}

export interface PayPalOrderResource {
  id: string;
  intent: 'CAPTURE' | 'AUTHORIZE';
  status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED' | 'PAYER_ACTION_REQUIRED';
  purchase_units: PayPalPurchaseUnit[];
  payer?: PayPalPayer;
  create_time: string;
  update_time: string;
  links?: PayPalLink[];
}

// =============================================================================
// Payment Capture Resources
// =============================================================================

export interface PayPalCapture {
  id: string;
  status: 'COMPLETED' | 'DECLINED' | 'PARTIALLY_REFUNDED' | 'PENDING' | 'REFUNDED' | 'FAILED';
  amount: PayPalAmount;
  final_capture?: boolean;
  seller_protection?: {
    status: string;
    dispute_categories?: string[];
  };
  seller_receivable_breakdown?: {
    gross_amount: PayPalAmount;
    paypal_fee: PayPalAmount;
    net_amount: PayPalAmount;
  };
  invoice_id?: string;
  custom_id?: string;
  create_time: string;
  update_time: string;
  links?: PayPalLink[];
}

// =============================================================================
// Refund Resources
// =============================================================================

export interface PayPalRefund {
  id: string;
  status: 'CANCELLED' | 'PENDING' | 'COMPLETED' | 'FAILED';
  amount: PayPalAmount;
  invoice_id?: string;
  custom_id?: string;
  acquirer_reference_number?: string;
  seller_payable_breakdown?: {
    gross_amount: PayPalAmount;
    paypal_fee: PayPalAmount;
    net_amount: PayPalAmount;
    total_refunded_amount: PayPalAmount;
  };
  create_time: string;
  update_time: string;
  links?: PayPalLink[];
}

// =============================================================================
// Subscription Resources
// =============================================================================

export interface PayPalSubscriptionResource {
  id: string;
  plan_id: string;
  start_time?: string;
  quantity?: string;
  shipping_amount?: PayPalAmount;
  subscriber?: {
    email_address?: string;
    payer_id?: string;
    name?: PayPalName;
    shipping_address?: PayPalAddress;
  };
  billing_info?: {
    outstanding_balance: PayPalAmount;
    cycle_executions?: Array<{
      tenure_type: 'REGULAR' | 'TRIAL';
      sequence: number;
      cycles_completed: number;
      cycles_remaining?: number;
      current_pricing_scheme_version?: number;
      total_cycles?: number;
    }>;
    last_payment?: {
      amount: PayPalAmount;
      time: string;
    };
    next_billing_time?: string;
    failed_payments_count?: number;
  };
  create_time: string;
  update_time: string;
  plan_overridden?: boolean;
  status: 'APPROVAL_PENDING' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED';
  status_change_note?: string;
  status_update_time?: string;
  links?: PayPalLink[];
}

// =============================================================================
// Dispute Resources
// =============================================================================

export interface PayPalDisputeResource {
  dispute_id: string;
  create_time: string;
  update_time: string;
  reason: 'MERCHANDISE_OR_SERVICE_NOT_RECEIVED' | 'MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED' | 'UNAUTHORISED' | 'CREDIT_NOT_PROCESSED' | 'DUPLICATE_TRANSACTION' | 'INCORRECT_AMOUNT' | 'PAYMENT_BY_OTHER_MEANS' | 'CANCELED_RECURRING_BILLING' | 'PROBLEM_WITH_REMITTANCE' | 'OTHER';
  status: 'OPEN' | 'WAITING_FOR_BUYER_RESPONSE' | 'WAITING_FOR_SELLER_RESPONSE' | 'UNDER_REVIEW' | 'RESOLVED' | 'OTHER';
  dispute_amount: PayPalAmount;
  dispute_outcome?: {
    outcome_code: 'RESOLVED_BUYER_FAVOUR' | 'RESOLVED_SELLER_FAVOUR' | 'RESOLVED_WITH_PAYOUT' | 'CANCELED_BY_BUYER' | 'ACCEPTED' | 'DENIED' | 'NONE';
    amount_refunded?: PayPalAmount;
  };
  dispute_life_cycle_stage: 'INQUIRY' | 'CHARGEBACK' | 'PRE_ARBITRATION' | 'ARBITRATION';
  dispute_channel: 'INTERNAL' | 'EXTERNAL';
  messages?: Array<{
    posted_by: 'BUYER' | 'SELLER';
    time_posted: string;
    content: string;
  }>;
  external_reason_code?: string;
  seller_response_due_date?: string;
  links?: PayPalLink[];
}

// =============================================================================
// Event-Specific Payload Types
// =============================================================================

export type OrderCompletedEvent = PayPalWebhookEvent<PayPalOrderResource>;
export type PaymentCaptureCompletedEvent = PayPalWebhookEvent<PayPalCapture>;
export type PaymentCaptureRefundedEvent = PayPalWebhookEvent<PayPalRefund>;
export type SubscriptionActivatedEvent = PayPalWebhookEvent<PayPalSubscriptionResource>;
export type SubscriptionCancelledEvent = PayPalWebhookEvent<PayPalSubscriptionResource>;
export type SubscriptionSuspendedEvent = PayPalWebhookEvent<PayPalSubscriptionResource>;
export type SubscriptionPaymentFailedEvent = PayPalWebhookEvent<PayPalSubscriptionResource>;
export type DisputeCreatedEvent = PayPalWebhookEvent<PayPalDisputeResource>;
export type DisputeResolvedEvent = PayPalWebhookEvent<PayPalDisputeResource>;

// =============================================================================
// Webhook Verification Types
// =============================================================================

export interface PayPalWebhookHeaders {
  'paypal-auth-algo': string;
  'paypal-cert-url': string;
  'paypal-transmission-id': string;
  'paypal-transmission-sig': string;
  'paypal-transmission-time': string;
}

export interface PayPalVerificationRequest {
  auth_algo: string;
  cert_url: string;
  transmission_id: string;
  transmission_sig: string;
  transmission_time: string;
  webhook_id: string;
  webhook_event: Record<string, unknown>;
}

export interface PayPalVerificationResponse {
  verification_status: 'SUCCESS' | 'FAILURE';
}

// =============================================================================
// Handler Response Types
// =============================================================================

export interface WebhookHandlerResponse {
  success: boolean;
  message?: string;
  data?: Record<string, unknown>;
}

export interface OrderHandlerResult {
  orderId: string;
  status: string;
  payerEmail: string | null;
}

export interface PaymentHandlerResult {
  captureId: string;
  amount: number;
  currency: string;
  payerEmail: string | null;
  subscriptionId: string | null;
}

export interface RefundHandlerResult {
  refundId: string;
  amount: number;
  currency: string;
}

export interface SubscriptionHandlerResult {
  subscriptionId: string;
  planId?: string;
  payerEmail: string | null;
  startTime?: string;
  clientId: string | null;
  winBackEnabled?: boolean;
  status?: string;
  failedAttempts?: number;
}

export interface DisputeHandlerResult {
  disputeId: string;
  reason?: string;
  outcome?: string;
  amount: number;
  currency: string;
  won?: boolean;
  requiresAction?: boolean;
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * All supported PayPal webhook event types
 */
export const PAYPAL_EVENT_TYPES = {
  ORDER_COMPLETED: 'CHECKOUT.ORDER.COMPLETED',
  PAYMENT_CAPTURED: 'PAYMENT.CAPTURE.COMPLETED',
  PAYMENT_REFUNDED: 'PAYMENT.CAPTURE.REFUNDED',
  SUBSCRIPTION_ACTIVATED: 'BILLING.SUBSCRIPTION.ACTIVATED',
  SUBSCRIPTION_CANCELLED: 'BILLING.SUBSCRIPTION.CANCELLED',
  SUBSCRIPTION_SUSPENDED: 'BILLING.SUBSCRIPTION.SUSPENDED',
  PAYMENT_FAILED: 'BILLING.SUBSCRIPTION.PAYMENT.FAILED',
  DISPUTE_CREATED: 'CUSTOMER.DISPUTE.CREATED',
  DISPUTE_RESOLVED: 'CUSTOMER.DISPUTE.RESOLVED',
} as const;

export type PayPalEventType = typeof PAYPAL_EVENT_TYPES[keyof typeof PAYPAL_EVENT_TYPES];

/**
 * Webhook log status values
 */
export type WebhookLogStatus = 'received' | 'processed' | 'failed';

/**
 * Type guard to check if event type is supported
 */
export function isSupportedEventType(eventType: string): eventType is PayPalEventType {
  return Object.values(PAYPAL_EVENT_TYPES).includes(eventType as PayPalEventType);
}
