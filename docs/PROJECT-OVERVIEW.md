# Project Overview - Playwright AI Testing Framework

> **Quick Reference Document**: Read this file to get a complete understanding of the project structure, architecture, and key files.

---

## 📋 Project Summary

This is the **Playwright AI Testing Framework** - an E2E testing platform that combines traditional Playwright testing with Claude AI capabilities for intelligent test generation, self-healing selectors, and AI-powered assertions.

### 🎯 Dual-Purpose Design

The project operates in **two modes**:

1. **Framework Development Mode** (current state)
   - Has `CLAUDE-DEV.md` present
   - You're working ON the framework source code
   - Can improve and fix the framework itself
   - Commands: `/improve-framework`, `/fix-framework`, `/review-changes`

2. **Template User Mode**
   - Generated via `npm run create-template`
   - QA teams use it to test THEIR applications
   - Only includes `CLAUDE.md`, not `CLAUDE-DEV.md`
   - Commands: `/new-screen`, `/fix-test`, `/add-coverage`

---

## 🏗️ Architecture Overview

```
/Users/juanbaez/Pictures/SIMA/test_project/
├── config/                          # AI Client & Model Configuration
│   ├── ai-client.ts                 # Unified Claude API client (multi-model support)
│   └── model-versions.ts            # Centralized model version management
│
├── fixtures/                        # Playwright Test Fixtures
│   └── ai-fixtures.ts              # AI-enhanced Playwright fixtures with smart locators
│
├── tests/                           # Test Suites
│   ├── examples/                    # Example tests demonstrating AI features
│   │   ├── basic-example.spec.ts   # Standard Playwright tests
│   │   ├── ai-features-example.spec.ts
│   │   ├── otp-auth-example.spec.ts
│   │   ├── selector-extraction-example.spec.ts  # NEW: Automatic selector extraction
│   │   └── test-case-planner-example.spec.ts
│   └── example-feature/             # User project example
│       └── example-p1.spec.ts
│
├── utils/                           # Utility Modules
│   ├── ai-helpers/                  # AI-Powered Utilities
│   │   ├── selector-extractor.ts   # NEW: Automatic selector extraction (used by /new-screen)
│   │   ├── test-generator.ts       # Generate tests from screenshots (uses AI vision)
│   │   ├── test-case-planner.ts    # Generate comprehensive test documentation
│   │   ├── site-explorer.ts        # Interactive site exploration and test doc generation
│   │   ├── ai-assertions.ts        # Visual, semantic, layout, accessibility assertions
│   │   ├── test-maintainer.ts      # Analyze and refactor test code
│   │   └── otp-extractor.ts        # AI-powered OTP extraction from emails
│   │
│   ├── api/                         # Feature-Specific Helpers
│   │   ├── auth-helper.ts          # Authentication operations (API-based login)
│   │   ├── example-helper.ts       # Template for feature helpers
│   │   ├── otp-helper.ts           # OTP authentication unified interface
│   │   └── email-providers/        # Email Provider Integrations
│   │       ├── base-provider.ts    # Abstract base class for providers
│   │       ├── mailtrap-provider.ts # Mailtrap email service integration
│   │       └── index.ts            # Provider exports
│   │
│   └── selectors/                   # Selector Management
│       └── self-healing.ts         # Auto-repair broken selectors with AI + caching
│
├── docs/                            # Framework Documentation
│   ├── AI-MODEL-STRATEGY.md        # Cost optimization guide (model selection)
│   ├── EXAMPLE-P2-P3-TESTS.md      # Test documentation template
│   ├── EXAMPLE-TEST-CASE-PLANNING.md # Test case planning output example
│   ├── MODEL-OPTIMIZATION-SUMMARY.md # Model cost analysis
│   └── PROJECT-OVERVIEW.md         # This file (quick reference)
│
├── scripts/                         # Utility Scripts
│   ├── check-model-versions.ts     # Verify model versions are current
│   ├── create-template.ts          # Generate clean template for users
│   ├── explore-site.ts             # Interactive site explorer CLI
│   └── init-new-project.sh         # Shell script for project initialization
│
├── .claude/                         # Claude Code Integration
│   ├── commands/                    # Framework developer commands
│   │   ├── improve-framework.md    # Add new framework features
│   │   ├── fix-framework.md        # Fix framework bugs
│   │   └── review-changes.md       # AI code review before PR
│   ├── commands-user/              # Template user commands
│   │   ├── new-screen.md           # Create tests for a new screen
│   │   ├── fix-test.md             # Debug and fix failing tests
│   │   └── add-coverage.md         # Add more test coverage
│   └── settings.local.json         # Claude Code settings
│
├── Configuration Files
│   ├── playwright.config.ts        # Playwright test configuration
│   ├── tsconfig.json               # TypeScript configuration
│   ├── package.json                # Node.js dependencies & scripts
│   └── .env.example                # Environment variables template
│
└── Documentation
    ├── README.md                   # Main project documentation
    ├── CLAUDE.md                   # User guide (template mode)
    ├── CLAUDE-DEV.md              # Framework dev guide (source only)
    ├── GETTING-STARTED.md         # Quick start guide
    ├── CHANGELOG.md                # Version history & improvements
    ├── TODO_framework.md           # Framework improvement tracking
    └── QUICK-REFERENCE.md         # Command quick reference
```

---

## 🔑 Key Technologies

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Playwright** | E2E testing framework | ^1.57.0 |
| **Claude AI** (Anthropic SDK) | AI capabilities | ^0.71.2 |
| **TypeScript** | Type-safe development | ^5.9.3 |
| **Node.js** | Runtime environment | Latest (ES2022) |
| **ts-node** | TypeScript execution | ^10.9.2 |
| **dotenv** | Environment configuration | ^17.2.3 |

---

## 🤖 AI Capabilities & Cost Structure

| Feature | Model | Cost | Use Case |
|---------|-------|------|----------|
| **Self-Healing Selectors** | Haiku | ~$0.002 | Repair broken locators |
| **Automatic Selector Extraction** | Sonnet | ~$0.05-0.10 | Extract selectors automatically (used by /new-screen) |
| **Test Generation** | Sonnet | ~$0.05-0.15 | Generate code from screenshots |
| **Test Case Planning** | Sonnet | ~$0.05-0.15 | Generate test documentation |
| **AI Assertions (Visual)** | Sonnet | ~$0.01-0.02 | Visual state validation |
| **AI Assertions (Semantic)** | Haiku | ~$0.001 | Text content validation |
| **AI Assertions (Layout)** | Sonnet | ~$0.01-0.02 | Layout structure verification |
| **AI Assertions (A11y)** | Sonnet | ~$0.01-0.02 | Accessibility validation |
| **Test Maintenance** | Sonnet | ~$0.01-0.02 | Analyze & refactor tests |
| **OTP Extraction** | Haiku | ~$0.0001 | Extract codes from emails |

### Model Selection Strategy

**Claude 3 Haiku** (Cheapest)
- ~$0.00025/1K input, ~$0.00125/1K output
- Best for: Simple text, basic analysis, high-volume operations
- Used for: Self-healing, semantic assertions, OTP extraction

**Claude Sonnet 4.5** (Balanced)
- ~$0.003/1K input, ~$0.015/1K output
- Best for: AI vision, test generation, complex analysis
- Used for: Test generation, visual assertions, planning, maintenance

**Claude Opus 4.5** (Most Capable)
- ~$0.015/1K input, ~$0.075/1K output
- Best for: Complex reasoning, fallback scenarios
- Rarely used by default

---

## 📚 Important Files to Read

### 🔴 Critical - Read First

1. **README.md** - Main project overview and quick start
   - `/Users/juanbaez/Pictures/SIMA/test_project/README.md`

2. **CLAUDE-DEV.md** - Framework developer guide (you are here)
   - `/Users/juanbaez/Pictures/SIMA/test_project/CLAUDE-DEV.md`
   - Contains workflow for improving/fixing framework

3. **playwright.config.ts** - Playwright configuration
   - `/Users/juanbaez/Pictures/SIMA/test_project/playwright.config.ts`
   - Test directories, browsers, CI/CD settings

4. **package.json** - Available scripts and dependencies
   - `/Users/juanbaez/Pictures/SIMA/test_project/package.json`

### 🟡 Core Architecture - Read for Understanding

5. **config/ai-client.ts** - Unified Claude API client
   - `/Users/juanbaez/Pictures/SIMA/test_project/config/ai-client.ts`
   - Multi-model support, error handling, retry logic

6. **config/model-versions.ts** - Model version management
   - `/Users/juanbaez/Pictures/SIMA/test_project/config/model-versions.ts`
   - Current model IDs and update strategy

7. **fixtures/ai-fixtures.ts** - AI-enhanced Playwright fixtures
   - `/Users/juanbaez/Pictures/SIMA/test_project/fixtures/ai-fixtures.ts`
   - Smart locators, AI-powered page interactions

### 🟢 AI Helpers - Read for AI Features

8. **utils/ai-helpers/selector-extractor.ts** - Automatic selector extraction (NEW)
   - `/Users/juanbaez/Pictures/SIMA/test_project/utils/ai-helpers/selector-extractor.ts`
   - Automatically extracts selectors from pages using AI vision
   - Used by /new-screen command to eliminate manual codegen

9. **utils/ai-helpers/test-generator.ts** - Test generation from screenshots
   - `/Users/juanbaez/Pictures/SIMA/test_project/utils/ai-helpers/test-generator.ts`
   - Uses Sonnet for AI vision

10. **utils/ai-helpers/test-case-planner.ts** - Test documentation generator
    - `/Users/juanbaez/Pictures/SIMA/test_project/utils/ai-helpers/test-case-planner.ts`
    - Creates comprehensive test case docs

11. **utils/ai-helpers/ai-assertions.ts** - Intelligent assertions
    - `/Users/juanbaez/Pictures/SIMA/test_project/utils/ai-helpers/ai-assertions.ts`
    - Visual, semantic, layout, a11y assertions

12. **utils/selectors/self-healing.ts** - Self-healing selectors
    - `/Users/juanbaez/Pictures/SIMA/test_project/utils/selectors/self-healing.ts`
    - Auto-repair broken selectors with caching

### 🔵 API Helpers - Read for Test Patterns

12. **utils/api/auth-helper.ts** - Authentication helper
    - `/Users/juanbaez/Pictures/SIMA/test_project/utils/api/auth-helper.ts`
    - Multi-role login patterns

13. **utils/api/otp-helper.ts** - OTP authentication
    - `/Users/juanbaez/Pictures/SIMA/test_project/utils/api/otp-helper.ts`
    - Unified OTP extraction interface

14. **utils/api/email-providers/base-provider.ts** - Email provider interface
    - `/Users/juanbaez/Pictures/SIMA/test_project/utils/api/email-providers/base-provider.ts`
    - Extensible email provider architecture

### 🟣 Documentation - Read for Context

15. **docs/AI-MODEL-STRATEGY.md** - Model selection and cost optimization
    - `/Users/juanbaez/Pictures/SIMA/test_project/docs/AI-MODEL-STRATEGY.md`

16. **CHANGELOG.md** - Version history and recent changes
    - `/Users/juanbaez/Pictures/SIMA/test_project/CHANGELOG.md`

17. **TODO_framework.md** - Framework improvement tracking
    - `/Users/juanbaez/Pictures/SIMA/test_project/TODO_framework.md`

### ⚪ Scripts - Read for Build/Tooling

18. **scripts/create-template.ts** - Template generation logic
    - `/Users/juanbaez/Pictures/SIMA/test_project/scripts/create-template.ts`
    - How framework becomes user template

19. **scripts/check-model-versions.ts** - Model version checker
    - `/Users/juanbaez/Pictures/SIMA/test_project/scripts/check-model-versions.ts`

### 🟤 Claude Code Commands - Read for Workflows

20. **.claude/commands/improve-framework.md** - Add features workflow
    - `/Users/juanbaez/Pictures/SIMA/test_project/.claude/commands/improve-framework.md`

21. **.claude/commands/fix-framework.md** - Fix bugs workflow
    - `/Users/juanbaez/Pictures/SIMA/test_project/.claude/commands/fix-framework.md`

22. **.claude/commands/review-changes.md** - Code review workflow
    - `/Users/juanbaez/Pictures/SIMA/test_project/.claude/commands/review-changes.md`

---

## 🛠️ Available Commands

### npm Scripts

```bash
# Testing
npm test                      # Run all tests
npm run test:examples        # Run including unstable examples
npm run test:headed          # Run with visible browser
npm run test:ui              # Run in interactive UI mode
npm run test:debug           # Debug single test
npm run test:codegen         # Generate test code interactively
npm run test:report          # View HTML test report

# AI Features
npm run ai:generate          # Generate tests from URL
npm run ai:plan-tests        # Generate test documentation
npm run ai:explore           # Interactive site explorer
npm run ai:maintain          # Analyze/refactor tests
npm run check-models         # Verify model versions

# Framework Development
npm run create-template      # Create clean user template
```

### Claude Code Commands (Framework Development)

```bash
/improve-framework <description>    # Add new framework features
/fix-framework <bug_description>    # Fix framework bugs
/review-changes [base_branch]       # AI code review before PR
```

---

## 🎯 Key Design Principles

1. **Dual-Mode Architecture**: Works as both development framework and reusable template
2. **Helper-First Pattern**: All test logic in helpers, tests are thin and readable
3. **Cost-Optimized AI**: Multi-model selection based on task complexity
4. **Caching Strategy**: Self-healing and selector caches prevent repeated AI calls
5. **Priority-Based Testing**: P1 automated, P2/P3 documented to prevent bloat
6. **Extensible Email Providers**: Abstract base allows custom implementations
7. **Backwards Compatibility**: Template generation removes framework-only files
8. **Clean Code Standards**: Type-safe TypeScript, strict mode enforced
9. **English-Only Code**: All code, comments, tests, AI content → English (international standard)

---

## 📊 Current Status

- **Version**: 1.7.0 (as of 2026-01-21)
- **Branch**: main (framework/add-automatic-new-screen)
- **Models**:
  - Haiku: `claude-3-haiku-20240307`
  - Sonnet: `claude-sonnet-4-5-20250929`
  - Opus: `claude-opus-4-5-20251101`

### Recent Changes (v1.7.0)

**Major Enhancement:**
1. **Automatic /new-screen workflow** - Phase 1 now uses AI vision to extract selectors automatically
2. New `SelectorExtractor` utility for automatic selector identification
3. Eliminates manual codegen exploration (saves 5-10 minutes per screen, 95% time reduction)
4. Added example test: `selector-extraction-example.spec.ts`
5. Updated documentation: AI-MODEL-STRATEGY.md, CLAUDE.md, PROJECT-OVERVIEW.md

### Previous Changes (v1.6.0)

**Major Enhancement:**
- Interactive Site Explorer for multi-page test documentation generation

### Previous Changes (v1.5.1)

**Critical Fixes:**
1. `/review-changes` command now actually executes (was only displaying docs)
2. Removed all SIMA-specific references from template generation
3. Renamed TODO_template.md → TODO_framework.md for clarity

**Improvements:**
- Simplified create-template.ts from 877 to 694 lines (-21%)
- `/review-changes` now 7x cheaper (~$0.25 vs ~$1.80)
- All SIMA references cleaned up - framework is truly generic

---

## 🚀 Quick Start for New Claude Code Sessions

1. **Read this file first** - Get complete project context
2. **Read CLAUDE-DEV.md** - Understand framework development workflow
3. **Check TODO_framework.md** - See current priorities
4. **Read relevant files** - Based on task (see Important Files section above)
5. **Run commands** - Use `/improve-framework` or `/fix-framework` as needed

---

## 📝 Test Organization Pattern

### Priority System
- **P1 (Alta/High)**: Critical path tests, must pass first, fully automated
- **P2 (Media/Medium)**: Important features, documented but not automated
- **P3 (Baja/Low)**: Edge cases, documented but not automated

### File Structure
```
tests/
├── examples/                    # Framework examples
│   ├── basic-example.spec.ts
│   ├── ai-features-example.spec.ts
│   ├── otp-auth-example.spec.ts
│   └── test-case-planner-example.spec.ts
└── example-feature/             # User project template
    └── example-p1.spec.ts
```

### Helper Pattern
```typescript
// Feature Helper
export class FeatureHelper {
  async navigateToFeature(page: Page): Promise<void> { ... }
  async performAction(page: Page, options: Options): Promise<Result> { ... }
}

// Test Usage
import { FeatureHelper } from '../../utils/api/feature-helper';
const helper = new FeatureHelper();

test('TC-FT-001: User can access feature', async ({ page }) => {
  await helper.navigateToFeature(page);
  const result = await helper.performAction(page);
  expect(result).toBeTruthy();
});
```

---

## 🔐 Environment Variables

```env
# Required
APP_URL=http://localhost:3000

# User credentials
ADMIN_USER=admin@example.com
ADMIN_PASS=admin-password
USER_EMAIL=user@example.com
USER_PASS=user-password

# Optional AI features
ANTHROPIC_API_KEY=sk-ant-...
ENABLE_SELF_HEALING=true
ENABLE_AI_ASSERTIONS=true
AI_MODEL=claude-sonnet-4-5-20250929
AI_MAX_TOKENS=4096

# OTP/Email testing
MAILTRAP_API_TOKEN=...
MAILTRAP_ACCOUNT_ID=...
MAILTRAP_INBOX_ID=...
ENABLE_OTP_AI_EXTRACTION=true
```

---

## 📈 Project Statistics

- **Total AI Helper Code**: ~1,428 lines of TypeScript
- **Example Tests**: 4 different test suites
- **Documentation Files**: 7+ comprehensive markdown files
- **Commands Available**: 6+ npm scripts + 6+ Claude Code commands
- **Email Providers**: 1 implemented (Mailtrap), extensible architecture
- **Git Status**: Clean, actively maintained

---

## 💡 Common Use Cases

### Improving the Framework
```bash
/improve-framework "Add support for new email provider (Gmail)"
```

### Fixing Framework Bugs
```bash
/fix-framework "Self-healing selector cache not working"
```

### Before Creating PR
```bash
/review-changes main
```

### Generating Tests (as user)
```bash
npm run ai:generate http://localhost:3000/login "Login screen"
npm run ai:plan-tests http://localhost:3000/dashboard dashboard
```

---

**Last Updated**: 2026-01-21
**Maintained By**: Framework Development Team
**License**: [Your License Here]
