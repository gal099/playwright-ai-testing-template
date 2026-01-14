# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Code Standards

**IMPORTANT: All code, comments, test descriptions, and AI-generated content MUST be in English.**

- **Code**: Variable names, function names, class names, interfaces, types → English
- **Comments**: Inline comments, JSDoc, file headers → English
- **Tests**: Test descriptions, test case IDs, assertions, helper methods → English
- **AI generations**: When using `npm run ai:generate` or any AI helper, ensure prompts explicitly request English output
- **Documentation**: Exception - user-facing docs can be localized, but technical/code documentation stays in English

This ensures consistency and maintainability as this is a public template repository used internationally.

## Project Overview

This is an **AI-Powered Playwright Testing Framework** template for E2E testing. It combines traditional Playwright testing with Claude AI capabilities for intelligent test generation, self-healing selectors, and AI-powered assertions.

**To use this template**: Configure `.env` with your application URL and credentials, then start writing tests!

---

## 🤖 Claude Code Commands

These commands help you work efficiently with the framework:

### `/new-screen <screen_name>`
Automate tests for a new screen or feature.

**When to use:** Starting to test a new page, screen, or feature area.

**What it does:**
- Guides you through exploring the UI with codegen
- Helps create helper file with best practices
- Creates test file and P2/P3 documentation
- Implements P1 tests only (critical path)
- Ensures helper-first approach

**Example:**
```
/new-screen "login page"
```

---

### `/fix-test [test_name]`
Fix a failing test.

**When to use:** A test is failing and you need to debug and fix it.

**What it does:**
- Helps reproduce and diagnose the failure
- Identifies common issues (selector, timing, assertion, auth)
- Guides you through fixing in helper (not test)
- Ensures all tests pass before committing

**Example:**
```
/fix-test "TC-LG-001"
```

---

### `/add-coverage <feature_name>`
Add more test coverage to an existing feature.

**When to use:** You have existing tests and want to add more coverage.

**What it does:**
- Reviews existing tests and P2/P3 documentation
- Helps select which tests to implement
- Extends existing helper with new methods
- Updates P2/P3 docs to mark implemented tests

**Example:**
```
/add-coverage "login"
```

---

### `/review-changes [base_branch]`
Get comprehensive AI review before creating PR.

**When to use:** Before creating a pull request to get feedback on your changes.

**What it does:**
- Analyzes all files changed in your branch
- Reviews code quality, test coverage, and documentation
- Checks for common issues and best practices
- Provides actionable feedback with severity levels
- Reports: Ready for PR / Needs Changes / Blocked

**Example:**
```
/review-changes
/review-changes main
```

**When to run:**
- After all tests pass (`npm test`)
- Before creating pull request
- After addressing previous review feedback

---

## Commands Reference

### Running Tests

```bash
# Run all tests
npm test

# Run in headed mode (see browser)
npm run test:headed

# Open Playwright UI mode
npm run test:ui

# Debug a specific test
npm run test:debug

# Generate test code interactively
npm run test:codegen

# View HTML report
npm run test:report
```

### Running Specific Tests

```bash
# Run single test file
npx playwright test tests/example-feature/example-p1.spec.ts

# Run single test by name
npx playwright test -g "TC-EX-001"

# Run with single worker (avoids session conflicts)
npx playwright test --workers=1

# Run specific project (browser)
npx playwright test --project=chromium
```

### AI Features

```bash
# Generate tests from URL (uses AI vision)
npm run ai:generate <url> [description]

# Analyze test suite quality
npm run ai:maintain analyze

# Refactor a test file (preview)
npm run ai:maintain refactor tests/example.spec.ts

# Apply refactoring
npm run ai:maintain refactor tests/example.spec.ts --apply

# Update selector across all tests
npm run ai:maintain update-selector ".old" "[data-testid='new']"
```

## Architecture

### AI Model Strategy

The framework uses **multi-model optimization** to balance cost and quality:

- **Haiku** (cheap, fast): Self-healing selectors, semantic assertions, data validation
- **Sonnet** (balanced): Test generation, visual assertions, layout checks, accessibility, refactoring
- **Opus** (expensive, best): Fallback for complex cases (rarely used)

Model selection is automatic based on feature complexity. See `docs/AI-MODEL-STRATEGY.md` for cost analysis.

### Test Organization

Tests are organized by **priority** and **feature area**:

```
tests/
├── examples/              # Example tests showing AI features
├── example-feature/       # Replace with your features
│   └── example-p1.spec.ts # P1 (high priority) tests
```

**Priority system**:
- **P1 (Alta)**: Critical path, must pass, implemented first
- **P2 (Media)**: Important features, documented in `docs/*-P2-P3-TESTS.md`
- **P3 (Baja)**: Nice-to-have, edge cases, documented in `docs/*-P2-P3-TESTS.md`

P2 and P3 tests are documented but not implemented to avoid test bloat. Implement them when explicitly needed.

### Helpers Architecture

**API Helpers** (`utils/api/`):
- `auth-helper.ts`: Authentication operations
- `example-helper.ts`: Template for feature-specific helpers
- `otp-helper.ts`: OTP/verification code extraction from emails
- `email-providers/`: Email provider integrations (Mailtrap, etc.)

**AI Helpers** (`utils/ai-helpers/`):
- `test-generator.ts`: Generate tests from screenshots using AI vision
- `ai-assertions.ts`: Intelligent assertions (visual, semantic, layout, a11y)
- `test-maintainer.ts`: Analyze and refactor test code
- `otp-extractor.ts`: AI-powered OTP extraction from emails

**Selectors** (`utils/selectors/`):
- `self-healing.ts`: Auto-repair broken selectors using AI vision + DOM analysis
- Caches results in `.selector-cache.json` (commit this file to share with team)

**Config** (`config/`):
- `ai-client.ts`: Unified Claude API client with multi-model support

### Key Design Patterns

#### 1. Multi-User Testing with Browser Contexts

Tests that need different user roles use **separate browser contexts**:

```typescript
test('multi-user flow', async ({ browser }) => {
  // Context 1: Admin
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  // ... perform admin actions
  await adminContext.close();

  // Context 2: Regular User
  const userContext = await browser.newContext();
  const userPage = await userContext.newPage();
  // ... verify changes visible to user
  await userContext.close();
});
```

#### 2. Helper-Based Test Structure

Never write raw navigation code in tests. Always use helpers:

```typescript
// ✅ GOOD
await helper.navigateToFeature(page);
await helper.performAction(page, options);

// ❌ BAD
await page.goto(url);
await page.click('button');
// ... manual steps
```

#### 3. Self-Healing Selectors (Optional)

Use AI fixtures for self-healing when selectors are unstable:

```typescript
import { test } from './fixtures/ai-fixtures';

test('with self-healing', async ({ aiPage, smartLocator }) => {
  const button = await smartLocator(
    '[data-testid="submit"]',
    'Submit button in the form'  // AI uses this if selector fails
  );
  await button.click();
});
```

#### 4. OTP Authentication

For authentication flows requiring email-based verification codes (OTP):

```typescript
import { OTPHelper } from './utils/api/otp-helper';

test('login with OTP', async ({ page }) => {
  // Initialize from environment variables
  const otpHelper = OTPHelper.fromEnv();

  // Clear inbox before test (optional)
  await otpHelper.clearInbox();

  // Trigger OTP email
  await page.fill('[name="email"]', process.env.USER_EMAIL);
  await page.click('button:text("Send Code")');

  // Wait for email and extract OTP (with AI or regex)
  const otpCode = await otpHelper.waitForOTP({
    maxWaitMs: 30000,
    filterSubject: 'código'  // Optional filter
  });

  // Enter OTP and verify
  await page.fill('[name="otp"]', otpCode);
  await page.click('button:text("Verify")');

  await expect(page).toHaveURL(/dashboard/);
});
```

**Features:**
- Supports Mailtrap (extensible to other providers)
- AI-powered extraction (~$0.0001/OTP using Haiku)
- Regex fallback if AI disabled
- Polling with configurable timeout
- Email filtering by subject/sender

See `tests/examples/otp-auth-example.spec.ts` for complete examples.

## Environment Variables

Required `.env` variables:

```bash
# Application Configuration
APP_URL=http://localhost:3000

# User Credentials (for different roles)
ADMIN_USER=admin@example.com
ADMIN_PASS=admin-password
USER_EMAIL=user@example.com
USER_PASS=user-password

# AI Features (optional - disable if no API key)
ANTHROPIC_API_KEY=sk-ant-...
ENABLE_SELF_HEALING=true
ENABLE_AI_ASSERTIONS=true
ENABLE_TEST_GENERATION=false

# AI Configuration
AI_MODEL=claude-3-5-sonnet-20241022
AI_MAX_TOKENS=4096

# OTP / Email Testing (optional - required for OTP authentication)
MAILTRAP_API_TOKEN=your_token_here
MAILTRAP_ACCOUNT_ID=your_account_id
MAILTRAP_INBOX_ID=your_inbox_id
ENABLE_OTP_AI_EXTRACTION=true
```

## Common Patterns & Gotchas

### Parallel Test Execution Issues

**Problem**: Login sessions conflict when tests run in parallel.

**Solution**: Run with `--workers=1` for tests sharing user sessions:

```bash
npx playwright test tests/feature/ --workers=1
```

### TypeScript Configuration

**Problem**: DOM types not available.

**Solution**: Already configured in `tsconfig.json` with `"lib": ["ES2020", "DOM"]`.

### AI Cost Management

- Self-healing caches results in `.selector-cache.json` (commit to repo)
- AI assertions are expensive (~$0.01-0.02 each), use selectively
- Disable AI features in CI/CD for faster smoke tests:
  ```bash
  ENABLE_SELF_HEALING=false ENABLE_AI_ASSERTIONS=false npm test
  ```

## Test Documentation

When creating new test areas:

1. Implement only **P1 (high priority)** tests
2. Document P2 and P3 tests in `docs/{FEATURE}-P2-P3-TESTS.md`
3. Include full test specifications (preconditions, steps, expected results)
4. Reference test case IDs (e.g., TC-FT-001) in test descriptions

Example:
```typescript
test('TC-FT-001: User can access feature screen', async ({ page }) => {
  // Test implementation
});
```

## File Ignores

The `.claudeignore` file is optimized to avoid wasting tokens on:
- `node_modules/`
- `test-results/` and `playwright-report/` (large JSON/HTML files)
- `*.log`, `*.trace.zip`, video files
- Build outputs, coverage reports
- IDE and OS files

Keep screenshots visible by default (may be needed for AI analysis).

## Adding New Test Areas

When testing a new screen/feature, use the `/new-screen` command for guided workflow, or follow these steps manually:

1. **Explore the UI first**:
   ```bash
   npm run test:codegen
   ```

2. **Create helper methods** in `utils/api/{feature}-helper.ts`:
   ```typescript
   export class FeatureHelper {
     async navigateToFeature(page: Page): Promise<void> { ... }
     async performAction(page: Page, options: Options): Promise<Result> { ... }
   }
   ```

3. **Identify test cases by priority** (P1/P2/P3)

4. **Implement P1 tests** in `tests/{feature}/{feature}-p1.spec.ts`

5. **Document P2/P3 tests** in `docs/{FEATURE}-P2-P3-TESTS.md`

**Tip:** The `/new-screen <screen_name>` command automates this entire workflow for you.

## AI Feature Toggles

The framework is **hybrid** - works with or without AI features:

- **Traditional Playwright**: Always available, no API key needed
- **AI Features**: Optional, require `ANTHROPIC_API_KEY`
  - Test generation: `npm run ai:generate`
  - Self-healing: `import { test } from './fixtures/ai-fixtures'`
  - AI assertions: Use `aiAssertions` fixture
  - Maintenance: `npm run ai:maintain`

Use AI features judiciously to balance quality and cost.
