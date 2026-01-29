# Start User Command

Initialize the framework for YOUR project (template usage mode).

---

📦 **TWO-REPO STRUCTURE**

This framework has two separate repositories:
- **Template Repo** (for end users): `playwright-ai-testing-template` - Use this for YOUR tests
- **Dev Repo** (for framework developers): `playwright-ai-testing-framework` - Framework development only

**Make sure you cloned the TEMPLATE repo**:
```bash
git clone git@github.com:gal099/playwright-ai-testing-template.git
```

---

⚠️ **WARNING: DESTRUCTIVE OPERATION**

This command will **DELETE your git history** (`rm -rf .git`) and create a fresh repository. This is intentional for starting a new project with clean history.

**✅ Use this command if:**
- You cloned the **template repo** to test YOUR application
- You want to start with a clean git history (no framework commits)
- You're setting up the framework for the first time as a template user

**❌ DO NOT use this command if:**
- You're working on the framework itself (use `/start-dev` instead)
- You cloned the **dev repo** by mistake (clone template repo instead)
- You have existing commits you want to preserve
- You're working on an active project with important git history

---

## Read

Read these files to understand the framework:
- `.env.example` (never read `.env`) - To know what configuration is needed
- `README.md` - Framework overview
- `CLAUDE.md` - User guide (never read `CLAUDE-DEV.md`)

## Read and Execute

**CRITICAL: Verify you're in the correct repository**

Check if `CLAUDE-DEV.md` exists:
- If it **DOES NOT exist** → ✅ Correct repo (template), proceed with setup
- If it **EXISTS** → ❌ Wrong repo (dev repo), **STOP and inform user**

If `CLAUDE-DEV.md` exists, show this error and exit:

```
❌ ERROR: You're in the DEVELOPMENT repository!

This is the framework development repo, not the template for end users.

To use this framework for YOUR tests, clone the template repository:

  git clone git@github.com:gal099/playwright-ai-testing-template.git

Then run /start-user from the template repo.

If you want to work ON the framework itself, use /start-dev instead.
```

## Run

Execute the following steps in sequence (fully automated, no user prompts):

1. **Install all dependencies**:
   ```bash
   npm install
   ```

2. **Create .env file from template**:
   ```bash
   cp .env.example .env
   ```

3. **Clean git repository** (start fresh for user's project):
   ```bash
   rm -rf .git
   git init
   git add .
   git commit -m "Initial commit: Playwright AI Testing Framework setup

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
   ```

4. **Run health check** (verify setup works):
   ```bash
   npm test tests/examples/
   ```

## Report

After completing setup, provide this output:

---

✅ **Framework Setup Complete!**

**What was done:**
- [✓] Verified correct repository (template repo)
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
