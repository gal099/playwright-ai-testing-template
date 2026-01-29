# Context Command - Project State

Get up to speed on your project state when returning after time away.

## Read

Read these files to understand your project:
- `CLAUDE.md` - Project instructions and patterns
- `README.md` - Project overview
- `.env.example` - Required configuration (never read `.env`)
- `package.json` - Available scripts and dependencies

## Read and Execute

Gather information about your project state by running these commands:
- `git status` - Current branch and changes
- `git log -10 --oneline` - Recent commits
- `ls tests/` - Your test areas
- `ls utils/api/` - Your helpers
- `git branch -a` - All branches

## Report

Provide a concise summary with this format:

---

## 📊 Project Context Summary

**Project**: [name from package.json]
**Branch**: [current branch]
**Status**: [clean / X modified / Y untracked files]

---

### 📝 Recent Activity (Last 10 commits)

[List recent commits in a clear format]

---

### 🧪 Your Test Areas

[List test directories found in tests/ excluding tests/examples/]

**Test coverage**:
- [Summarize what screens/features are being tested]

**Examples** (framework reference):
- [List example tests available in tests/examples/]

---

### 🔧 Your Helpers

[List helper files found in utils/api/ excluding example-helper.ts]

**Available helpers**:
- [List with brief description of each helper's purpose]

---

### 🤖 Available Commands

- **`/context`** - Refresh project context (this command)
- **`/new-screen <screen_name>`** - Automate tests for a new screen/feature
- **`/fix-test [test_name]`** - Debug and fix failing tests
- **`/add-coverage <feature>`** - Add more test coverage
- **`/review-changes [base_branch]`** - Get AI code review before PR

---

### ⚡ Quick Start

```bash
# Run all tests
npm test

# Run specific test area
npm test tests/[feature]/

# Run in headed mode
npm run test:headed

# Run with UI
npm run test:ui

# Add new screen
/new-screen "your-screen-name"

# Fix failing test
/fix-test "TC-XX-001"
```

---

### 📖 Project Structure

```
tests/
├── examples/              # Framework examples (reference)
└── [your-features]/       # Your test files

utils/api/
├── auth-helper.ts        # Authentication (framework)
├── otp-helper.ts         # OTP authentication (framework)
└── [your-helpers].ts     # Your feature helpers

docs/
└── [FEATURE]-P2-P3-TESTS.md  # Your documented P2/P3 tests
```

---

### 💡 Testing Workflow

**When adding new screen**:
1. Run `/new-screen "screen-name"`
2. Framework creates helper and test files
3. Implement P1 tests (critical path)
4. Document P2/P3 tests in docs/

**When fixing tests**:
1. Identify failing test
2. Run `/fix-test "test-name"`
3. Fix in helper (not in test file)
4. Verify all tests pass

**Before creating PR**:
1. Ensure all tests pass: `npm test`
2. Review changes: `/review-changes`
3. Address any issues
4. Create PR

---

### 📚 Documentation

- **CLAUDE.md** - Project guide and command reference
- **README.md** - Setup and quick start
- **docs/AI-MODEL-STRATEGY.md** - AI cost optimization
- **docs/EXAMPLE-P2-P3-TESTS.md** - Test documentation template

---

### 🎯 Priority System

- **P1 (High)**: Critical path, must pass - IMPLEMENT these
- **P2 (Medium)**: Important features - DOCUMENT in docs/
- **P3 (Low)**: Edge cases - DOCUMENT in docs/

Only implement P1 tests to avoid test bloat. Document P2/P3 for future reference.

---

**Ready to continue working!** 🚀

**Next**:
- Use `/new-screen <name>` to automate a new feature
- Use `/fix-test` to debug failing tests
- See CLAUDE.md for detailed patterns and examples
