---
description: Comprehensive AI review of changes in current branch before creating PR
allowed-tools: ["Bash", "Task", "Read"]
arguments:
  - name: base_branch
    description: Base branch to compare against (defaults to origin/main)
    required: false
---

# Review Changes Before PR

Performs a comprehensive AI-powered code review of all changes in your current branch before you create a pull request.

**Use this command before:**
- Creating a pull request (framework or feature work)
- Merging to main/master
- Sharing your branch with the team

**What this command does:**
1. Analyzes all changed files in your branch
2. Reviews code quality, architecture, and best practices
3. Checks for bugs, security issues, and performance problems
4. Validates documentation completeness
5. Ensures tests are included and passing
6. Provides actionable recommendations

---

## 🤖 Claude Workflow (Execute This)

**When this command is invoked, follow these steps:**

### Step 1: Determine Base Branch

```
base_branch = "$ARGUMENTS" (if provided) or "origin/main" (default)
```

### Step 2: Get Changed Files

Use Bash tool:
```bash
git diff --name-only {base_branch}
```

If no files changed, inform user and exit.

### Step 3: Launch Review Agent

Use Task tool with these parameters:

**subagent_type**: `"general-purpose"`

**description**: `"Comprehensive code review of branch changes"`

**prompt**:
```
Perform comprehensive code review of changes between current branch and {base_branch}.

Changed files:
{list from step 2}

Analyze across these dimensions:
1. Code Quality: Style, patterns, maintainability, readability
2. Architecture: Design decisions, separation of concerns, modularity
3. Bugs: Potential issues, edge cases, error handling
4. Security: Vulnerabilities, input validation, data exposure
5. Performance: Inefficiencies, optimization opportunities
6. Testing: Coverage, test quality, reliability
7. Documentation: Comments, README updates, guides

For framework development specifically, verify:
- Follows helper-first architecture pattern
- AI cost optimization justified (model selection, caching)
- CLAUDE-DEV.md updated if framework behavior changes
- Examples created in tests/examples/ for new features
- All code and comments in English
- Backwards compatibility maintained
- Framework tests pass without regressions

For feature/test development specifically, verify:
- All logic in helpers, not in test files
- Tests are independent and idempotent
- P1 tests implemented, P2/P3 documented
- Stable selectors used (data-testid, role, text)
- Test coverage for critical paths

Generate structured report with:

## 📊 CHANGES SUMMARY
- Files changed: X
- Lines added: +XXX
- Lines removed: -XXX

## 📋 FILES REVIEWED
1. path/to/file1 (+XX -XX)
2. path/to/file2 (+XX -XX)

## 🔴 CRITICAL ISSUES (Must Fix Before PR)
[If any found, list with:]
- Issue description
- Location: file.ts:line
- Fix: Specific recommendation

[If none: "No critical issues found."]

## 🟡 IMPORTANT ISSUES (Should Fix Before PR)
[If any found, list with:]
- Issue description
- Location: file.ts:line
- Suggestion: How to improve

[If none: "No important issues found."]

## 💡 SUGGESTIONS (Nice to Have)
[If any found, list with:]
- Enhancement description
- Location: file.ts:line

[If none: "No suggestions at this time."]

## ✅ POSITIVE HIGHLIGHTS
[What's well-done in this change:]
- Good patterns observed
- Strengths of the implementation

## 🏁 VERDICT
[Choose one:]
- ✅ Ready for PR - All checks passed, no blocking issues
- ⚠️ Needs Changes Before PR - Address critical/important issues first
- 🔴 Blocked - Critical issues must be fixed before proceeding
```

### Step 4: Present Results

After the agent completes, present the full report to the user.

---

## Usage Examples

### Basic Usage (Compare with main)
```bash
/review-changes
```

### Compare with Custom Base Branch
```bash
/review-changes develop
```

### Before Framework PR
```bash
# After implementing new feature
git checkout framework/add-new-feature
/review-changes

# Fix any issues identified
# Commit fixes
# Create PR
```

### Before Feature PR
```bash
# After implementing new tests
git checkout feature/test-checkout
/review-changes

# Address critical and important issues
# Commit fixes
# Create PR
```

---

## Review Criteria

### For Framework Development

The review will check:
- **Architecture**: Follows framework design patterns, helper-first approach
- **AI Cost**: Model selection justified, caching implemented
- **Documentation**: Updated CLAUDE-DEV.md, AI-MODEL-STRATEGY.md
- **Examples**: Test examples created in tests/examples/
- **English**: All code and comments in English
- **Breaking Changes**: Backwards compatibility maintained
- **Testing**: Framework tests pass, no regressions

### For Feature/Test Development

The review will check:
- **Helper Usage**: All logic in helpers, not in test files
- **Test Quality**: Independent, idempotent, reliable tests
- **Priority**: P1 implemented, P2/P3 documented
- **Selectors**: Stable selectors used (data-testid, role, text)
- **Documentation**: P2/P3 docs updated
- **Test Coverage**: Critical paths covered
- **English**: All code and comments in English

---

## Acting on Review Results

### ✅ Ready for PR
- All checks passed
- No critical or important issues
- Create PR with confidence

### ⚠️ Needs Changes Before PR
- Address critical issues (required)
- Consider important issues (recommended)
- Optional: address suggestions
- Run `/review-changes` again to verify
- Create PR after fixes

### 🔴 Blocked - Critical Issues
- Must fix all critical issues before PR
- Do NOT create PR until resolved
- Fix issues, commit changes
- Run `/review-changes` again
- Verify all critical issues resolved

---

## Best Practices

### Before Running Review

1. **Ensure clean state**:
   ```bash
   git status
   # Should show only committed changes
   ```

2. **All tests passing**:
   ```bash
   npm test
   # All tests should pass before review
   ```

3. **TypeScript compiles**:
   ```bash
   npx tsc --noEmit
   # No type errors
   ```

4. **Commit message ready**:
   - Clear, descriptive commit messages
   - Follow framework/feature conventions

### After Review

1. **Address critical issues first**: These block your PR

2. **Consider important issues**: Improve code quality

3. **Evaluate suggestions**: Nice-to-have improvements

4. **Run review again**: After making fixes, verify

5. **Create PR**: When review passes with ✅ or ⚠️ (minor issues only)

---

## Cost Information

- **Estimated cost**: ~$0.25-0.35 per review (using general-purpose agent)
- **Time**: 1-3 minutes depending on number of changed files
- **Token usage**: ~60k-80k input tokens, ~3k output tokens

**Cost optimization**: The agent runs in isolated context without main conversation history, making it 7x cheaper than manual review.

---

## Limitations

- **Not a substitute for human review**: Use this as a first pass, team review is still valuable
- **Context-dependent**: Agent has project context but may miss domain-specific concerns
- **Time**: Review can take 1-3 minutes for large changes
- **API Cost**: Uses Claude API (~$0.25-0.35 per review depending on changes)

---

## When NOT to Use This Command

- **No changes committed**: Run `git status` first, commit your changes
- **On main/master branch**: This is for feature/framework branches
- **Before testing**: Run `npm test` first, ensure tests pass
- **For minor changes**: Single-line fixes don't need full review

---

**Ready to review?** Run `/review-changes` now to get comprehensive feedback on your changes before creating a PR. The agent will automatically analyze your changes and provide a structured report.
