/**
 * OTP Authentication Example
 *
 * This test demonstrates how to use the OTP Helper for authentication flows
 * that require email-based verification codes.
 *
 * Prerequisites:
 * 1. Set up Mailtrap account (https://mailtrap.io)
 * 2. Create API token (https://mailtrap.io/api-tokens)
 * 3. Get your Account ID and Inbox ID from Mailtrap dashboard
 * 4. Add credentials to .env:
 *    MAILTRAP_API_TOKEN=your_token
 *    MAILTRAP_ACCOUNT_ID=your_account_id
 *    MAILTRAP_INBOX_ID=your_inbox_id
 *    ENABLE_OTP_AI_EXTRACTION=true
 *
 * Real-world example from Iruña Gestor Documental:
 * - User enters email
 * - System sends 6-digit OTP via email
 * - OTP is valid for 1 hour, single use
 * - User enters OTP to complete login
 */

import { test, expect } from '@playwright/test';
import { OTPHelper } from '../../utils/api/otp-helper';

test.describe('OTP Authentication Examples', () => {
  /**
   * EXAMPLE 1: Basic OTP login flow
   *
   * This is the most common pattern for OTP authentication.
   */
  test('TC-AUTH-001: Login with OTP code from email', async ({ page }) => {
    // Skip if Mailtrap credentials are not configured
    if (!process.env.MAILTRAP_API_TOKEN) {
      test.skip();
    }

    // Initialize OTP helper from environment variables
    const otpHelper = OTPHelper.fromEnv();

    // Optional: Clear inbox before test to avoid stale emails
    await otpHelper.clearInbox();

    // 1. Navigate to login page
    await page.goto('https://your-app.com/login');

    // 2. Enter email address
    await page.fill('[name="email"]', process.env.USER_EMAIL!);
    await page.click('button:text("Send Code")');

    // 3. Wait for confirmation message
    await expect(page.locator('text=Verification code sent')).toBeVisible();

    // 4. Wait for OTP email and extract code
    console.log('Waiting for OTP email...');
    const otpCode = await otpHelper.waitForOTP({
      maxWaitMs: 30000, // Wait up to 30 seconds
      pollIntervalMs: 2000, // Check every 2 seconds
      filterSubject: 'código', // Filter by subject containing "código"
    });

    console.log(`Received OTP: ${otpCode}`);

    // 5. Enter OTP code
    await page.fill('[name="otp"]', otpCode);
    await page.click('button:text("Verify")');

    // 6. Verify successful login
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  /**
   * EXAMPLE 2: OTP with custom configuration
   *
   * Shows how to configure OTP helper with specific options.
   */
  test('TC-AUTH-002: Login with custom OTP configuration', async ({ page }) => {
    if (!process.env.MAILTRAP_API_TOKEN) {
      test.skip();
    }

    // Create OTP helper with custom configuration
    const otpHelper = OTPHelper.createMailtrap(
      {
        apiToken: process.env.MAILTRAP_API_TOKEN!,
        accountId: process.env.MAILTRAP_ACCOUNT_ID!,
        inboxId: process.env.MAILTRAP_INBOX_ID!,
      },
      {
        enableAI: true, // Use AI extraction (more robust)
        deleteAfterExtraction: true, // Clean up emails automatically
      }
    );

    await page.goto('https://your-app.com/login');

    await page.fill('[name="email"]', process.env.USER_EMAIL!);
    await page.click('button:text("Send Code")');

    // Get OTP with filtering by sender
    const otpCode = await otpHelper.getOTP({
      maxWaitMs: 45000,
      filterFrom: 'no-reply@your-app.com', // Only emails from this sender
    });

    await page.fill('[name="otp"]', otpCode);
    await page.click('button:text("Verify")');

    await expect(page).toHaveURL(/dashboard/);
  });

  /**
   * EXAMPLE 3: Multi-step OTP flow (registration + verification)
   *
   * Shows how to handle multiple OTP codes in a single test.
   */
  test('TC-AUTH-003: User registration with email verification', async ({ page }) => {
    if (!process.env.MAILTRAP_API_TOKEN) {
      test.skip();
    }

    const otpHelper = OTPHelper.fromEnv({ deleteAfterExtraction: true });

    // Clear inbox at the start
    await otpHelper.clearInbox();

    // Step 1: Register new user
    await page.goto('https://your-app.com/register');
    await page.fill('[name="email"]', process.env.USER_EMAIL!);
    await page.fill('[name="password"]', process.env.USER_PASS!);
    await page.click('button:text("Register")');

    // Step 2: Verify email with first OTP
    console.log('Waiting for registration OTP...');
    const registrationOTP = await otpHelper.waitForOTP({
      maxWaitMs: 30000,
      filterSubject: 'registration',
    });

    await page.fill('[name="verification-code"]', registrationOTP);
    await page.click('button:text("Verify Email")');

    // Step 3: Enable 2FA (requires second OTP)
    await page.click('button:text("Enable 2FA")');

    console.log('Waiting for 2FA OTP...');
    const twoFactorOTP = await otpHelper.waitForOTP({
      maxWaitMs: 30000,
      filterSubject: '2FA',
    });

    await page.fill('[name="2fa-code"]', twoFactorOTP);
    await page.click('button:text("Confirm")');

    await expect(page.locator('text=2FA enabled')).toBeVisible();
  });

  /**
   * EXAMPLE 4: OTP retry logic
   *
   * Shows how to handle OTP expiration and resend scenarios.
   */
  test('TC-AUTH-004: Resend OTP if first code expires', async ({ page }) => {
    if (!process.env.MAILTRAP_API_TOKEN) {
      test.skip();
    }

    const otpHelper = OTPHelper.fromEnv();
    await otpHelper.clearInbox();

    await page.goto('https://your-app.com/login');
    await page.fill('[name="email"]', process.env.USER_EMAIL!);
    await page.click('button:text("Send Code")');

    // Get first OTP
    const firstOTP = await otpHelper.waitForOTP({ maxWaitMs: 30000 });
    console.log(`First OTP: ${firstOTP}`);

    // Simulate: User doesn't enter code in time, requests resend
    await page.click('button:text("Resend Code")');

    // Get second OTP (will be different)
    const secondOTP = await otpHelper.waitForOTP({ maxWaitMs: 30000 });
    console.log(`Second OTP: ${secondOTP}`);

    // Use the latest OTP
    await page.fill('[name="otp"]', secondOTP);
    await page.click('button:text("Verify")');

    await expect(page).toHaveURL(/dashboard/);
  });

  /**
   * EXAMPLE 5: Check if AI extraction is available
   *
   * Gracefully handle cases where AI API key is not configured.
   */
  test('TC-AUTH-005: OTP extraction with fallback to regex', async ({ page }) => {
    if (!process.env.MAILTRAP_API_TOKEN) {
      test.skip();
    }

    const otpHelper = OTPHelper.fromEnv({
      enableAI: false, // Force regex extraction
    });

    console.log(`AI extraction available: ${otpHelper.isAIAvailable()}`);

    await page.goto('https://your-app.com/login');
    await page.fill('[name="email"]', process.env.USER_EMAIL!);
    await page.click('button:text("Send Code")');

    // OTP will be extracted using regex patterns
    const otpCode = await otpHelper.waitForOTP({ maxWaitMs: 30000 });

    await page.fill('[name="otp"]', otpCode);
    await page.click('button:text("Verify")');

    await expect(page).toHaveURL(/dashboard/);
  });
});

/**
 * NOTES:
 *
 * 1. Cost Optimization:
 *    - AI extraction uses Haiku model (~$0.0001 per OTP)
 *    - Very cost-effective for OTP extraction
 *    - Can disable AI and use regex fallback if needed
 *
 * 2. Email Provider Support:
 *    - Currently supports Mailtrap
 *    - Easy to extend for other providers (Mailosaur, Gmail API, etc.)
 *    - Implement BaseEmailProvider interface for custom providers
 *
 * 3. Best Practices:
 *    - Clear inbox before tests to avoid stale emails
 *    - Use filterSubject or filterFrom to avoid wrong emails
 *    - Set reasonable timeout (30-45 seconds is typical)
 *    - Consider deleteAfterExtraction to keep inbox clean
 *
 * 4. Troubleshooting:
 *    - Check Mailtrap dashboard if emails are arriving
 *    - Verify API token has correct permissions
 *    - Ensure Account ID and Inbox ID are correct
 *    - Check console logs for extraction details
 */
