# Test Generation Example

This document explains how to use the AI-powered test generator to automatically create test files.

## Basic Usage

Generate tests for any URL:

```bash
npm run ai:generate https://your-app.com
```

## With Description

Provide context to generate more targeted tests:

```bash
npm run ai:generate https://your-app.com/login "Test the login flow with email and password"
```

## What Gets Generated

The test generator will:

1. **Visit the URL** and take screenshots
2. **Analyze the page** structure and interactive elements
3. **Use AI vision** to understand the UI
4. **Generate comprehensive tests** including:
   - Element visibility checks
   - User interaction flows
   - Form submissions
   - Navigation tests
   - Proper assertions

## Example Output

```typescript
// Generated test file will look like this:
import { test, expect } from '@playwright/test';

test.describe('Generated Tests for Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://your-app.com/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/dashboard/);
  });
});
```

## Generated Test Location

Tests are saved to `tests/generated/` with timestamps:
- `tests/generated/generated-test-2025-12-19T15-30-00.spec.ts`

## Tips

1. **Be specific in descriptions**: Better descriptions lead to better tests
2. **Review generated tests**: Always review and adjust to match your needs
3. **Use as starting point**: Generated tests are a foundation to build upon
4. **Combine with manual tests**: Mix AI-generated with hand-crafted tests

## Programmatic Usage

You can also use the generator programmatically:

```typescript
import TestGenerator from './utils/ai-helpers/test-generator';

const generator = new TestGenerator();

await generator.generateTests({
  url: 'https://your-app.com',
  description: 'Shopping cart checkout flow',
  outputPath: './tests/checkout',
  exploreDuration: 3000 // Wait time for page load
});
```

## Configuration

Adjust these environment variables in `.env`:

```bash
# Enable/disable test generation
ENABLE_TEST_GENERATION=true

# Model to use for generation
AI_MODEL=claude-3-5-sonnet-20241022

# How much detail to generate
AI_MAX_TOKENS=4096
```
