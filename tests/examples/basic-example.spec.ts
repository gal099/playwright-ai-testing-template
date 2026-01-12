import { test, expect } from '../../fixtures/ai-fixtures';

/**
 * Basic Example Test
 *
 * This example shows standard Playwright testing with AI enhancements available.
 * The AI features are optional and can be enabled when needed.
 */

test.describe('Basic Example Tests', () => {
  test('standard test with regular Playwright', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Regular Playwright assertions work as expected
    await expect(page).toHaveTitle(/Playwright/);

    const getStarted = page.getByRole('link', { name: 'Get started' });
    await expect(getStarted).toBeVisible();
  });

  test('using AI-enhanced page', async ({ aiPage }) => {
    await aiPage.goto('https://playwright.dev');

    // The aiPage is just a regular page with AI capabilities available
    await expect(aiPage).toHaveTitle(/Playwright/);

    const getStarted = aiPage.getByRole('link', { name: 'Get started' });
    await expect(getStarted).toBeVisible();
    await getStarted.click();

    await expect(aiPage).toHaveURL(/.*intro/);
  });
});
