import { test, expect } from '@playwright/test';
import { ExampleHelper } from '../../utils/api/example-helper';

/**
 * Example Feature - P1 (High Priority) Tests
 *
 * Replace this with your actual feature tests
 */

const exampleHelper = new ExampleHelper();

test.describe('Example Feature - P1 Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Navigate to your app
    await page.goto(process.env.APP_URL || 'http://localhost:3000');
  });

  test('TC-EX-001: Basic navigation test', async ({ page }) => {
    // Example test - replace with your actual tests
    await expect(page).toHaveTitle(/Your App/);
  });

  test('TC-EX-002: Example with helper', async ({ page }) => {
    // Use helpers for common operations
    await exampleHelper.performAction(page);

    // Add assertions
    const result = await exampleHelper.verifyState(page);
    expect(result).toBe(true);
  });
});
