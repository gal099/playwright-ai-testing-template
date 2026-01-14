---
description: Fix a failing test following best practices workflow
arguments:
  - name: test_name
    description: Name or description of the failing test (optional)
    required: false
---

# Fix Failing Test

Your task is to fix the following failing test: $ARGUMENTS

Follow this structured workflow strictly. **Do not skip phases.**

---

## Phase 0: Create Fix Branch (Optional for Quick Fixes)

**Objective:** Decide if a branch is needed for this fix.

**When to create a branch:**
- Fix requires multiple file changes
- Fix is complex or risky
- Fix needs review before merging
- Multiple tests are failing

**When to skip branch:**
- Simple selector update
- Quick typo fix
- One-line change

**If creating a branch:**

1. **Check current branch status**:
   ```bash
   git status
   ```
   Ensure working tree is clean.

2. **Create and checkout a fix branch**:
   ```bash
   git checkout -b fix/test-name-or-issue
   ```

   **Branch naming convention:**
   - Use `fix/` prefix
   - Use kebab-case
   - Be descriptive
   - Examples:
     - `fix/login-button-selector`
     - `fix/dashboard-timing-issue`
     - `fix/checkout-flow-assertion`

3. **Confirm you're on the new branch**:
   ```bash
   git branch --show-current
   ```

---

## Phase 1: Reproduce & Understand

**Objective:** Reproduce the failure and understand the root cause.

1. **Reproduce the failure**:

   Run the specific failing test:
   ```bash
   # By test name
   npx playwright test -g "TC-XX-001"

   # By file
   npx playwright test tests/login/login-p1.spec.ts

   # In headed mode to see what's happening
   npx playwright test tests/login/login-p1.spec.ts --headed

   # With UI mode for interactive debugging
   npm run test:ui
   ```

   Observe the failure:
   - Read the error message carefully
   - Note which line fails
   - Check screenshots in `test-results/` if available
   - Look at trace files for detailed execution

2. **Understand the symptoms**:
   - Does it fail consistently or intermittently (flaky)?
   - What is the error type?
     - Selector not found
     - Timeout
     - Assertion failure
     - Network error
     - Authentication issue
   - Did the application UI change?
   - Did someone modify the test recently?

3. **Use debug mode** for detailed investigation:
   ```bash
   # Opens browser with debugger
   npx playwright test tests/login/login-p1.spec.ts --debug

   # Or use Playwright Inspector
   PWDEBUG=1 npx playwright test tests/login/login-p1.spec.ts
   ```

4. **Check recent changes**:
   ```bash
   # See recent commits affecting this test
   git log --oneline -- tests/login/login-p1.spec.ts

   # See who last modified the helper
   git log --oneline -- utils/api/login-helper.ts
   ```

5. **Ask clarifying questions** if the failure reason is unclear

6. **DO NOT write any code yet** - this phase is for understanding only

---

## Phase 2: Diagnose Root Cause

**Objective:** Identify why the test is failing and plan the fix.

### Common Failure Scenarios:

#### A. **Selector Changed (Application Updated)**

**Symptoms:**
- Error: "Selector not found" or "Element not visible"
- Application still works manually
- Test was working before

**Diagnosis:**
```bash
# Run codegen to find new selector
npm run test:codegen
# Navigate to the screen and locate the element
```

**Fix Strategy:**
- Update selector in helper method
- Prefer stable selectors (data-testid, role, text)
- Consider using self-healing selectors for unstable elements

---

#### B. **Timing Issue (Race Condition)**

**Symptoms:**
- Test fails intermittently (flaky)
- Error: "Timeout" or "Element not ready"
- Works in headed mode, fails in headless

**Diagnosis:**
- Element loads asynchronously
- No proper wait before interaction
- Network request still in progress

**Fix Strategy:**
- Add proper waits: `await page.waitForURL()`, `await page.waitForSelector()`
- Wait for network idle: `await page.waitForLoadState('networkidle')`
- Avoid arbitrary timeouts: `await page.waitForTimeout(1000)` ❌
- Use Playwright's auto-waiting where possible

---

#### C. **Assertion Failure (Test Logic Wrong)**

**Symptoms:**
- Error: "Expected X but got Y"
- Application behavior changed
- Test expectations are outdated

**Diagnosis:**
- Application behavior changed (new feature, bug fix)
- Test was written incorrectly
- Data changed (test data no longer valid)

**Fix Strategy:**
- Verify if application behavior is correct
- Update test expectations if behavior is intentional
- Update test data if needed
- Fix test logic if test was wrong

---

#### D. **Authentication Issue**

**Symptoms:**
- Redirected to login page
- "Unauthorized" errors
- Test worked in isolation but fails in suite

**Diagnosis:**
- Session expired
- Login state not preserved
- Test order dependency

**Fix Strategy:**
- Use proper authentication in beforeEach
- Check auth helper usage
- Run test in isolation to verify: `npx playwright test -g "TC-XX-001"`

---

#### E. **Application Bug**

**Symptoms:**
- Application genuinely broken
- Error is valid and expected
- Multiple related tests fail

**Diagnosis:**
- Real bug in application
- Recent deployment broke functionality

**Fix Strategy:**
- Report bug to development team
- Skip test temporarily with `.skip`:
  ```typescript
  test.skip('TC-XX-001: Known bug - issue #123', async ({ page }) => {
    // Test code
  });
  ```
- Add bug tracking reference in skip comment

---

## Phase 3: Implement Fix

**Objective:** Fix the test with minimal changes.

1. **Make minimal changes**:
   - Fix only what's broken
   - Don't refactor while fixing
   - Don't "improve" unrelated code
   - Keep changes focused and reviewable

2. **Apply the fix** based on diagnosis:

   **For selector issues:**
   ```typescript
   // Update in helper, not in test
   // utils/api/login-helper.ts
   async clickLoginButton(page: Page): Promise<void> {
     // Old (broken):
     // await page.click('.login-btn');

     // New (fixed):
     await page.click('[data-testid="login-button"]');
     // Or use text if stable:
     await page.click('text=Log In');
   }
   ```

   **For timing issues:**
   ```typescript
   // Add proper waits in helper
   async navigateToLogin(page: Page): Promise<void> {
     await page.goto(process.env.APP_URL + '/login');
     // Wait for page to be ready
     await page.waitForLoadState('networkidle');
     // Or wait for specific element
     await page.waitForSelector('[data-testid="login-form"]');
   }
   ```

   **For assertion issues:**
   ```typescript
   // Update expectation in test
   // Before:
   expect(userName).toBe('John Doe');
   // After (if app now returns full name differently):
   expect(userName).toBe('John Michael Doe');
   ```

   **For authentication issues:**
   ```typescript
   // Ensure login in beforeEach
   test.beforeEach(async ({ page }) => {
     await authHelper.login(page, 'admin');
     await helper.navigateToScreen(page);
   });
   ```

3. **Consider self-healing** for frequently changing selectors:
   ```typescript
   import { test } from '../../fixtures/ai-fixtures';

   test('...', async ({ smartLocator }) => {
     const button = await smartLocator(
       '[data-testid="submit"]',
       'Blue submit button in the form'
     );
     await button.click();
     // If selector breaks again, AI will find it
   });
   ```

4. **Update helper, not test**:
   - ✅ Fix in `utils/api/{screen}-helper.ts`
   - ❌ Don't add logic directly in test file

---

## Phase 4: Verify Fix

**Objective:** Ensure the test passes and no regressions were introduced.

1. **Run the fixed test**:
   ```bash
   # Run the specific test
   npx playwright test -g "TC-XX-001"

   # Run in headed mode to verify visually
   npx playwright test -g "TC-XX-001" --headed

   # Run multiple times to check for flakiness
   npx playwright test -g "TC-XX-001" --repeat-each=5
   ```

2. **Run related tests**:
   ```bash
   # Run all tests in the same file
   npx playwright test tests/login/login-p1.spec.ts

   # Run all tests for the screen
   npx playwright test tests/login/
   ```

3. **Run full test suite** to check for regressions:
   ```bash
   npm test
   ```

4. **Test in all browsers** (if selector or timing issue):
   ```bash
   npx playwright test -g "TC-XX-001" --project=chromium
   npx playwright test -g "TC-XX-001" --project=firefox
   npx playwright test -g "TC-XX-001" --project=webkit
   ```

5. **CRITICAL: Iterate until test passes reliably**:
   - If test still fails, return to Phase 2
   - If test is flaky, add more waits or use self-healing
   - If other tests break, fix those too
   - **DO NOT proceed to Phase 5 until ALL tests pass**
   - **MANDATORY: All tests must pass before committing**

---

## Phase 5: Commit Fix

**Objective:** Create a clean commit documenting the fix.

**PREREQUISITE:** All tests must be passing. If you haven't run `npm test` in Phase 4 and verified all tests pass, go back and do that now.

1. **Verify tests one final time**:
   ```bash
   npm test
   ```
   All tests must pass. If any fail, return to Phase 4.

2. **Create a descriptive commit message**:
   ```
   Fix: {test-name} - {issue-description}

   Issue: {what was failing and why}
   Fix: {what changed to fix it}
   Location: {file(s) modified}

   Tests: All tests passing (npm test)

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   ```

   **Examples:**

   ```
   Fix: login button selector after UI update

   Issue: Login test failing with "selector not found". Application
   UI was updated and login button selector changed from class-based
   to data-testid attribute.

   Fix: Updated clickLoginButton() in login-helper.ts to use new
   data-testid selector: [data-testid="login-button"]

   Location: utils/api/login-helper.ts

   Tests: All tests passing (npm test)

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   ```

   ```
   Fix: dashboard test timing issue (flaky test)

   Issue: Dashboard tests failing intermittently with timeout errors.
   Chart elements were loading asynchronously but tests didn't wait
   for them to be ready.

   Fix: Added waitForLoadState('networkidle') after navigation and
   waitForSelector for chart container before interactions in
   dashboard-helper.ts

   Location: utils/api/dashboard-helper.ts

   Tests: All tests passing (npm test), verified with --repeat-each=10

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   ```

   ```
   Fix: skip checkout test due to known application bug

   Issue: Checkout flow test failing at payment step. Application
   has a known bug (issue #456) where payment gateway returns 500
   error intermittently.

   Fix: Added .skip to TC-CK-004 test with reference to bug tracker.
   Test will be re-enabled once bug #456 is fixed.

   Location: tests/checkout/checkout-p1.spec.ts

   Tests: All other tests passing (npm test)

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   ```

3. **Stage and commit**:
   ```bash
   # Stage modified files
   git add utils/api/{screen}-helper.ts
   git add tests/{screen}/

   # Verify what's being committed
   git status
   git diff --staged

   # Commit
   git commit -m "Fix: ..."
   ```

4. **Push the fix branch** (if you created one):
   ```bash
   git push -u origin fix/your-fix-name
   ```

---

## Project-Specific Constraints

**Critical Requirements:**
- ✅ **Fix in helper**: Update helper methods, not test files (unless test logic is wrong)
- ✅ **Minimal changes**: Fix only what's broken, don't refactor
- ✅ **English only**: All code, comments must remain in English
- ✅ **Test isolation**: Ensure fix doesn't create dependencies between tests
- ✅ **All tests pass**: Run full suite before committing
- ✅ **Stable selectors**: Prefer data-testid, role, text over CSS classes

**Never Commit:**
- Debug code or console.logs added during investigation
- Temporary workarounds (like arbitrary sleeps)
- Commented-out code
- Test results or artifacts

---

## Workflow Reminders

- **Phase 0 is optional** - For simple fixes, work directly on current branch
- **Reproduce first** - Always run the test and see it fail before fixing
- **Identify root cause** - Don't guess, understand why it fails
- **Fix in helper** - Keep test files clean, logic goes in helpers
- **Make minimal changes** - Fix only what's broken
- **Verify thoroughly** - Run test multiple times to check for flakiness
- **Run full suite** - Ensure no regressions (mandatory)
- **Commit with context** - Explain what was failing and how you fixed it

---

## Troubleshooting Guide

### Test fails with "Selector not found"

1. Run codegen to find element:
   ```bash
   npm run test:codegen
   ```
2. Update selector in helper method
3. Consider using self-healing if selector changes frequently

### Test is flaky (passes sometimes)

1. Add proper waits (waitForURL, waitForSelector, waitForLoadState)
2. Check for race conditions in helper methods
3. Run with `--repeat-each=10` to verify fix:
   ```bash
   npx playwright test -g "test-name" --repeat-each=10
   ```

### Test passes locally but fails in CI

1. Check if using AI features (disable in CI if no API key)
2. Try with `--workers=1` if tests share state
3. Increase timeouts if CI is slower
4. Check if environment variables are set in CI

### Can't reproduce the failure

1. Check git history for recent changes
2. Ask team if application was updated
3. Try running in headless mode (how CI runs):
   ```bash
   npx playwright test -g "test-name" --headed=false
   ```
4. Check if test order matters:
   ```bash
   # Run in isolation
   npx playwright test -g "test-name" --repeat-each=1
   ```

### Multiple tests failing after app update

1. Check if it's a helper issue (affects all tests using that helper)
2. Update helper once, all tests should pass
3. If it's a widespread selector change, consider using self-healing

### Test fails with authentication error

1. Check auth helper is called in beforeEach
2. Verify credentials in .env are correct
3. Check if session is preserved:
   ```typescript
   test.use({ storageState: 'auth.json' });
   ```

---

## When to Use Self-Healing

Consider self-healing selectors when:
- Selectors change frequently
- Multiple tests break due to UI changes
- Stable selectors aren't available
- Cost is acceptable (~$0.001 per selector, cached)

**Don't use self-healing when:**
- Stable selectors are available (data-testid, role)
- Test rarely fails
- You want to minimize AI costs

---

**Ready to begin?** Start with Phase 1: Reproduce the failure. Understand why it's failing before attempting any fix. If fix is simple, work directly on current branch. If complex, create a fix branch (Phase 0).

**When finished:** Commit with clear explanation of what was failing, why, and how you fixed it. Ensure all tests pass before committing.
