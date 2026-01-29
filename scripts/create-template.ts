#!/usr/bin/env node

/**
 * Template Generator Script
 * Converts the framework project into a clean, reusable Playwright + AI template
 *
 * Usage: npm run create-template
 */

import { promises as fs } from 'fs';
import * as path from 'path';

const ROOT = process.cwd();

async function updatePackageJson() {
  console.log('📦 Updating package.json...\n');

  const pkgPath = path.join(ROOT, 'package.json');
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));

  pkg.name = 'playwright-ai-testing-template';
  pkg.version = '1.0.0';
  pkg.description = 'AI-Powered Playwright Testing Framework - Reusable template for E2E testing with Claude AI integration';
  delete pkg.repository;
  delete pkg.author;

  // Add template script
  pkg.scripts['create-template'] = 'ts-node scripts/create-template.ts';

  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('   ✓ Updated package.json');
  console.log();
}

async function updateEnvExample() {
  console.log('🔧 Updating .env.example...\n');

  const envExample = `# Application Configuration
APP_URL=http://localhost:3000

# User Credentials (for different roles)
ADMIN_USER=admin@example.com
ADMIN_PASS=admin-password
USER_EMAIL=user@example.com
USER_PASS=user-password

# AI Features (optional - requires Anthropic API key)
ANTHROPIC_API_KEY=sk-ant-your-key-here
ENABLE_SELF_HEALING=true
ENABLE_AI_ASSERTIONS=true
ENABLE_TEST_GENERATION=false

# AI Configuration
AI_MODEL=claude-3-5-sonnet-20241022
AI_MAX_TOKENS=4096
`;

  await fs.writeFile(path.join(ROOT, '.env.example'), envExample);
  console.log('   ✓ Updated .env.example');
  console.log();
}

async function updateReadme() {
  console.log('📖 Updating README.md...\n');

  const readme = `# Playwright AI Testing Framework Template

An **AI-powered testing template** that combines traditional Playwright E2E testing with Claude AI capabilities for intelligent test generation, self-healing selectors, and AI-powered assertions.

## Features

- 🤖 **AI Integration**: Claude AI for test generation, self-healing, and intelligent assertions
- 📊 **Multi-Model Optimization**: Automatic model selection (Haiku/Sonnet/Opus) based on task complexity
- 🔄 **Self-Healing Selectors**: Automatically repair broken selectors using AI vision + DOM analysis
- 🎯 **Smart Assertions**: Visual, semantic, layout, and accessibility assertions powered by AI
- 📝 **Test Generation**: Generate tests from screenshots using AI vision
- 🏗️ **Clean Architecture**: Organized by priority (P1/P2/P3) with helper-based patterns
- 💰 **Cost-Optimized**: Caching and smart model selection to minimize AI API costs

## Quick Start

### 1. Installation

\`\`\`bash
npm install
\`\`\`

### 2. Configuration

Copy \`.env.example\` to \`.env\` and configure:

\`\`\`bash
cp .env.example .env
\`\`\`

Required variables:
- \`APP_URL\`: Your application URL
- \`ADMIN_USER\`, \`ADMIN_PASS\`: Admin credentials
- \`ANTHROPIC_API_KEY\`: For AI features (optional)

### 3. Run Tests

\`\`\`bash
# Run all tests
npm test

# Run in headed mode
npm run test:headed

# Open Playwright UI
npm run test:ui

# Debug tests
npm run test:debug
\`\`\`

## Project Structure

\`\`\`
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
│   │   └── test-maintainer.ts
│   ├── api/                   # Feature-specific helpers
│   │   ├── auth-helper.ts
│   │   └── example-helper.ts
│   └── selectors/
│       └── self-healing.ts    # Auto-repair selectors
└── CLAUDE.md                  # Project guide for Claude Code
\`\`\`

## AI Features

### Test Generation

Generate tests from screenshots:

\`\`\`bash
npm run ai:generate <url> [description]
\`\`\`

### Self-Healing Selectors

Use AI fixtures for automatic selector repair:

\`\`\`typescript
import { test } from './fixtures/ai-fixtures';

test('with self-healing', async ({ aiPage, smartLocator }) => {
  const button = await smartLocator(
    '[data-testid="submit"]',
    'Submit button in the form'
  );
  await button.click();
});
\`\`\`

### AI Assertions

Intelligent assertions for visual, semantic, and layout checks:

\`\`\`typescript
import { test } from './fixtures/ai-fixtures';

test('AI assertions', async ({ aiPage, aiAssertions }) => {
  await aiAssertions.assertVisualState(
    aiPage,
    'The submit button should be visible and enabled'
  );
});
\`\`\`

### Test Maintenance

Analyze and refactor test code:

\`\`\`bash
# Analyze test suite
npm run ai:maintain analyze

# Refactor a test file
npm run ai:maintain refactor tests/example.spec.ts

# Update selectors across all tests
npm run ai:maintain update-selector ".old" "[data-testid='new']"
\`\`\`

## Writing Tests

### 1. Create Feature Helper

\`\`\`typescript
// utils/api/feature-helper.ts
export class FeatureHelper {
  async navigateToFeature(page: Page): Promise<void> {
    // Navigation logic
  }

  async performAction(page: Page, options: Options): Promise<Result> {
    // Action logic
  }
}
\`\`\`

### 2. Write P1 Tests

\`\`\`typescript
// tests/feature/feature-p1.spec.ts
import { test, expect } from '@playwright/test';
import { FeatureHelper } from '../../utils/api/feature-helper';

const helper = new FeatureHelper();

test('TC-FT-001: Test description', async ({ page }) => {
  await helper.navigateToFeature(page);
  const result = await helper.performAction(page);
  expect(result).toBeTruthy();
});
\`\`\`

### 3. Document P2/P3 Tests

Document (but don't implement) lower-priority tests in \`docs/FEATURE-P2-P3-TESTS.md\`.

## Priority System

- **P1 (High)**: Critical path tests, must pass, implement first
- **P2 (Medium)**: Important features, document in \`docs/\`
- **P3 (Low)**: Edge cases, document in \`docs/\`

## Cost Optimization

The framework uses multi-model optimization to balance cost and quality:

- **Haiku** (cheap): Self-healing, semantic assertions (~$0.001 per call)
- **Sonnet** (balanced): Test generation, visual assertions (~$0.01 per call)
- **Opus** (expensive): Complex cases, fallback only (~$0.10 per call)

See \`docs/AI-MODEL-STRATEGY.md\` for detailed cost analysis.

## Configuration Files

- \`playwright.config.ts\`: Playwright configuration
- \`tsconfig.json\`: TypeScript configuration
- \`.claudeignore\`: Files to ignore for Claude Code
- \`CLAUDE.md\`: Project instructions for Claude Code

## CI/CD Integration

Disable AI features in CI for faster smoke tests:

\`\`\`bash
ENABLE_SELF_HEALING=false ENABLE_AI_ASSERTIONS=false npm test
\`\`\`

## License

MIT

## Contributing

1. Follow the helper-based architecture
2. Implement only P1 tests
3. Document P2/P3 tests in \`docs/\`
4. Use AI features judiciously
5. Update \`CLAUDE.md\` for new patterns
`;

  await fs.writeFile(path.join(ROOT, 'README.md'), readme);
  console.log('   ✓ Updated README.md');
  console.log();
}

async function updateClaudeMd() {
  console.log('📄 Updating CLAUDE.md...\n');

  const claudeMd = `# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **AI-Powered Playwright Testing Framework** template for E2E testing. Use this template to build automated tests for your application with AI capabilities including intelligent test generation, self-healing selectors, and AI-powered assertions.

**To use this template**: Configure \`.env\` with your application URL and credentials, then start writing tests!

## Commands Reference

### Running Tests

\`\`\`bash
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
\`\`\`

### Running Specific Tests

\`\`\`bash
# Run single test file
npx playwright test tests/example-feature/example-p1.spec.ts

# Run single test by name
npx playwright test -g "TC-EX-001"

# Run with single worker (avoids session conflicts)
npx playwright test --workers=1

# Run specific project (browser)
npx playwright test --project=chromium
\`\`\`

### AI Features

\`\`\`bash
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
\`\`\`

## Architecture

### AI Model Strategy

The framework uses **multi-model optimization** to balance cost and quality:

- **Haiku** (cheap, fast): Self-healing selectors, semantic assertions, data validation
- **Sonnet** (balanced): Test generation, visual assertions, layout checks, accessibility, refactoring
- **Opus** (expensive, best): Fallback for complex cases (rarely used)

Model selection is automatic based on feature complexity. See \`docs/AI-MODEL-STRATEGY.md\` for cost analysis.

### Test Organization

Tests are organized by **priority** and **feature area**:

\`\`\`
tests/
├── examples/              # Example tests showing AI features
├── example-feature/       # Replace with your features
│   └── example-p1.spec.ts # P1 (high priority) tests
\`\`\`

**Priority system**:
- **P1 (Alta)**: Critical path, must pass, implemented first
- **P2 (Media)**: Important features, documented in \`docs/*-P2-P3-TESTS.md\`
- **P3 (Baja)**: Nice-to-have, edge cases, documented in \`docs/*-P2-P3-TESTS.md\`

P2 and P3 tests are documented but not implemented to avoid test bloat. Implement them when explicitly needed.

### Helpers Architecture

**API Helpers** (\`utils/api/\`):
- \`auth-helper.ts\`: Authentication operations
- \`example-helper.ts\`: Template for feature-specific helpers

**AI Helpers** (\`utils/ai-helpers/\`):
- \`test-generator.ts\`: Generate tests from screenshots using AI vision
- \`ai-assertions.ts\`: Intelligent assertions (visual, semantic, layout, a11y)
- \`test-maintainer.ts\`: Analyze and refactor test code

**Selectors** (\`utils/selectors/\`):
- \`self-healing.ts\`: Auto-repair broken selectors using AI vision + DOM analysis
- Caches results in \`.selector-cache.json\` (commit this file to share with team)

**Config** (\`config/\`):
- \`ai-client.ts\`: Unified Claude API client with multi-model support

### Key Design Patterns

#### 1. Multi-User Testing with Browser Contexts

Tests that need different user roles use **separate browser contexts**:

\`\`\`typescript
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
\`\`\`

#### 2. Helper-Based Test Structure

Never write raw navigation code in tests. Always use helpers:

\`\`\`typescript
// ✅ GOOD
await helper.navigateToFeature(page);
await helper.performAction(page, options);

// ❌ BAD
await page.goto(url);
await page.click('button');
// ... manual steps
\`\`\`

#### 3. Self-Healing Selectors (Optional)

Use AI fixtures for self-healing when selectors are unstable:

\`\`\`typescript
import { test } from './fixtures/ai-fixtures';

test('with self-healing', async ({ aiPage, smartLocator }) => {
  const button = await smartLocator(
    '[data-testid="submit"]',
    'Submit button in the form'  // AI uses this if selector fails
  );
  await button.click();
});
\`\`\`

## Environment Variables

Required \`.env\` variables:

\`\`\`bash
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
\`\`\`

## Common Patterns & Gotchas

### Parallel Test Execution Issues

**Problem**: Login sessions conflict when tests run in parallel.

**Solution**: Run with \`--workers=1\` for tests sharing user sessions:

\`\`\`bash
npx playwright test tests/feature/ --workers=1
\`\`\`

### TypeScript Configuration

**Problem**: DOM types not available.

**Solution**: Already configured in \`tsconfig.json\` with \`"lib": ["ES2020", "DOM"]\`.

### AI Cost Management

- Self-healing caches results in \`.selector-cache.json\` (commit to repo)
- AI assertions are expensive (~$0.01-0.02 each), use selectively
- Disable AI features in CI/CD for faster smoke tests:
  \`\`\`bash
  ENABLE_SELF_HEALING=false ENABLE_AI_ASSERTIONS=false npm test
  \`\`\`

## Test Documentation

When creating new test areas:

1. Implement only **P1 (high priority)** tests
2. Document P2 and P3 tests in \`docs/{FEATURE}-P2-P3-TESTS.md\`
3. Include full test specifications (preconditions, steps, expected results)
4. Reference test case IDs (e.g., TC-FT-001) in test descriptions

Example:
\`\`\`typescript
test('TC-FT-001: User can access feature screen', async ({ page }) => {
  // Test implementation
});
\`\`\`

## File Ignores

The \`.claudeignore\` file is optimized to avoid wasting tokens on:
- \`node_modules/\`
- \`test-results/\` and \`playwright-report/\` (large JSON/HTML files)
- \`*.log\`, \`*.trace.zip\`, video files
- Build outputs, coverage reports
- IDE and OS files

Keep screenshots visible by default (may be needed for AI analysis).

## Adding New Test Areas

When testing a new screen/feature:

1. **Explore the UI first**:
   \`\`\`bash
   npm run test:codegen
   \`\`\`

2. **Create helper methods** in \`utils/api/{feature}-helper.ts\`:
   \`\`\`typescript
   export class FeatureHelper {
     async navigateToFeature(page: Page): Promise<void> { ... }
     async performAction(page: Page, options: Options): Promise<Result> { ... }
   }
   \`\`\`

3. **Identify test cases by priority** (P1/P2/P3)

4. **Implement P1 tests** in \`tests/{feature}/{feature}-p1.spec.ts\`

5. **Document P2/P3 tests** in \`docs/{FEATURE}-P2-P3-TESTS.md\`

6. **Update this CLAUDE.md** if introducing new patterns

## AI Feature Toggles

The framework is **hybrid** - works with or without AI features:

- **Traditional Playwright**: Always available, no API key needed
- **AI Features**: Optional, require \`ANTHROPIC_API_KEY\`
  - Test generation: \`npm run ai:generate\`
  - Self-healing: \`import { test } from './fixtures/ai-fixtures'\`
  - AI assertions: Use \`aiAssertions\` fixture
  - Maintenance: \`npm run ai:maintain\`

Use AI features judiciously to balance quality and cost.
`;

  await fs.writeFile(path.join(ROOT, 'CLAUDE.md'), claudeMd);
  console.log('   ✓ Updated CLAUDE.md');
  console.log();
}

async function removeFrameworkDevFiles() {
  console.log('🗑️  Removing framework development files...\n');

  const devFiles = [
    'CLAUDE-DEV.md',
    'new_ideas',
    'TODO_framework.md'
  ];

  for (const file of devFiles) {
    const fullPath = path.join(ROOT, file);
    try {
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        await fs.rm(fullPath, { recursive: true, force: true });
        console.log(`   ✓ Deleted directory: ${file}`);
      } else {
        await fs.unlink(fullPath);
        console.log(`   ✓ Deleted file: ${file}`);
      }
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        console.log(`   ⚠ Could not delete ${file}: ${error.message}`);
      }
    }
  }
  console.log();
}

async function copyUserCommands() {
  console.log('📋 Copying user commands to template...\n');

  const claudeDir = path.join(ROOT, '.claude');
  const commandsUserDir = path.join(claudeDir, 'commands-user');
  const commandsDir = path.join(claudeDir, 'commands');

  // Files that should be in template (shared or user-specific)
  const sharedFiles = [
    'start-user.md',
    'context-user.md',  // Will be renamed to context.md in template
    'review-changes.md'
  ];

  try {
    // Save shared command files from commands/
    const savedFiles: Record<string, string> = {};
    for (const file of sharedFiles) {
      const filePath = path.join(commandsDir, file);
      try {
        savedFiles[file] = await fs.readFile(filePath, 'utf-8');
        console.log(`   ✓ Saved ${file} (shared command)`);
      } catch (error) {
        console.log(`   ⚠ ${file} not found - skipping`);
      }
    }

    // Remove existing commands directory (includes framework-only commands like start-dev.md)
    await fs.rm(commandsDir, { recursive: true, force: true });
    console.log('   ✓ Removed framework commands directory');

    // Create fresh commands directory
    await fs.mkdir(commandsDir, { recursive: true });

    // Copy commands-user content if it exists
    try {
      await fs.access(commandsUserDir);
      const userCommands = await fs.readdir(commandsUserDir);
      for (const file of userCommands) {
        if (file === '.gitkeep') continue;
        await fs.copyFile(
          path.join(commandsUserDir, file),
          path.join(commandsDir, file)
        );
      }
      console.log('   ✓ Copied user commands to .claude/commands/');

      // Remove commands-user source directory
      await fs.rm(commandsUserDir, { recursive: true, force: true });
      console.log('   ✓ Removed commands-user/ source');
    } catch (error) {
      console.log('   ⚠ commands-user/ not found - only using shared commands');
    }

    // Restore shared command files
    for (const [file, content] of Object.entries(savedFiles)) {
      // Rename context-user.md to context.md in template
      const targetFile = file === 'context-user.md' ? 'context.md' : file;
      await fs.writeFile(path.join(commandsDir, targetFile), content);
      console.log(`   ✓ Added ${targetFile} to template${file !== targetFile ? ' (renamed from ' + file + ')' : ''}`);
    }

  } catch (error: any) {
    console.log(`   ⚠ Could not copy user commands: ${error.message}`);
  }

  console.log();
}

async function main() {
  console.log('\n🚀 Playwright AI Template Generator\n');
  console.log('This script will convert your project into a clean, reusable template.\n');

  // Pre-flight validation: ensure we're in the project root
  try {
    await fs.access(path.join(ROOT, 'package.json'));
    await fs.access(path.join(ROOT, 'playwright.config.ts'));
  } catch (error) {
    console.error('❌ Error: Must run from project root (package.json and playwright.config.ts must exist)');
    process.exit(1);
  }

  try {
    await removeFrameworkDevFiles();
    await copyUserCommands();
    await updatePackageJson();
    await updateEnvExample();
    await updateReadme();
    await updateClaudeMd();

    console.log('✅ Template generation complete!\n');
    console.log('Next steps:');
    console.log('1. Review the changes');
    console.log('2. Test the template: npm test');
    console.log('3. Commit to git (if using version control)');
    console.log('4. Start building your tests!\n');
  } catch (error) {
    console.error('❌ Error generating template:', error);
    process.exit(1);
  }
}

main();
