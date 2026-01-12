import { test, expect } from '../../fixtures/ai-fixtures';

/**
 * AI Features Example
 *
 * This example demonstrates all the AI-powered testing capabilities:
 * 1. Self-healing selectors
 * 2. Visual assertions
 * 3. Semantic content validation
 * 4. Layout verification
 * 5. Accessibility checks
 *
 * Note: These tests use the Playwright website as an example.
 * Replace with your actual application URL and selectors.
 */

test.describe('AI-Powered Testing Features', () => {
  test.beforeEach(async ({ aiPage }) => {
    await aiPage.goto('https://playwright.dev');
  });

  test('self-healing selectors', async ({ aiPage, smartLocator }) => {
    // smartLocator will attempt to heal the selector if it fails
    // It uses AI to find alternative selectors based on visual context

    // If this selector breaks, AI will try to find it by description
    const getStartedButton = await smartLocator(
      'a[href="/docs/intro"]',
      'Get started button or link'
    );

    await getStartedButton.click();
    await expect(aiPage).toHaveURL(/.*intro/);
  });

  test('visual state assertion', async ({ aiPage, aiAssertions }) => {
    // AI analyzes a screenshot to verify the visual state matches description
    await aiAssertions.expectVisualState(
      aiPage,
      'The page shows a modern documentation website with a prominent hero section and navigation bar'
    );
  });

  test('semantic content validation', async ({ aiPage, aiAssertions }) => {
    // Validates that text content matches semantic meaning
    // Doesn't require exact text match - AI understands synonyms and paraphrasing

    const heading = aiPage.locator('h1').first();

    await aiAssertions.expectSemanticContent(
      aiPage,
      'h1',
      'A framework for automated testing across multiple browsers'
    );
  });

  test('layout verification', async ({ aiPage, aiAssertions }) => {
    // AI analyzes the visual layout and verifies it matches expectations
    await aiAssertions.expectLayout(
      aiPage,
      'The navigation bar is at the top with logo on the left and menu items on the right. Below is a hero section with centered text.'
    );
  });

  test('accessibility check', async ({ aiPage, aiAssertions }) => {
    // AI performs comprehensive accessibility analysis
    // Checks both programmatic and visual accessibility issues
    await aiAssertions.expectAccessible(aiPage);
  });

  test('focused accessibility check', async ({ aiPage, aiAssertions }) => {
    // Check specific accessibility concerns
    await aiAssertions.expectAccessible(
      aiPage,
      'navigation and interactive elements'
    );
  });

  test('combining AI and standard assertions', async ({ aiPage, aiAssertions }) => {
    // You can mix AI assertions with standard Playwright assertions

    // Standard assertion
    await expect(aiPage).toHaveTitle(/Playwright/);

    // AI visual assertion
    await aiAssertions.expectVisualState(
      aiPage,
      'Page displays the Playwright logo and documentation structure'
    );

    // Standard assertion
    const getStarted = aiPage.getByRole('link', { name: /get started/i });
    await expect(getStarted).toBeVisible();

    await getStarted.click();

    // AI semantic assertion
    await aiAssertions.expectSemanticContent(
      aiPage,
      'h1',
      'Installation and introduction guide'
    );
  });

  test('data validation with context', async ({ aiPage, aiAssertions }) => {
    // Navigate to a page with version or date information
    await aiPage.goto('https://playwright.dev/docs/intro');

    // AI validates that displayed data makes sense in context
    // This is useful for validating dynamic content like dates, numbers, etc.
    const versionElement = aiPage.locator('.navbar__items').first();

    await aiAssertions.expectDataValid(
      aiPage,
      '.navbar__items',
      'Navigation menu with documentation sections and search'
    );
  });
});

test.describe('Self-Healing in Action', () => {
  test('fallback when selector changes', async ({ aiPage, smartLocator }) => {
    // This test demonstrates how self-healing works when selectors break

    await aiPage.goto('https://playwright.dev');

    // Try a selector that might not exist
    // The AI will attempt to find the element based on the description
    try {
      const docs = await smartLocator(
        '[data-testid="docs-link"]', // This probably doesn't exist
        'Documentation or Docs navigation link'
      );

      await docs.click();
      console.log('✅ Self-healing successfully found the element!');
    } catch (error) {
      console.log('❌ Even self-healing couldn\'t find it, but it tried!');
      // In a real test, you might want to use a different strategy here
    }
  });
});

test.describe('AI Assertions Best Practices', () => {
  test('when to use visual assertions', async ({ aiPage, aiAssertions }) => {
    // Use visual assertions when:
    // 1. Testing complex UI layouts
    // 2. Validating visual hierarchy
    // 3. Checking responsive design
    // 4. Verifying visual styling and themes

    await aiPage.goto('https://playwright.dev');

    await aiAssertions.expectVisualState(
      aiPage,
      'Professional documentation site with clear visual hierarchy and modern design'
    );
  });

  test('when to use semantic assertions', async ({ aiPage, aiAssertions }) => {
    // Use semantic assertions when:
    // 1. Text content might vary but meaning stays the same
    // 2. Testing internationalized content
    // 3. Validating dynamic content with similar meaning
    // 4. Checking error messages that might be reworded

    await aiPage.goto('https://playwright.dev/docs/intro');

    // Even if the exact wording changes, the meaning should match
    await aiAssertions.expectSemanticContent(
      aiPage,
      'h1',
      'Getting started with installation'
    );
  });
});
