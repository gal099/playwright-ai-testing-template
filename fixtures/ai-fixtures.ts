import { test as base, Page } from '@playwright/test';
import { selfHealingSelector } from '../utils/selectors/self-healing';
import { aiAssert } from '../utils/ai-helpers/ai-assertions';

type AIFixtures = {
  aiPage: Page;
  smartLocator: (selector: string, description?: string) => ReturnType<typeof selfHealingSelector.findElement>;
  aiAssertions: typeof aiAssert;
};

/**
 * Extended Playwright test with AI capabilities
 *
 * Usage:
 * import { test, expect } from '../fixtures/ai-fixtures';
 *
 * test('my test', async ({ aiPage, smartLocator, aiAssertions }) => {
 *   await aiPage.goto('...');
 *   await smartLocator('button', 'submit button').click();
 *   await aiAssertions.expectVisualState(aiPage, 'success message is shown');
 * });
 */
export const test = base.extend<AIFixtures>({
  // Enhanced page with AI features
  aiPage: async ({ page }, use) => {
    // Setup: you can add any page-level AI enhancements here
    console.log('🤖 AI-enhanced page initialized');
    await use(page);
    // Teardown
  },

  // Smart locator with self-healing
  smartLocator: async ({ page }, use) => {
    await use((selector: string, description?: string) => {
      return selfHealingSelector.findElement(page, selector, description);
    });
  },

  // AI assertions helper
  aiAssertions: async ({}, use) => {
    await use(aiAssert);
  },
});

export { expect } from '@playwright/test';
