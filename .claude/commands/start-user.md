# Start User Command

Initialize the framework for YOUR project (template usage mode).

---

⚠️ **WARNING: DESTRUCTIVE OPERATION**

This command will **DELETE your git history** (`rm -rf .git`) and create a fresh repository. This is intentional for starting a new project with clean history.

**✅ Use this command if:**
- You just cloned the framework to test YOUR application
- You want to start with a clean git history (no framework commits)
- You're setting up the framework for the first time as a template user

**❌ DO NOT use this command if:**
- You're working on the framework itself (use `/start-dev` instead)
- You have existing commits you want to preserve
- You're working on an active project with important git history

---

## Read

Read these files to understand the framework:
- `.env.example` (never read `.env`) - To know what configuration is needed
- `README.md` - Framework overview
- `CLAUDE.md` - User guide (never read `CLAUDE-DEV.md`)

## Read and Execute

Check if framework needs to be converted to template mode:
- If `CLAUDE-DEV.md` exists → Run `npm run create-template` first
- If `CLAUDE-DEV.md` does NOT exist → Already in template mode, skip conversion

## Run

Execute the following steps in sequence (fully automated, no user prompts):

1. **Convert to template mode** (if CLAUDE-DEV.md exists):
   ```bash
   npm run create-template
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Create .env file from template**:
   ```bash
   cp .env.example .env
   ```

4. **Clean git repository** (start fresh for user's project):
   ```bash
   rm -rf .git
   git init
   git add .
   git commit -m "Initial commit: Playwright AI Testing Framework setup

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
   ```

5. **Run health check** (verify setup works):
   ```bash
   npm test tests/examples/
   ```

## Report

After completing setup, provide this output:

---

✅ **Framework Setup Complete!**

**What was done:**
- [✓] Framework converted to Template Mode / Already in template mode
- [✓] All dependencies installed
- [✓] .env file created from .env.example
- [✓] Git repository initialized (clean history)
- [✓] Initial commit created
- [✓] Health check passed - example tests ran successfully

---

## 📋 Next Steps

### 1. Configure .env file

Open `.env` and update with YOUR application details:

```bash
APP_URL=https://your-app-url.com
ADMIN_USER=your-admin@email.com
ADMIN_PASS=your-password
USER_EMAIL=user@email.com
USER_PASS=user-password
ANTHROPIC_API_KEY=sk-ant-...  # Optional, for AI features
```

### 2. Create and connect to your remote repository

**Option A: Create new repo on GitHub (using gh CLI)**

```bash
# Create new GitHub repo
gh repo create my-test-automation --private --source=. --remote=origin

# Push to remote
git push -u origin main
```

**Option B: Use existing remote repository**

```bash
# Add your remote repository
git remote add origin <your-repo-url>

# Example:
# git remote add origin https://github.com/yourusername/my-test-automation.git

# Push to remote
git push -u origin main
```

### 3. Start automating your tests

Now you're ready to use the framework! Available commands:

- **`/new-screen <screen_name>`** - Automate tests for a new screen/feature (automatic selector extraction)
- **`/fix-test [test_name]`** - Debug and fix failing tests
- **`/add-coverage <feature>`** - Add more test coverage to existing features
- **`/review-changes [base_branch]`** - Get AI code review before creating PR

**Example workflow:**
```bash
# Step 1: Create tests for login page
/new-screen "login page"

# Step 2: Run tests
npm test

# Step 3: Fix any failing tests
/fix-test "TC-LG-001"

# Step 4: Commit your changes
git add .
git commit -m "Add login page tests"
git push
```

### 4. Learn more

- Read **`CLAUDE.md`** for detailed documentation
- Check **`docs/AI-MODEL-STRATEGY.md`** for AI cost optimization
- See **`tests/examples/`** for example tests demonstrating features

---

**Ready to start testing!** 🚀

Use `/new-screen <screen_name>` when you're ready to automate your first screen.
