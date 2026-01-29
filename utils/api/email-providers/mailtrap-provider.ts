/**
 * Mailtrap Email Provider
 *
 * Integrates with Mailtrap API v2 to fetch emails from test inboxes.
 *
 * @see https://api-docs.mailtrap.io/docs/mailtrap-api-docs/
 *
 * Setup:
 * 1. Get API token from https://mailtrap.io/api-tokens
 * 2. Find your Account ID and Inbox ID in the Mailtrap dashboard
 * 3. Add to .env:
 *    MAILTRAP_API_TOKEN=your_token
 *    MAILTRAP_ACCOUNT_ID=your_account_id
 *    MAILTRAP_INBOX_ID=your_inbox_id
 */

import {
  BaseEmailProvider,
  EmailMessage,
  EmailProviderConfig,
  FetchEmailOptions,
} from './base-provider';

export interface MailtrapConfig extends EmailProviderConfig {
  apiToken: string;
  accountId: string;
  inboxId: string;
}

interface MailtrapEmailResponse {
  id: number;
  inbox_id: number;
  subject: string;
  sent_at: string;
  from_email: string;
  from_name: string;
  to_email: string;
  to_name: string;
  email_size: number;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  html_body: string;
  txt_body: string;
  raw_body: string;
  html_path: string;
  txt_path: string;
  raw_path: string;
}

export class MailtrapProvider extends BaseEmailProvider {
  private readonly baseURL = 'https://mailtrap.io/api/v1';
  private accountId: string;
  private inboxId: string;

  constructor(config: MailtrapConfig) {
    super(config);

    if (!config.apiToken) {
      throw new Error('Mailtrap API token is required');
    }
    if (!config.accountId) {
      throw new Error('Mailtrap account ID is required');
    }
    if (!config.inboxId) {
      throw new Error('Mailtrap inbox ID is required');
    }

    this.accountId = config.accountId;
    this.inboxId = config.inboxId;
  }

  /**
   * Fetch the latest email using polling
   */
  async fetchLatestEmail(options?: FetchEmailOptions): Promise<EmailMessage> {
    return this.pollForEmail(options);
  }

  /**
   * Fetch all emails from the inbox
   */
  async fetchAllEmails(limit: number = 50): Promise<EmailMessage[]> {
    const url = `${this.baseURL}/accounts/${this.accountId}/inboxes/${this.inboxId}/messages`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Api-Token': this.config.apiToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Mailtrap API error: ${response.status} ${response.statusText}`
      );
    }

    const emails: MailtrapEmailResponse[] = await response.json();

    // Sort by created_at descending (newest first) and limit
    const sortedEmails = emails
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);

    return sortedEmails.map(this.transformEmail);
  }

  /**
   * Delete a specific email
   */
  async deleteEmail(emailId: string): Promise<void> {
    const url = `${this.baseURL}/accounts/${this.accountId}/inboxes/${this.inboxId}/messages/${emailId}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Api-Token': this.config.apiToken,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete email ${emailId}: ${response.status} ${response.statusText}`
      );
    }
  }

  /**
   * Clear all emails from the inbox
   */
  async clearInbox(): Promise<void> {
    const url = `${this.baseURL}/accounts/${this.accountId}/inboxes/${this.inboxId}/clean`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Api-Token': this.config.apiToken,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to clear inbox: ${response.status} ${response.statusText}`
      );
    }
  }

  /**
   * Transform Mailtrap API response to EmailMessage
   */
  private transformEmail(email: MailtrapEmailResponse): EmailMessage {
    return {
      id: email.id.toString(),
      subject: email.subject,
      from: email.from_email,
      to: email.to_email,
      textContent: email.txt_body || '',
      htmlContent: email.html_body || '',
      receivedAt: new Date(email.created_at),
    };
  }
}
