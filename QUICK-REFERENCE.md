# Quick Reference Card

## 🚀 Most Common Commands

```bash
# Testing
npm test                    # Run all tests
npm run test:headed        # See browser
npm run test:ui            # Interactive UI mode
npm run test:debug         # Debug mode
npm run test:codegen       # Explore & generate selectors

# AI Features
npm run ai:generate <url>             # Generate test from URL
npm run ai:maintain analyze           # Analyze test suite
npm run ai:maintain refactor <file>   # Refactor test file

# Template Management
npm run create-template               # Convert to clean template
./scripts/init-new-project.sh <name> <path>  # New project from template
```

## 📁 File Locations Cheat Sheet

| What | Where |
|------|-------|
| Your tests | `tests/your-feature/` |
| Your helpers | `utils/api/your-feature-helper.ts` |
| AI examples | `tests/examples/` |
| Config | `.env` (copy from `.env.example`) |
| Docs | `docs/` |

## 🤖 AI Feature Quick Start

### 1. Self-Healing Selectors

```typescript
import { test } from '../../fixtures/ai-fixtures';

test('auto-repair', async ({ smartLocator }) => {
  const btn = await smartLocator(
    '[data-testid="submit"]',
    'Blue submit button'
  );
  await btn.click();
});
```

### 2. Visual Assertions

```typescript
import { test } from '../../fixtures/ai-fixtures';

test('visual check', async ({ aiPage, aiAssertions }) => {
  await aiAssertions.assertVisualState(
    aiPage,
    'Button should appear enabled'
  );
});
```

### 3. Generate Test

```bash
npm run ai:generate https://your-app.com "Login page"
```

## 📖 Documentation Quick Links

| Need | Read |
|------|------|
| Getting started | `GETTING-STARTED.md` |
| AI features guide | `tests/examples/ai-features-example.spec.ts` |
| Cost optimization | `docs/AI-MODEL-STRATEGY.md` |
| File navigation | `FILES-GUIDE.md` |
| Template usage | `TEMPLATE-USAGE.md` |
| Claude Code help | `CLAUDE.md` |

## 🔧 Configuration

```bash
# .env (required)
APP_URL=https://your-app.com
ADMIN_USER=admin@example.com
ADMIN_PASS=password

# Optional - for AI features
ANTHROPIC_API_KEY=sk-ant-...
ENABLE_SELF_HEALING=true
ENABLE_AI_ASSERTIONS=true
```

## 💡 Common Patterns

### Create Feature Test

```bash
# 1. Create helper
vim utils/api/login-helper.ts

# 2. Create test
vim tests/login/login-p1.spec.ts

# 3. Document P2/P3
vim docs/LOGIN-P2-P3-TESTS.md

# 4. Run
npx playwright test tests/login/
```

### Multi-User Test

```typescript
test('admin and user', async ({ browser }) => {
  const adminCtx = await browser.newContext();
  const adminPage = await adminCtx.newPage();
  // ... admin actions
  await adminCtx.close();

  const userCtx = await browser.newContext();
  const userPage = await userCtx.newPage();
  // ... verify as user
  await userCtx.close();
});
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Tests fail in parallel | `npx playwright test --workers=1` |
| AI key not found | Add `ANTHROPIC_API_KEY` to `.env` |
| Selectors break often | Use `smartLocator` from AI fixtures |
| High AI costs | Check `docs/AI-MODEL-STRATEGY.md` |

## 📊 Cost Reference

| Feature | Cost | Speed |
|---------|------|-------|
| Self-healing | ~$0.001 | 1s |
| Semantic assertion | ~$0.001 | 1s |
| Visual assertion | ~$0.01 | 2s |
| Test generation | ~$0.05 | 30s |

Cache reduces repeated calls to ~$0.

## 🎯 Priority System

- **P1**: Critical path → **IMPLEMENT**
- **P2**: Important → **DOCUMENT** in `docs/`
- **P3**: Edge cases → **DOCUMENT** in `docs/`

## 🔄 Template Workflow

```bash
# Use for current project
cp .env.example .env && npm test

# OR create new project
./scripts/init-new-project.sh my-project ~/projects/my-project

# Later: extract improvements
npm run create-template
```

## 📦 Project Structure

```
├── config/         # AI client
├── fixtures/       # AI fixtures
├── tests/          # Your tests
│   └── examples/   # AI examples
├── utils/
│   ├── ai-helpers/ # AI tools
│   ├── api/        # Your helpers
│   └── selectors/  # Self-healing
└── docs/           # Documentation
```

## ⚡ Speed Tips

1. Use helpers (don't repeat yourself)
2. Cache selectors (commit `.selector-cache.json`)
3. Disable AI in CI (`ENABLE_SELF_HEALING=false`)
4. Run critical tests with `--workers=1`
5. Use AI selectively (cost consideration)

## 🎓 Learning Path

1. Run examples: `npm test`
2. Read: `GETTING-STARTED.md`
3. Try: `npm run test:codegen`
4. Copy: `tests/example-feature/example-p1.spec.ts`
5. Modify for your app
6. Explore AI: `tests/examples/ai-features-example.spec.ts`

---

Keep this file handy for daily reference!
