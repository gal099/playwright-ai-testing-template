---
description: Automate tests for a new screen/feature following best practices workflow
arguments:
  - name: screen_name
    description: Name of the screen or feature to test
    required: true
---

# New Screen Test Implementation

Your task is to automate tests for the following screen/feature: $ARGUMENTS

Follow this structured workflow strictly. **Do not skip phases.**

---

## Phase 0: Create Feature Branch

**Objective:** Isolate test work in a dedicated branch.

1. **Check current branch status**:
   ```bash
   git status
   ```
   Ensure working tree is clean before creating a new branch.

2. **Create and checkout a feature branch** with descriptive naming:
   ```bash
   git checkout -b feature/test-screen-name
   ```

   **Branch naming convention:**
   - Use `feature/test-` prefix
   - Use kebab-case (lowercase with hyphens)
   - Be descriptive but concise
   - Examples:
     - `feature/test-login-page`
     - `feature/test-dashboard`
     - `feature/test-user-profile`
     - `feature/test-checkout-flow`

3. **Confirm you're on the new branch**:
   ```bash
   git branch --show-current
   ```

---

## Phase 1: Automatic UI Analysis

**Objective:** Automatically analyze the screen and extract selectors using AI vision (no manual exploration needed!).

1. **Think hard** about the testing requirements:
   - What is the main purpose of this screen?
   - What are the critical user flows?
   - What could break?
   - What are the acceptance criteria?
   - Are there any ambiguities that need clarification?

2. **Check if test case documentation exists**:
   - Look for `docs/{SCREEN}-TEST-CASES.md` (where SCREEN is uppercase screen name)
   - If exists, read it to understand expected P1 test scenarios
   - Extract test case IDs and priorities
   - Use this to guide selector extraction focus

3. **Read APP_URL from environment**:
   - Check `.env` file for `APP_URL` configuration
   - Determine the page path (e.g., `/login`, `/register`, `/dashboard`)
   - Full URL will be: `{APP_URL}{path}`
   - If path is unclear, ask user for the specific URL path

4. **Automatically extract selectors using AI vision**:

   Now I'll use the SelectorExtractor utility to automatically analyze the page and identify interactive elements.

   <tool>
     <name>Bash</name>
     <params>
       <command>cat .env | grep APP_URL</command>
       <description>Read APP_URL from environment</description>
     </params>
   </tool>

   Then, I'll create a small script to extract selectors:

   <tool>
     <name>Write</name>
     <params>
       <file_path>/tmp/extract-selectors.ts</file_path>
       <content>
import { SelectorExtractor } from './utils/ai-helpers/selector-extractor';

async function main() {
  const extractor = new SelectorExtractor();

  // Get URL from command line args or use default
  const url = process.argv[2] || process.env.APP_URL;
  const pageType = process.argv[3] || 'page';

  console.log(`\n🔍 Analyzing ${pageType} at: ${url}\n`);

  try {
    const result = await extractor.extractSelectors(url, pageType, {
      waitTime: 2000,
      fullPage: true,
    });

    console.log('\n✅ Selector Extraction Results:\n');
    console.log(`Confidence: ${result.confidence}`);
    console.log(`Selectors found: ${Object.keys(result.selectors).length}`);
    console.log(`Expected redirect: ${result.redirectUrl}`);
    console.log(`Load timing: ${result.timing.loadTime}`);
    console.log(`Async operations: ${result.timing.asyncOperations}\n`);

    console.log('📋 Identified Selectors:');
    Object.entries(result.selectors).forEach(([name, selector]) => {
      console.log(`  ${name}: "${selector}"`);
    });

    if (result.errorSelectors.length > 0) {
      console.log('\n⚠️  Error Selectors:');
      result.errorSelectors.forEach(sel => console.log(`  "${sel}"`));
    }

    // Output JSON for programmatic use
    console.log('\n📦 JSON Output:');
    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('\n❌ Extraction failed:', error.message);
    console.error('\n💡 Fallback Options:');
    console.error('   1. Verify URL is correct and accessible');
    console.error('   2. Check if page requires authentication');
    console.error('   3. Use manual codegen: npm run test:codegen');
    process.exit(1);
  }
}

main();
       </content>
     </params>
   </tool>

   <tool>
     <name>Bash</name>
     <params>
       <command>npx ts-node /tmp/extract-selectors.ts "{APP_URL}{path}" "{screen_name}"</command>
       <description>Extract selectors automatically using AI vision</description>
     </params>
   </tool>

5. **Review extracted selectors**:
   - Examine the confidence score (aim for ≥0.7)
   - Review the identified selectors for completeness
   - Check if critical elements are covered
   - Note any missing elements that may need manual addition

6. **Validate extraction results**:
   - If confidence ≥ 0.7 and all critical elements found: **Proceed to Phase 2**
   - If confidence < 0.7 or missing critical elements: **Ask user if they want to:**
     - Continue with automatic extraction (may need manual selector refinement later)
     - Supplement with manual codegen exploration
     - Re-run extraction with different timing settings

7. **Fallback to manual codegen** (if automatic extraction fails completely):
   ```bash
   npm run test:codegen
   ```

   If AI extraction fails or returns no results, fall back to the manual workflow:
   - Launch codegen and manually explore the UI
   - Note selectors from codegen inspector
   - Report findings and continue to Phase 2

8. **Explore existing code** (for context):
   - Check if similar helpers exist in `utils/api/`
   - Review authentication requirements (see `utils/api/auth-helper.ts`)
   - Look at existing test patterns in `tests/`
   - Check example tests in `tests/examples/` for AI feature usage

**Note:** This automatic extraction costs ~$0.08 per page (Sonnet AI vision). Results are NOT cached but are saved in the generated helper code for reuse.

---

## Phase 2: Plan Tests (P1/P2/P3 Priority)

**Objective:** Identify test cases and prioritize before implementation.

1. **Think harder** about what to test:
   - What are the critical paths (P1)?
   - What are important but not critical (P2)?
   - What are edge cases and nice-to-haves (P3)?
   - Which tests justify AI features vs traditional assertions?
   - Are there multi-user scenarios requiring separate contexts?

2. **Create a test plan** including:
   - List of test cases with IDs (TC-XX-001, TC-XX-002, etc.)
   - Priority for each test (P1/P2/P3)
   - Helper methods needed (navigation, actions, verifications)
   - Data requirements (test users, mock data, etc.)
   - AI features needed (self-healing selectors, visual assertions, etc.)
   - Estimated cost if using AI features

3. **Decide P1 tests to implement**:
   - Focus on critical path only
   - Typically 3-7 tests per screen
   - Keep it simple - can add more later

4. **Document P2/P3 tests**:
   - These will go in `docs/{SCREEN}-P2-P3-TESTS.md`
   - Full specifications but not implemented
   - Implement later when explicitly needed

5. **Present the plan** and wait for approval before proceeding

---

## Phase 3: Create Structure

**Objective:** Set up helper, test file, and documentation structure.

1. **Create helper file** at `utils/api/{screen}-helper.ts`:
   ```bash
   # Helper will contain all screen-specific logic
   # Location: utils/api/login-helper.ts (example)
   ```

   Helper template:
   ```typescript
   import { Page } from '@playwright/test';

   /**
    * Helper for {Screen} screen operations
    */
   export class {Screen}Helper {
     /**
      * Navigate to {screen}
      */
     async navigateTo{Screen}(page: Page): Promise<void> {
       // Navigation logic here
     }

     /**
      * Perform main action
      */
     async performAction(page: Page, data: any): Promise<void> {
       // Action logic here
     }

     /**
      * Verify screen state
      */
     async verifyState(page: Page): Promise<boolean> {
       // Verification logic here
       return true;
     }
   }
   ```

2. **Create test file** at `tests/{screen}/{screen}-p1.spec.ts`:
   ```bash
   # Create directory
   mkdir -p tests/{screen}

   # Test file will use the helper
   ```

3. **Create P2/P3 documentation** at `docs/{SCREEN}-P2-P3-TESTS.md`:
   - Use `docs/EXAMPLE-P2-P3-TESTS.md` as template
   - Document all non-P1 tests with full specifications
   - Include preconditions, steps, expected results
   - Add test case IDs

---

## Phase 4: Implementation

**Objective:** Implement helper and P1 tests following best practices.

1. **Write the helper** following the plan:
   - All navigation logic in helper methods
   - All actions in helper methods
   - All verifications in helper methods
   - NO raw `page.goto()` or `page.click()` in tests
   - Use stable selectors (data-testid, role, text)
   - Add proper waiting (waitForURL, waitForSelector, etc.)
   - Include JSDoc comments
   - Handle errors gracefully

2. **Write P1 tests** using the helper:
   - Import helper at the top
   - Use helper methods exclusively
   - Clear test descriptions with test case IDs
   - Group related tests in describe blocks
   - Use beforeEach for common setup
   - Include meaningful assertions
   - Add comments for complex logic

3. **Consider AI features** (optional, use judiciously):
   - **Self-healing selectors** - For unstable elements:
     ```typescript
     import { test } from '../../fixtures/ai-fixtures';

     test('...', async ({ smartLocator }) => {
       const btn = await smartLocator(
         '[data-testid="submit"]',
         'Blue submit button in the form'
       );
       await btn.click();
     });
     ```

   - **Visual assertions** - For layout/appearance:
     ```typescript
     import { test } from '../../fixtures/ai-fixtures';

     test('...', async ({ aiPage, aiAssertions }) => {
       await aiAssertions.assertVisualState(
         aiPage,
         'Submit button should be visible and enabled'
       );
     });
     ```

   - **Remember:** AI features cost money (~$0.001-0.01 per use)
   - Only use when traditional assertions aren't sufficient

4. **Document P2/P3 tests**:
   - Complete the `docs/{SCREEN}-P2-P3-TESTS.md` file
   - Include all non-implemented test cases
   - Follow the template format

5. **Think** about edge cases as you implement:
   - What if elements are loading?
   - What if the user is not logged in?
   - What if data is missing?
   - What if the screen is slow to load?

6. **Iterate as needed**:
   - Run tests as you write them
   - Refine selectors if they're fragile
   - Adjust waits if timing is off
   - Repeat until tests are reliable

---

## Phase 5: Testing & Validation

**Objective:** Verify tests work correctly and reliably.

1. **Run your tests**:
   ```bash
   # Run just your new tests
   npx playwright test tests/{screen}/

   # Run in headed mode to see what's happening
   npx playwright test tests/{screen}/ --headed

   # Run with UI mode for interactive debugging
   npm run test:ui
   ```

2. **Test reliability**:
   - Run tests multiple times to ensure they're not flaky
   - Test in all browsers:
     ```bash
     npx playwright test tests/{screen}/ --project=chromium
     npx playwright test tests/{screen}/ --project=firefox
     npx playwright test tests/{screen}/ --project=webkit
     ```
   - If tests are flaky, add proper waits or use self-healing

3. **Run full test suite** to check for regressions:
   ```bash
   npm test
   ```

4. **Code quality checks**:
   - Proper formatting (should auto-format on save)
   - TypeScript compiles without errors:
     ```bash
     npx tsc --noEmit
     ```
   - No console errors or warnings
   - All code in English (no Spanish in comments/descriptions)

5. **CRITICAL: Iterate until ALL tests pass**:
   - Run the full test suite:
     ```bash
     npm test
     ```
   - If ANY test fails, fix the issue and rerun
   - **DO NOT proceed to Phase 6 until ALL tests are passing**
   - **Iterate as many times as needed** - no shortcuts
   - **MANDATORY: All tests must pass before committing** - this is non-negotiable

---

## Phase 6: Documentation & Commit

**Objective:** Create a clean commit with proper documentation.

**PREREQUISITE:** All tests must be passing before proceeding. If you haven't run `npm test` in Phase 5 and verified all tests pass, go back and do that now.

1. **Final verification**:
   ```bash
   npm test
   ```
   All tests must pass. If any fail, return to Phase 5.

2. **Create a descriptive commit message**:
   ```
   Add tests: {screen} (TC-XX-001 to TC-XX-00N)

   Implements P1 tests for {screen} screen:
   - TC-XX-001: {Test description}
   - TC-XX-002: {Test description}
   - TC-XX-003: {Test description}

   Helper: utils/api/{screen}-helper.ts
   Tests: tests/{screen}/{screen}-p1.spec.ts
   Docs: docs/{SCREEN}-P2-P3-TESTS.md

   P2/P3 tests documented but not implemented (to avoid test bloat).
   All tests passing (npm test).

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   ```

   **Example:**
   ```
   Add tests: login page (TC-LG-001 to TC-LG-005)

   Implements P1 tests for login page:
   - TC-LG-001: User can login with valid credentials
   - TC-LG-002: User sees error with invalid credentials
   - TC-LG-003: User can navigate to forgot password
   - TC-LG-004: User can toggle password visibility
   - TC-LG-005: User is redirected after successful login

   Helper: utils/api/login-helper.ts
   Tests: tests/login/login-p1.spec.ts
   Docs: docs/LOGIN-P2-P3-TESTS.md

   Uses traditional Playwright assertions (no AI features needed).
   P2/P3 tests documented but not implemented.
   All tests passing (npm test).

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   ```

3. **Commit the changes**:
   - Stage relevant files:
     ```bash
     git add utils/api/{screen}-helper.ts
     git add tests/{screen}/
     git add docs/{SCREEN}-P2-P3-TESTS.md
     ```
   - Verify nothing unnecessary is being committed:
     ```bash
     git status
     ```
   - Create the commit

4. **Push the feature branch** (optional, for backup/collaboration):
   ```bash
   git push -u origin feature/test-{screen}
   ```

---

## Project-Specific Constraints

**Critical Requirements:**
- ✅ **Helper-first approach**: ALL screen logic goes in helper, tests use helper methods
- ✅ **P1 tests only**: Implement critical path only, document P2/P3
- ✅ **English only**: All code, comments, test descriptions, variable names must be in English
- ✅ **Stable selectors**: Prefer data-testid, role, text over CSS classes or XPath
- ✅ **AI cost awareness**: Use AI features selectively (they cost money)
- ✅ **Proper waits**: Use waitForURL, waitForSelector, not arbitrary timeouts
- ✅ **Test isolation**: Each test should be independent and idempotent
- ✅ **Clean commits**: Descriptive messages with test case IDs

**Never Commit:**
- `node_modules/`
- `test-results/`, `playwright-report/`
- `.env` (only `.env.example`)
- `*.log` files
- Screenshots or videos (unless explicitly needed for documentation)
- Debug code or console.logs

**Test Structure (Follow This Pattern):**
```typescript
import { test, expect } from '@playwright/test';
import { ScreenHelper } from '../../utils/api/screen-helper';

/**
 * Screen Name - P1 (High Priority) Tests
 */

const helper = new ScreenHelper();

test.describe('Screen Name - P1 Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Common setup: login, navigate, etc.
    await helper.navigateToScreen(page);
  });

  test('TC-XX-001: Test description', async ({ page }) => {
    // Use helper methods
    await helper.performAction(page);

    // Make assertions
    const result = await helper.verifyState(page);
    expect(result).toBe(true);
  });
});
```

---

## Workflow Reminders

- **Start with Phase 0** - Create feature branch before any work
- **Phase 1 is now automatic** - AI vision extracts selectors automatically (no manual codegen needed!)
- **Fallback available** - Can still use manual codegen if automatic extraction fails
- **Plan tests by priority** - P1 only, document P2/P3
- **Helper-first always** - No raw navigation/actions in tests
- **Use subagents** if exploration is complex
- **Ask for approval** after presenting the plan (Phase 2)
- **Iterate in Phase 4** - Tests rarely work perfectly on first try
- **Phase 5 is critical** - Iterate until ALL tests pass, no exceptions
- **Run `npm test` before committing** - All tests must pass, this is mandatory
- **Keep commits atomic** - One screen/feature per commit
- **English only** - This is a public template, maintain consistency
- **AI cost awareness** - Automatic extraction costs ~$0.08 per page (worth it for time savings!)

---

## Common Patterns & Best Practices

### Multi-User Scenarios

When testing interactions between different users (e.g., admin creates, user views):

```typescript
test('Admin action is visible to regular user', async ({ browser }) => {
  // Context 1: Admin user
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  await adminHelper.login(adminPage, 'admin');
  await adminHelper.createItem(adminPage, 'Test Item');
  await adminContext.close();

  // Context 2: Regular user
  const userContext = await browser.newContext();
  const userPage = await userContext.newPage();
  await userHelper.login(userPage, 'user');
  const items = await userHelper.getItems(userPage);
  expect(items).toContain('Test Item');
  await userContext.close();
});
```

### Parallel Test Execution Issues

If tests share login sessions and fail in parallel:

```bash
npx playwright test tests/{screen}/ --workers=1
```

### Using Self-Healing (When Selectors Are Unstable)

```typescript
import { test } from '../../fixtures/ai-fixtures';

test('Test with self-healing', async ({ smartLocator }) => {
  // Primary selector + semantic description
  const button = await smartLocator(
    '[data-testid="submit"]',
    'Blue submit button at bottom of form'
  );
  await button.click();

  // If data-testid changes, AI finds it by description
  // Results are cached to avoid repeated API calls
});
```

### AI Cost Optimization

- **Self-healing**: ~$0.001 per selector (cached after first use)
- **Visual assertions**: ~$0.01-0.02 per assertion (NOT cached)
- **Use AI sparingly**: Only when traditional assertions won't work
- **Prefer traditional**: `expect(page).toHaveURL()`, `expect(element).toBeVisible()`

---

## Troubleshooting

### Test is flaky (passes sometimes, fails other times)

**Solution:**
- Add proper waits: `await page.waitForURL('**/expected-path')`
- Wait for elements: `await page.waitForSelector('[data-testid="element"]')`
- Wait for network idle: `await page.waitForLoadState('networkidle')`
- Use self-healing selectors if element location changes

### Selector not found

**Solution:**
- Run in headed mode to see what's happening: `npm run test:headed`
- Use codegen to get correct selector: `npm run test:codegen`
- Check if element is in iframe or shadow DOM
- Verify element exists after navigation completes
- Consider using self-healing selectors

### Tests pass locally but fail in CI

**Solution:**
- Disable AI features in CI (they may not have API key):
  ```bash
  ENABLE_SELF_HEALING=false ENABLE_AI_ASSERTIONS=false npm test
  ```
- Run with `--workers=1` if tests share state
- Increase timeouts for slower CI environment

### TypeScript errors

**Solution:**
- Make sure types are imported: `import { Page } from '@playwright/test';`
- Check that `tsconfig.json` includes your test files
- Run `npx tsc --noEmit` to see all type errors

---

**Ready to begin?** Start with Phase 0: Create a feature branch. Then proceed to Phase 1: Explore UI with codegen. Do not write any code until you have completed Phase 2 and received approval for your test plan.

**When finished:** Commit with descriptive message including test case IDs, helper location, and documentation reference.
