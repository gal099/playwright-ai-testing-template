# Playwright AI Testing Framework

> **Version 1.5.1** | [Changelog](CHANGELOG.md)

A testing framework that serves as both a development platform and a reusable template for E2E testing with Claude AI integration. Combines traditional Playwright testing with AI capabilities for intelligent test generation, self-healing selectors, and AI-powered assertions.

## Features

- 🤖 **AI Integration**: Claude AI for test generation, self-healing, and intelligent assertions
- 📊 **Multi-Model Optimization**: Automatic model selection (Haiku/Sonnet/Opus) based on task complexity
- 🔄 **Self-Healing Selectors**: Automatically repair broken selectors using AI vision + DOM analysis
- 🎯 **Smart Assertions**: Visual, semantic, layout, and accessibility assertions powered by AI
- 📝 **Test Generation**: Generate tests from screenshots using AI vision
- 📋 **Test Case Planner**: Generate comprehensive test documentation from screenshots before automation
- 📧 **OTP Authentication**: Email-based verification code extraction with AI (Mailtrap integration)
- 🤖 **Claude Code Commands**: Structured workflows for test automation and framework development
- 🔍 **AI Code Review**: Pre-PR review with actionable feedback and severity levels
- 🏗️ **Clean Architecture**: Organized by priority (P1/P2/P3) with helper-based patterns
- 💰 **Cost-Optimized**: Caching and smart model selection to minimize AI API costs

## Two Usage Modes

This repository serves two distinct purposes:

### 🔧 Framework Development Mode (Working ON the framework)

If you cloned this repository directly and see `CLAUDE-DEV.md`, you're in **framework development mode**. This means you're improving the framework itself.

**Use this mode for:**
- Adding new AI helpers or framework features
- Fixing bugs in framework code
- Improving architecture and patterns
- Optimizing AI model selection and costs

**Key files:**
- `CLAUDE-DEV.md` - Framework development guide (read this)
- `TODO_template.md` - Framework improvements tracking
- `.claude/commands/` - Framework development commands (`/improve-framework`, `/fix-framework`)

**Commands available:**
- `/improve-framework <description>` - Add new framework features
- `/fix-framework <bug_description>` - Fix framework bugs
- `/review-changes [base_branch]` - AI code review before PR

### 📋 Template Usage Mode (Working WITH the framework)

After running `npm run create-template`, you get a clean template for testing your applications. In this mode, `CLAUDE-DEV.md` and framework dev files are removed.

**Use this mode for:**
- Writing E2E tests for your application
- Testing screens and features of your app
- Creating project-specific helpers
- Automating test scenarios

**Key files:**
- `CLAUDE.md` - Template usage guide (read this)
- `.claude/commands/` - User commands (`/new-screen`, `/fix-test`, `/add-coverage`)

**Commands available:**
- `/new-screen <screen_name>` - Create tests for a new screen
- `/fix-test [test_name]` - Debug and fix failing tests
- `/add-coverage <feature_name>` - Add more test coverage
- `/review-changes [base_branch]` - AI code review before PR

---

## Quick Start

Choose your path based on your mode:

### 🔧 Framework Development Mode

If you're working **ON** the framework (improving it):

```bash
# 1. Clone the repository
git clone <repo-url>
cd playwright-ai-testing-framework

# 2. Install dependencies
npm install

# 3. Read framework development guide
# Open CLAUDE-DEV.md for detailed instructions

# 4. Check pending framework tasks
# See TODO_template.md for improvements tracking

# 5. (Optional) Configure .env for testing AI features
cp .env.example .env
# Add your ANTHROPIC_API_KEY if testing AI-powered features

# 6. Run existing tests to ensure everything works
npm test
```

**Next steps:**
- Use `/improve-framework` to add new features
- Use `/fix-framework` to fix bugs
- See `CLAUDE-DEV.md` for complete workflow

### 📋 Template Usage Mode

If you're working **WITH** the framework (testing your application):

```bash
# 1. Generate clean template (removes framework dev files)
npm run create-template

# 2. Install dependencies
npm install

# 3. Configure for YOUR application
cp .env.example .env
# Edit .env with:
#   APP_URL=http://your-app-url.com
#   ADMIN_USER=your-admin@email.com
#   ADMIN_PASS=your-admin-password
#   ANTHROPIC_API_KEY=sk-ant-... (optional, for AI features)

# 4. (Optional) Configure Claude Code settings
cp .claude/settings.local.json.example .claude/settings.local.json

# 5. Run example tests
npm test

# 6. Start creating your tests
# Use /new-screen <screen_name> to create tests for your app
```

**Next steps:**
- Use `/new-screen` to automate new screens
- Use `/fix-test` to debug failing tests
- See `CLAUDE.md` for complete workflow

## Claude Code Commands

When working with [Claude Code](https://claude.ai/code), available commands depend on your mode:

**Template Usage Mode** (see commands above in "Two Usage Modes" section)

**Framework Development Mode** (see commands above in "Two Usage Modes" section)

See `CLAUDE.md` (template mode) or `CLAUDE-DEV.md` (framework mode) for detailed command documentation.

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
- `CLAUDE.md`: Project instructions for Claude Code (template usage mode)
- `CLAUDE-DEV.md`: Framework development guide (framework dev mode only)

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
