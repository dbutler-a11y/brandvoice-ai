/**
 * Example usage patterns for BrandVoice.AI Email System
 * These examples show how to integrate emails into your application
 */

import {
  sendWelcomeEmail,
  sendPaymentFailedEmail,
  sendWinBackEmail,
  sendDisputeAlertEmail,
  sendPaymentReceivedEmail,
} from './index';

/**
 * Example 1: Send welcome email when client subscribes
 * Integration point: After PayPal subscription is created
 */
export async function handleNewSubscription(
  clientEmail: string,
  clientName: string,
  subscriptionPlan: string
) {
  console.log(`New subscription for ${clientName} - ${subscriptionPlan}`);

  // Send welcome email
  const emailResult = await sendWelcomeEmail(
    clientEmail,
    clientName,
    subscriptionPlan
  );

  if (emailResult.success) {
    console.log('Welcome email sent successfully:', emailResult.messageId);
    // Optionally log to database
    // await prisma.emailLog.create({ ... });
  } else {
    console.error('Failed to send welcome email:', emailResult.error);
    // Retry logic or queue for later
  }

  return emailResult;
}

/**
 * Example 2: Handle payment failures
 * Integration point: PayPal webhook for BILLING.SUBSCRIPTION.PAYMENT.FAILED
 */
export async function handlePaymentFailure(
  clientEmail: string,
  clientName: string,
  subscriptionId: string
) {
  console.log(`Payment failed for ${clientName}`);

  // Generate update payment link
  const updateLink = `${process.env.NEXT_PUBLIC_BASE_URL}/billing/update?subscription=${subscriptionId}`;

  // Send payment failed notification
  const emailResult = await sendPaymentFailedEmail(
    clientEmail,
    clientName,
    updateLink
  );

  if (emailResult.success) {
    console.log('Payment failure email sent:', emailResult.messageId);

    // Update client status in database
    // await prisma.client.update({
    //   where: { email: clientEmail },
    //   data: {
    //     status: 'PAYMENT_FAILED',
    //     paymentFailureNotifiedAt: new Date()
    //   }
    // });
  } else {
    console.error('Failed to send payment failure email:', emailResult.error);
  }

  return emailResult;
}

/**
 * Example 3: Payment received confirmation
 * Integration point: PayPal webhook for PAYMENT.SALE.COMPLETED
 */
export async function handlePaymentReceived(
  clientEmail: string,
  clientName: string,
  amount: number,
  transactionId: string
) {
  console.log(`Payment received from ${clientName}: $${amount}`);

  // Send confirmation email
  const emailResult = await sendPaymentReceivedEmail(
    clientEmail,
    clientName,
    amount,
    transactionId
  );

  if (emailResult.success) {
    console.log('Payment confirmation sent:', emailResult.messageId);

    // Update client status
    // await prisma.client.update({
    //   where: { email: clientEmail },
    //   data: {
    //     status: 'ACTIVE',
    //     lastPaymentAt: new Date(),
    //     lastPaymentAmount: amount
    //   }
    // });
  } else {
    console.error('Failed to send payment confirmation:', emailResult.error);
  }

  return emailResult;
}

/**
 * Example 4: Win-back campaign for churned clients
 * Integration point: Scheduled cron job (run monthly)
 */
export async function runWinBackCampaign() {
  console.log('Starting win-back campaign...');

  // Find clients who canceled 30-60 days ago
  // const churnedClients = await prisma.client.findMany({
  //   where: {
  //     status: 'CANCELLED',
  //     canceledAt: {
  //       gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
  //       lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  //     },
  //     winBackSentAt: null, // Haven't sent win-back email yet
  //   }
  // });

  const churnedClients = [
    { email: 'client1@example.com', name: 'John Doe' },
    { email: 'client2@example.com', name: 'Jane Smith' },
  ];

  const results = [];

  for (const client of churnedClients) {
    // Generate unique promo code
    const promoCode = `WELCOME${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Send win-back email
    const emailResult = await sendWinBackEmail(
      client.email,
      client.name,
      promoCode
    );

    if (emailResult.success) {
      console.log(`Win-back email sent to ${client.name}`);

      // Update client record
      // await prisma.client.update({
      //   where: { email: client.email },
      //   data: {
      //     winBackSentAt: new Date(),
      //     winBackPromoCode: promoCode,
      //   }
      // });

      results.push({ client: client.name, success: true });
    } else {
      console.error(`Failed to send win-back email to ${client.name}:`, emailResult.error);
      results.push({ client: client.name, success: false, error: emailResult.error });
    }

    // Rate limiting: wait 1 second between emails
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('Win-back campaign completed:', results);
  return results;
}

/**
 * Example 5: Handle payment disputes
 * Integration point: PayPal webhook for CUSTOMER.DISPUTE.CREATED
 */
export async function handlePaymentDispute(
  clientEmail: string,
  clientName: string,
  disputeId: string,
  disputeAmount: number
) {
  console.log(`URGENT: Payment dispute from ${clientName}`);

  // Send alert to admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@brandvoice.ai';

  const emailResult = await sendDisputeAlertEmail(
    adminEmail,
    clientName,
    disputeId,
    disputeAmount
  );

  if (emailResult.success) {
    console.log('Dispute alert sent to admin:', emailResult.messageId);

    // Log dispute in database
    // await prisma.dispute.create({
    //   data: {
    //     clientEmail,
    //     clientName,
    //     caseId: disputeId,
    //     amount: disputeAmount,
    //     status: 'OPEN',
    //     notifiedAt: new Date(),
    //   }
    // });

    // Also update client status
    // await prisma.client.update({
    //   where: { email: clientEmail },
    //   data: {
    //     status: 'DISPUTED',
    //     hasActiveDispute: true
    //   }
    // });
  } else {
    console.error('Failed to send dispute alert:', emailResult.error);
    // This is critical - maybe send SMS or Slack notification as backup
  }

  return emailResult;
}

/**
 * Example 6: Bulk email with error handling and retry logic
 */
export async function sendBulkEmails(
  clients: Array<{ email: string; name: string; package: string }>,
  emailType: 'welcome' | 'payment-received' = 'welcome'
) {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as Array<{ email: string; error: string }>,
  };

  for (const client of clients) {
    try {
      let emailResult;

      if (emailType === 'welcome') {
        emailResult = await sendWelcomeEmail(
          client.email,
          client.name,
          client.package
        );
      }
      // Add more email types as needed

      if (emailResult?.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push({
          email: client.email,
          error: emailResult?.error || 'Unknown error',
        });
      }

      // Rate limiting: 100 emails/day on free tier
      // Wait 1 second between each email to be safe
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      results.failed++;
      results.errors.push({
        email: client.email,
        error: error instanceof Error ? error.message : 'Exception thrown',
      });
    }
  }

  console.log('Bulk email results:', results);
  return results;
}

/**
 * Example 7: Integration with Next.js API route
 */
export async function handleWebhookEmailTrigger(webhookData: any) {
  const { event_type, resource } = webhookData;

  switch (event_type) {
    case 'BILLING.SUBSCRIPTION.CREATED':
      return await handleNewSubscription(
        resource.subscriber.email_address,
        resource.subscriber.name.given_name + ' ' + resource.subscriber.name.surname,
        resource.plan.name
      );

    case 'PAYMENT.SALE.COMPLETED':
      return await handlePaymentReceived(
        resource.payer.email_address,
        resource.payer.payer_info.first_name + ' ' + resource.payer.payer_info.last_name,
        parseFloat(resource.amount.total),
        resource.id
      );

    case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
      return await handlePaymentFailure(
        resource.subscriber.email_address,
        resource.subscriber.name.given_name + ' ' + resource.subscriber.name.surname,
        resource.id
      );

    case 'CUSTOMER.DISPUTE.CREATED':
      return await handlePaymentDispute(
        resource.disputed_transactions[0].buyer.email,
        resource.disputed_transactions[0].buyer.name,
        resource.dispute_id,
        parseFloat(resource.dispute_amount.value)
      );

    default:
      console.log('Unhandled webhook event:', event_type);
      return null;
  }
}

/**
 * Example 8: Schedule-based win-back campaign
 * This could be called from a cron job or scheduled task
 */
export async function scheduledWinBackCampaign() {
  try {
    console.log('Running scheduled win-back campaign...');

    const results = await runWinBackCampaign();

    // Log results for monitoring
    console.log(`Win-back campaign completed: ${results.filter(r => r.success).length} sent, ${results.filter(r => !r.success).length} failed`);

    return {
      success: true,
      totalSent: results.filter(r => r.success).length,
      totalFailed: results.filter(r => !r.success).length,
      results,
    };
  } catch (error) {
    console.error('Error in scheduled win-back campaign:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
