# Playwright AI Testing Template

> **Version 1.2.0** | [Changelog](CHANGELOG.md)

An **AI-powered Playwright testing framework** that combines traditional E2E testing with Claude AI capabilities for intelligent test generation, self-healing selectors, and AI-powered assertions.

## Features

- 🤖 **AI Integration**: Claude AI for test generation, self-healing, and intelligent assertions
- 📊 **Multi-Model Optimization**: Automatic model selection (Haiku/Sonnet/Opus) based on task complexity
- 🔄 **Self-Healing Selectors**: Automatically repair broken selectors using AI vision + DOM analysis
- 🎯 **Smart Assertions**: Visual, semantic, layout, and accessibility assertions powered by AI
- 📝 **Test Generation**: Generate tests from screenshots using AI vision
- 📧 **OTP Authentication**: Email-based verification code extraction with AI (Mailtrap integration)
- 🏗️ **Clean Architecture**: Organized by priority (P1/P2/P3) with helper-based patterns
- 💰 **Cost-Optimized**: Caching and smart model selection to minimize AI API costs

## Quick Start

### 1. Installation

```bash
npm install
```

### 2. Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:
- `APP_URL`: Your application URL
- `ADMIN_USER`, `ADMIN_PASS`: Admin credentials
- `ANTHROPIC_API_KEY`: For AI features (optional)

### 3. Run Tests

```bash
# Run all tests
npm test

# Run in headed mode
npm run test:headed

# Open Playwright UI
npm run test:ui

# Debug tests
npm run test:debug
```

## Project Structure

```
├── config/
│   └── ai-client.ts           # Unified Claude API client
├── docs/
│   ├── AI-MODEL-STRATEGY.md   # Cost optimization guide
│   └── EXAMPLE-P2-P3-TESTS.md # Test documentation template
├── fixtures/
│   └── ai-fixtures.ts         # AI-enhanced Playwright fixtures
├── tests/
│   ├── examples/              # Example tests showing AI features
│   └── example-feature/       # Feature tests organized by priority
├── utils/
│   ├── ai-helpers/            # AI-powered utilities
│   │   ├── test-generator.ts
│   │   ├── ai-assertions.ts
│   │   ├── test-maintainer.ts
│   │   └── otp-extractor.ts   # AI-powered OTP extraction
│   ├── api/                   # Feature-specific helpers
│   │   ├── auth-helper.ts
│   │   ├── example-helper.ts
│   │   ├── otp-helper.ts      # OTP authentication helper
│   │   └── email-providers/   # Email provider integrations
│   └── selectors/
│       └── self-healing.ts    # Auto-repair selectors
└── CLAUDE.md                  # Project guide for Claude Code
```

## AI Features

### Test Generation

Generate tests from screenshots:

```bash
npm run ai:generate <url> [description]
```

### Self-Healing Selectors

Use AI fixtures for automatic selector repair:

```typescript
import { test } from './fixtures/ai-fixtures';

test('with self-healing', async ({ aiPage, smartLocator }) => {
  const button = await smartLocator(
    '[data-testid="submit"]',
    'Submit button in the form'
  );
  await button.click();
});
```

### AI Assertions

Intelligent assertions for visual, semantic, and layout checks:

```typescript
import { test } from './fixtures/ai-fixtures';

test('AI assertions', async ({ aiPage, aiAssertions }) => {
  await aiAssertions.assertVisualState(
    aiPage,
    'The submit button should be visible and enabled'
  );
});
```

### OTP Authentication

Extract verification codes from emails with AI:

```typescript
import { OTPHelper } from './utils/api/otp-helper';

test('login with OTP', async ({ page }) => {
  const otpHelper = OTPHelper.fromEnv();

  await page.fill('[name="email"]', process.env.USER_EMAIL);
  await page.click('button:text("Send Code")');

  // Wait for email and extract OTP
  const otpCode = await otpHelper.waitForOTP({ maxWaitMs: 30000 });

  await page.fill('[name="otp"]', otpCode);
  await page.click('button:text("Verify")');
});
```

**Setup:**
1. Get Mailtrap API token from [mailtrap.io/api-tokens](https://mailtrap.io/api-tokens)
2. Add credentials to `.env`:
   ```bash
   MAILTRAP_API_TOKEN=your_token
   MAILTRAP_ACCOUNT_ID=your_account_id
   MAILTRAP_INBOX_ID=your_inbox_id
   ```
3. See `tests/examples/otp-auth-example.spec.ts` for complete examples

### Test Maintenance

Analyze and refactor test code:

```bash
# Analyze test suite
npm run ai:maintain analyze

# Refactor a test file
npm run ai:maintain refactor tests/example.spec.ts

# Update selectors across all tests
npm run ai:maintain update-selector ".old" "[data-testid='new']"
```

## Writing Tests

### 1. Create Feature Helper

```typescript
// utils/api/feature-helper.ts
export class FeatureHelper {
  async navigateToFeature(page: Page): Promise<void> {
    // Navigation logic
  }

  async performAction(page: Page, options: Options): Promise<Result> {
    // Action logic
  }
}
```

### 2. Write P1 Tests

```typescript
// tests/feature/feature-p1.spec.ts
import { test, expect } from '@playwright/test';
import { FeatureHelper } from '../../utils/api/feature-helper';

const helper = new FeatureHelper();

test('TC-FT-001: Test description', async ({ page }) => {
  await helper.navigateToFeature(page);
  const result = await helper.performAction(page);
  expect(result).toBeTruthy();
});
```

### 3. Document P2/P3 Tests

Document (but don't implement) lower-priority tests in `docs/FEATURE-P2-P3-TESTS.md`.

## Priority System

- **P1 (High)**: Critical path tests, must pass, implement first
- **P2 (Medium)**: Important features, document in `docs/`
- **P3 (Low)**: Edge cases, document in `docs/`

## Cost Optimization

The framework uses multi-model optimization to balance cost and quality:

- **Haiku** (cheap): Self-healing, semantic assertions (~$0.001 per call)
- **Sonnet** (balanced): Test generation, visual assertions (~$0.01 per call)
- **Opus** (expensive): Complex cases, fallback only (~$0.10 per call)

See `docs/AI-MODEL-STRATEGY.md` for detailed cost analysis.

## Configuration Files

- `playwright.config.ts`: Playwright configuration
- `tsconfig.json`: TypeScript configuration
- `.claudeignore`: Files to ignore for Claude Code
- `CLAUDE.md`: Project instructions for Claude Code

## CI/CD Integration

Disable AI features in CI for faster smoke tests:

```bash
ENABLE_SELF_HEALING=false ENABLE_AI_ASSERTIONS=false npm test
```

## License

MIT

## Contributing

1. Follow the helper-based architecture
2. Implement only P1 tests
3. Document P2/P3 tests in `docs/`
4. Use AI features judiciously
5. Update `CLAUDE.md` for new patterns
