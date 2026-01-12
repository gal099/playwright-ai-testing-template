# Scripts

This directory contains utility scripts for template management.

## create-template.ts

Converts a project-specific Playwright test suite into a clean, reusable template.

**When to use**: When you have a working Playwright + AI project and want to extract the framework as a template for other projects.

**Usage**:
```bash
npm run create-template
```

**What it does**:
1. Deletes project-specific files (test implementations, helpers, screenshots)
2. Creates generic example files
3. Updates documentation (README, CLAUDE.md, .env.example)
4. Renames package to `playwright-ai-testing-template`

**Files kept** (framework/AI features):
- `config/ai-client.ts`
- `fixtures/ai-fixtures.ts`
- `utils/ai-helpers/*`
- `utils/selectors/self-healing.ts`
- `docs/AI-MODEL-STRATEGY.md`
- Example tests

**Files removed** (project-specific):
- Feature-specific tests and helpers
- Generated tests
- Screenshots and test results
- Project-specific documentation

## init-new-project.sh

Initializes a new project from this template.

**When to use**: When starting a new testing project and want to use this template as the base.

**Usage**:
```bash
./scripts/init-new-project.sh <project-name> <target-directory>
```

**Example**:
```bash
./scripts/init-new-project.sh ecommerce-tests ~/projects/ecommerce-tests
```

**What it does**:
1. Copies template to target directory
2. Removes git history and reinitializes
3. Updates package.json with new project name
4. Creates .env from .env.example
5. Optionally installs npm dependencies

## Workflow

### Creating a Template (First Time)

1. Build your Playwright + AI framework in a project
2. When ready to extract as template:
   ```bash
   npm run create-template
   ```
3. Review changes and commit
4. Template is ready to reuse!

### Using the Template (New Projects)

1. From the template directory:
   ```bash
   ./scripts/init-new-project.sh my-new-project ~/path/to/new-project
   ```
2. Navigate to new project:
   ```bash
   cd ~/path/to/new-project
   ```
3. Configure for your app:
   ```bash
   vim .env  # Update APP_URL and credentials
   ```
4. Start testing:
   ```bash
   npm test
   ```

## Notes

- The template includes full AI features (test generation, self-healing, AI assertions)
- AI features are optional - works fine without `ANTHROPIC_API_KEY`
- See `GETTING-STARTED.md` for detailed usage instructions
- See `CLAUDE.md` for Claude Code integration details
