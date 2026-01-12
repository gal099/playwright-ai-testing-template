/**
 * AI-Powered OTP Extractor
 *
 * Uses Claude AI to intelligently extract OTP/verification codes from email content.
 *
 * Advantages over regex:
 * - Works with any email format (HTML, plain text, different languages)
 * - Handles variations in code placement
 * - More resilient to format changes
 * - Very low cost (~$0.0001 per extraction using Haiku)
 *
 * Falls back to regex patterns if AI is disabled.
 */

import { aiClient } from '../../config/ai-client';

export class OTPExtractor {
  private enableAI: boolean;

  constructor(enableAI: boolean = true) {
    this.enableAI = enableAI;
  }

  /**
   * Extract OTP code from email content
   *
   * @param emailContent Email content (text or HTML)
   * @param subject Email subject (optional, provides additional context)
   * @returns Extracted OTP code
   */
  async extractOTP(emailContent: string, subject?: string): Promise<string> {
    // Try AI extraction first (more robust)
    if (this.enableAI) {
      try {
        return await this.extractWithAI(emailContent, subject);
      } catch (error) {
        console.warn('AI extraction failed, falling back to regex:', error);
        // Fall through to regex
      }
    }

    // Fallback to regex
    return this.extractWithRegex(emailContent, subject);
  }

  /**
   * Extract OTP using Claude AI (Haiku model for low cost)
   */
  private async extractWithAI(emailContent: string, subject?: string): Promise<string> {
    const contextMessage = subject ? `Email subject: ${subject}\n\n` : '';

    const prompt = `${contextMessage}Extract the verification code (OTP) from this email content.

Requirements:
- Return ONLY the numeric or alphanumeric code
- No explanations, no extra text, just the code
- If there are multiple codes, return the most prominent one
- Common patterns: 6-digit numbers, 4-digit PINs, alphanumeric codes

Email content:
${emailContent.slice(0, 2000)}`; // Limit content to reduce tokens

    const response = await aiClient.ask(
      prompt,
      'You are an OTP code extractor. Return only the code, nothing else.',
      {
        model: 'haiku', // Cheap and fast
        maxTokens: 64,
      }
    );

    const code = response.trim();

    // Validate extracted code
    if (!this.isValidOTPCode(code)) {
      throw new Error(`Invalid OTP code extracted: ${code}`);
    }

    return code;
  }

  /**
   * Extract OTP using regex patterns (fallback)
   */
  private extractWithRegex(emailContent: string, subject?: string): string {
    const allContent = `${subject || ''} ${emailContent}`;

    // Try multiple regex patterns (most common first)
    const patterns = [
      // 6-digit numeric (most common)
      /\b\d{6}\b/,
      // 4-digit PIN
      /\b\d{4}\b/,
      // 8-digit code
      /\b\d{8}\b/,
      // Alphanumeric codes (e.g., "ABC123", "X9Y2Z1")
      /\b[A-Z0-9]{6}\b/,
      /\b[A-Z0-9]{8}\b/,
      // Codes with dashes (e.g., "123-456")
      /\b\d{3}-\d{3}\b/,
    ];

    for (const pattern of patterns) {
      const match = allContent.match(pattern);
      if (match) {
        return match[0];
      }
    }

    throw new Error('Could not extract OTP code using regex patterns');
  }

  /**
   * Validate if extracted string is a valid OTP code
   */
  private isValidOTPCode(code: string): boolean {
    // OTP codes are typically:
    // - 4-8 characters long
    // - Numeric or alphanumeric
    // - No spaces or special characters (except maybe dashes)

    if (!code || code.length < 4 || code.length > 10) {
      return false;
    }

    // Allow only alphanumeric and dashes
    if (!/^[A-Z0-9-]+$/i.test(code)) {
      return false;
    }

    return true;
  }

  /**
   * Check if OTP extraction is available
   */
  isAvailable(): boolean {
    return this.enableAI && !!process.env.ANTHROPIC_API_KEY;
  }
}
