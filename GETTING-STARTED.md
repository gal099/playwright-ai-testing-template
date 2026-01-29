# Getting Started with Playwright AI Testing Framework

Welcome! This framework gives you a production-ready Playwright testing platform with AI superpowers, and can be used as a reusable template for your projects.

## What You Get

### Core Features
- **Traditional Playwright testing** - Works immediately, no AI key needed
- **AI-enhanced testing** (optional) - Add Claude API key for magic:
  - **Self-healing selectors** - Auto-repair broken locators
  - **Visual assertions** - "Button should look enabled"
  - **Test generation** - Generate tests from screenshots
  - **Test maintenance** - Analyze and refactor test code

### Smart Cost Management
- Multi-model strategy (Haiku/Sonnet/Opus) balances quality vs cost
- Selector caching prevents repeated AI calls
- ~$0.001-0.02 per AI assertion depending on complexity

### Clean Architecture
```
├── config/           # AI client configuration
├── fixtures/         # AI-enhanced Playwright fixtures
├── tests/
│   ├── examples/     # Working examples of AI features
│   └── your-feature/ # Your tests here
├── utils/
│   ├── ai-helpers/   # Test generator, AI assertions, maintainer
│   ├── api/          # Feature-specific helpers
│   └── selectors/    # Self-healing selector logic
└── docs/             # AI strategy, test documentation templates
```

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```bash
# Required
APP_URL=https://your-app-url.com

# Optional - for AI features
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 3. Run Example Tests

```bash
# Run without AI (works immediately)
npm test

# See the browser
npm run test:headed

# Interactive UI mode
npm run test:ui
```

### 4. Explore AI Features

```bash
# Generate a test from a URL (requires API key)
npm run ai:generate https://your-app.com "Login page"

# Analyze your test suite
npm run ai:maintain analyze

# Use Playwright codegen to explore your app
npm run test:codegen https://your-app.com
```

## Building Your First Test

### Step 1: Create a Helper

```typescript
// utils/api/login-helper.ts
import { Page } from '@playwright/test';

export class LoginHelper {
  async login(page: Page, username: string, password: string) {
    await page.goto(process.env.APP_URL!);
    await page.fill('[data-testid="username"]', username);
    await page.fill('[data-testid="password"]', password);
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('**/dashboard');
  }
}
```

### Step 2: Write P1 Tests

```typescript
// tests/login/login-p1.spec.ts
import { test, expect } from '@playwright/test';
import { LoginHelper } from '../../utils/api/login-helper';

const loginHelper = new LoginHelper();

test.describe('Login - P1 Tests', () => {
  test('TC-LOGIN-001: User can login successfully', async ({ page }) => {
    await loginHelper.login(
      page,
      process.env.USER_EMAIL!,
      process.env.USER_PASS!
    );

    await expect(page).toHaveURL(/.*dashboard/);
  });
});
```

### Step 3: Document P2/P3 Tests

```markdown
<!-- docs/LOGIN-P2-P3-TESTS.md -->
# Login - P2/P3 Tests

## P2 (Medium Priority)

### TC-LOGIN-100: Password reset flow
- User clicks "Forgot password"
- Enters email
- Receives reset link
- Can set new password

## P3 (Low Priority)

### TC-LOGIN-200: Remember me functionality
- User checks "Remember me"
- Session persists after browser close
```

## Using AI Features

### Option 1: Use AI Fixtures (Recommended)

```typescript
import { test } from '../../fixtures/ai-fixtures';

test('with self-healing selectors', async ({ aiPage, smartLocator }) => {
  await aiPage.goto(process.env.APP_URL!);

  // If selector breaks, AI will find it using the description
  const loginButton = await smartLocator(
    '[data-testid="login"]',
    'Blue login button in the top right corner'
  );

  await loginButton.click();
});
```

### Option 2: Use AI Assertions

```typescript
import { test } from '../../fixtures/ai-fixtures';

test('visual validation', async ({ aiPage, aiAssertions }) => {
  await aiPage.goto(process.env.APP_URL!);

  // AI verifies the visual state
  await aiAssertions.assertVisualState(
    aiPage,
    'The submit button should be visible and appear enabled'
  );
});
```

### Option 3: Generate Tests from Screenshots

```bash
# AI will take a screenshot and generate test code
npm run ai:generate https://your-app.com/feature "Feature description"
```

## Cost Management Tips

1. **Use AI selectively**: Traditional selectors are free, AI assertions cost ~$0.01-0.02 each
2. **Cache results**: `.selector-cache.json` stores self-healing results (commit it!)
3. **Disable in CI**: For smoke tests, disable AI features:
   ```bash
   ENABLE_SELF_HEALING=false npm test
   ```
4. **Start with examples**: See `tests/examples/ai-features-example.spec.ts`

## Project Organization

### Priority System
- **P1 (High)**: Critical features - **IMPLEMENT THESE**
- **P2 (Medium)**: Important but not critical - **DOCUMENT IN docs/**
- **P3 (Low)**: Nice-to-have edge cases - **DOCUMENT IN docs/**

### Naming Convention
```
tests/
  feature-name/
    feature-name-p1.spec.ts    # Implemented tests

docs/
  FEATURE-NAME-P2-P3-TESTS.md  # Documented but not implemented
```

### Test ID Format
```typescript
test('TC-{FEATURE}-{NUMBER}: Description', async ({ page }) => {
  // Examples:
  // TC-LOGIN-001: User can login
  // TC-DASH-042: Chart displays correct data
});
```

## Common Patterns

### Multi-User Tests (Different Roles)

```typescript
test('admin and user interaction', async ({ browser }) => {
  // Admin context
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  await adminHelper.login(adminPage);
  await adminHelper.createItem(adminPage, 'Test Item');
  await adminContext.close();

  // User context
  const userContext = await browser.newContext();
  const userPage = await userContext.newPage();
  await userHelper.login(userPage);
  const visible = await userHelper.canSeeItem(userPage, 'Test Item');
  expect(visible).toBe(true);
  await userContext.close();
});
```

### Parallel Execution Control

```bash
# Avoid session conflicts with single worker
npx playwright test tests/login/ --workers=1
```

## Next Steps

1. **Review examples**: Check `tests/examples/` for working patterns
2. **Read AI strategy**: See `docs/AI-MODEL-STRATEGY.md` for cost analysis
3. **Explore your app**: Use `npm run test:codegen` to generate selectors
4. **Start testing**: Create your first feature helper and P1 tests!

## Troubleshooting

### "ANTHROPIC_API_KEY not found"
- AI features are optional
- Either add the key to `.env` or use traditional Playwright features

### Tests fail in parallel
- Use `--workers=1` for tests sharing login sessions

### TypeScript errors about DOM
- Already configured in `tsconfig.json` with `"lib": ["ES2020", "DOM"]`

### Want to disable AI temporarily?
```bash
ENABLE_SELF_HEALING=false ENABLE_AI_ASSERTIONS=false npm test
```

## Resources

- **Playwright Docs**: https://playwright.dev
- **Claude AI Docs**: https://docs.anthropic.com
- **Example Tests**: `tests/examples/`
- **Architecture Guide**: `CLAUDE.md`
- **AI Strategy**: `docs/AI-MODEL-STRATEGY.md`

---

Happy testing! 🎭✨
