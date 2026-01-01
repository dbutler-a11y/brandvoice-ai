#!/usr/bin/env tsx
/**
 * Test Email Script
 * Run with: npx tsx scripts/test-email.ts
 *
 * This script helps you test the email system from the command line
 */

import {
  sendTestEmail,
  sendWelcomeEmail,
  sendPaymentFailedEmail,
  sendWinBackEmail,
  sendDisputeAlertEmail,
  sendPaymentReceivedEmail,
  isEmailConfigured,
} from '../lib/email';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEmailSystem() {
  log('\n=== BrandVoice Studio Email System Test ===\n', 'cyan');

  // Check configuration
  log('Checking email configuration...', 'blue');
  if (!isEmailConfigured()) {
    log('❌ Email system not configured!', 'red');
    log('Please set RESEND_API_KEY and EMAIL_FROM in .env file', 'yellow');
    process.exit(1);
  }
  log('✓ Email system is configured\n', 'green');

  // Get test email from command line or use default
  const testEmail = process.argv[2] || process.env.ADMIN_EMAIL || 'test@example.com';

  log(`Test recipient: ${testEmail}\n`, 'cyan');

  // Test 1: Basic test email
  log('1. Sending test email...', 'blue');
  const test1 = await sendTestEmail(testEmail);
  if (test1.success) {
    log(`✓ Test email sent! Message ID: ${test1.messageId}`, 'green');
  } else {
    log(`❌ Test email failed: ${(test1 as { error?: string }).error ?? 'Unknown error'}`, 'red');
  }

  // Wait a bit between emails
  await delay(2000);

  // Test 2: Welcome email
  log('\n2. Sending welcome email...', 'blue');
  const test2 = await sendWelcomeEmail(
    testEmail,
    'Test Client',
    'Pro Package'
  );
  if (test2.success) {
    log(`✓ Welcome email sent! Message ID: ${test2.messageId}`, 'green');
  } else {
    log(`❌ Welcome email failed: ${(test2 as { error?: string }).error ?? 'Unknown error'}`, 'red');
  }

  await delay(2000);

  // Test 3: Payment failed email
  log('\n3. Sending payment failed email...', 'blue');
  const test3 = await sendPaymentFailedEmail(
    testEmail,
    'Test Client',
    'https://brandvoice.studio/billing/update'
  );
  if (test3.success) {
    log(`✓ Payment failed email sent! Message ID: ${test3.messageId}`, 'green');
  } else {
    log(`❌ Payment failed email failed: ${(test3 as { error?: string }).error ?? 'Unknown error'}`, 'red');
  }

  await delay(2000);

  // Test 4: Payment received email
  log('\n4. Sending payment received email...', 'blue');
  const test4 = await sendPaymentReceivedEmail(
    testEmail,
    'Test Client',
    297.00,
    'TEST-ORDER-12345'
  );
  if (test4.success) {
    log(`✓ Payment received email sent! Message ID: ${test4.messageId}`, 'green');
  } else {
    log(`❌ Payment received email failed: ${(test4 as { error?: string }).error ?? 'Unknown error'}`, 'red');
  }

  await delay(2000);

  // Test 5: Win-back email
  log('\n5. Sending win-back email...', 'blue');
  const test5 = await sendWinBackEmail(
    testEmail,
    'Test Client',
    'WELCOME20'
  );
  if (test5.success) {
    log(`✓ Win-back email sent! Message ID: ${test5.messageId}`, 'green');
  } else {
    log(`❌ Win-back email failed: ${(test5 as { error?: string }).error ?? 'Unknown error'}`, 'red');
  }

  await delay(2000);

  // Test 6: Dispute alert email (to admin)
  log('\n6. Sending dispute alert email...', 'blue');
  const test6 = await sendDisputeAlertEmail(
    testEmail,
    'Test Client',
    'PP-D-TEST-12345',
    297.00
  );
  if (test6.success) {
    log(`✓ Dispute alert email sent! Message ID: ${test6.messageId}`, 'green');
  } else {
    log(`❌ Dispute alert email failed: ${(test6 as { error?: string }).error ?? 'Unknown error'}`, 'red');
  }

  // Summary
  const results = [test1, test2, test3, test4, test5, test6];
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  log('\n=== Test Summary ===', 'cyan');
  log(`Total: ${results.length}`, 'blue');
  log(`Success: ${successCount}`, 'green');
  log(`Failed: ${failCount}`, failCount > 0 ? 'red' : 'green');

  if (failCount === 0) {
    log('\n✓ All email tests passed!', 'green');
    log(`Check your inbox at: ${testEmail}`, 'cyan');
  } else {
    log('\n⚠ Some email tests failed. Check the error messages above.', 'yellow');
  }

  log('\n=== Important Notes ===', 'cyan');
  log('1. Check your email inbox (and spam folder)', 'blue');
  log('2. Emails should arrive within 1-2 minutes', 'blue');
  log('3. If using Resend test domain, emails may take longer', 'blue');
  log('4. Verify all links work correctly', 'blue');
  log('5. Test on mobile and desktop email clients\n', 'blue');
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the tests
testEmailSystem()
  .then(() => {
    log('Test script completed', 'green');
    process.exit(0);
  })
  .catch((error) => {
    log(`\nTest script error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  });
