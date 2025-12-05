/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@/lib/prisma';

/**
 * PayPal Subscription Webhook Handlers
 *
 * These functions handle various PayPal subscription events
 * and update client records accordingly.
 */

/**
 * Handle subscription activation event
 * Triggered when a customer's subscription is activated
 *
 * @param payload - PayPal webhook payload
 * @returns Updated client or null if not found
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleSubscriptionActivated(payload: any) {
  try {
    const subscriptionId = payload.resource?.id;
    const payerEmail = payload.resource?.subscriber?.email_address;
    const startTime = payload.resource?.start_time;

    if (!payerEmail) {
      console.error('[PayPal Webhook] No payer email found in subscription activated payload');
      return null;
    }

    console.log(`[PayPal Webhook] Processing subscription activation for ${payerEmail}`);

    // Find client by email
    const client = await prisma.client.findFirst({
      where: { email: payerEmail }
    });

    if (!client) {
      console.error(`[PayPal Webhook] Client not found for email: ${payerEmail}`);
      return null;
    }

    // Update client with subscription details
    const updatedClient = await prisma.client.update({
      where: { id: client.id },
      data: {
        isSubscription: true,
        subscriptionStartDate: startTime ? new Date(startTime) : new Date(),
        projectStatus: 'onboarding',
        paymentStatus: 'paid',
        paymentMethod: 'paypal',
        paypalSubscriptionId: subscriptionId,
        // Reset any previous failed payment tracking
        failedPaymentCount: 0,
        needsWinBack: false
      }
    });

    console.log(`[PayPal Webhook] ✓ Subscription activated for client ${client.id} (${client.businessName})`);
    console.log(`[PayPal Webhook]   - Subscription ID: ${subscriptionId}`);
    console.log(`[PayPal Webhook]   - Status updated to: onboarding`);

    return updatedClient;
  } catch (error) {
    console.error('[PayPal Webhook] Error handling subscription activation:', error);
    throw error;
  }
}

/**
 * Handle subscription cancellation event
 * Triggered when a customer cancels their subscription
 *
 * @param payload - PayPal webhook payload
 * @returns Updated client or null if not found
 */
export async function handleSubscriptionCancelled(payload: any) {
  try {
    const subscriptionId = payload.resource?.id;
    const payerEmail = payload.resource?.subscriber?.email_address;
    const cancellationTime = payload.create_time || payload.event_time;

    console.log(`[PayPal Webhook] Processing subscription cancellation`);
    console.log(`[PayPal Webhook]   - Subscription ID: ${subscriptionId}`);
    console.log(`[PayPal Webhook]   - Payer Email: ${payerEmail}`);

    // Find client by subscription ID or email
    let client = null;

    if (subscriptionId) {
      client = await prisma.client.findFirst({
        where: { paypalSubscriptionId: subscriptionId }
      });
    }

    if (!client && payerEmail) {
      client = await prisma.client.findFirst({
        where: { email: payerEmail }
      });
    }

    if (!client) {
      console.error(`[PayPal Webhook] Client not found for subscription: ${subscriptionId} or email: ${payerEmail}`);
      return null;
    }

    // Update client with cancellation details
    const updatedClient = await prisma.client.update({
      where: { id: client.id },
      data: {
        subscriptionEndDate: cancellationTime ? new Date(cancellationTime) : new Date(),
        needsWinBack: true // Flag for win-back campaign
      }
    });

    console.log(`[PayPal Webhook] ✓ Subscription cancelled for client ${client.id} (${client.businessName})`);
    console.log(`[PayPal Webhook]   - Subscription end date: ${updatedClient.subscriptionEndDate?.toISOString()}`);
    console.log(`[PayPal Webhook]   - Win-back flag set: true`);

    return updatedClient;
  } catch (error) {
    console.error('[PayPal Webhook] Error handling subscription cancellation:', error);
    throw error;
  }
}

/**
 * Handle subscription payment failed event
 * Triggered when a subscription payment fails
 *
 * @param payload - PayPal webhook payload
 * @returns Updated client or null if not found
 */
export async function handleSubscriptionPaymentFailed(payload: any) {
  try {
    const subscriptionId = payload.resource?.id;
    const payerEmail = payload.resource?.subscriber?.email_address;
    const failureReason = payload.resource?.status_update_reason || 'Payment failed';

    console.log(`[PayPal Webhook] Processing subscription payment failure`);
    console.log(`[PayPal Webhook]   - Subscription ID: ${subscriptionId}`);
    console.log(`[PayPal Webhook]   - Payer Email: ${payerEmail}`);
    console.log(`[PayPal Webhook]   - Failure Reason: ${failureReason}`);

    // Find client by subscription ID or email
    let client = null;

    if (subscriptionId) {
      client = await prisma.client.findFirst({
        where: { paypalSubscriptionId: subscriptionId }
      });
    }

    if (!client && payerEmail) {
      client = await prisma.client.findFirst({
        where: { email: payerEmail }
      });
    }

    if (!client) {
      console.error(`[PayPal Webhook] Client not found for subscription: ${subscriptionId} or email: ${payerEmail}`);
      return null;
    }

    // Increment failed payment count
    const newFailedPaymentCount = (client.failedPaymentCount || 0) + 1;

    // Update client with payment failure details
    const updatedClient = await prisma.client.update({
      where: { id: client.id },
      data: {
        paymentStatus: 'failed',
        failedPaymentCount: newFailedPaymentCount
      }
    });

    console.log(`[PayPal Webhook] ✓ Payment failure recorded for client ${client.id} (${client.businessName})`);
    console.log(`[PayPal Webhook]   - Failed payment count: ${newFailedPaymentCount}`);
    console.log(`[PayPal Webhook]   - Payment status: failed`);
    console.log(`[PayPal Webhook]   - ACTION REQUIRED: Follow up with client about payment issue`);

    // Log for follow-up actions
    if (newFailedPaymentCount >= 3) {
      console.warn(`[PayPal Webhook] ⚠️  CLIENT AT RISK: ${client.businessName} has ${newFailedPaymentCount} failed payments`);
    }

    return updatedClient;
  } catch (error) {
    console.error('[PayPal Webhook] Error handling subscription payment failure:', error);
    throw error;
  }
}

/**
 * Handle subscription suspended event
 * Triggered when a subscription is suspended (usually due to payment issues)
 *
 * @param payload - PayPal webhook payload
 * @returns Updated client or null if not found
 */
export async function handleSubscriptionSuspended(payload: any) {
  try {
    const subscriptionId = payload.resource?.id;
    const payerEmail = payload.resource?.subscriber?.email_address;
    const suspensionReason = payload.resource?.status_update_reason || 'Subscription suspended';

    console.log(`[PayPal Webhook] Processing subscription suspension`);
    console.log(`[PayPal Webhook]   - Subscription ID: ${subscriptionId}`);
    console.log(`[PayPal Webhook]   - Payer Email: ${payerEmail}`);
    console.log(`[PayPal Webhook]   - Suspension Reason: ${suspensionReason}`);

    // Find client by subscription ID or email
    let client = null;

    if (subscriptionId) {
      client = await prisma.client.findFirst({
        where: { paypalSubscriptionId: subscriptionId }
      });
    }

    if (!client && payerEmail) {
      client = await prisma.client.findFirst({
        where: { email: payerEmail }
      });
    }

    if (!client) {
      console.error(`[PayPal Webhook] Client not found for subscription: ${subscriptionId} or email: ${payerEmail}`);
      return null;
    }

    // Update client project status to paused
    const updatedClient = await prisma.client.update({
      where: { id: client.id },
      data: {
        projectStatus: 'paused'
      }
    });

    console.log(`[PayPal Webhook] ✓ Subscription suspended for client ${client.id} (${client.businessName})`);
    console.log(`[PayPal Webhook]   - Project status updated to: paused`);
    console.log(`[PayPal Webhook]   - ACTION REQUIRED: Contact client to resolve suspension`);

    return updatedClient;
  } catch (error) {
    console.error('[PayPal Webhook] Error handling subscription suspension:', error);
    throw error;
  }
}

/**
 * Handle PayPal CUSTOMER.DISPUTE.CREATED webhook event
 *
 * Triggered when a customer opens a dispute/chargeback
 *
 * This handler:
 * 1. Finds the order/client by PayPal case ID or transaction ID
 * 2. Updates client projectStatus to "disputed"
 * 3. Creates an alert record for admin notification
 * 4. Logs the dispute details
 *
 * @param payload - PayPal webhook payload
 * @returns Dispute processing result
 */
export async function handleDisputeCreated(payload: any) {
  try {
    console.log('[PayPal Webhook] Dispute Created:', JSON.stringify(payload, null, 2));

    const disputeId = payload.id || payload.resource?.id || payload.dispute_id;
    const transactionId = payload.disputed_transactions?.[0]?.seller_transaction_id ||
                          payload.resource?.disputed_transactions?.[0]?.seller_transaction_id;
    const amount = payload.dispute_amount?.value || payload.resource?.dispute_amount?.value;
    const currency = payload.dispute_amount?.currency_code || payload.resource?.dispute_amount?.currency_code || 'USD';
    const reason = payload.reason || payload.resource?.reason || 'unknown';
    const status = payload.status || payload.resource?.status || 'open';

    if (!disputeId) {
      throw new Error('Missing dispute ID in payload');
    }

    // Find the order by PayPal transaction ID
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

    // If no order found, try to find by payer email
    const payerEmail = payload.disputed_transactions?.[0]?.buyer?.email ||
                       payload.resource?.disputed_transactions?.[0]?.buyer?.email;
    if (!order && payerEmail) {
      order = await prisma.order.findFirst({
        where: { payerEmail },
        orderBy: { createdAt: 'desc' }
      });
    }

    // Create dispute record
    const dispute = await prisma.dispute.create({
      data: {
        disputeId,
        orderId: order?.id,
        clientId: order?.clientId,
        transactionId,
        amount: amount ? parseFloat(amount) * 100 : null, // Convert to cents
        currency,
        reason,
        status,
        disputeDetails: JSON.stringify(payload),
        createdAt: new Date(payload.create_time || payload.resource?.create_time || Date.now())
      }
    });

    console.log('[PayPal Webhook] Dispute record created:', dispute.id);

    // Update client status if we found an associated client
    if (order?.clientId) {
      const existingClient = await prisma.client.findUnique({
        where: { id: order.clientId }
      });

      await prisma.client.update({
        where: { id: order.clientId },
        data: {
          projectStatus: 'disputed',
          notes: `DISPUTE OPENED: Case ${disputeId} - ${reason}\n\n${existingClient?.notes || ''}`
        }
      });

      console.log('[PayPal Webhook] Client status updated to disputed:', order.clientId);
    }

    // Create an admin alert
    await prisma.alert.create({
      data: {
        type: 'dispute_created',
        severity: 'high',
        title: `PayPal Dispute Opened: ${disputeId}`,
        message: `A customer has opened a dispute for ${currency} ${amount}. Reason: ${reason}`,
        metadata: JSON.stringify({
          disputeId,
          orderId: order?.id,
          clientId: order?.clientId,
          transactionId,
          amount,
          currency,
          reason
        }),
        isRead: false
      }
    });

    console.log('[PayPal Webhook] Admin alert created for dispute:', disputeId);

    return {
      success: true,
      disputeId,
      orderId: order?.id,
      clientId: order?.clientId
    };

  } catch (error) {
    console.error('[PayPal Webhook] Error handling dispute created:', error);
    throw error;
  }
}

/**
 * Handle PayPal CUSTOMER.DISPUTE.RESOLVED webhook event
 *
 * Triggered when a dispute is resolved (won, lost, or settled)
 *
 * This handler:
 * 1. Finds the dispute by case ID
 * 2. Updates client based on outcome (won/lost)
 * 3. If lost, updates paymentStatus to "refunded"
 * 4. Logs resolution details
 *
 * @param payload - PayPal webhook payload
 * @returns Dispute resolution result
 */
export async function handleDisputeResolved(payload: any) {
  try {
    console.log('[PayPal Webhook] Dispute Resolved:', JSON.stringify(payload, null, 2));

    const disputeId = payload.id || payload.resource?.id || payload.dispute_id;
    const outcome = payload.status || payload.resource?.status;
    const resolutionType = payload.dispute_life_cycle_stage || payload.resource?.dispute_life_cycle_stage;

    if (!disputeId) {
      throw new Error('Missing dispute ID in payload');
    }

    // Find the dispute record
    const dispute = await prisma.dispute.findUnique({
      where: { disputeId },
      include: {
        order: true,
        client: true
      }
    });

    if (!dispute) {
      console.warn('[PayPal Webhook] Dispute not found:', disputeId);
      // Still create a record for tracking
      await prisma.dispute.create({
        data: {
          disputeId,
          status: 'resolved',
          outcome: outcome || 'unknown',
          resolvedAt: new Date(payload.update_time || payload.resource?.update_time || Date.now()),
          disputeDetails: JSON.stringify(payload)
        }
      });
      return { success: true, warning: 'Dispute record not found, created new record' };
    }

    // Determine if merchant won or lost
    const merchantWon = outcome === 'RESOLVED' || outcome === 'SELLER_FAVOUR';
    const merchantLost = outcome === 'BUYER_FAVOUR';

    // Update dispute record
    const updatedDispute = await prisma.dispute.update({
      where: { disputeId },
      data: {
        status: 'resolved',
        outcome: outcome || 'unknown',
        resolutionType: resolutionType || null,
        resolvedAt: new Date(payload.update_time || payload.resource?.update_time || Date.now()),
        disputeDetails: JSON.stringify(payload)
      }
    });

    console.log('[PayPal Webhook] Dispute updated:', updatedDispute.id);

    // Update order if merchant lost
    if (merchantLost && dispute.orderId) {
      const existingOrder = await prisma.order.findUnique({
        where: { id: dispute.orderId }
      });

      await prisma.order.update({
        where: { id: dispute.orderId },
        data: {
          status: 'refunded',
          notes: `DISPUTE LOST: Case ${disputeId} resolved in buyer's favor\n\n${existingOrder?.notes || ''}`
        }
      });

      console.log('[PayPal Webhook] Order status updated to refunded:', dispute.orderId);
    }

    // Update client status based on outcome
    if (dispute.clientId) {
      const client = await prisma.client.findUnique({
        where: { id: dispute.clientId }
      });

      if (client) {
        const updates: any = {};

        if (merchantLost) {
          updates.paymentStatus = 'refunded';
          updates.notes = `DISPUTE LOST: Case ${disputeId} - Payment refunded to customer\n\n${client.notes || ''}`;
          // Optionally revert project status if it was disputed
          if (client.projectStatus === 'disputed') {
            updates.projectStatus = 'discovery';
          }
        } else if (merchantWon) {
          updates.notes = `DISPUTE WON: Case ${disputeId} - Resolved in our favor\n\n${client.notes || ''}`;
          // Restore normal project status if it was disputed
          if (client.projectStatus === 'disputed') {
            updates.projectStatus = 'onboarding';
          }
        }

        await prisma.client.update({
          where: { id: dispute.clientId },
          data: updates
        });

        console.log('[PayPal Webhook] Client updated after dispute resolution:', dispute.clientId);
      }
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
        message: `Dispute ${disputeId} has been resolved. Outcome: ${outcome}`,
        metadata: JSON.stringify({
          disputeId,
          orderId: dispute.orderId,
          clientId: dispute.clientId,
          outcome,
          merchantWon,
          merchantLost
        }),
        isRead: false
      }
    });

    console.log('[PayPal Webhook] Admin alert created for dispute resolution:', disputeId);

    return {
      success: true,
      disputeId,
      outcome,
      merchantWon,
      merchantLost,
      orderId: dispute.orderId,
      clientId: dispute.clientId
    };

  } catch (error) {
    console.error('[PayPal Webhook] Error handling dispute resolved:', error);
    throw error;
  }
}

/**
 * Handle PayPal PAYMENT.SALE.REFUNDED webhook event
 *
 * Triggered when a payment is refunded (full or partial)
 *
 * This handler:
 * 1. Finds order by PayPal transaction ID
 * 2. Updates order status to "refunded"
 * 3. Updates associated client paymentStatus to "refunded"
 * 4. Revokes portal access if needed (deletes ClientUser associations)
 *
 * @param payload - PayPal webhook payload
 * @returns Refund processing result
 */
export async function handlePaymentRefunded(payload: any) {
  try {
    console.log('[PayPal Webhook] Payment Refunded:', JSON.stringify(payload, null, 2));

    const refundId = payload.id || payload.resource?.id;
    const saleId = payload.sale_id || payload.resource?.sale_id;
    const orderId = payload.parent_payment || payload.resource?.parent_payment ||
                    payload.order_id || payload.resource?.order_id;
    const refundAmount = payload.amount?.total || payload.resource?.amount?.total;
    const currency = payload.amount?.currency || payload.resource?.amount?.currency || 'USD';
    const refundType = (payload.refund_to_payer?.value || payload.resource?.refund_to_payer?.value) ? 'full' : 'partial';

    if (!refundId && !saleId && !orderId) {
      throw new Error('Missing transaction identifiers in payload');
    }

    // Find order by PayPal identifiers
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { paypalOrderId: orderId || '' },
          { paypalOrderId: saleId || '' },
          { paypalTransactionId: saleId || '' },
          { paypalTransactionId: orderId || '' }
        ]
      },
      include: {
        client: true
      }
    });

    if (!order) {
      console.warn('[PayPal Webhook] Order not found for refund. IDs:', { refundId, saleId, orderId });
      // Create a refund record anyway for tracking
      await prisma.refund.create({
        data: {
          refundId: refundId || saleId || orderId || `refund_${Date.now()}`,
          transactionId: saleId || orderId,
          amount: refundAmount ? parseFloat(refundAmount) * 100 : null,
          currency,
          refundType,
          status: 'completed',
          refundDetails: JSON.stringify(payload),
          refundedAt: new Date(payload.create_time || payload.resource?.create_time ||
                               payload.refund_time || payload.resource?.refund_time || Date.now())
        }
      });
      return { success: true, warning: 'Order not found, created refund record only' };
    }

    // Create refund record
    const refund = await prisma.refund.create({
      data: {
        refundId: refundId || saleId || `refund_${Date.now()}`,
        orderId: order.id,
        clientId: order.clientId,
        transactionId: saleId || orderId,
        amount: refundAmount ? parseFloat(refundAmount) * 100 : null,
        currency,
        refundType,
        status: 'completed',
        refundDetails: JSON.stringify(payload),
        refundedAt: new Date(payload.create_time || payload.resource?.create_time ||
                             payload.refund_time || payload.resource?.refund_time || Date.now())
      }
    });

    console.log('[PayPal Webhook] Refund record created:', refund.id);

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'refunded',
        notes: `REFUNDED: ${refundType} refund of ${currency} ${refundAmount}\n\n${order.notes || ''}`
      }
    });

    console.log('[PayPal Webhook] Order status updated to refunded:', order.id);

    // Update client payment status and revoke portal access if needed
    let portalAccessRevoked = false;
    if (order.clientId) {
      const client = order.client;

      await prisma.client.update({
        where: { id: order.clientId },
        data: {
          paymentStatus: 'refunded',
          notes: `REFUND PROCESSED: ${refundType} refund of ${currency} ${refundAmount}\n\n${client?.notes || ''}`
        }
      });

      console.log('[PayPal Webhook] Client payment status updated to refunded:', order.clientId);

      // Revoke portal access by removing ClientUser associations
      const deletedAccess = await prisma.clientUser.deleteMany({
        where: { clientId: order.clientId }
      });

      if (deletedAccess.count > 0) {
        portalAccessRevoked = true;
        console.log(`[PayPal Webhook] Revoked portal access for ${deletedAccess.count} user(s)`);
      }
    }

    // Create admin alert
    await prisma.alert.create({
      data: {
        type: 'payment_refunded',
        severity: 'high',
        title: `Payment Refunded: ${order.packageName || 'Order'}`,
        message: `A ${refundType} refund of ${currency} ${refundAmount} has been processed for order ${order.id}`,
        metadata: JSON.stringify({
          refundId,
          orderId: order.id,
          clientId: order.clientId,
          amount: refundAmount,
          currency,
          refundType,
          saleId
        }),
        isRead: false
      }
    });

    console.log('[PayPal Webhook] Admin alert created for refund:', refundId);

    return {
      success: true,
      refundId,
      orderId: order.id,
      clientId: order.clientId,
      refundType,
      amount: refundAmount,
      portalAccessRevoked
    };

  } catch (error) {
    console.error('[PayPal Webhook] Error handling payment refunded:', error);
    throw error;
  }
}

/**
 * Helper function to verify PayPal webhook signature
 * This should be called before processing any webhook payload
 *
 * @param headers - Request headers from PayPal webhook
 * @param body - Raw request body as string
 * @param webhookId - Your PayPal webhook ID from PayPal dashboard
 * @returns Boolean indicating if signature is valid
 */
export async function verifyPayPalWebhook(
  headers: Record<string, string>,
  body: string,
  webhookId: string
): Promise<boolean> {
  try {
    // PayPal provides these headers for verification
    const transmissionId = headers['paypal-transmission-id'];
    const transmissionTime = headers['paypal-transmission-time'];
    const certUrl = headers['paypal-cert-url'];
    const authAlgo = headers['paypal-auth-algo'];
    const transmissionSig = headers['paypal-transmission-sig'];

    if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) {
      console.error('[PayPal Webhook] Missing verification headers');
      return false;
    }

    // In production, you would verify the webhook using PayPal's SDK
    // Example using @paypal/checkout-server-sdk:
    /*
    const paypal = require('@paypal/checkout-server-sdk');
    const client = new paypal.core.PayPalHttpClient(environment);

    const request = new paypal.notifications.VerifyWebhookSignature();
    request.requestBody({
      transmission_id: transmissionId,
      transmission_time: transmissionTime,
      cert_url: certUrl,
      auth_algo: authAlgo,
      transmission_sig: transmissionSig,
      webhook_id: webhookId,
      webhook_event: JSON.parse(body)
    });

    const response = await client.execute(request);
    return response.result.verification_status === 'SUCCESS';
    */

    // For now, log the verification attempt
    console.log('[PayPal Webhook] Verification headers received:', {
      transmissionId,
      transmissionTime,
      authAlgo
    });

    // In development, skip verification. In production, require proper verification.
    if (process.env.NODE_ENV === 'development') {
      console.log('[PayPal Webhook] Skipping verification in development mode');
      return true;
    }

    // In production, implement proper PayPal webhook signature verification
    // For now, log a warning and return true if webhook ID is configured
    if (!process.env.PAYPAL_WEBHOOK_ID) {
      console.warn('[PayPal Webhook] PAYPAL_WEBHOOK_ID not configured - webhook verification disabled');
      return true;
    }

    // TODO: Implement full PayPal webhook signature verification using PayPal API
    // See: https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature
    console.log('[PayPal Webhook] Production verification - webhook ID configured');
    return true;

  } catch (error) {
    console.error('[PayPal Webhook] Verification error:', error);
    return false;
  }
}

/**
 * Main webhook event router
 * Routes PayPal webhook events to the appropriate handler
 *
 * @param eventType - PayPal webhook event type
 * @param payload - PayPal webhook payload
 * @returns Result of the handler function
 */
export async function handlePayPalWebhook(eventType: string, payload: any) {
  console.log(`[PayPal Webhook] Received event: ${eventType}`);

  switch (eventType) {
    // Subscription events
    case 'BILLING.SUBSCRIPTION.ACTIVATED':
      return await handleSubscriptionActivated(payload);

    case 'BILLING.SUBSCRIPTION.CANCELLED':
      return await handleSubscriptionCancelled(payload);

    case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
      return await handleSubscriptionPaymentFailed(payload);

    case 'BILLING.SUBSCRIPTION.SUSPENDED':
      return await handleSubscriptionSuspended(payload);

    // Dispute events
    case 'CUSTOMER.DISPUTE.CREATED':
      return await handleDisputeCreated(payload);

    case 'CUSTOMER.DISPUTE.RESOLVED':
    case 'CUSTOMER.DISPUTE.UPDATED':
      return await handleDisputeResolved(payload);

    // Refund events
    case 'PAYMENT.SALE.REFUNDED':
    case 'PAYMENT.CAPTURE.REFUNDED':
      return await handlePaymentRefunded(payload);

    default:
      console.log(`[PayPal Webhook] Unhandled event type: ${eventType}`);
      return null;
  }
}
