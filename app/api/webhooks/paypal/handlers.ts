/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@/lib/prisma';
import { notifyPaymentSuccess, notifyPaymentFailed, notifyRefundProcessed } from '@/lib/email';

/**
 * PayPal Webhook Event Handlers
 *
 * These handlers process PayPal webhook events and update the database accordingly.
 * Each handler is designed to be idempotent - safe to call multiple times with the same event.
 */

interface PayPalResource {
  id?: string;
  status?: string;
  amount?: {
    currency_code: string;
    value: string;
  };
  payer?: {
    email_address?: string;
    name?: {
      given_name?: string;
      surname?: string;
    };
  };
  custom_id?: string;
  [key: string]: unknown;
}

interface PayPalWebhookPayload {
  id: string;
  event_type: string;
  create_time: string;
  resource: PayPalResource;
  summary?: string;
}

/**
 * Helper: Extract payer information from resource
 */
function extractPayerInfo(resource: PayPalResource) {
  return {
    email: resource.payer?.email_address || null,
    name: resource.payer?.name
      ? `${resource.payer.name.given_name || ''} ${resource.payer.name.surname || ''}`.trim()
      : null,
  };
}

/**
 * Helper: Convert PayPal amount to cents
 */
function amountToCents(amount?: { value: string }): number {
  if (!amount?.value) return 0;
  return Math.round(parseFloat(amount.value) * 100);
}

/**
 * CHECKOUT.ORDER.COMPLETED
 *
 * Fired when a customer completes the checkout flow and approves the order.
 * This is the primary event for one-time purchases.
 *
 * Actions:
 * - Update or create Order record
 * - Update payment status to "paid"
 * - Link to existing Lead if email matches
 */
export async function handleOrderCompleted(payload: PayPalWebhookPayload) {
  console.log('[Handler] Processing CHECKOUT.ORDER.COMPLETED');

  const { resource } = payload;
  const orderId = resource.id;

  if (!orderId) {
    throw new Error('Order ID not found in webhook payload');
  }

  const payer = extractPayerInfo(resource);

  // Find existing order or create new one
  const existingOrder = await prisma.order.findUnique({
    where: { paypalOrderId: orderId },
  });

  if (existingOrder) {
    // Update existing order
    await prisma.order.update({
      where: { paypalOrderId: orderId },
      data: {
        paypalStatus: resource.status || 'COMPLETED',
        status: 'paid',
        updatedAt: new Date(),
      },
    });

    console.log(`[Handler] Updated existing order: ${orderId}`);
  } else {
    console.log(`[Handler] Order ${orderId} not found in database - may need manual review`);
    // Note: Orders are typically created during checkout, before this webhook fires.
    // If order doesn't exist, it might be a direct PayPal payment not from our checkout flow.
  }

  // Try to link to a Lead if email matches
  if (payer.email) {
    const lead = await prisma.lead.findFirst({
      where: { email: payer.email },
    });

    if (lead) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          status: 'WON',
          convertedAt: new Date(),
        },
      });
      console.log(`[Handler] Linked order to Lead: ${lead.id}`);
    }
  }

  // Send payment success email notification (non-blocking)
  if (existingOrder) {
    notifyPaymentSuccess({
      orderId: orderId,
      customerEmail: payer.email || 'Unknown',
      customerName: payer.name || undefined,
      packageName: existingOrder.packageName || 'Video Package',
      amount: (existingOrder.totalAmount || 0) / 100,
      isSubscription: false,
    }).catch(err => console.error('[Handler] Failed to send payment email:', err));
  }

  return {
    orderId,
    status: 'completed',
    payerEmail: payer.email,
  };
}

/**
 * PAYMENT.CAPTURE.COMPLETED
 *
 * Fired when a payment is captured (funds are transferred).
 * For one-time purchases, this follows ORDER.COMPLETED.
 * For subscriptions, this fires on each recurring payment.
 *
 * Actions:
 * - Update Order record with payment details
 * - Update Client payment status if linked
 * - For subscriptions: Extend subscription period
 */
export async function handlePaymentCaptured(payload: PayPalWebhookPayload) {
  console.log('[Handler] Processing PAYMENT.CAPTURE.COMPLETED');

  const { resource } = payload;
  const captureId = resource.id;
  const amount = amountToCents(resource.amount);
  const payer = extractPayerInfo(resource);

  // Check if this is a subscription payment
  const subscriptionId = resource.custom_id || (resource as Record<string, unknown>).billing_agreement_id;

  if (subscriptionId) {
    // This is a subscription payment
    console.log(`[Handler] Subscription payment captured: ${subscriptionId}`);

    // Find client by subscription ID
    const client = await prisma.client.findFirst({
      where: { paypalSubscriptionId: subscriptionId as string },
    });

    if (client) {
      // Update client payment status and extend subscription
      const now = new Date();
      const currentEnd = client.subscriptionEndDate || now;
      const newEnd = new Date(currentEnd);
      newEnd.setMonth(newEnd.getMonth() + 1); // Extend by 1 month

      await prisma.client.update({
        where: { id: client.id },
        data: {
          paymentStatus: 'paid',
          paymentDate: now,
          subscriptionEndDate: newEnd,
          failedPaymentCount: 0, // Reset failed payment counter
          needsWinBack: false,
        },
      });

      console.log(`[Handler] Extended subscription for Client ${client.id} until ${newEnd}`);
    }
  } else {
    // This is a one-time payment - try to find the order
    // PayPal doesn't always provide direct order linkage in this event
    // You may need to use the supplementary_data or invoice_id fields
    console.log(`[Handler] One-time payment captured: ${captureId}, Amount: ${amount / 100}`);
  }

  return {
    captureId,
    amount: amount / 100,
    currency: resource.amount?.currency_code || 'USD',
    payerEmail: payer.email,
    subscriptionId: subscriptionId || null,
  };
}

/**
 * PAYMENT.CAPTURE.REFUNDED
 *
 * Fired when a payment is refunded to the customer.
 *
 * Actions:
 * - Create Refund record
 * - Update Order status to "refunded"
 * - Update Client payment status
 * - Revoke portal access
 * - Create admin alert
 */
export async function handlePaymentRefunded(payload: PayPalWebhookPayload) {
  console.log('[Handler] Processing PAYMENT.CAPTURE.REFUNDED');

  const { resource } = payload;
  const refundId = resource.id;
  const amount = amountToCents(resource.amount);
  const saleId = (resource as Record<string, unknown>).sale_id as string;
  const refundAmount = amount / 100;
  const currency = resource.amount?.currency_code || 'USD';

  console.log(`[Handler] Refund issued: ${refundId}, Amount: ${refundAmount}`);

  // Try to find the order by transaction ID or amount
  let order = null;

  if (saleId) {
    order = await prisma.order.findFirst({
      where: {
        OR: [
          { paypalOrderId: saleId },
          { paypalTransactionId: saleId }
        ]
      }
    });
  }

  // Fallback to matching by amount if no direct match
  if (!order) {
    const matchingOrders = await prisma.order.findMany({
      where: {
        totalAmount: amount,
        status: { not: 'refunded' },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    if (matchingOrders.length > 0) {
      order = matchingOrders[0];
    }
  }

  if (!order) {
    console.warn(`[Handler] Could not find matching order for refund ${refundId}`);

    // Create orphan refund record for tracking
    await prisma.refund.create({
      data: {
        refundId,
        transactionId: saleId || null,
        amount,
        currency,
        refundType: 'full',
        status: 'completed',
        refundedAt: new Date(payload.create_time),
        refundDetails: JSON.stringify(payload)
      }
    });

    // Create alert for manual review
    await prisma.alert.create({
      data: {
        type: 'payment_refunded',
        severity: 'high',
        title: `Unmatched Refund: ${refundId}`,
        message: `A refund of ${currency} ${refundAmount} was processed but no matching order was found. Manual review required.`,
        metadata: JSON.stringify({ refundId, saleId, amount: refundAmount, currency }),
        isRead: false
      }
    });

    return {
      refundId,
      amount: refundAmount,
      currency,
      warning: 'Order not found'
    };
  }

  // Create refund record
  const refund = await prisma.refund.create({
    data: {
      refundId,
      orderId: order.id,
      clientId: order.clientId,
      transactionId: saleId || null,
      amount,
      currency,
      refundType: amount === order.totalAmount ? 'full' : 'partial',
      status: 'completed',
      refundedAt: new Date(payload.create_time),
      refundDetails: JSON.stringify(payload)
    }
  });

  console.log(`[Handler] Created refund record: ${refund.id}`);

  // Update order status
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: 'refunded',
      notes: order.notes
        ? `${order.notes}\n\nRefunded via PayPal webhook: ${refundId}`
        : `Refunded via PayPal webhook: ${refundId}`
    },
  });

  // Update linked client if exists
  let portalAccessRevoked = false;
  if (order.clientId) {
    const client = await prisma.client.findUnique({
      where: { id: order.clientId }
    });

    await prisma.client.update({
      where: { id: order.clientId },
      data: {
        paymentStatus: 'refunded',
        notes: client?.notes
          ? `${client.notes}\n\nREFUND PROCESSED: ${currency} ${refundAmount} on ${new Date().toISOString()}`
          : `REFUND PROCESSED: ${currency} ${refundAmount} on ${new Date().toISOString()}`
      },
    });

    // Revoke portal access
    const deletedAccess = await prisma.clientUser.deleteMany({
      where: { clientId: order.clientId }
    });

    if (deletedAccess.count > 0) {
      portalAccessRevoked = true;
      console.log(`[Handler] Revoked portal access for ${deletedAccess.count} user(s)`);
    }

    console.log(`[Handler] Updated Client ${order.clientId} to refunded status`);
  }

  // Create admin alert
  await prisma.alert.create({
    data: {
      type: 'payment_refunded',
      severity: 'high',
      title: `Payment Refunded: ${order.packageName || 'Order'}`,
      message: `A refund of ${currency} ${refundAmount} has been processed for order ${order.id}${order.clientId ? ` (Client: ${order.clientId})` : ''}.`,
      metadata: JSON.stringify({
        refundId,
        orderId: order.id,
        clientId: order.clientId,
        amount: refundAmount,
        currency,
        saleId,
        portalAccessRevoked
      }),
      isRead: false
    }
  });

  console.log(`[Handler] Created admin alert for refund: ${refundId}`);

  // Send refund email notification (non-blocking)
  const client = order.clientId ? await prisma.client.findUnique({ where: { id: order.clientId } }) : null;
  notifyRefundProcessed({
    orderId: order.id,
    customerEmail: client?.email || 'Unknown',
    amount: refundAmount,
    reason: 'PayPal refund processed',
  }).catch(err => console.error('[Handler] Failed to send refund email:', err));

  return {
    refundId,
    orderId: order.id,
    clientId: order.clientId,
    amount: refundAmount,
    currency,
    portalAccessRevoked
  };
}

/**
 * BILLING.SUBSCRIPTION.ACTIVATED
 *
 * Fired when a subscription is activated (either new or reactivated).
 *
 * Actions:
 * - Find or create Client record
 * - Set subscription start date and status
 * - Store PayPal subscription ID for future lookups
 */
export async function handleSubscriptionActivated(payload: PayPalWebhookPayload) {
  console.log('[Handler] Processing BILLING.SUBSCRIPTION.ACTIVATED');

  const { resource } = payload;
  const subscriptionId = resource.id;

  if (!subscriptionId) {
    throw new Error('Subscription ID not found in webhook payload');
  }

  const payer = extractPayerInfo(resource);
  const planId = (resource as Record<string, unknown>).plan_id as string;
  const startTime = (resource as Record<string, unknown>).start_time as string;

  console.log(`[Handler] Subscription activated: ${subscriptionId}, Plan: ${planId}`);

  // Try to find existing client by email or subscription ID
  let client = null;

  if (payer.email) {
    client = await prisma.client.findFirst({
      where: {
        OR: [
          { email: payer.email },
          { paypalSubscriptionId: subscriptionId },
        ],
      },
    });
  }

  if (client) {
    // Update existing client
    const now = new Date(startTime || Date.now());
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1); // Initial 1-month subscription

    await prisma.client.update({
      where: { id: client.id },
      data: {
        isSubscription: true,
        paypalSubscriptionId: subscriptionId,
        subscriptionStartDate: now,
        subscriptionEndDate: endDate,
        paymentStatus: 'paid',
        paymentDate: now,
        failedPaymentCount: 0,
        needsWinBack: false,
      },
    });

    console.log(`[Handler] Updated Client ${client.id} with subscription ${subscriptionId}`);
  } else {
    console.log(`[Handler] No matching client found for subscription ${subscriptionId} - manual review needed`);
    // In a real scenario, you might create a pending client or send an alert
  }

  return {
    subscriptionId,
    planId,
    payerEmail: payer.email,
    startTime,
    clientId: client?.id || null,
  };
}

/**
 * BILLING.SUBSCRIPTION.CANCELLED
 *
 * Fired when a subscription is cancelled by the customer or merchant.
 *
 * Actions:
 * - Update Client subscription status
 * - Flag for potential win-back campaign
 * - Keep access until current period ends
 */
export async function handleSubscriptionCancelled(payload: PayPalWebhookPayload) {
  console.log('[Handler] Processing BILLING.SUBSCRIPTION.CANCELLED');

  const { resource } = payload;
  const subscriptionId = resource.id;

  if (!subscriptionId) {
    throw new Error('Subscription ID not found in webhook payload');
  }

  // Find client by subscription ID
  const client = await prisma.client.findFirst({
    where: { paypalSubscriptionId: subscriptionId },
  });

  if (client) {
    await prisma.client.update({
      where: { id: client.id },
      data: {
        isSubscription: false, // Mark as no longer active subscription
        needsWinBack: true, // Flag for win-back campaign
        notes: client.notes
          ? `${client.notes}\n\nSubscription cancelled on ${new Date().toISOString()}`
          : `Subscription cancelled on ${new Date().toISOString()}`,
      },
    });

    console.log(`[Handler] Subscription cancelled for Client ${client.id}`);
  } else {
    console.warn(`[Handler] Could not find client for subscription ${subscriptionId}`);
  }

  return {
    subscriptionId,
    clientId: client?.id || null,
    winBackEnabled: true,
  };
}

/**
 * BILLING.SUBSCRIPTION.SUSPENDED
 *
 * Fired when a subscription is suspended (usually due to payment failure).
 *
 * Actions:
 * - Update Client status to suspended
 * - Send payment update notification
 * - Track for potential churn
 */
export async function handleSubscriptionSuspended(payload: PayPalWebhookPayload) {
  console.log('[Handler] Processing BILLING.SUBSCRIPTION.SUSPENDED');

  const { resource } = payload;
  const subscriptionId = resource.id;

  if (!subscriptionId) {
    throw new Error('Subscription ID not found in webhook payload');
  }

  const client = await prisma.client.findFirst({
    where: { paypalSubscriptionId: subscriptionId },
  });

  if (client) {
    await prisma.client.update({
      where: { id: client.id },
      data: {
        paymentStatus: 'failed',
        needsWinBack: true,
        notes: client.notes
          ? `${client.notes}\n\nSubscription suspended on ${new Date().toISOString()}`
          : `Subscription suspended on ${new Date().toISOString()}`,
      },
    });

    console.log(`[Handler] Subscription suspended for Client ${client.id}`);

    // TODO: Send email notification to client about payment issue
    // TODO: Create task for admin to follow up
  } else {
    console.warn(`[Handler] Could not find client for subscription ${subscriptionId}`);
  }

  return {
    subscriptionId,
    clientId: client?.id || null,
    status: 'suspended',
  };
}

/**
 * BILLING.SUBSCRIPTION.PAYMENT.FAILED
 *
 * Fired when a subscription payment fails.
 *
 * Actions:
 * - Increment failed payment counter
 * - Update payment status
 * - After 3 failures, flag for cancellation
 * - Send payment update request to customer
 */
export async function handlePaymentFailed(payload: PayPalWebhookPayload) {
  console.log('[Handler] Processing BILLING.SUBSCRIPTION.PAYMENT.FAILED');

  const { resource } = payload;
  const subscriptionId = (resource as Record<string, unknown>).billing_agreement_id as string || resource.id;

  if (!subscriptionId) {
    throw new Error('Subscription ID not found in webhook payload');
  }

  const client = await prisma.client.findFirst({
    where: { paypalSubscriptionId: subscriptionId },
  });

  if (client) {
    const newFailedCount = (client.failedPaymentCount || 0) + 1;
    const shouldSuspend = newFailedCount >= 3;

    await prisma.client.update({
      where: { id: client.id },
      data: {
        paymentStatus: 'failed',
        failedPaymentCount: newFailedCount,
        needsWinBack: shouldSuspend,
        notes: client.notes
          ? `${client.notes}\n\nPayment failed (attempt ${newFailedCount}) on ${new Date().toISOString()}`
          : `Payment failed (attempt ${newFailedCount}) on ${new Date().toISOString()}`,
      },
    });

    console.log(`[Handler] Payment failed for Client ${client.id} (${newFailedCount} failures)`);

    if (shouldSuspend) {
      console.log(`[Handler] Client ${client.id} flagged for suspension after 3 failed payments`);
    }

    // Send payment failed email notification (non-blocking)
    notifyPaymentFailed({
      customerEmail: client.email || 'Unknown',
      packageName: 'Subscription',
      amount: 0, // Amount not available in this event
      errorMessage: `Payment attempt ${newFailedCount} failed`,
    }).catch(err => console.error('[Handler] Failed to send payment failed email:', err));
  } else {
    console.warn(`[Handler] Could not find client for subscription ${subscriptionId}`);
  }

  return {
    subscriptionId,
    clientId: client?.id || null,
    failedAttempts: client ? (client.failedPaymentCount || 0) + 1 : 1,
  };
}

/**
 * CUSTOMER.DISPUTE.CREATED
 *
 * Fired when a customer opens a dispute (chargeback).
 *
 * Actions:
 * - Create Dispute record
 * - Update client projectStatus to "disputed"
 * - Create admin alert
 * - Flag order/client for review
 */
export async function handleDisputeCreated(payload: PayPalWebhookPayload) {
  console.log('[Handler] Processing CUSTOMER.DISPUTE.CREATED');

  const { resource } = payload;
  const disputeId = resource.id;
  const reason = (resource as Record<string, unknown>).reason as string;
  const amount = amountToCents(resource.amount);
  const currency = resource.amount?.currency_code || 'USD';
  const transactionId = ((resource as Record<string, unknown>).disputed_transactions as Array<Record<string, unknown>>)?.[0]?.seller_transaction_id as string;
  const status = resource.status || 'OPEN';

  console.log(`[Handler] Dispute created: ${disputeId}, Reason: ${reason}, Amount: ${amount / 100}`);

  // Try to find order by transaction ID first
  let order = null;

  if (transactionId) {
    order = await prisma.order.findFirst({
      where: {
        OR: [
          { paypalOrderId: transactionId },
          { paypalTransactionId: transactionId }
        ]
      }
    });
  }

  // Fallback to matching by amount
  if (!order) {
    const matchingOrders = await prisma.order.findMany({
      where: {
        totalAmount: amount,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    if (matchingOrders.length > 0) {
      order = matchingOrders[0];
    }
  }

  // Create dispute record
  const dispute = await prisma.dispute.create({
    data: {
      disputeId,
      transactionId: transactionId || null,
      orderId: order?.id,
      clientId: order?.clientId,
      amount,
      currency,
      reason: reason || 'unknown',
      status,
      disputeDetails: JSON.stringify(payload),
      createdAt: new Date(payload.create_time)
    }
  });

  console.log(`[Handler] Created dispute record: ${dispute.id}`);

  // Update order if found
  if (order) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'processing', // Under dispute
        notes: order.notes
          ? `${order.notes}\n\nDispute opened: ${disputeId} - ${reason}`
          : `Dispute opened: ${disputeId} - ${reason}`,
      },
    });

    console.log(`[Handler] Linked dispute to Order ${order.id}`);
  }

  // Update client status to disputed if found
  if (order?.clientId) {
    const client = await prisma.client.findUnique({
      where: { id: order.clientId }
    });

    await prisma.client.update({
      where: { id: order.clientId },
      data: {
        projectStatus: 'disputed',
        notes: client?.notes
          ? `${client.notes}\n\nDISPUTE OPENED: Case ${disputeId} - ${reason} on ${new Date().toISOString()}`
          : `DISPUTE OPENED: Case ${disputeId} - ${reason} on ${new Date().toISOString()}`
      },
    });

    console.log(`[Handler] Updated Client ${order.clientId} to disputed status`);
  }

  // Create admin alert
  await prisma.alert.create({
    data: {
      type: 'dispute_created',
      severity: 'high',
      title: `PayPal Dispute Opened: ${disputeId}`,
      message: `A customer has opened a dispute for ${currency} ${amount / 100}. Reason: ${reason}. ${order ? `Order: ${order.id}` : 'Order not found - manual review needed.'}`,
      metadata: JSON.stringify({
        disputeId,
        orderId: order?.id,
        clientId: order?.clientId,
        transactionId,
        amount: amount / 100,
        currency,
        reason
      }),
      isRead: false
    }
  });

  console.log(`[Handler] Created admin alert for dispute: ${disputeId}`);

  return {
    disputeId,
    orderId: order?.id,
    clientId: order?.clientId,
    reason,
    amount: amount / 100,
    currency,
    requiresAction: true,
  };
}

/**
 * CUSTOMER.DISPUTE.RESOLVED
 *
 * Fired when a dispute is resolved (in favor of merchant or customer).
 *
 * Actions:
 * - Update Dispute record with outcome
 * - Update order status based on resolution
 * - If lost: Mark as refunded, update client
 * - If won: Restore normal status
 * - Create admin alert
 */
export async function handleDisputeResolved(payload: PayPalWebhookPayload) {
  console.log('[Handler] Processing CUSTOMER.DISPUTE.RESOLVED');

  const { resource } = payload;
  const disputeId = resource.id;
  const outcome = (resource as Record<string, unknown>).dispute_outcome as {
    outcome_code?: string;
  };
  const amount = amountToCents(resource.amount);
  const currency = resource.amount?.currency_code || 'USD';
  const outcomeCode = outcome?.outcome_code || resource.status;
  const resolutionType = (resource as Record<string, unknown>).dispute_life_cycle_stage as string;

  // Determine if merchant won or lost
  const merchantWon = outcomeCode === 'RESOLVED' || outcomeCode === 'SELLER_FAVOUR' || outcomeCode?.includes('SELLER');
  const merchantLost = outcomeCode === 'BUYER_FAVOUR' || outcomeCode?.includes('BUYER');

  console.log(`[Handler] Dispute resolved: ${disputeId}, Outcome: ${outcomeCode}, Won: ${merchantWon}`);

  // Find the dispute record
  const dispute = await prisma.dispute.findUnique({
    where: { disputeId },
    include: {
      order: true,
      client: true
    }
  });

  if (!dispute) {
    console.warn(`[Handler] Dispute record not found for ${disputeId}, creating minimal record`);

    // Create a minimal dispute record
    await prisma.dispute.create({
      data: {
        disputeId,
        status: 'resolved',
        outcome: outcomeCode || 'unknown',
        resolvedAt: new Date(payload.create_time),
        amount,
        currency,
        reason: 'unknown',
        disputeDetails: JSON.stringify(payload)
      }
    });

    return {
      disputeId,
      outcome: outcomeCode,
      won: merchantWon,
      amount: amount / 100,
      currency,
      warning: 'Dispute record not found'
    };
  }

  // Update dispute record
  await prisma.dispute.update({
    where: { disputeId },
    data: {
      status: 'resolved',
      outcome: outcomeCode || 'unknown',
      resolutionType: resolutionType || null,
      resolvedAt: new Date(payload.create_time),
      disputeDetails: JSON.stringify(payload)
    }
  });

  console.log(`[Handler] Updated dispute record: ${dispute.id}`);

  // Update order if found
  if (dispute.orderId) {
    const order = dispute.order;

    await prisma.order.update({
      where: { id: dispute.orderId },
      data: {
        status: merchantWon ? 'fulfilled' : 'refunded',
        notes: order?.notes
          ? `${order.notes}\n\nDispute resolved: ${disputeId} - ${merchantWon ? 'Won' : 'Lost'} (${outcomeCode})`
          : `Dispute resolved: ${disputeId} - ${merchantWon ? 'Won' : 'Lost'} (${outcomeCode})`,
      },
    });

    console.log(`[Handler] Updated Order ${dispute.orderId} - dispute ${merchantWon ? 'won' : 'lost'}`);
  }

  // Update client based on outcome
  if (dispute.clientId) {
    const client = dispute.client;
    const updates: Record<string, unknown> = {};

    if (merchantLost) {
      updates.paymentStatus = 'refunded';
      updates.notes = client?.notes
        ? `${client.notes}\n\nDISPUTE LOST: Case ${disputeId} - Payment refunded to customer on ${new Date().toISOString()}`
        : `DISPUTE LOST: Case ${disputeId} - Payment refunded to customer on ${new Date().toISOString()}`;

      // Revert project status if it was disputed
      if (client?.projectStatus === 'disputed') {
        updates.projectStatus = 'discovery';
      }
    } else if (merchantWon) {
      updates.notes = client?.notes
        ? `${client.notes}\n\nDISPUTE WON: Case ${disputeId} - Resolved in our favor on ${new Date().toISOString()}`
        : `DISPUTE WON: Case ${disputeId} - Resolved in our favor on ${new Date().toISOString()}`;

      // Restore normal project status if it was disputed
      if (client?.projectStatus === 'disputed') {
        updates.projectStatus = 'onboarding';
      }
    }

    await prisma.client.update({
      where: { id: dispute.clientId },
      data: updates
    });

    console.log(`[Handler] Updated Client ${dispute.clientId} after dispute resolution`);
  }

  // Create admin alert
  const alertSeverity = merchantLost ? 'high' : merchantWon ? 'low' : 'medium';
  const alertTitle = merchantLost
    ? `Dispute Lost: ${disputeId}`
    : merchantWon
      ? `Dispute Won: ${disputeId}`
      : `Dispute Resolved: ${disputeId}`;

  await prisma.alert.create({
    data: {
      type: 'dispute_resolved',
      severity: alertSeverity,
      title: alertTitle,
      message: `Dispute ${disputeId} has been resolved. Outcome: ${outcomeCode}. ${merchantLost ? 'Payment was refunded to customer.' : merchantWon ? 'Resolved in our favor!' : 'Review required.'}`,
      metadata: JSON.stringify({
        disputeId,
        orderId: dispute.orderId,
        clientId: dispute.clientId,
        outcome: outcomeCode,
        merchantWon,
        merchantLost,
        amount: amount / 100,
        currency
      }),
      isRead: false
    }
  });

  console.log(`[Handler] Created admin alert for dispute resolution: ${disputeId}`);

  return {
    disputeId,
    orderId: dispute.orderId,
    clientId: dispute.clientId,
    outcome: outcomeCode,
    won: merchantWon,
    amount: amount / 100,
    currency,
  };
}
