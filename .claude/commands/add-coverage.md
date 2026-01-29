---
description: Add more test coverage to an existing feature following best practices
arguments:
  - name: feature_name
    description: Name of the feature to add coverage for
    required: true
---

# Add Test Coverage to Existing Feature

Your task is to add more test coverage for the following feature: $ARGUMENTS

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
   git checkout -b feature/add-coverage-feature-name
   ```

   **Branch naming convention:**
   - Use `feature/add-coverage-` prefix
   - Use kebab-case (lowercase with hyphens)
   - Be descriptive but concise
   - Examples:
     - `feature/add-coverage-login`
     - `feature/add-coverage-dashboard`
     - `feature/add-coverage-checkout`

3. **Confirm you're on the new branch**:
   ```bash
   git branch --show-current
   ```

---

## Phase 1: Review Existing Coverage

**Objective:** Understand what's already tested and what's documented.

1. **Review existing test files**:
   ```bash
   # List existing tests for this feature
   ls tests/{feature}/

   # Read existing P1 tests
   # Look at: tests/{feature}/{feature}-p1.spec.ts
   ```

   Note:
   - What test cases are already implemented?
   - What's the current coverage level?
   - Are tests reliable or flaky?
   - Any patterns to follow?

2. **Review existing helper**:
   ```bash
   # Read the helper file
   # Look at: utils/api/{feature}-helper.ts
   ```

   Note:
   - What helper methods already exist?
   - What methods might be needed for new tests?
   - Is helper well-structured or needs refactoring?

3. **Review P2/P3 documentation**:
   ```bash
   # Read documented but not implemented tests
   # Look at: docs/{FEATURE}-P2-P3-TESTS.md
   ```

   Note:
   - What P2 tests are documented?
   - What P3 tests are documented?
   - Which tests are most valuable to implement?
   - Any tests that are no longer relevant?

4. **Run existing tests** to verify they pass:
   ```bash
   npm test tests/{feature}/
   ```

   If existing tests fail, fix them first before adding new ones.

5. **Ask clarifying questions** if requirements are unclear

6. **DO NOT write any code yet** - this phase is for understanding only

---

## Phase 2: Select Tests to Implement

**Objective:** Choose which P2/P3 tests to promote to P1 and implement.

1. **Think hard** about test value:
   - Which tests cover the most risk?
   - Which tests add the most value?
   - Which tests are easiest to implement?
   - Which tests align with current development priorities?
   - What is the cost/benefit of each test?

2. **Prioritize tests** from P2/P3 docs:
   - Identify 3-5 tests to implement (don't add too many at once)
   - Focus on high-value, medium-effort tests
   - Skip tests that are too complex or low-value
   - Consider AI feature costs if needed

3. **Create implementation plan**:
   - List test cases to implement with IDs
   - New helper methods needed (if any)
   - Data requirements (test users, mock data)
   - AI features needed (if any)
   - Estimated time and effort

4. **Present the plan** and wait for approval before proceeding

---

## Phase 3: Extend Helper (If Needed)

**Objective:** Add helper methods for new test cases if needed.

1. **Identify new helper methods needed**:
   - Review the test cases to implement
   - Check if existing helper methods can be reused
   - Identify gaps in helper coverage

2. **Add new helper methods** if needed:
   ```typescript
   // utils/api/{feature}-helper.ts

   /**
    * New helper method for test case TC-XX-XXX
    */
   async newHelperMethod(page: Page, options: any): Promise<void> {
     // Implementation
   }
   ```

   Guidelines:
   - Follow existing helper patterns
   - Keep methods focused and single-purpose
   - Add JSDoc comments
   - Handle errors appropriately
   - Use stable selectors

3. **Test new helper methods** manually:
   ```bash
   # Run existing tests to verify helper changes don't break anything
   npm test tests/{feature}/
   ```

---

## Phase 4: Implement New Tests

**Objective:** Implement selected P2/P3 tests as new P1 tests.

1. **Add tests to existing P1 file** or create new file if needed:
   ```typescript
   // tests/{feature}/{feature}-p1.spec.ts

   test('TC-XX-XXX: Test description from P2/P3 docs', async ({ page }) => {
     // Setup
     await helper.navigateToFeature(page);

     // Execute
     await helper.performNewAction(page, testData);

     // Verify
     const result = await helper.verifyNewState(page);
     expect(result).toBe(expectedValue);
   });
   ```

   Guidelines:
   - Use existing helper methods where possible
   - Follow the same patterns as existing P1 tests
   - Use clear test descriptions with test case IDs
   - Keep tests independent and isolated
   - Add comments for complex logic

2. **Follow the helper-first approach**:
   - ✅ All logic in helper methods
   - ✅ Tests use helper methods exclusively
   - ❌ No raw `page.goto()` or `page.click()` in tests
   - ❌ No complex logic in test files

3. **Consider AI features** (use judiciously):
   - Only if traditional assertions won't work
   - Remember the cost implications
   - Prefer traditional Playwright assertions

4. **Keep tests maintainable**:
   - Use descriptive variable names
   - Extract complex setup to beforeEach
   - Don't duplicate code across tests
   - Keep each test focused on one thing

---

## Phase 5: Update Documentation

**Objective:** Update P2/P3 docs to reflect implemented tests.

1. **Update P2/P3 documentation**:
   - Remove or mark implemented tests in `docs/{FEATURE}-P2-P3-TESTS.md`
   - Add note: "✅ Implemented in {file}.spec.ts as TC-XX-XXX"
   - Or move tests to "Implemented" section
   - Keep documentation clean and current

2. **Example update**:
   ```markdown
   ## P2 Tests (Medium Priority)

   ### ✅ TC-LG-100: User can reset password (IMPLEMENTED)
   **Status:** Implemented in tests/login/login-p1.spec.ts as TC-LG-100
   **Date:** 2025-01-13

   ### TC-LG-101: User can change email
   **Priority**: P2 (Media)
   [... rest of spec ...]
   ```

---

## Phase 6: Testing & Validation

**Objective:** Verify new tests work correctly and reliably.

1. **Run new tests multiple times**:
   ```bash
   # Run just the new tests
   npx playwright test -g "TC-XX-XXX"

   # Run multiple times to check for flakiness
   npx playwright test -g "TC-XX-XXX" --repeat-each=5

   # Run in headed mode to verify visually
   npx playwright test -g "TC-XX-XXX" --headed
   ```

2. **Run all tests for the feature**:
   ```bash
   # Ensure new tests don't break existing ones
   npx playwright test tests/{feature}/
   ```

3. **Run full test suite**:
   ```bash
   npm test
   ```

4. **Test in all browsers**:
   ```bash
   npx playwright test tests/{feature}/ --project=chromium
   npx playwright test tests/{feature}/ --project=firefox
   npx playwright test tests/{feature}/ --project=webkit
   ```

5. **Check for flakiness**:
   - If tests are flaky, add proper waits
   - Consider self-healing for unstable selectors
   - Ensure tests are independent

6. **CRITICAL: Iterate until ALL tests pass**:
   - Run the full test suite:
     ```bash
     npm test
     ```
   - If ANY test fails, fix the issue and rerun
   - **DO NOT proceed to Phase 7 until ALL tests pass**
   - **Iterate as many times as needed** - no shortcuts
   - **MANDATORY: All tests must pass before committing**

---

## Phase 7: Commit Changes

**Objective:** Create a clean commit documenting the added coverage.

**PREREQUISITE:** All tests must be passing before proceeding. If you haven't run `npm test` in Phase 6 and verified all tests pass, go back and do that now.

1. **Verify tests one final time**:
   ```bash
   npm test
   ```
   All tests must pass. If any fail, return to Phase 6.

2. **Create a descriptive commit message**:
   ```
   Add coverage: {feature} (TC-XX-XXX to TC-XX-XXX)

   Implements additional tests for {feature}:
   - TC-XX-XXX: {Test description}
   - TC-XX-XXX: {Test description}
   - TC-XX-XXX: {Test description}

   Coverage: {previous-count} → {new-count} tests
   Helper: {new/updated} helper methods in utils/api/{feature}-helper.ts
   Docs: Updated docs/{FEATURE}-P2-P3-TESTS.md

   All tests passing (npm test).

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   ```

   **Example:**
   ```
   Add coverage: login page (TC-LG-100 to TC-LG-102)

   Implements additional tests for login page:
   - TC-LG-100: User can reset password via email link
   - TC-LG-101: User can change login email from profile
   - TC-LG-102: User sees account lockout after 5 failed attempts

   Coverage: 5 → 8 tests (3 new P1 tests)
   Helper: Added resetPassword() and changeEmail() methods
   Docs: Updated docs/LOGIN-P2-P3-TESTS.md (moved 3 tests to implemented)

   Uses traditional Playwright assertions (no AI features).
   All tests passing (npm test).

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   ```

3. **Stage and commit**:
   ```bash
   # Stage modified files
   git add tests/{feature}/
   git add utils/api/{feature}-helper.ts
   git add docs/{FEATURE}-P2-P3-TESTS.md

   # Verify what's being committed
   git status
   git diff --staged

   # Commit
   git commit -m "Add coverage: ..."
   ```

4. **Push the feature branch** (optional):
   ```bash
   git push -u origin feature/add-coverage-{feature}
   ```

---

## Project-Specific Constraints

**Critical Requirements:**
- ✅ **Use existing helper**: Extend, don't replace or duplicate
- ✅ **Follow existing patterns**: Match style of existing P1 tests
- ✅ **Helper-first approach**: All logic in helper, not in tests
- ✅ **English only**: All code, comments, test descriptions in English
- ✅ **Update P2/P3 docs**: Mark implemented tests
- ✅ **Test isolation**: New tests must be independent
- ✅ **All tests pass**: Run full suite before committing

**Never Commit:**
- Broken existing tests
- Tests that duplicate existing coverage
- Tests without proper test case IDs
- Debug code or console.logs

**Test Quality Standards:**
- Independent (can run in any order)
- Idempotent (can run multiple times)
- Reliable (not flaky)
- Fast (use efficient waits, not arbitrary timeouts)
- Maintainable (clear, simple, well-commented)

---

## Workflow Reminders

- **Start with Phase 0** - Create feature branch
- **Phase 1 is important** - Understand what exists before adding
- **Select tests carefully** - Don't add too many at once (3-5 is good)
- **Reuse helper methods** - Extend existing helper, don't duplicate
- **Follow existing patterns** - Match style of current P1 tests
- **Update P2/P3 docs** - Keep documentation in sync
- **Phase 6 is critical** - Iterate until ALL tests pass
- **Run full suite** - Ensure no regressions (mandatory)
- **Commit with context** - Show before/after test count

---

## Best Practices

### Start Small
- Add 3-5 tests at a time
- Don't try to achieve 100% coverage in one go
- Iterate and add more coverage over time

### Reuse and Extend
- Use existing helper methods whenever possible
- Only add new helper methods when truly needed
- Don't duplicate logic across tests

### Keep Tests Independent
- Each test should set up its own state
- Don't rely on test execution order
- Clean up after tests if needed

### Focus on Value
- Implement tests that catch real bugs
- Skip tests that are too complex for little value
- Prioritize happy path and critical error cases

### Maintain Documentation
- Keep P2/P3 docs current
- Mark implemented tests clearly
- Add notes if tests are skipped or postponed

---

## Common Scenarios

### Scenario A: Adding error handling tests

Existing: Happy path tests (login succeeds)
Adding: Error cases (wrong password, account locked, etc.)

**Approach:**
- Review existing helper for error handling support
- Add helper methods if needed (e.g., `loginWithInvalidPassword()`)
- Implement error test cases
- Verify error messages and states

---

### Scenario B: Adding edge case tests

Existing: Main functionality tests
Adding: Edge cases (empty fields, special characters, boundary values)

**Approach:**
- Identify edge cases from P2/P3 docs
- Check if helper supports edge case data
- Implement edge case tests with appropriate data
- Ensure tests are isolated and don't affect other tests

---

### Scenario C: Adding multi-step flow tests

Existing: Single-action tests
Adding: Complex workflows (multi-page flows, multi-user interactions)

**Approach:**
- Break down complex flow into helper methods
- Create step-by-step test using helper methods
- Use browser contexts for multi-user tests
- Add comments to explain complex flow logic

---

### Scenario D: Refactoring while adding coverage

Situation: Existing helper is messy and needs refactoring

**Approach:**
- ⚠️ Be cautious: Don't refactor and add tests at the same time
- If refactoring is necessary:
  1. Commit existing test additions first
  2. Create separate branch for refactoring
  3. Refactor helper
  4. Verify all tests still pass
  5. Commit refactoring separately
- If refactoring is minor, okay to include in same commit

---

## When to Stop Adding Coverage

**Stop adding tests when:**
- Diminishing returns (complex tests for low-value scenarios)
- Test suite is becoming slow (consider parallel execution)
- Coverage is sufficient for current risk level
- P2/P3 tests remaining are genuinely low priority

**It's okay to:**
- Leave P3 tests unimplemented
- Keep P2 tests documented but not implemented
- Add more coverage later as priorities change

**The goal is not 100% coverage:**
- Focus on high-value tests
- Balance coverage with maintenance cost
- Keep test suite fast and reliable

---

**Ready to begin?** Start with Phase 0: Create a feature branch. Then proceed to Phase 1: Review existing coverage. Understand what's already tested before adding more tests.

**When finished:** Commit with clear description of what tests were added and how coverage improved. Update P2/P3 documentation to reflect implemented tests.
