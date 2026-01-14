---
description: Fix a bug following Anthropic's best practices workflow
arguments:
  - name: bug_description
    description: Description of the bug to fix
    required: true
---

# Bug Fix Implementation

Your task is to fix the following bug: $ARGUMENTS

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
   git checkout -b fix/descriptive-bug-name
   ```

   **Branch naming convention:**
   - Use `fix/` prefix
   - Use kebab-case (lowercase with hyphens)
   - Be descriptive but concise
   - Examples:
     - `fix/firebreak-cache-invalidation`
     - `fix/wind-parameter-calculation`
     - `fix/terrain-loading-error`
     - `fix/session-timeout-crash`

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
   - Test in both GPU and CPU modes (if applicable)

2. **Understand the symptoms**:
   - When does it occur? (always, intermittent, specific conditions)
   - What components are involved?
   - What data or inputs trigger it?
   - Does it affect other functionality?

3. **Explore the codebase** (use Explore subagent for complex investigations):
   - Find the code that exhibits the bug
   - Trace the execution path that leads to the bug
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
   - Why did this bug occur? (logic error, edge case, race condition, etc.)
   - When was it introduced? (check git history if helpful)
   - Are there similar bugs elsewhere in the codebase?

2. **Evaluate fix approaches**:
   - List multiple potential solutions
   - Consider trade-offs (simplicity vs. performance, safety vs. elegance)
   - Think about side effects and unintended consequences
   - Consider backward compatibility

3. **Create a detailed fix plan** including:
   - Files to modify (with line numbers)
   - Exact changes needed
   - Why this fix addresses the root cause
   - Edge cases the fix must handle
   - Tests to verify the fix works
   - Tests to verify no regressions
   - GPU and CPU mode compatibility (if applicable)

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
   - Ensure GPU and CPU mode compatibility (if touching simulator code)

2. **Think** about edge cases as you implement:
   - Does this fix handle all variations of the bug?
   - Could this fix introduce new bugs?
   - Are there similar code patterns that need the same fix?

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

2. **Test for regressions**:
   - Run ALL existing tests (unit, integration, e2e)
     ```bash
     ./run_tests.sh
     ```
   - Manually test related functionality
   - Verify deterministic behavior still works (if applicable)
     ```bash
     python3 simulador_rdc/simulador_rdc.py --exp 1 --steps 50 \
       --ignition 400,600 --maps-dir maps/your_map --params fixed
     ```
   - Test in browser if webapp-related

3. **Test in both modes** (if simulator-related):
   - GPU mode (if available)
   - CPU mode with `--cpu-mode` flag

4. **Code quality checks**:
   - Proper formatting (Black/autopep8)
   - No obvious issues or vulnerabilities
   - Follows .gitignore patterns (no generated files)

5. **CRITICAL: Iterate until ALL tests pass**:
   - Run the full test suite:
     ```bash
     ./run_tests.sh
     ```
   - Run all tests (unit, integration, e2e, manual reproduction)
   - If ANY test fails, fix the issue and rerun the full test suite
   - **DO NOT proceed to Phase 5 until ALL tests are passing**
   - **The bug must be completely fixed** - no partial solutions
   - **MANDATORY: All tests must pass before committing** - this is non-negotiable
   - Document any issues that cannot be fixed (for Phase 6)

---

## Phase 5: Documentation & Commit

**Objective:** Document changes and create a clean commit.

**PREREQUISITE:** All tests must be passing before proceeding. If you haven't run `./run_tests.sh` in Phase 4 and verified all tests pass, go back and do that now.

1. **Update documentation** if needed:
   - Update comments if fixing complex logic
   - Update README.md if bug affected documented behavior
   - Add regression test if the bug was subtle/hard to catch

2. **Verify tests one final time before committing**:
   ```bash
   ./run_tests.sh
   ```
   All tests must pass. If any fail, return to Phase 4.

3. **Create a descriptive commit message**:
   ```
   Fix: [brief one-line description of the bug]

   Bug: [Description of what was wrong and how it manifested]

   Root Cause: [Explanation of why the bug occurred]

   Fix: [Explanation of how the fix addresses the root cause]

   Testing: [How the fix was tested and verified]

   Tests: All tests passing (./run_tests.sh)

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   ```

   **Example:**
   ```
   Fix: Cache not invalidated when wind parameters change

   Bug: Simulations with different wind parameters returned identical
   results because cached terrain data wasn't being invalidated.

   Root Cause: Wind parameters weren't included in cache key calculation,
   causing cache hits when parameters changed.

   Fix: Added wind_scale and wind_rotation to cache key generation in
   load_terrain_data(). Cache now properly invalidates when wind params change.

   Testing: Verified with manual tests and added integration test for
   cache invalidation on wind parameter changes.

   Tests: All tests passing (./run_tests.sh)

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   ```

4. **Commit the changes**:
   - Stage relevant files only
   - Verify nothing is being committed that shouldn't be
   - Create the commit

5. **Push the fix branch** (optional, for backup/collaboration):
   ```bash
   git push -u origin fix/your-bug-name
   ```

---

## Phase 6: Create Documentation

**Objective:** Document the bug fix with context and review for future sessions.

1. **Get the current branch name**:
   ```bash
   git branch --show-current
   ```

2. **Create branch-specific results directory**:
   ```bash
   mkdir -p .claude/results/<branch-name>
   ```

3. **Create CONTEXT.md** at `.claude/results/<branch-name>/CONTEXT.md`:

   This file maintains important context between Claude sessions. Include:

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

   ## Important Decisions Made

   - [Why this fix approach was chosen]
   - [Alternative approaches considered and rejected]
   - [Trade-offs in the solution]

   ## Critical Files & Locations

   - `path/to/file.py:123-145` - [Where the bug was fixed]
   - `path/to/test.py:67` - [Related test code]

   ## Current State

   - [What's fixed]
   - [What's still being tested]
   - [What's blocked or needs attention]

   ## Next Steps

   1. [Immediate next task]
   2. [Follow-up testing needed]
   3. [Related bugs to check]

   ## Important Notes for Future Sessions

   - [How to reproduce the original bug]
   - [Edge cases to watch out for]
   - [Related areas that might have similar issues]
   - [Testing approaches that worked well]

   ## Dependencies & Related Code

   - [Other code affected by this fix]
   - [Related bugs or issues]
   - [Similar patterns elsewhere in codebase]
   ```

4. **Create REVIEW.md** at `.claude/results/<branch-name>/REVIEW.md`:

   Full review of the bug fix:

   ```markdown
   # Bug Fix Review: <branch-name>

   **Date:** YYYY-MM-DD
   **Bug Description:** [Detailed description of the bug]

   ## Summary

   [Comprehensive overview of the bug and fix]

   ## 🐛 Bug Details

   - **Symptoms:** [What was observed]
   - **Root Cause:** [Why it occurred]
   - **Affected Components:** [Which parts of the system]
   - **Severity:** [Critical/High/Medium/Low]
   - **Reproducibility:** [Always/Intermittent/Rare]
   - **How to Reproduce:** [Step-by-step reproduction steps]

   ## Changes Made

   ### Files Modified

   - `path/to/file1.py`
     - Fixed: [specific bug]
     - Modified: [logic/behavior]
     - Line ranges: [X-Y, A-B]

   - `path/to/test.py`
     - Added: [test cases]

   ## ✅ Fix Implemented

   - **Changes Made:** [Specific code changes]
   - **Why This Works:** [Explanation of how fix addresses root cause]
   - **Edge Cases Handled:** [List of edge cases now covered]

   ## 🧪 Testing Performed

   - **Reproduction Test:** [Verified bug is fixed - how]
   - **Unit Tests:** [Pass/Fail - list relevant tests]
   - **Integration Tests:** [Pass/Fail - list relevant tests]
   - **Regression Tests:** [Pass/Fail - verified no new bugs]
   - **Manual Testing:** [Scenarios tested]
   - **GPU/CPU Testing:** [Both modes tested if applicable]

   ## ⏳ Pending / Follow-up Work

   - [Any related issues discovered]
   - [Similar bugs in other parts of the codebase]
   - [Improvements to prevent similar bugs]
   - [Tests to add for better coverage]

   ## ❌ Known Limitations / Could Not Fix

   - [Any aspects of the bug that couldn't be fully resolved]
   - [Explain why]
   - [Workarounds or mitigations]
   - [Suggest future solutions]

   ## 💡 Implementation Notes

   - [Lessons learned]
   - [Why the bug occurred in the first place]
   - [How to prevent similar bugs in the future]
   - [Any architectural insights]

   ## Git Diff

   ```diff
   [Paste the output of: git diff main...HEAD]
   ```
   ```

5. **Generate and include the git diff**:
   ```bash
   git diff main...HEAD
   ```
   Copy the output into the "Git Diff" section of REVIEW.md

6. **Fill in all sections thoroughly** - be honest about what worked and what didn't

7. **Update CONTEXT.md regularly** - This file should be updated throughout development, not just at the end. After completing significant milestones, update it so future sessions have current information.

---

## Project-Specific Constraints

**Critical Requirements:**
- ✅ Code must work in both GPU (CuPy) and CPU (NumPy/SciPy) modes
- ✅ Preserve reproducibility: `--params fixed` must remain deterministic
- ✅ Follow existing code formatting (Black/autopep8)
- ✅ Don't commit generated files (check `.gitignore`)
- ✅ Keep files under ~500 LOC (split/refactor if needed)
- ✅ Bilingual documentation (Spanish primary, English secondary)

**Never Commit:**
- `*_referencia_*.npy` files
- `map_cache/` contents
- `maps/*` contents (except `.gitkeep`)
- `.DS_Store`, `.mcp.json`, `playwright-mcp-config.json`

**File Structure (Stable - Don't Break):**
- `simulador_rdc/simulador_rdc.py` - Main simulation logic
- `simulador_rdc/modelo_rdc.py` - GPU kernels
- `simulador_rdc/modelo_rdc_cuda.py` - CPU fallback
- `webapp/app.py` - Web API
- `webapp/static/js/terrain.js` - Frontend

---

## Workflow Reminders

- **Start with Phase 0** - Create fix branch before any work
- **Phase 1 is critical** - Reproduce the bug reliably before fixing
- **Identify root cause** - Don't just fix symptoms
- **Use subagents liberally** for investigation and verification
- **Ask for approval** after presenting the fix plan (Phase 2)
- **Make minimal changes** - Fix only what's broken
- **Phase 4 is critical** - Iterate until ALL tests pass AND bug is fixed
- **Run `./run_tests.sh` before committing** - All tests must pass, this is mandatory
- **Document everything in Phase 6** - What, why, and how
- **Keep commits atomic** - One bug fix per commit
- **Push to fix branch** - Keep main branch clean

---

## Bug Fix Best Practices

1. **Always reproduce first** - Can't fix what you can't reproduce
2. **Find root cause** - Don't mask symptoms
3. **Fix minimally** - Smaller changes = less risk
4. **Test thoroughly** - Bug must stay fixed
5. **Check for similar bugs** - Same issue might exist elsewhere
6. **Add regression tests** - Prevent bug from returning
7. **Document why** - Explain the fix for future developers

---

**Ready to begin?** Start with Phase 0: Create a fix branch. Then proceed to Phase 1: Reproduce & Understand. Do not write any code until you have completed Phase 2 and received approval for your fix plan.

**When finished:** Complete Phase 6 to create documentation at `.claude/results/<branch-name>/` including:
- `CONTEXT.md` - Maintains context between sessions with bug details, fix approach, and testing notes
- `REVIEW.md` - Complete review of the bug fix with testing results and git diff
