---
description: Implement a new feature following Anthropic's best practices workflow
arguments:
  - name: feature_description
    description: Description of the feature to implement
    required: true
---

# Feature Implementation

Your task is to implement the following feature: $ARGUMENTS

Follow this structured workflow strictly. **Do not skip phases.**

---

## Phase 0: Create Feature Branch

**Objective:** Isolate feature work in a dedicated branch.

1. **Check current branch status**:
   ```bash
   git status
   ```
   Ensure working tree is clean before creating a new branch.

2. **Create and checkout a feature branch** with descriptive naming:
   ```bash
   git checkout -b feature/descriptive-feature-name
   ```

   **Branch naming convention:**
   - Use `feature/` prefix
   - Use kebab-case (lowercase with hyphens)
   - Be descriptive but concise
   - Examples:
     - `feature/add-firebreak-visualization`
     - `feature/improve-wind-calculation`
     - `feature/export-simulation-data`

3. **Confirm you're on the new branch**:
   ```bash
   git branch --show-current
   ```

---

## Phase 1: Explore & Understand (READ-ONLY - No Code Yet!)

**Objective:** Thoroughly understand the problem space before writing any code.

1. **Think hard** about the feature requirements:
   - What problem does this solve?
   - What are the implications and side effects?
   - Are there any ambiguities that need clarification?

2. **Explore the codebase** (use Explore subagent for complex investigations):
   - Find relevant existing code and patterns
   - Identify similar features or functionality
   - Locate files and modules that will need modification
   - Understand dependencies and potential impacts
   - Read the CLAUDE.md file for project conventions

3. **Ask clarifying questions** if the feature description is unclear or incomplete

4. **DO NOT write any code yet** - this phase is for understanding only

---

## Phase 2: Plan & Design

**Objective:** Create a detailed implementation plan before coding.

1. **Think harder** about different implementation approaches:
   - Evaluate multiple solutions
   - Consider trade-offs and edge cases
   - Think about testing strategy

2. **Create a detailed plan** including:
   - Files to create or modify (with line numbers if modifying)
   - Functions/classes/components to add
   - How the feature integrates with existing code
   - Edge cases and error handling approach
   - Testing strategy (manual tests, expected outputs)
   - GPU and CPU mode compatibility (if applicable)

3. **Present the plan** and wait for approval before proceeding

4. **Consider using Plan subagent** for complex features requiring architectural decisions

---

## Phase 3: Implementation

**Objective:** Implement the feature following the approved plan.

1. **Write the code** following your plan:
   - Follow existing code patterns and conventions (check CLAUDE.md)
   - Add appropriate error handling
   - Include docstrings/comments for complex logic
   - Ensure GPU and CPU mode compatibility (if touching simulator code)

2. **Think** about edge cases as you implement each piece

3. **Use subagents to verify** that implementation isn't overfitting or missing edge cases

4. **Iterate as needed**:
   - Run the code
   - Check outputs
   - Refine implementation
   - Repeat until working correctly

---

## Phase 4: Testing & Validation

**Objective:** Verify the feature works correctly and doesn't break existing functionality.

1. **Test the feature thoroughly**:
   - Manual testing with representative inputs
   - Test both success and error cases
   - For simulator changes: verify deterministic behavior
     ```bash
     python3 simulador_rdc/simulador_rdc.py --exp 1 --steps 50 \
       --ignition 400,600 --maps-dir maps/your_map --params fixed
     ```
   - For webapp changes: test in browser with different scenarios

2. **Test in both modes** (if simulator-related):
   - GPU mode (if available)
   - CPU mode with `--cpu-mode` flag

3. **Verify no regressions**:
   - Run existing tests if applicable
   - Check that existing features still work
   - Verify deterministic output still matches

4. **Code quality checks**:
   - Proper formatting (Black/autopep8)
   - No obvious issues or vulnerabilities
   - Follows .gitignore patterns (no generated files)

5. **CRITICAL: Iterate until ALL tests pass**:
   - Run the full test suite:
     ```bash
     ./run_tests.sh
     ```
   - Run all tests (unit tests, integration tests, e2e tests, manual tests)
   - If ANY test fails, fix the issue and rerun the full test suite
   - **DO NOT proceed to Phase 5 until ALL tests are passing**
   - **Iterate as many times as needed** - no shortcuts
   - **MANDATORY: All tests must pass before committing** - this is non-negotiable
   - Document any issues that cannot be fixed (for Phase 6)

---

## Phase 5: Documentation & Commit

**Objective:** Document changes and create a clean commit.

**PREREQUISITE:** All tests must be passing before proceeding. If you haven't run `./run_tests.sh` in Phase 4 and verified all tests pass, go back and do that now.

1. **Update documentation** if needed:
   - Update README.md only for major features
   - Update API_SPEC.md for new API endpoints
   - Add comments for complex logic
   - Update .gitignore if new generated files are created

2. **Verify tests one final time before committing**:
   ```bash
   ./run_tests.sh
   ```
   All tests must pass. If any fail, return to Phase 4.

3. **Create a descriptive commit message**:
   ```
   Add feature: [brief one-line description]

   [Detailed explanation of what was added, why it was needed,
   and any important implementation details. Keep it concise but
   informative.]

   Tests: All tests passing (./run_tests.sh)

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   ```

4. **Commit the changes**:
   - Stage relevant files only
   - Verify nothing is being committed that shouldn't be
   - Create the commit

5. **Push the feature branch** (optional, for backup/collaboration):
   ```bash
   git push -u origin feature/your-feature-name
   ```

---

## Phase 6: Create Documentation

**Objective:** Document the work completed with context and review for future sessions.

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

   [1-2 sentence summary of what this branch does]

   ## Important Decisions Made

   - [Key architectural decisions]
   - [Trade-offs chosen and why]
   - [Approaches tried and rejected]

   ## Critical Files & Locations

   - `path/to/file.py:123-145` - [What this code does and why it matters]
   - `path/to/another.js:67` - [Important function/logic here]

   ## Current State

   - [What's working]
   - [What's in progress]
   - [What's blocked or needs attention]

   ## Next Steps

   1. [Immediate next task]
   2. [Following task]
   3. [Then this]

   ## Important Notes for Future Sessions

   - [Gotchas to remember]
   - [Context that would be helpful to know]
   - [Constraints or requirements to keep in mind]
   - [Common errors and how to avoid them]

   ## Dependencies & Related Code

   - [Other branches this depends on]
   - [Related functionality to be aware of]
   - [External dependencies or constraints]
   ```

4. **Create REVIEW.md** at `.claude/results/<branch-name>/REVIEW.md`:

   Full review of all work done in this branch:

   ```markdown
   # Feature Implementation Review: <branch-name>

   **Date:** YYYY-MM-DD
   **Feature Description:** [Detailed description of what was implemented]

   ## Summary

   [Comprehensive overview of the feature implementation]

   ## Changes Made

   ### Files Modified

   - `path/to/file1.py`
     - Added: [functionality]
     - Modified: [existing behavior]
     - Line ranges: [X-Y, A-B]

   - `path/to/file2.js`
     - [changes description]

   ### Files Created

   - `path/to/new_file.py` - [purpose and functionality]

   ## ✅ Completed

   - [List everything that was successfully implemented]
   - [Include specific files modified/created]
   - [Note any key decisions made]
   - [List all tests that are passing]

   ## ⏳ Pending / Future Work

   - [List any features that were planned but not completed]
   - [Any improvements identified during implementation]
   - [Follow-up tasks or refactoring needed]

   ## ❌ Known Issues / Could Not Fix

   - [List any issues encountered that couldn't be resolved]
   - [Include error messages or symptoms]
   - [Explain why they couldn't be fixed]
   - [Suggest potential solutions or workarounds]

   ## 📊 Test Results

   - Total tests: X
   - Passing: X
   - Failing: X (should be 0)
   - Test coverage areas: [list what was tested]

   ## 💡 Implementation Notes

   - [Lessons learned]
   - [Architectural decisions]
   - [Why certain approaches were chosen]
   - [Important details for future developers]

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

- **Start with Phase 0** - Create feature branch before any work
- **DO NOT skip Phase 1 & 2** - Jumping straight to code reduces quality
- **Use subagents liberally** for exploration and verification
- **Ask for approval** after presenting the plan (Phase 2)
- **Iterate in Phase 3** - First version is rarely perfect
- **Phase 4 is critical** - Iterate until ALL tests pass, no exceptions
- **Run `./run_tests.sh` before committing** - All tests must pass, this is mandatory
- **Document everything in Phase 6** - Completed, pending, and unfixable issues
- **Keep commits atomic** - One feature per commit
- **Push to feature branch** - Keep main branch clean

---

**Ready to begin?** Start with Phase 0: Create a feature branch. Then proceed to Phase 1: Explore & Understand. Do not write any code until you have completed Phase 2 and received approval for your plan.

**When finished:** Complete Phase 6 to create documentation at `.claude/results/<branch-name>/` including:
- `CONTEXT.md` - Maintains context between sessions with important decisions, current state, and next steps
- `REVIEW.md` - Complete review of all work done with git diff for future reference
