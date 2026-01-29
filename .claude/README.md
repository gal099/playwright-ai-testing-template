# Claude Code Configuration

This directory contains configuration files for Claude Code CLI.

## Files

### `settings.local.json` (Personal, not tracked)

Your personal Claude Code settings. This file contains permissions and preferences specific to your workflow.

**Setup:**
```bash
# Copy the example file to create your local settings
cp .claude/settings.local.json.example .claude/settings.local.json
```

**Note:** This file is in `.gitignore` and will not be committed. Each team member should create their own based on the example.

### `settings.local.json.example` (Template, tracked)

Example configuration showing recommended permissions for this project. Use this as a starting point for your personal `settings.local.json`.

## Permissions Explained

The example configuration includes permissions for:

- **npm/playwright**: Install dependencies and run tests
- **git commands**: Version control operations
- **gh commands**: GitHub CLI operations (PR, releases)
- **Web tools**: Research and documentation lookup

Modify your local settings to match your workflow preferences.

## Commands

This directory contains custom Claude Code commands:

### For Framework Development (Source Repository)

- `commands/`: Framework development commands (improve-framework, fix-framework, review-changes)
- `commands-user/`: User-facing commands (new-screen, fix-test, add-coverage)

**Structure:**
```
.claude/
├── commands/              # Used during framework development
│   ├── improve-framework.md
│   ├── fix-framework.md
│   └── review-changes.md  # Shared with users
└── commands-user/         # Copied to template
    ├── new-screen.md
    ├── fix-test.md
    └── add-coverage.md
```

### For Template Users

When `npm run create-template` is executed:
- `commands-user/*` → copied to `commands/`
- `review-changes.md` → also copied to `commands/`
- Users only see commands relevant to testing their applications

See `CLAUDE.md` in the root directory for command documentation.
