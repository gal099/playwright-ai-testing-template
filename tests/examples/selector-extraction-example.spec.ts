import { test, expect } from '@playwright/test';
import { SelectorExtractor } from '../../utils/ai-helpers/selector-extractor';

/**
 * Example: Automatic Selector Extraction with AI Vision
 *
 * This example demonstrates how to use the SelectorExtractor to automatically
 * identify interactive elements on a page and generate Playwright selectors.
 *
 * This feature is used internally by the /new-screen command to eliminate
 * manual codegen exploration.
 *
 * IMPORTANT: This test requires ANTHROPIC_API_KEY in .env and will make
 * real API calls (~$0.08 per extraction using Sonnet model).
 *
 * Cost: ~$0.08 per extraction (Sonnet model for AI vision)
 * Time: ~5-10 seconds per page analysis
 */

test.describe('Selector Extraction - AI Vision', () => {
  test.skip(
    !process.env.ANTHROPIC_API_KEY,
    'Skipping: ANTHROPIC_API_KEY not configured'
  );

  /**
   * Example 1: Extract selectors from Playwright.dev login page
   *
   * This is a real-world example showing how the extractor analyzes
   * a page and returns structured selector data.
   */
  test('should extract selectors from a login-style page', async () => {
    const extractor = new SelectorExtractor();

    // Note: Using Playwright.dev docs page as an example
    // In real usage, you'd use your APP_URL from .env
    const url = 'https://playwright.dev/';
    const pageType = 'documentation homepage';

    console.log('\n🚀 Starting selector extraction...');
    console.log(`📍 URL: ${url}`);
    console.log(`📝 Page Type: ${pageType}`);

    const result = await extractor.extractSelectors(url, pageType, {
      waitTime: 2000,
      fullPage: true,
    });

    console.log('\n✅ Extraction Results:');
    console.log(`   Confidence: ${result.confidence}`);
    console.log(`   Selectors found: ${Object.keys(result.selectors).length}`);
    console.log(`   Error selectors: ${result.errorSelectors.length}`);
    console.log(`   Redirect URL: ${result.redirectUrl}`);
    console.log(`   Load timing: ${result.timing.loadTime}`);
    console.log(`   Async operations: ${result.timing.asyncOperations}`);

    console.log('\n📋 Identified Selectors:');
    Object.entries(result.selectors).forEach(([name, selector]) => {
      console.log(`   ${name}: ${selector}`);
    });

    // Verify result structure
    expect(result).toBeDefined();
    expect(result.selectors).toBeDefined();
    expect(typeof result.selectors).toBe('object');
    expect(Object.keys(result.selectors).length).toBeGreaterThan(0);

    // Verify confidence score
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);

    // Verify timing configuration
    expect(['load', 'networkidle', 'domcontentloaded']).toContain(
      result.timing.loadTime
    );
    expect(typeof result.timing.asyncOperations).toBe('boolean');

    // Verify redirect URL is a string (can be empty)
    expect(typeof result.redirectUrl).toBe('string');

    // Verify error selectors is an array
    expect(Array.isArray(result.errorSelectors)).toBe(true);
  });

  /**
   * Example 2: Understanding confidence scores
   *
   * The confidence score indicates selector stability:
   * - 1.0: All selectors use data-testid or stable attributes
   * - 0.8-0.9: Mix of stable and moderately stable selectors
   * - 0.6-0.7: Some selectors rely on text or structure
   * - <0.6: Many fragile selectors (should consider manual review)
   */
  test('should provide confidence score for selector quality', async () => {
    const extractor = new SelectorExtractor();

    const result = await extractor.extractSelectors(
      'https://playwright.dev/',
      'homepage'
    );

    console.log(`\n📊 Confidence Score: ${result.confidence}`);

    if (result.confidence >= 0.8) {
      console.log('✅ High confidence - selectors are stable');
    } else if (result.confidence >= 0.6) {
      console.log('⚠️  Medium confidence - review selectors manually');
    } else {
      console.log('❌ Low confidence - manual codegen recommended');
    }

    // Confidence should always be between 0 and 1
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  /**
   * Example 3: Error handling - Invalid URL
   *
   * Shows how the extractor handles errors gracefully.
   */
  test('should fail gracefully with invalid URL', async () => {
    const extractor = new SelectorExtractor();

    await expect(async () => {
      await extractor.extractSelectors(
        'https://this-domain-does-not-exist-12345.com',
        'invalid page'
      );
    }).rejects.toThrow();
  });

  /**
   * Example 4: Demonstrating usage in helper creation
   *
   * This shows how extracted selectors would be used in a real helper class.
   */
  test('should generate selectors usable in helper methods', async () => {
    const extractor = new SelectorExtractor();

    const result = await extractor.extractSelectors(
      'https://playwright.dev/',
      'homepage'
    );

    console.log('\n🔧 How to use these selectors in a helper:');
    console.log('\n```typescript');
    console.log('export class HomepageHelper {');

    // Show example helper methods using extracted selectors
    Object.entries(result.selectors).slice(0, 3).forEach(([name, selector]) => {
      console.log(`  async click${name.charAt(0).toUpperCase() + name.slice(1)}(page: Page) {`);
      console.log(`    await page.locator('${selector}').click();`);
      console.log(`  }\n`);
    });

    console.log('  async navigateTo(page: Page) {');
    console.log(`    await page.goto(url);`);
    console.log(`    await page.waitForLoadState('${result.timing.loadTime}');`);
    console.log('  }');
    console.log('}');
    console.log('```\n');

    // Verify we can access selectors for code generation
    expect(Object.keys(result.selectors).length).toBeGreaterThan(0);
  });

  /**
   * Example 5: Timing configuration usage
   *
   * Shows how timing information helps generate better helper code.
   */
  test('should provide timing configuration for helper methods', async () => {
    const extractor = new SelectorExtractor();

    const result = await extractor.extractSelectors(
      'https://playwright.dev/',
      'homepage'
    );

    console.log('\n⏱️  Timing Configuration:');
    console.log(`   Load State: ${result.timing.loadTime}`);
    console.log(`   Has Async Operations: ${result.timing.asyncOperations}`);

    console.log('\n💡 This tells us:');
    if (result.timing.loadTime === 'networkidle') {
      console.log('   - Page has network requests, wait for networkidle');
    }
    if (result.timing.asyncOperations) {
      console.log('   - Page has dynamic content, may need additional waits');
    }

    // Verify timing data is actionable
    expect(result.timing.loadTime).toBeDefined();
    expect(result.timing.asyncOperations).toBeDefined();
  });
});

/**
 * Additional Notes for Framework Users:
 *
 * 1. Cost Awareness:
 *    - Each extraction costs ~$0.08 (Sonnet AI vision)
 *    - Results are NOT cached (each page is unique)
 *    - Results are saved in generated helper code for reuse
 *
 * 2. When to Use:
 *    - Automating test creation with /new-screen command
 *    - Quick analysis of new pages without manual exploration
 *    - Understanding page structure before writing tests
 *
 * 3. When NOT to Use:
 *    - Complex multi-step flows (extract each step separately)
 *    - Pages requiring authentication (not yet supported)
 *    - Pages with extensive JavaScript/dynamic content (may need manual review)
 *
 * 4. Fallback Strategy:
 *    - If confidence < 0.6, consider manual codegen verification
 *    - If extraction fails, fall back to traditional codegen workflow
 *    - Always validate selectors against actual page before committing
 *
 * 5. Integration with /new-screen:
 *    - The /new-screen command uses this automatically in Phase 1
 *    - No manual codegen needed anymore!
 *    - User only needs to approve extracted selectors
 */
