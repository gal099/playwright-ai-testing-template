---
description: Comprehensive AI review of changes in current branch before creating PR
arguments:
  - name: base_branch
    description: Base branch to compare against (defaults to main)
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

## How It Works

The review agent will:

1. **Compare branches**: Identifies all files changed between your branch and the base branch ($ARGUMENTS or `main`)

2. **Read changed files**: Analyzes the full content of each modified file

3. **Evaluate changes** across multiple dimensions:
   - Code Quality: Style, patterns, maintainability
   - Architecture: Design decisions, separation of concerns
   - Bugs: Potential issues, edge cases, error handling
   - Security: Vulnerabilities, input validation
   - Performance: Inefficiencies, optimization opportunities
   - Testing: Coverage, test quality, reliability
   - Documentation: Comments, README, guides

4. **Generate report** with:
   - Overall verdict (Ready / Needs Changes / Blocked)
   - Critical issues (must fix before PR)
   - Important issues (should fix before PR)
   - Suggestions (nice-to-have improvements)
   - Positive highlights (what you did well)

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

## What to Expect

### Review Report Structure

```
╔════════════════════════════════════════════╗
║       CODE REVIEW REPORT                   ║
╚════════════════════════════════════════════╝

📊 CHANGES SUMMARY
- Files changed: X
- Lines added: +XXX
- Lines removed: -XXX

📋 FILES REVIEWED
1. path/to/file1.ts (+XX -XX)
2. path/to/file2.ts (+XX -XX)

🔴 CRITICAL ISSUES (Must Fix)
1. [Security] Issue description
   Location: file.ts:line
   Fix: Specific recommendation

🟡 IMPORTANT ISSUES (Should Fix)
1. [Architecture] Issue description
   Location: file.ts:line
   Suggestion: How to improve

💡 SUGGESTIONS (Nice to Have)
1. [Enhancement] Suggestion description
   Location: file.ts:line

✅ POSITIVE HIGHLIGHTS
- What you did well
- Good patterns observed

🏁 VERDICT
⚠️ Needs Changes Before PR
✅ Ready for PR
🔴 Blocked - Critical Issues Must Be Fixed
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

## Common Issues and Fixes

### Critical Issues

**"Tests not included for new code"**
- Add test coverage in tests/examples/ (framework)
- Add P1 tests in tests/{feature}/ (features)

**"Missing documentation updates"**
- Update CLAUDE-DEV.md (framework changes)
- Update CLAUDE.md (user-facing changes)
- Document P2/P3 tests if applicable

**"Security vulnerability detected"**
- Fix immediately (XSS, SQL injection, command injection, etc.)
- Follow OWASP best practices

**"Breaking change without migration path"**
- Add backwards compatibility
- Document breaking changes clearly
- Provide migration guide

### Important Issues

**"Code duplication detected"**
- Extract to helper method
- Create reusable utility

**"Missing error handling"**
- Add try-catch blocks
- Handle edge cases
- Return meaningful errors

**"Tests might be flaky"**
- Add proper waits (waitForURL, waitForSelector)
- Remove arbitrary timeouts
- Ensure test isolation

**"Performance concern"**
- Optimize expensive operations
- Consider caching
- Review AI model selection

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

## Integration with Workflow

### Framework Development Workflow
```bash
# Phase 0-5: Implement feature
git checkout -b framework/add-feature

# Phase 6: Local review before PR
/review-changes

# Fix issues
# Commit fixes

# Phase 7: Create PR
gh pr create --title "..." --body "..."
```

### Feature/Test Development Workflow
```bash
# Implement tests
git checkout -b feature/test-screen

# Local review before PR
/review-changes

# Fix issues
# Commit fixes

# Create PR
gh pr create --title "..." --body "..."
```

---

## Tips for Better Reviews

### Get More Detailed Reviews

The review agent automatically:
- Reads full file contents (not just diffs)
- Understands project context and architecture
- Applies best practices for the framework

### Handle Large Changes

For very large changes (many files):
- Consider breaking into smaller PRs
- Review takes longer but is more thorough
- Agent will prioritize critical issues

### Iterative Reviews

After fixing issues:
```bash
# Fix issues
git add .
git commit -m "fix: address review feedback"

# Review again
/review-changes

# Verify issues resolved
```

---

## Limitations

- **Not a substitute for human review**: Use this as a first pass, team review is still valuable
- **Context-dependent**: Agent has project context but may miss domain-specific concerns
- **Time**: Review can take 1-3 minutes for large changes
- **API Cost**: Uses Claude API (~$0.01-0.05 per review depending on changes)

---

## When NOT to Use This Command

- **No changes committed**: Run `git status` first, commit your changes
- **On main/master branch**: This is for feature/framework branches
- **Before testing**: Run `npm test` first, ensure tests pass
- **For minor changes**: Single-line fixes don't need full review

---

**Ready to review?** Run `/review-changes` now to get comprehensive feedback on your changes before creating a PR. Address any critical or important issues, then create your pull request with confidence.
