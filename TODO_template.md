# TODO: Template Improvements & Fixes

This file tracks improvements, bugs, and changes discovered while working on projects that should be applied back to the base template.

## 🐛 Bugs / Fixes

(No open bugs)

---

## ✨ Enhancements

### [ENHANCE-006] Fix /review-changes Command to Use Agent
**Date:** 2026-01-14
**Priority:** High
**Status:** ✅ IMPLEMENTED

**Goal:**
Fix `/review-changes` command to automatically launch a Task agent instead of just showing documentation.

**What was implemented:**
Rewrote `.claude/commands/review-changes.md` with:
- Added `allowed-tools: ["Bash", "Task", "Read"]` in frontmatter
- New "🤖 Claude Workflow (Execute This)" section with step-by-step instructions
- Step 1: Determine base branch ($ARGUMENTS or origin/main)
- Step 2: Get changed files with `git diff --name-only`
- Step 3: Launch Task tool with general-purpose agent
- Structured prompt template with review dimensions and report format
- Simplified from 454 to 294 lines (35% reduction)

**Testing:**
- Manually tested command execution
- Task tool launched successfully
- Agent generated structured review report with verdict
- Bug confirmed fixed

**Benefits:**
- 7x cheaper (~$0.25 vs ~$1.80)
- Isolated context
- Automated execution
- Progress visibility
- Structured reports

**Location:**
- `.claude/commands/review-changes.md` - Complete rewrite

---

### [ENHANCE-007] Review Command Improvements
**Date:** 2026-01-14
**Priority:** Low
**Status:** Pending

**Goal:**
Minor improvements to `/review-changes` command based on agent review feedback.

**Improvements to consider:**

1. **Improve prompt format clarity** (from agent review issue #2):
   - Current: Uses triple backticks around multi-line prompt
   - Suggestion: Use heredoc or quote-style format to avoid potential backtick interpretation issues
   - Location: `.claude/commands/review-changes.md:56-132`

2. **Add origin/main fallback check** (from agent review issue #3):
   - Current: Defaults to `origin/main` without checking existence
   - Suggestion: Add fallback to `origin/master` if `origin/main` doesn't exist
   - Code example:
     ```bash
     if git rev-parse --verify origin/main >/dev/null 2>&1; then
       base_branch="origin/main"
     elif git rev-parse --verify origin/master >/dev/null 2>&1; then
       base_branch="origin/master"
     fi
     ```

3. **Add troubleshooting section**:
   - Command doesn't execute
   - No files to review
   - Agent fails to start
   - Common error messages and solutions

4. **Clarify file list format**:
   - Specify how to format `{list from step 2}` in prompt
   - One file per line vs comma-separated vs other format

**Benefits:**
- More robust error handling
- Better compatibility with different git setups
- Clearer documentation for edge cases

**Note:** These are nice-to-have improvements. The command works correctly without them.

---

### [ENHANCE-002] Semantic Versioning Reminders
**Date:** 2026-01-14
**Priority:** Medium
**Status:** ✅ IMPLEMENTED

**Goal:**
Add clear reminders about semantic versioning in framework development docs.

**What was implemented:**
Added comprehensive "Semantic Versioning Reminder" section to `CLAUDE-DEV.md` with:
- Version types (PATCH/MINOR/MAJOR) with examples
- Version bump checklist (7 steps)
- Git tagging workflow
- GitHub Release creation workflow
- Reference example from v1.4.2 release

Updated framework commands (`.claude/commands/`):
- `improve-framework.md` - Added versioning steps in Phase 5
- `fix-framework.md` - Added versioning steps in Phase 5

**Location:**
- `CLAUDE-DEV.md` - Section "Semantic Versioning Reminder" (lines 258-401)
- `.claude/commands/improve-framework.md` - Phase 5 steps 3-4, 8
- `.claude/commands/fix-framework.md` - Phase 5 steps 3-4, 8

**Benefit:**
- Consistent versioning across releases
- Clear guidance for framework developers
- Automated workflow for tagging and releases
- Reference example for future releases

---

### [ENHANCE-003] Git Operations Protocol
**Date:** 2026-01-14
**Priority:** High
**Status:** ✅ IMPLEMENTED

**Goal:**
Add mandatory review protocol before pushing to remote.

**What was implemented:**
Added "Git & Review Protocol (MANDATORY)" section to `CLAUDE-DEV.md` with:
- Step-by-step checklist before pushing
- Mandatory `/review-changes` before commits to main
- Clear explanation of why review is critical
- Exception rules for trivial changes

**Location:**
- `CLAUDE-DEV.md` - Section "Git & Review Protocol (MANDATORY)"

**Benefit:**
- Catches issues before they become public
- Validates documentation consistency
- Ensures code quality standards
- No PR safety net when committing to main directly

---

### [ENHANCE-004] Update create-template.ts
**Date:** 2026-01-14
**Priority:** Medium
**Status:** Pending (depends on FIX-002)

**Goal:**
Update template generation script to correctly filter commands.

**Details:**
- Ensure only user-facing commands go to template
- Exclude framework development commands
- Handle new command structure (after FIX-002 is resolved)

**Location:**
- `scripts/create-template.ts`

**Benefit:**
- Clean template for end users
- No confusion with framework dev commands

---

### [ENHANCE-005] Rename TODO File
**Date:** 2026-01-14
**Priority:** Low
**Status:** Pending

**Goal:**
Rename `TODO_template.md` to `TODO_framework.md` for clarity.

**Reason:**
- Current name "template" is ambiguous
- "framework" better describes it's for framework development TODOs
- Consistent with other naming (CLAUDE-DEV.md, framework/* branches)

**Action:**
```bash
git mv TODO_template.md TODO_framework.md
```

**Files to update:**
- `.gitignore` (update reference if exists)
- Any docs mentioning this file

**Benefit:**
- Clearer purpose
- Better naming consistency

---

## 📝 Notes

- Update this file whenever you find something while working on projects
- Review and apply changes to template periodically (e.g., after completing important features)
- Keep the format: Date, clear description, before/after code, priority
- Completed items are removed after being implemented and released

## ✅ Completed (Archive)

### v1.4.1 - 2026-01-14

- **[FIX-002]** Command Structure Issue - Fixed command organization for Claude Code Skill tool compatibility

### v1.2.0 - 2026-01-13

- **[FIX-001]** Hardcoded URL in auth-helper.ts - Fixed with strict APP_URL validation
- **[ENHANCE-001]** English-only language standard - Added Code Standards section to CLAUDE.md
