import { Page, expect } from '@playwright/test';
import { aiClient } from '../../config/ai-client';

export class AIAssertion {
  private enabled: boolean;

  constructor() {
    this.enabled = process.env.ENABLE_AI_ASSERTIONS !== 'false';
  }

  /**
   * Visual assertion using AI vision
   * Validates that the page matches a natural language description
   */
  async expectVisualState(page: Page, description: string): Promise<void> {
    if (!this.enabled) {
      console.log('⚠️  AI assertions disabled, skipping visual check');
      return;
    }

    console.log(`👁️  AI Visual Check: ${description}`);

    const screenshot = await page.screenshot({ fullPage: false });
    const screenshotBase64 = screenshot.toString('base64');

    const prompt = `
Analyze this screenshot and determine if it matches this description:
"${description}"

Respond with a JSON object in this exact format:
{
  "matches": true or false,
  "confidence": 0.0 to 1.0,
  "explanation": "brief explanation of what you see and why it matches or doesn't match"
}

Be strict but reasonable in your assessment.
`;

    const systemPrompt = `You are a QA visual validation expert. Analyze screenshots carefully and provide accurate assessments.
Always respond with valid JSON only.
IMPORTANT: Provide all explanations and messages in English only.`;

    // Use Sonnet for visual assertions (needs good vision capabilities)
    const response = await aiClient.askWithImage(
      prompt,
      screenshotBase64,
      'image/png',
      {
        model: 'sonnet',
        maxTokens: 2048
      },
      systemPrompt
    );

    // Parse response
    const result = this.parseAIResponse(response);

    if (!result.matches) {
      throw new Error(
        `Visual assertion failed: ${description}\n` +
        `Confidence: ${result.confidence}\n` +
        `Explanation: ${result.explanation}`
      );
    }

    console.log(`✅ Visual check passed (confidence: ${result.confidence})`);
  }

  /**
   * Semantic text assertion
   * Validates text content matches semantic meaning, not exact wording
   */
  async expectSemanticContent(page: Page, selector: string, expectedMeaning: string): Promise<void> {
    if (!this.enabled) {
      console.log('⚠️  AI assertions disabled, skipping semantic check');
      return;
    }

    const actualText = await page.locator(selector).textContent();

    if (!actualText) {
      throw new Error(`No text found at selector: ${selector}`);
    }

    const prompt = `
Compare these two pieces of text semantically:

Expected meaning: "${expectedMeaning}"
Actual text: "${actualText}"

Do they convey the same meaning? Consider synonyms, paraphrasing, and context.

Respond with JSON:
{
  "matches": true or false,
  "confidence": 0.0 to 1.0,
  "explanation": "brief explanation"
}
`;

    // Use Haiku for simple text comparison (cost-efficient)
    const response = await aiClient.ask(prompt, undefined, {
      model: 'haiku',
      maxTokens: 512
    });
    const result = this.parseAIResponse(response);

    if (!result.matches) {
      throw new Error(
        `Semantic assertion failed.\n` +
        `Expected meaning: ${expectedMeaning}\n` +
        `Actual text: ${actualText}\n` +
        `Confidence: ${result.confidence}\n` +
        `Explanation: ${result.explanation}`
      );
    }

    console.log(`✅ Semantic check passed`);
  }

  /**
   * Layout assertion using AI vision
   * Validates visual layout and arrangement of elements
   */
  async expectLayout(page: Page, description: string): Promise<void> {
    if (!this.enabled) {
      console.log('⚠️  AI assertions disabled, skipping layout check');
      return;
    }

    console.log(`📐 AI Layout Check: ${description}`);

    const screenshot = await page.screenshot({ fullPage: true });
    const screenshotBase64 = screenshot.toString('base64');

    const prompt = `
Analyze the layout of this page and verify if it matches this description:
"${description}"

Focus on:
- Element positioning and alignment
- Visual hierarchy
- Spacing and margins
- Responsive design aspects
- Overall composition

Respond with JSON:
{
  "matches": true or false,
  "confidence": 0.0 to 1.0,
  "explanation": "what you observed about the layout"
}
`;

    const systemPrompt = `You are a QA visual layout expert. Analyze page layouts carefully.
IMPORTANT: Provide all explanations and observations in English only.`;

    // Use Sonnet for layout analysis (needs good vision)
    const response = await aiClient.askWithImage(
      prompt,
      screenshotBase64,
      'image/png',
      {
        model: 'sonnet',
        maxTokens: 2048
      },
      systemPrompt
    );
    const result = this.parseAIResponse(response);

    if (!result.matches) {
      throw new Error(
        `Layout assertion failed: ${description}\n` +
        `Confidence: ${result.confidence}\n` +
        `Explanation: ${result.explanation}`
      );
    }

    console.log(`✅ Layout check passed`);
  }

  /**
   * Accessibility assertion using AI
   * Checks for accessibility issues and best practices
   */
  async expectAccessible(page: Page, focus?: string): Promise<void> {
    if (!this.enabled) {
      console.log('⚠️  AI assertions disabled, skipping accessibility check');
      return;
    }

    console.log(`♿ AI Accessibility Check${focus ? `: ${focus}` : ''}`);

    const screenshot = await page.screenshot({ fullPage: false });
    const screenshotBase64 = screenshot.toString('base64');

    // Also get the HTML structure for better analysis
    const accessibilityInfo = await page.evaluate(() => {
      const issues: string[] = [];

      // Check for common a11y issues
      document.querySelectorAll('img:not([alt])').forEach(() => {
        issues.push('Image without alt attribute');
      });

      document.querySelectorAll('button:not([aria-label]):empty').forEach(() => {
        issues.push('Button without text or aria-label');
      });

      document.querySelectorAll('input:not([aria-label]):not([id])').forEach(() => {
        issues.push('Input without label or aria-label');
      });

      return { issues };
    });

    const prompt = `
Analyze this page for accessibility issues.
${focus ? `Focus specifically on: ${focus}` : 'Check general accessibility.'}

Programmatic issues found: ${JSON.stringify(accessibilityInfo.issues)}

Also check the visual aspects for:
- Color contrast
- Text readability
- Focus indicators
- Touch target sizes
- Visual hierarchy

Respond with JSON:
{
  "accessible": true or false,
  "severity": "none" | "minor" | "moderate" | "critical",
  "issues": ["list", "of", "issues"],
  "explanation": "summary of accessibility state"
}
`;

    const systemPrompt = `You are an accessibility expert. Analyze pages for WCAG compliance and a11y best practices.
IMPORTANT: Provide all issues, explanations, and recommendations in English only.`;

    // Use Sonnet for accessibility analysis (requires comprehensive understanding)
    const response = await aiClient.askWithImage(
      prompt,
      screenshotBase64,
      'image/png',
      {
        model: 'sonnet',
        maxTokens: 2048
      },
      systemPrompt
    );
    const result = JSON.parse(this.extractJSON(response));

    if (!result.accessible && result.severity !== 'minor') {
      throw new Error(
        `Accessibility assertion failed!\n` +
        `Severity: ${result.severity}\n` +
        `Issues found:\n${result.issues.map((i: string) => `  - ${i}`).join('\n')}\n` +
        `${result.explanation}`
      );
    }

    if (result.issues.length > 0) {
      console.log(`⚠️  Minor accessibility issues: ${result.issues.join(', ')}`);
    }

    console.log(`✅ Accessibility check passed`);
  }

  /**
   * Data-driven assertion
   * Validates that displayed data makes sense given the context
   */
  async expectDataValid(page: Page, selector: string, dataContext: string): Promise<void> {
    if (!this.enabled) {
      console.log('⚠️  AI assertions disabled, skipping data validation');
      return;
    }

    const data = await page.locator(selector).textContent();

    const prompt = `
Validate if this data makes sense in the given context:

Data: "${data}"
Context: ${dataContext}

Check for:
- Logical consistency
- Format correctness
- Reasonable values
- No obvious errors

Respond with JSON:
{
  "valid": true or false,
  "confidence": 0.0 to 1.0,
  "issues": ["any", "problems", "found"],
  "explanation": "brief explanation"
}
`;

    // Use Haiku for simple data validation (cost-efficient)
    const response = await aiClient.ask(prompt, undefined, {
      model: 'haiku',
      maxTokens: 512
    });
    const result = JSON.parse(this.extractJSON(response));

    if (!result.valid) {
      throw new Error(
        `Data validation failed.\n` +
        `Data: ${data}\n` +
        `Context: ${dataContext}\n` +
        `Issues: ${result.issues.join(', ')}\n` +
        `Explanation: ${result.explanation}`
      );
    }

    console.log(`✅ Data validation passed`);
  }

  private parseAIResponse(response: string): { matches: boolean; confidence: number; explanation: string } {
    try {
      const jsonStr = this.extractJSON(response);
      const parsed = JSON.parse(jsonStr);

      return {
        matches: parsed.matches || parsed.accessible || parsed.valid || false,
        confidence: parsed.confidence || 0.5,
        explanation: parsed.explanation || 'No explanation provided',
      };
    } catch (error) {
      console.error('Failed to parse AI response:', response);
      throw new Error(`Failed to parse AI response: ${error}`);
    }
  }

  private extractJSON(text: string): string {
    // Try to extract JSON from markdown code blocks
    const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }

    // Try to find JSON object in text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return jsonMatch[0];
    }

    return text.trim();
  }
}

export const aiAssert = new AIAssertion();
