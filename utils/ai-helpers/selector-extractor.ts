import { chromium, Browser, Page } from '@playwright/test';
import { aiClient } from '../../config/ai-client';

/**
 * Result of selector extraction from a page
 */
export interface SelectorExtractionResult {
  /** Map of element names to Playwright selectors */
  selectors: Record<string, string>;
  /** Expected redirect URL after successful action */
  redirectUrl: string;
  /** Selectors for error message elements */
  errorSelectors: string[];
  /** Timing configuration for the page */
  timing: {
    loadTime: 'load' | 'networkidle' | 'domcontentloaded';
    asyncOperations: boolean;
  };
  /** Confidence score (0.0-1.0) for the extraction quality */
  confidence: number;
}

/**
 * Options for selector extraction
 */
export interface SelectorExtractionOptions {
  /** Whether the page requires authentication (will skip if true) */
  requireAuth?: boolean;
  /** Custom wait time in milliseconds before capturing screenshot */
  waitTime?: number;
  /** Whether to capture full page or just viewport */
  fullPage?: boolean;
}

/**
 * Automatically extracts Playwright selectors from a page using AI vision.
 *
 * This utility combines screenshot capture, DOM analysis, and AI vision
 * to identify interactive elements and generate stable Playwright selectors.
 *
 * @example
 * ```typescript
 * const extractor = new SelectorExtractor();
 * const result = await extractor.extractSelectors(
 *   'https://example.com/login',
 *   'login'
 * );
 * console.log(result.selectors); // { emailInput: "input[name='email']", ... }
 * ```
 */
export class SelectorExtractor {
  /**
   * Extract selectors from a page using AI vision analysis
   *
   * @param url - The URL of the page to analyze
   * @param pageType - Description of page type (e.g., "login", "register", "dashboard")
   * @param options - Optional configuration
   * @returns Structured selector data with confidence score
   */
  async extractSelectors(
    url: string,
    pageType: string,
    options: SelectorExtractionOptions = {}
  ): Promise<SelectorExtractionResult> {
    const {
      requireAuth = false,
      waitTime = 2000,
      fullPage = true,
    } = options;

    // Handle authentication-required pages
    if (requireAuth) {
      throw new Error(
        'Pages requiring authentication are not yet supported for automatic extraction. ' +
        'Please use manual codegen exploration or log in first.'
      );
    }

    console.log(`📸 Capturing screenshot from: ${url}`);
    console.log(`🔍 Analyzing ${pageType} page...`);

    let browser: Browser | null = null;

    try {
      // Step 1: Launch browser and navigate to page
      browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();

      await page.goto(url);
      await page.waitForLoadState('networkidle');

      // Additional wait for dynamic content
      if (waitTime > 0) {
        await page.waitForTimeout(waitTime);
      }

      // Step 2: Capture screenshot
      const screenshot = await page.screenshot({ fullPage });
      const screenshotBase64 = screenshot.toString('base64');

      // Step 3: Extract DOM structure
      const domStructure = await this.extractInteractiveElements(page);

      // Step 4: Use AI vision to identify elements and generate selectors
      const result = await this.analyzeWithAI(
        screenshotBase64,
        domStructure,
        pageType
      );

      await browser.close();

      console.log(`✅ Selector extraction complete (confidence: ${result.confidence})`);

      return result;

    } catch (error) {
      if (browser) {
        await browser.close();
      }

      if (error instanceof Error) {
        console.error(`❌ Selector extraction failed: ${error.message}`);
        throw new Error(`Failed to extract selectors: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Extract interactive elements from the page DOM
   * Reuses pattern from test-case-planner.ts and self-healing.ts
   *
   * @param page - Playwright page instance
   * @returns Array of element metadata
   */
  private async extractInteractiveElements(page: Page): Promise<any[]> {
    const elements = await page.evaluate(() => {
      const extractedElements: any[] = [];

      // Helper function to get element info with full attributes
      const getElementInfo = (el: Element, type: string) => {
        const attributes: Record<string, string> = {};
        Array.from(el.attributes).forEach((attr) => {
          attributes[attr.name] = attr.value;
        });

        return {
          type,
          tag: el.tagName.toLowerCase(),
          text: el.textContent?.trim().substring(0, 100) || '',
          id: (el as HTMLElement).id || undefined,
          name: (el as any).name || undefined,
          testId: el.getAttribute('data-testid') || undefined,
          role: el.getAttribute('role') || undefined,
          ariaLabel: el.getAttribute('aria-label') || undefined,
          placeholder: (el as any).placeholder || undefined,
          inputType: (el as HTMLInputElement).type || undefined,
          buttonType: (el as HTMLButtonElement).type || undefined,
          href: (el as HTMLAnchorElement).href || undefined,
          classes: Array.from(el.classList),
          attributes,
        };
      };

      // Extract buttons
      document.querySelectorAll('button').forEach((el) => {
        extractedElements.push(getElementInfo(el, 'button'));
      });

      // Extract links
      document.querySelectorAll('a[href]').forEach((el) => {
        extractedElements.push(getElementInfo(el, 'link'));
      });

      // Extract inputs
      document.querySelectorAll('input').forEach((el) => {
        extractedElements.push(getElementInfo(el, 'input'));
      });

      // Extract selects
      document.querySelectorAll('select').forEach((el) => {
        extractedElements.push(getElementInfo(el, 'select'));
      });

      // Extract textareas
      document.querySelectorAll('textarea').forEach((el) => {
        extractedElements.push(getElementInfo(el, 'textarea'));
      });

      // Extract forms
      document.querySelectorAll('form').forEach((el) => {
        extractedElements.push(getElementInfo(el, 'form'));
      });

      // Extract elements with button/link roles
      document.querySelectorAll('[role="button"], [role="link"]').forEach((el) => {
        // Avoid duplicates
        if (el.tagName.toLowerCase() !== 'button' && el.tagName.toLowerCase() !== 'a') {
          extractedElements.push(getElementInfo(el, 'role-element'));
        }
      });

      // Limit to 100 most relevant elements to manage token usage
      return extractedElements.slice(0, 100);
    });

    return elements;
  }

  /**
   * Analyze screenshot and DOM with AI vision to generate selectors
   *
   * @param screenshotBase64 - Base64 encoded screenshot
   * @param domStructure - Extracted DOM elements
   * @param pageType - Type of page being analyzed
   * @returns Parsed selector extraction result
   */
  private async analyzeWithAI(
    screenshotBase64: string,
    domStructure: any[],
    pageType: string
  ): Promise<SelectorExtractionResult> {
    const prompt = `
Analyze this ${pageType} page screenshot and DOM structure to identify interactive elements and generate Playwright selectors.

DOM Structure (Interactive Elements):
${JSON.stringify(domStructure, null, 2)}

Your task:
1. Identify ALL interactive elements visible in the screenshot
2. Match them to elements in the DOM structure
3. Generate the BEST Playwright selector for each element

For a ${pageType} page, identify:
- Input fields with their purpose (email, password, username, search, etc.)
- Primary action button (submit/login/register/save button)
- Secondary actions (cancel, back, forgot password, etc.)
- Navigation links (register, help, terms, home, etc.)
- Error message locations
- Success indicators (checkmarks, success messages)
- Expected redirect URL after successful action

Selector Priority (use in this order):
1. [data-testid="..."] (MOST PREFERRED - stable and explicit)
2. [name="..."] (for form inputs)
3. [aria-label="..."] or [role="..."] (accessibility attributes)
4. button:has-text("...") or link:has-text("...") (for unique text)
5. input[type="..."] (for inputs without better attributes)
6. CSS selector (LAST RESORT - avoid classes when possible)

Return ONLY a valid JSON object with this exact structure:
{
  "selectors": {
    "elementName": "playwright-selector",
    "anotherElement": "another-selector"
  },
  "redirectUrl": "/expected/path/after/success",
  "errorSelectors": ["selector-for-error-message"],
  "timing": {
    "loadTime": "networkidle",
    "asyncOperations": false
  },
  "confidence": 0.95
}

Rules:
- Use camelCase for element names (e.g., emailInput, submitButton, forgotPasswordLink)
- Return ONLY the JSON object, no explanation before or after
- Include confidence score (0.0-1.0) based on:
  * 1.0 = All elements have data-testid or stable attributes
  * 0.8-0.9 = Mix of stable and moderately stable selectors
  * 0.6-0.7 = Some selectors rely on text or structure
  * <0.6 = Many fragile selectors (classes, complex CSS)
- If multiple elements match, choose the most visible/primary one
- For timing.loadTime, choose: "load", "networkidle", or "domcontentloaded"
- Set asyncOperations: true if page has dynamic content/AJAX/SPAs
- For redirectUrl, predict where user goes after successful action (or empty string if stays on same page)

Be specific, accurate, and prefer stable selectors over fragile ones.
`;

    try {
      const response = await aiClient.askWithImage(
        prompt,
        screenshotBase64,
        'image/png',
        { model: 'sonnet', maxTokens: 2048 }
      );

      // Parse AI response
      const jsonStr = this.extractJSON(response);
      const result = JSON.parse(jsonStr);

      // Validate result structure
      this.validateResult(result);

      return result as SelectorExtractionResult;

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`AI vision analysis failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Extract JSON from AI response (handles markdown code blocks)
   * Reuses pattern from existing AI helpers
   *
   * @param text - AI response text
   * @returns Extracted JSON string
   */
  private extractJSON(text: string): string {
    // Try to extract from code block first
    const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }

    // Try to find JSON object directly
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return jsonMatch[0];
    }

    // Return as-is and let JSON.parse fail with clear error
    return text.trim();
  }

  /**
   * Validate the structure of AI response
   *
   * @param result - Parsed JSON result
   * @throws Error if result is invalid
   */
  private validateResult(result: any): void {
    if (!result || typeof result !== 'object') {
      throw new Error('AI response is not a valid object');
    }

    if (!result.selectors || typeof result.selectors !== 'object') {
      throw new Error('Result missing "selectors" object');
    }

    if (typeof result.redirectUrl !== 'string') {
      throw new Error('Result missing "redirectUrl" string');
    }

    if (!Array.isArray(result.errorSelectors)) {
      throw new Error('Result missing "errorSelectors" array');
    }

    if (!result.timing || typeof result.timing !== 'object') {
      throw new Error('Result missing "timing" object');
    }

    if (
      !['load', 'networkidle', 'domcontentloaded'].includes(result.timing.loadTime)
    ) {
      throw new Error('Invalid timing.loadTime value');
    }

    if (typeof result.timing.asyncOperations !== 'boolean') {
      throw new Error('timing.asyncOperations must be boolean');
    }

    if (
      typeof result.confidence !== 'number' ||
      result.confidence < 0 ||
      result.confidence > 1
    ) {
      throw new Error('confidence must be a number between 0 and 1');
    }

    // Validate that we have at least some selectors
    if (Object.keys(result.selectors).length === 0) {
      throw new Error('No selectors were extracted from the page');
    }
  }
}
