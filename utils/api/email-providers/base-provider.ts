/**
 * Base interface for email providers
 * Implement this interface to support different email testing services
 * (Mailtrap, Mailosaur, Gmail API, etc.)
 */

export interface EmailMessage {
  id: string;
  subject: string;
  from: string;
  to: string;
  textContent: string;
  htmlContent: string;
  receivedAt: Date;
}

export interface EmailProviderConfig {
  apiToken: string;
  accountId?: string;
  inboxId?: string;
  [key: string]: any;
}

export interface FetchEmailOptions {
  maxWaitMs?: number;
  pollIntervalMs?: number;
  filterSubject?: string;
  filterFrom?: string;
}

export abstract class BaseEmailProvider {
  protected config: EmailProviderConfig;

  constructor(config: EmailProviderConfig) {
    this.config = config;
  }

  /**
   * Fetch the latest email from the inbox
   * @param options Fetch options including polling configuration
   * @returns The latest email message
   */
  abstract fetchLatestEmail(options?: FetchEmailOptions): Promise<EmailMessage>;

  /**
   * Fetch all emails from the inbox
   * @param limit Maximum number of emails to fetch
   * @returns Array of email messages
   */
  abstract fetchAllEmails(limit?: number): Promise<EmailMessage[]>;

  /**
   * Delete an email by ID
   * @param emailId The ID of the email to delete
   */
  abstract deleteEmail(emailId: string): Promise<void>;

  /**
   * Clear all emails from the inbox
   */
  abstract clearInbox(): Promise<void>;

  /**
   * Poll for new email with retry logic
   * @param options Polling options
   * @returns The latest email message
   */
  protected async pollForEmail(options?: FetchEmailOptions): Promise<EmailMessage> {
    const maxWaitMs = options?.maxWaitMs || 30000;
    const pollIntervalMs = options?.pollIntervalMs || 2000;
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitMs) {
      const emails = await this.fetchAllEmails(1);

      if (emails.length > 0) {
        const latestEmail = emails[0];

        // Apply filters if provided
        if (options?.filterSubject && !latestEmail.subject.includes(options.filterSubject)) {
          await this.sleep(pollIntervalMs);
          continue;
        }

        if (options?.filterFrom && !latestEmail.from.includes(options.filterFrom)) {
          await this.sleep(pollIntervalMs);
          continue;
        }

        return latestEmail;
      }

      await this.sleep(pollIntervalMs);
    }

    throw new Error(`No email received within ${maxWaitMs}ms timeout`);
  }

  /**
   * Sleep utility for polling
   * @param ms Milliseconds to sleep
   */
  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
