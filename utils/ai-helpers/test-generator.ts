import { chromium, Page } from '@playwright/test';
import { aiClient } from '../../config/ai-client';
import * as fs from 'fs';
import * as path from 'path';

interface TestGenerationOptions {
  url: string;
  description?: string;
  outputPath?: string;
  exploreDuration?: number;
}

export class TestGenerator {
  async generateTests(options: TestGenerationOptions): Promise<string> {
    const {
      url,
      description = '',
      outputPath = './tests/generated',
      exploreDuration = 5000,
    } = options;

    console.log(`🤖 Generating tests for: ${url}`);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(exploreDuration);

      // Capture page information
      const pageTitle = await page.title();
      const pageHTML = await page.content();
      const screenshot = await page.screenshot({ fullPage: true });
      const screenshotBase64 = screenshot.toString('base64');

      // Get interactive elements
      const interactiveElements = await this.extractInteractiveElements(page);

      // Generate tests using AI
      const prompt = `
Analyze this web page and generate comprehensive Playwright tests.

URL: ${url}
Page Title: ${pageTitle}
${description ? `User Description: ${description}` : ''}

Interactive Elements Found:
${JSON.stringify(interactiveElements, null, 2)}

Generate a complete Playwright test file that:
1. Tests the main user flows and interactions
2. Validates key elements are present
3. Tests form submissions if applicable
4. Includes proper assertions
5. Uses modern Playwright best practices with TypeScript
6. Uses data-testid selectors where possible, falling back to accessible roles

Return ONLY the TypeScript code for the test file, including necessary imports.
Start with:
import { test, expect } from '@playwright/test';

Make the tests descriptive and maintainable.
`;

      const systemPrompt = `You are an expert QA automation engineer specializing in Playwright test creation.
Generate clean, maintainable, and comprehensive test code following industry best practices.
Focus on user-centric test scenarios and proper error handling.`;

      // Use Sonnet for balanced quality and cost in test generation
      const testCode = await aiClient.askWithImage(prompt, screenshotBase64, 'image/png', {
        model: 'sonnet',
        maxTokens: 4096
      });

      // Extract code from markdown if present
      const cleanedCode = this.extractCodeFromMarkdown(testCode);

      // Save the generated test
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `generated-test-${timestamp}.spec.ts`;
      const fullPath = path.join(outputPath, fileName);

      // Ensure directory exists
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }

      fs.writeFileSync(fullPath, cleanedCode);

      console.log(`✅ Test generated successfully: ${fullPath}`);

      return fullPath;
    } finally {
      await browser.close();
    }
  }

  private async extractInteractiveElements(page: Page) {
    return await page.evaluate(() => {
      const elements: Array<{ tag: string; type?: string; text?: string; id?: string; name?: string; testId?: string; role?: string }> = [];

      // Buttons
      document.querySelectorAll('button').forEach((el) => {
        elements.push({
          tag: 'button',
          text: el.textContent?.trim().substring(0, 50),
          id: el.id,
          testId: el.getAttribute('data-testid') || undefined,
          role: el.getAttribute('role') || undefined,
        });
      });

      // Links
      document.querySelectorAll('a[href]').forEach((el) => {
        elements.push({
          tag: 'a',
          text: el.textContent?.trim().substring(0, 50),
          id: el.id,
          testId: el.getAttribute('data-testid') || undefined,
        });
      });

      // Inputs
      document.querySelectorAll('input').forEach((el) => {
        elements.push({
          tag: 'input',
          type: el.type,
          id: el.id,
          name: el.name,
          testId: el.getAttribute('data-testid') || undefined,
        });
      });

      // Forms
      document.querySelectorAll('form').forEach((el) => {
        elements.push({
          tag: 'form',
          id: el.id,
          testId: el.getAttribute('data-testid') || undefined,
        });
      });

      return elements.slice(0, 50); // Limit to first 50 elements
    });
  }

  private extractCodeFromMarkdown(text: string): string {
    // Extract code from markdown code blocks
    const codeBlockRegex = /```(?:typescript|ts)?\n([\s\S]*?)```/;
    const match = text.match(codeBlockRegex);

    if (match) {
      return match[1].trim();
    }

    // If no code block found, return as is (might already be clean code)
    return text.trim();
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Usage: npm run ai:generate <url> [description]

Example:
  npm run ai:generate https://example.com "Login flow tests"
    `);
    process.exit(1);
  }

  const generator = new TestGenerator();
  const [url, ...descriptionParts] = args;
  const description = descriptionParts.join(' ');

  generator
    .generateTests({ url, description })
    .then((filePath) => {
      console.log(`\n🎉 Tests saved to: ${filePath}`);
      console.log('\nRun them with: npm test');
    })
    .catch((error) => {
      console.error('❌ Error generating tests:', error);
      process.exit(1);
    });
}

export default TestGenerator;
