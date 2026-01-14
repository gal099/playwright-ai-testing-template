---
description: Fix a bug in the framework itself following best practices workflow
arguments:
  - name: bug_description
    description: Description of the framework bug to fix
    required: true
---

# Framework Bug Fix

Your task is to fix the following framework bug: $ARGUMENTS

Follow this structured workflow strictly. **Do not skip phases.**

---

## Phase 0: Create Fix Branch

**Objective:** Isolate bug fix work in a dedicated branch.

1. **Check current branch status**:
   ```bash
   git status
   ```
   Ensure working tree is clean before creating a new branch.

2. **Create and checkout a fix branch** with descriptive naming:
   ```bash
   git checkout -b framework/fix-descriptive-bug-name
   ```

   **Branch naming convention:**
   - Use `framework/fix-` prefix (distinguishes from user project fixes)
   - Use kebab-case (lowercase with hyphens)
   - Be descriptive but concise
   - Examples:
     - `framework/fix-self-healing-cache-invalidation`
     - `framework/fix-otp-extraction-timeout`
     - `framework/fix-ai-assertions-error-handling`
     - `framework/fix-fixture-memory-leak`

3. **Confirm you're on the new branch**:
   ```bash
   git branch --show-current
   ```

---

## Phase 1: Reproduce & Understand (READ-ONLY - No Code Yet!)

**Objective:** Reproduce the bug and thoroughly understand its root cause.

1. **Reproduce the bug**:
   - Create a minimal test case that triggers the bug
   - Document exact steps to reproduce
   - Note what happens vs. what should happen
   - Capture error messages, stack traces, or incorrect outputs
   - Test in different scenarios (different browsers, different data, etc.)

2. **Understand the symptoms**:
   - When does it occur? (always, intermittent, specific conditions)
   - What framework components are involved?
   - What data or inputs trigger it?
   - Does it affect other functionality?
   - Is it a regression or existing issue?

3. **Explore the codebase** (use Explore subagent for complex investigations):
   - Find the code that exhibits the bug
   - Trace the execution path that leads to the bug
   - Read relevant files:
     - AI helpers in `utils/ai-helpers/`
     - Fixtures in `fixtures/ai-fixtures.ts`
     - Selectors in `utils/selectors/self-healing.ts`
     - API client in `config/ai-client.ts`
   - Identify related code and dependencies
   - Look for similar patterns that might have the same bug
   - Read the CLAUDE.md file for project conventions

4. **Ask clarifying questions** if the bug description is unclear

5. **DO NOT write any code yet** - this phase is for understanding only

---

## Phase 2: Root Cause Analysis & Fix Strategy

**Objective:** Identify the root cause and plan the fix before coding.

1. **Identify the root cause**:
   - What is actually causing the bug? (not just the symptom)
   - Why did this bug occur? (logic error, edge case, race condition, API issue, etc.)
   - When was it introduced? (check git history if helpful: `git log --oneline -- path/to/file.ts`)
   - Are there similar bugs elsewhere in the framework?
   - Is this an AI API issue or framework logic issue?

2. **Evaluate fix approaches**:
   - List multiple potential solutions
   - Consider trade-offs (simplicity vs. performance, safety vs. elegance)
   - Think about side effects and unintended consequences
   - Consider backward compatibility (do users rely on current behavior?)
   - Evaluate cost implications (will fix increase API calls?)

3. **Create a detailed fix plan** including:
   - Files to modify (with line numbers)
   - Exact changes needed
   - Why this fix addresses the root cause
   - Edge cases the fix must handle
   - Tests to verify the fix works
   - Tests to verify no regressions
   - Documentation updates needed

4. **Present the plan** and wait for approval before proceeding

5. **Consider using Plan subagent** for complex bugs requiring architectural changes

---

## Phase 3: Implementation

**Objective:** Implement the fix following the approved plan.

1. **Write the fix** following your plan:
   - Make minimal changes (fix only what's broken)
   - Follow existing code patterns and conventions (check CLAUDE.md)
   - Add appropriate error handling
   - Include comments explaining why the fix works
   - Maintain backward compatibility when possible
   - Ensure cost optimization isn't broken

2. **Think** about edge cases as you implement:
   - Does this fix handle all variations of the bug?
   - Could this fix introduce new bugs?
   - Are there similar code patterns that need the same fix?
   - Does this affect AI model selection or token usage?

3. **Use subagents to verify** the fix is complete and correct

4. **Iterate as needed**:
   - Test the fix
   - Verify bug is resolved
   - Refine implementation
   - Repeat until bug is completely fixed

---

## Phase 4: Testing & Validation

**Objective:** Verify the bug is fixed and no regressions were introduced.

1. **Verify the bug is fixed**:
   - Run the reproduction steps from Phase 1
   - Confirm the bug no longer occurs
   - Test edge cases and variations
   - Test with different inputs and configurations
   - Verify error messages are helpful (if bug was about error handling)

2. **Test for regressions**:
   - Run ALL existing tests:
     ```bash
     npm test
     ```
   - Manually test related functionality
   - Check that example tests still work correctly
   - Verify no breaking changes to public APIs
   - Test in all supported browsers (if browser-specific):
     ```bash
     npx playwright test --project=chromium
     npx playwright test --project=firefox
     npx playwright test --project=webkit
     ```

3. **Verify cost optimization still works**:
   - Check that caching still functions (if applicable)
   - Verify AI model selection hasn't changed unexpectedly
   - Ensure token usage is reasonable

4. **Code quality checks**:
   - Proper formatting (Prettier/ESLint)
   - No obvious issues or vulnerabilities
   - TypeScript compiles without errors:
     ```bash
     npx tsc --noEmit
     ```
   - No console errors or warnings

5. **CRITICAL: Iterate until ALL tests pass**:
   - Run the full test suite:
     ```bash
     npm test
     ```
   - Run all tests (unit, integration, examples, manual reproduction)
   - If ANY test fails, fix the issue and rerun the full test suite
   - **DO NOT proceed to Phase 5 until ALL tests are passing**
   - **The bug must be completely fixed** - no partial solutions
   - **MANDATORY: All tests must pass before committing** - this is non-negotiable

---

## Phase 5: Documentation & Commit

**Objective:** Document changes and create a clean commit.

**PREREQUISITE:** All tests must be passing before proceeding. If you haven't run `npm test` in Phase 4 and verified all tests pass, go back and do that now.

1. **Update documentation** if needed:
   - Update comments if fixing complex logic
   - Update `docs/AI-MODEL-STRATEGY.md` if costs changed
   - Update CLAUDE.md if bug affected documented behavior
   - Add regression test example if the bug was subtle/hard to catch
   - Update README.md if bug affected a major feature

2. **Verify tests one final time before committing**:
   ```bash
   npm test
   ```
   All tests must pass. If any fail, return to Phase 4.

3. **Create a descriptive commit message**:
   ```
   framework: fix [brief one-line description of the bug]

   Bug: [Description of what was wrong and how it manifested]

   Root Cause: [Explanation of why the bug occurred]

   Fix: [Explanation of how the fix addresses the root cause]

   Testing: [How the fix was tested and verified]

   Tests: All tests passing (npm test)

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   ```

   **Example:**
   ```
   framework: fix self-healing cache not invalidating on selector change

   Bug: Self-healing selector cache returned stale results when the
   same semantic description was used with a different primary selector.
   This caused incorrect elements to be located after UI changes.

   Root Cause: Cache key was based only on semantic description, not
   including the primary selector. When primary selector changed (e.g.,
   after dev updated data-testid), cache returned old healed selector.

   Fix: Updated cache key generation in self-healing.ts to include both
   primary selector and semantic description. Cache now properly
   invalidates when either changes. Added MD5 hash for key stability.

   Testing:
   - Verified with manual tests using changing selectors
   - Added test case in tests/examples/self-healing-example.spec.ts
   - Confirmed cache invalidation works correctly
   - All existing tests still pass

   Tests: All tests passing (npm test)

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   ```

4. **Commit the changes**:
   - Stage relevant files only
   - Verify nothing is being committed that shouldn't be
   - Create the commit

5. **Push the fix branch** (optional, for backup/collaboration):
   ```bash
   git push -u origin framework/fix-your-bug-name
   ```

---

## Phase 6: Create Documentation (Optional but Recommended)

**Objective:** Document the bug fix with context for future framework development.

1. **Get the current branch name**:
   ```bash
   git branch --show-current
   ```

2. **Create branch-specific results directory** (optional for complex bugs):
   ```bash
   mkdir -p new_ideas/results/<branch-name>
   ```

3. **Create CONTEXT.md** at `new_ideas/results/<branch-name>/CONTEXT.md`:

   This file maintains important context for future framework work:

   ```markdown
   # Context: <branch-name>

   **Last Updated:** YYYY-MM-DD HH:MM
   **Status:** [In Progress / Completed / Blocked]

   ## Quick Summary

   [1-2 sentence summary of the bug being fixed]

   ## Bug Details

   - **Symptoms:** [What was observed]
   - **Root Cause:** [Why it occurred]
   - **Severity:** [Critical/High/Medium/Low]
   - **Affected Components:** [Which parts of framework]

   ## Important Decisions Made

   - [Why this fix approach was chosen]
   - [Alternative approaches considered and rejected]
   - [Trade-offs in the solution]
   - [Backward compatibility considerations]

   ## Critical Files & Locations

   - `path/to/file.ts:123-145` - [Where the bug was fixed]
   - `tests/examples/test.spec.ts:67` - [Related test code]

   ## Current State

   - [What's fixed]
   - [What's still being tested]
   - [What's blocked or needs attention]

   ## Next Steps

   1. [Immediate next task]
   2. [Follow-up testing needed]
   3. [Related bugs to check]

   ## Important Notes for Future Framework Development

   - [How to reproduce the original bug]
   - [Edge cases to watch out for]
   - [Related areas that might have similar issues]
   - [Testing approaches that worked well]

   ## Prevention

   - [How to prevent similar bugs in the future]
   - [What patterns to avoid]
   - [What tests to add]
   ```

---

## Framework-Specific Constraints

**Critical Requirements:**
- ✅ All code must be in English (code, comments, docs)
- ✅ Follow helper-based architecture patterns
- ✅ Maintain cost optimization (don't increase API calls unnecessarily)
- ✅ Preserve caching behavior when possible
- ✅ Keep TypeScript types accurate
- ✅ Update JSDoc comments if public APIs change
- ✅ Add regression test if bug was subtle

**Never Commit:**
- `node_modules/`
- `test-results/`, `playwright-report/`
- `.env` (only `.env.example`)
- `*.log` files
- Debug code or console.logs added during investigation

**Framework File Structure (Stable - Don't Break):**
- `config/ai-client.ts` - Unified Claude API client
- `fixtures/ai-fixtures.ts` - AI-enhanced Playwright fixtures
- `utils/ai-helpers/` - AI-powered utilities
- `utils/selectors/self-healing.ts` - Self-healing selectors
- `utils/api/` - Helper classes (auth, OTP, etc.)
- `tests/examples/` - Example tests demonstrating features

---

## Workflow Reminders

- **Start with Phase 0** - Create fix branch before any work
- **Phase 1 is critical** - Reproduce the bug reliably before fixing
- **Identify root cause** - Don't just fix symptoms
- **Use subagents liberally** for investigation and verification
- **Ask for approval** after presenting the fix plan (Phase 2)
- **Make minimal changes** - Fix only what's broken
- **Phase 4 is critical** - Iterate until ALL tests pass AND bug is fixed
- **Run `npm test` before committing** - All tests must pass, this is mandatory
- **Document why the bug occurred** - Help prevent similar bugs
- **Keep commits atomic** - One bug fix per commit
- **Push to fix branch** - Keep main branch clean

---

## Bug Fix Best Practices

1. **Always reproduce first** - Can't fix what you can't reproduce
2. **Find root cause** - Don't mask symptoms
3. **Fix minimally** - Smaller changes = less risk
4. **Test thoroughly** - Bug must stay fixed
5. **Check for similar bugs** - Same issue might exist elsewhere in framework
6. **Add regression tests** - Prevent bug from returning
7. **Document why** - Explain the fix for future framework developers
8. **Consider backward compatibility** - Don't break users' existing tests
9. **Verify cost implications** - Don't accidentally increase API usage
10. **Update examples if needed** - Show correct usage pattern

---

## Common Framework Bug Categories

### Self-Healing Issues
- Cache invalidation problems
- Incorrect selector matching
- AI vision analysis failures
- Token limit exceeded

### AI Assertion Issues
- Model selection errors
- Incorrect expectation interpretation
- Screenshot capture failures
- Cost optimization not working

### Fixture Issues
- Context not passed correctly
- Cleanup not happening
- Memory leaks
- Initialization errors

### Helper Issues
- Authentication failures
- OTP extraction timeouts
- Email provider integration issues
- Error handling gaps

---

**Ready to begin?** Start with Phase 0: Create a fix branch. Then proceed to Phase 1: Reproduce & Understand. Do not write any code until you have completed Phase 2 and received approval for your fix plan.

**When finished:** Update documentation and create a clean commit explaining the bug, root cause, fix, and testing performed.
