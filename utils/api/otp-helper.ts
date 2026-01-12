/**
 * OTP Helper - Unified interface for OTP/verification code extraction
 *
 * Combines email providers with OTP extraction to simplify authentication flows
 * that require email-based verification codes.
 *
 * Usage:
 * ```typescript
 * const otpHelper = OTPHelper.createMailtrap({
 *   apiToken: process.env.MAILTRAP_API_TOKEN!,
 *   accountId: process.env.MAILTRAP_ACCOUNT_ID!,
 *   inboxId: process.env.MAILTRAP_INBOX_ID!,
 * });
 *
 * const code = await otpHelper.getOTP({ maxWaitMs: 30000 });
 * ```
 */

import { BaseEmailProvider, MailtrapProvider, MailtrapConfig, FetchEmailOptions } from './email-providers';
import { OTPExtractor } from '../ai-helpers/otp-extractor';

export interface OTPHelperOptions {
  /**
   * Email provider instance
   */
  emailProvider: BaseEmailProvider;

  /**
   * Enable AI-powered OTP extraction (default: true)
   * Falls back to regex if disabled or AI fails
   */
  enableAI?: boolean;

  /**
   * Delete email after extracting OTP (default: false)
   * Useful for keeping inbox clean during tests
   */
  deleteAfterExtraction?: boolean;
}

export interface GetOTPOptions extends FetchEmailOptions {
  /**
   * Maximum time to wait for email (default: 30000ms)
   */
  maxWaitMs?: number;

  /**
   * Polling interval in milliseconds (default: 2000ms)
   */
  pollIntervalMs?: number;

  /**
   * Filter emails by subject containing this text
   */
  filterSubject?: string;

  /**
   * Filter emails by sender email
   */
  filterFrom?: string;
}

export class OTPHelper {
  private emailProvider: BaseEmailProvider;
  private otpExtractor: OTPExtractor;
  private deleteAfterExtraction: boolean;

  constructor(options: OTPHelperOptions) {
    this.emailProvider = options.emailProvider;
    this.otpExtractor = new OTPExtractor(options.enableAI ?? true);
    this.deleteAfterExtraction = options.deleteAfterExtraction ?? false;
  }

  /**
   * Get OTP code from latest email
   *
   * @param options Polling and filtering options
   * @returns Extracted OTP code
   */
  async getOTP(options?: GetOTPOptions): Promise<string> {
    // Fetch latest email with polling
    const email = await this.emailProvider.fetchLatestEmail(options);

    console.log(`[OTP Helper] Received email: "${email.subject}" from ${email.from}`);

    // Extract OTP from email content
    const otpCode = await this.otpExtractor.extractOTP(
      email.htmlContent || email.textContent,
      email.subject
    );

    console.log(`[OTP Helper] Extracted OTP: ${otpCode}`);

    // Optionally delete email after extraction
    if (this.deleteAfterExtraction) {
      await this.emailProvider.deleteEmail(email.id);
      console.log(`[OTP Helper] Deleted email ${email.id}`);
    }

    return otpCode;
  }

  /**
   * Get OTP and wait for email with retry logic
   * Alias for getOTP() for better semantic clarity
   */
  async waitForOTP(options?: GetOTPOptions): Promise<string> {
    return this.getOTP(options);
  }

  /**
   * Clear all emails from inbox
   * Useful for cleaning up before/after tests
   */
  async clearInbox(): Promise<void> {
    await this.emailProvider.clearInbox();
    console.log('[OTP Helper] Inbox cleared');
  }

  /**
   * Check if AI extraction is available
   */
  isAIAvailable(): boolean {
    return this.otpExtractor.isAvailable();
  }

  /**
   * Factory: Create OTPHelper with Mailtrap provider
   *
   * @param config Mailtrap configuration
   * @param options Additional OTP helper options
   * @returns Configured OTPHelper instance
   */
  static createMailtrap(
    config: MailtrapConfig,
    options?: Partial<Omit<OTPHelperOptions, 'emailProvider'>>
  ): OTPHelper {
    const provider = new MailtrapProvider(config);

    return new OTPHelper({
      emailProvider: provider,
      enableAI: options?.enableAI ?? true,
      deleteAfterExtraction: options?.deleteAfterExtraction ?? false,
    });
  }

  /**
   * Factory: Create OTPHelper from environment variables
   *
   * Expects these env vars:
   * - MAILTRAP_API_TOKEN
   * - MAILTRAP_ACCOUNT_ID
   * - MAILTRAP_INBOX_ID
   * - ENABLE_OTP_AI_EXTRACTION (optional, default: true)
   *
   * @param options Additional OTP helper options
   * @returns Configured OTPHelper instance
   */
  static fromEnv(options?: Partial<Omit<OTPHelperOptions, 'emailProvider'>>): OTPHelper {
    const apiToken = process.env.MAILTRAP_API_TOKEN;
    const accountId = process.env.MAILTRAP_ACCOUNT_ID;
    const inboxId = process.env.MAILTRAP_INBOX_ID;
    const enableAI = process.env.ENABLE_OTP_AI_EXTRACTION !== 'false';

    if (!apiToken || !accountId || !inboxId) {
      throw new Error(
        'Missing Mailtrap credentials. Set MAILTRAP_API_TOKEN, MAILTRAP_ACCOUNT_ID, and MAILTRAP_INBOX_ID in .env'
      );
    }

    return OTPHelper.createMailtrap(
      { apiToken, accountId, inboxId },
      { ...options, enableAI: options?.enableAI ?? enableAI }
    );
  }
}
