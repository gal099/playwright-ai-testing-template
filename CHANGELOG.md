# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **BREAKING: Command Restructure for Safety**: Renamed and reorganized onboarding commands
  - **`/setup` → `/start-user`**: Renamed for clarity (template usage mode)
  - **NEW: `/start-dev`**: Framework developer entry point (prevents accidental template conversion)
  - **Moved to `.claude/commands/`**: Both commands now accessible immediately after clone
  - **Safety improvement**: Framework developers can't accidentally destroy their dev environment
  - **Location changes**:
    - `.claude/commands-user/setup.md` → `.claude/commands/start-user.md`
    - `.claude/commands-user/context.md` → `.claude/commands/context.md`
    - NEW: `.claude/commands/start-dev.md`
  - **Why this matters**:
    - Previously: Framework developers could accidentally run `/setup` and destroy CLAUDE-DEV.md
    - Now: Clear separation with `/start-dev` for framework work, `/start-user` for template usage
    - Context available to both modes (useful for returning to work)

- **`/start-dev` Command - Framework Developer Entry Point**: `.claude/commands/start-dev.md`
  - **Purpose**: Get started with framework development (working ON the framework)
  - **Features**:
    - Reads CLAUDE-DEV.md (framework guide)
    - Shows pending framework tasks (TODO_framework.md)
    - Lists framework examples (tests/examples/)
    - Lists AI helpers (utils/ai-helpers/)
    - Displays framework development commands
    - Shows recent framework commits and branches
    - Provides framework development workflow
  - **Safety**: Does NOT convert to template, does NOT delete git history
  - **Use Cases**: Framework contributor onboarding, returning to framework work

- **`/context` Command - Now Available in Both Modes**: `.claude/commands/context.md`
  - **Previously**: Only in commands-user/ folder
  - **Now**: In commands/ folder, accessible in both framework dev and template mode
  - **Why**: Useful for returning users in both modes

## [1.8.0] - 2026-01-29

### Added

- **`/start-user` Command - Automated Project Initialization**: `.claude/commands/start-user.md` (formerly `/setup`)
  - **Purpose**: Fully automated first-time setup for new users starting with the framework
  - **Features**:
    - Converts framework to Template Mode (removes CLAUDE-DEV.md, framework dev files)
    - Installs all dependencies (`npm install`)
    - Creates `.env` file from `.env.example`
    - Completely cleans git history (`rm -rf .git`, `git init`)
    - Creates initial commit with fresh history
    - Runs health check (`npm test tests/examples/`)
    - Guides user through remote repository setup (GitHub CLI or manual)
  - **Benefits**:
    - **Zero manual steps** - One command does everything
    - **Safe defaults** - Tested workflow from clone to first test
    - **Clear guidance** - Step-by-step post-setup instructions
    - **Fresh start** - Clean git history for user's project
  - **Cost**: No AI costs (pure bash automation)
  - **Status**: Fully tested in isolated environment

- **`/context` Command - Quick Project State Overview**: `.claude/commands-user/context.md`
  - **Purpose**: Help returning users quickly understand current project state
  - **Features**:
    - Reads project documentation (CLAUDE.md, README.md, package.json)
    - Shows git status and recent commits (last 10)
    - Lists existing test areas (tests/) and helpers (utils/api/)
    - Displays all available branches
    - Provides available commands reference
    - Shows quick start guide
  - **Benefits**:
    - **Fast onboarding** - Get up to speed in seconds
    - **Read-only** - No file modifications or setup operations
    - **Comprehensive** - All context in one place
    - **Safe** - Cannot break anything, just reads state
  - **Cost**: No AI costs (pure information gathering)
  - **Use Cases**: Returning after break, new team member orientation, project overview

## [1.7.0] - 2026-01-21

### Added

- **Automatic Selector Extraction for /new-screen**: Implemented ENHANCE-008 - Made /new-screen fully automatic
  - **Core Implementation**: `utils/ai-helpers/selector-extractor.ts` (408 lines)
    - `SelectorExtractor` class with AI vision-powered selector extraction
    - `extractSelectors(url, pageType, options)` method
    - Returns structured result: selectors, redirectUrl, errorSelectors, timing, confidence score
  - **Features**:
    - Automatic screenshot capture from APP_URL
    - DOM structure extraction (buttons, inputs, links, forms, textareas)
    - AI vision analysis using Sonnet model for high accuracy
    - Confidence scoring (0.0-1.0) based on selector stability
    - Timing detection (load/networkidle/domcontentloaded)
    - Async operation detection
    - Graceful error handling and validation
  - **Model**: Sonnet (AI vision required for screenshot analysis)
  - **Cost**: ~$0.05-0.10 per page extraction
    - Input: ~3000 tokens (screenshot base64 + DOM structure JSON)
    - Output: ~500 tokens (JSON with selectors and metadata)
  - **Selector Priority**:
    1. `[data-testid="..."]` (most stable)
    2. `[name="..."]` (for inputs)
    3. `[aria-label="..."]` or `[role="..."]` (accessibility)
    4. `button:has-text("...")` (unique text)
    5. CSS selectors (last resort)
  - **Benefits**:
    - **Saves 5-10 minutes per screen** (95% time reduction)
    - No manual codegen exploration needed
    - Generates helper-ready selector code automatically
    - Provides timing and async operation guidance
    - Quality assessment via confidence score
    - Falls back to manual codegen if extraction fails

### Changed

- **`/new-screen` Command - Phase 1 Redesign**: `.claude/commands-user/new-screen.md`
  - **Before**: Manual codegen exploration workflow (user had to explore UI, copy selectors, report back)
  - **After**: Fully automatic AI vision analysis
    - Automatically captures screenshot from APP_URL
    - Extracts selectors using SelectorExtractor utility
    - Shows identified elements to user for validation
    - Falls back to manual codegen if automatic extraction fails
  - **User Experience**:
    - Before: 5-10 minutes of manual work
    - After: ~30 seconds, fully automatic (just run command and approve)
  - **Cost Trade-off**: +$0.08 per screen for massive time savings (worth it!)

### Documentation

- **AI Model Strategy**: Updated `docs/AI-MODEL-STRATEGY.md` with:
  - New section for Automatic Selector Extraction
  - Cost analysis and model selection rationale
  - Use cases and benefits
  - Confidence scoring explanation
  - Example workflow
- **User Guide**: Updated `CLAUDE.md` with:
  - Automatic selector extraction feature in `/new-screen` description
  - Updated workflow (automatic vs manual)
  - Cost information (~$0.10 total per screen)
  - Time savings explanation (95% reduction)
- **Project Overview**: Updated `docs/PROJECT-OVERVIEW.md` with:
  - Added selector-extractor.ts to AI helpers list
  - Added selector-extraction-example.spec.ts to examples
  - Updated AI capabilities table with new feature
  - Updated file structure documentation
- **Example Test**: `tests/examples/selector-extraction-example.spec.ts` (175 lines)
  - 5 comprehensive examples demonstrating SelectorExtractor usage
  - Real-world extraction from playwright.dev
  - Confidence score interpretation
  - Error handling examples
  - Helper code generation examples
  - Timing configuration usage

### Testing

- All existing tests passing (24/24 in 3 browsers)
- New selector extraction tests passing in all browsers
- TypeScript compilation successful
- No regressions detected

**Impact:** Major UX improvement for /new-screen command. Saves significant time (5-10 min → 30 sec) with small AI cost increase ($0.08). Backwards compatible - can fall back to manual codegen if needed.

---

## [1.6.0] - 2026-01-21

### Added

- **Interactive Site Explorer**: New AI-powered tool for incremental test case discovery
  - **Command**: `npm run ai:explore <url>`
  - **Core Implementation**: `utils/ai-helpers/site-explorer.ts` (658 lines)
  - **CLI Interface**: `scripts/explore-site.ts` (160 lines)
  - **Features**:
    - Interactive page-by-page exploration with user control
    - Automatic navigation link discovery using Playwright
    - AI-powered link filtering to show only significant navigation (Haiku model)
    - Persistent exploration state saved to `.exploration-map.json`
    - URL deduplication prevents re-analyzing same pages
    - Integration with existing TestCasePlanner for test case generation
    - Graceful error handling and recovery
  - **Cost**: ~$0.05-0.16 per page analyzed
    - Test case generation: ~$0.05-0.15 (Sonnet via TestCasePlanner)
    - Link filtering: ~$0.001 (Haiku for simple categorization)
  - **Output**:
    - Individual test case docs per page: `docs/{PAGE}-TEST-CASES.md`
    - Exploration map: `.exploration-map.json` (git-ignored)
    - Summary report at completion
  - **Example Usage**:
    ```bash
    npm run ai:explore http://localhost:3000/login
    ```
  - **Benefits**:
    - No need to manually discover and type each URL
    - User controls exploration (no wasted analysis)
    - Only ~2% cost overhead vs manual approach
    - Discover site navigation structure interactively

### Documentation

- **Feature Specification**: `docs/FEATURE-SITE-EXPLORER.md` (460 lines) - Complete specification including future releases
- **Project Overview**: `docs/PROJECT-OVERVIEW.md` (443 lines) - New consolidated project reference document
- **AI Model Strategy**: Updated `docs/AI-MODEL-STRATEGY.md` with cost analysis for site explorer
- **User Guide**: Updated `CLAUDE.md` with interactive site explorer documentation and examples
- **Example Test**: `tests/examples/site-explorer-example.spec.ts` demonstrating programmatic usage

### Changed

- **Configuration**:
  - `package.json`: Added `"ai:explore"` npm script
  - `.gitignore`: Added `.exploration-map.json`
  - `.claudeignore`: Added `.exploration-map.json`

**Impact:** Major new feature for multi-page test documentation generation. Backwards compatible - existing functionality unchanged.

---

## [1.5.1] - 2026-01-14

### Fixed

- **`/review-changes` Command Execution**: Fixed command that was only displaying documentation without executing the review (ENHANCE-006)
  - Command now automatically launches Task tool with general-purpose agent
  - Added `allowed-tools: ["Bash", "Task", "Read"]` in frontmatter
  - New "🤖 Claude Workflow (Execute This)" section with step-by-step executable instructions
  - Simplified from 454 to 294 lines (35% reduction)
  - Added origin/master fallback for legacy repositories
  - Improved prompt format clarity (triple quotes instead of backticks)
  - Clarified file list format specification
  - Testing: Manually verified command launches agent and generates structured reports
  - Benefits: 7x cheaper (~$0.25 vs ~$1.80) due to isolated agent context

- **SIMA References Cleanup**: Removed all SIMA-specific references from template generation script (ENHANCE-004)
  - Updated script header comment: "SIMA project" → "framework project"
  - Eliminated TO_DELETE array with SIMA-specific file paths
  - Removed deleteItems() function (42 lines)
  - Removed createExampleFiles() function (145 lines) - files already exist in repo
  - Updated .gitignore to ignore .selector-cache.json in framework source
  - Script simplified from 877 to 694 lines (-183 lines, -21%)
  - Framework now truly generic and reusable

### Changed

- **TODO_template.md**: Updated enhancement status
  - ENHANCE-004: Marked as ✅ IMPLEMENTED (SIMA cleanup)
  - ENHANCE-006: Marked as ✅ IMPLEMENTED (review-changes fix)
  - ENHANCE-007: Marked as ✅ PARTIALLY IMPLEMENTED (robustness improvements)

### Documentation

- `.claude/commands/review-changes.md`: Complete rewrite with executable workflow
- `TODO_template.md`: Comprehensive tracking of all 3 enhancements implemented

**Impact:** Critical bug fix for review command + code cleanup for better maintainability. Both changes are backwards compatible.

---

## [1.5.0] - 2026-01-14

### Added

- **Semantic Versioning Reminder**: Comprehensive guide in CLAUDE-DEV.md (ENHANCE-002)
  - Version types (PATCH/MINOR/MAJOR) with clear examples
  - 7-step version bump checklist:
    1. Update package.json version
    2. Update README.md version badge
    3. Add CHANGELOG.md entry
    4. Commit version bump
    5. Create annotated git tag
    6. Push commits and tag
    7. Create GitHub Release
  - Reference example: v1.4.2 successful release workflow
  - Integrated into framework commands (/improve-framework, /fix-framework)
  - Location: CLAUDE-DEV.md section "Semantic Versioning Reminder"

- **Test Configuration Improvement**: Separated stable from unstable tests
  - Added `testIgnore` in playwright.config.ts to skip unstable example tests
  - Ignores tests depending on external sites (playwright.dev) and user apps (localhost:3000)
  - New npm script: `npm run test:examples` to run ALL tests including examples
  - Keeps stable tests: basic-example.spec.ts, otp-auth-example.spec.ts (auto-skipped if no config)
  - Rationale: Framework tests should not fail due to external site changes

- **ENHANCE-006**: Added to TODO_template.md
  - Fix /review-changes command to use Task agent automatically
  - Priority: High
  - Benefits: 7x cheaper (~$0.25 vs ~$1.80), isolated context, automated execution

### Changed

- **Framework Commands Updated**: Added versioning steps to Phase 5
  - `.claude/commands/improve-framework.md`: Steps 3-4 (version determination), step 8 (tagging/release)
  - `.claude/commands/fix-framework.md`: Steps 3-4 (version determination), step 8 (tagging/release)
  - Both commands now ask user for version bump type before committing

- **TODO_template.md**: Updated status
  - ENHANCE-002: Marked as ✅ IMPLEMENTED
  - ENHANCE-006: Added as Pending (fix /review-changes)

### Documentation

- **CLAUDE-DEV.md**: New "Semantic Versioning Reminder" section (145 lines)
  - Comprehensive guide for framework developers
  - When to bump PATCH vs MINOR vs MAJOR
  - Step-by-step workflow with code examples
  - GitHub Release creation workflow
- **playwright.config.ts**: Added comments explaining test ignore strategy
- **package.json**: Documented new `test:examples` script

**Benefit:** Framework developers now have clear guidance on versioning, reducing inconsistency and missed steps in release workflow.

---

## [1.4.2] - 2026-01-14

### Changed

- **Repository Renamed**: `playwright-ai-testing-template` → `playwright-ai-testing-framework`
  - Better reflects dual nature: framework source + reusable template
  - GitHub redirect preserves old URLs automatically
  - Updated all internal references (package.json, README.md, CHANGELOG.md)
  - Repository URL: https://github.com/gal099/playwright-ai-testing-framework

- **Documentation Restructure**: Added comprehensive dual-mode documentation
  - **Framework Development Mode**: For developers working ON the framework
    - Added warning banner to CLAUDE.md directing framework devs to CLAUDE-DEV.md
    - Added "User Perspective" section in CLAUDE-DEV.md
    - Documents framework improvement workflow
  - **Template Usage Mode**: For users working WITH the framework
    - Clear separation of concerns in README.md
    - Separate Quick Start instructions for each mode
    - Mode-specific command documentation
  - README.md: Complete restructure with mode-specific sections
  - CLAUDE.md: Terminology clarified (framework vs template context)
  - GETTING-STARTED.md: Updated to reflect framework nature

### Added

- **Git & Review Protocol**: Mandatory review process before pushing (ENHANCE-003)
  - CLAUDE-DEV.md: New "Git & Review Protocol (MANDATORY)" section
  - Step-by-step checklist before pushing to remote
  - Mandatory `/review-changes` before commits to main
  - Framework commands updated with review step (improve-framework, fix-framework)
  - Emphasizes importance when working directly on main branch
  - Rationale: Catches issues before public, validates consistency, ensures quality

- **TODO_template.md**: Now tracked in git for framework development
  - Previously ignored, now visible for team collaboration
  - Tracks framework improvements, bugs, and enhancements
  - Updated ENHANCE-003 status to implemented

- **Test Case Planner Feature**: Added to README.md feature list
  - Previously missing from main feature showcase
  - Links to v1.4.0 feature implementation

### Fixed

- **settings.local.json**: Removed from git tracking
  - Personal configuration file now properly excluded
  - No longer appears as modified in git status

- **.gitignore**: Removed TODO_template.md exclusion
  - Framework development TODOs now visible to team

### Documentation

- README.md: Updated title from "Template" to "Framework"
- package.json: Added repository field with new URL
- CHANGELOG.md: Updated repository links
- All documentation now consistently uses "framework" for source, "template" for generated output

**Breaking Changes**: Repository URL changed, but GitHub redirects handle this automatically. Users cloning the old URL will be redirected to the new one.

**Migration**: No action needed for existing users. Git remotes will work automatically via GitHub redirect, but can be updated manually:
```bash
git remote set-url origin git@github.com:gal099/playwright-ai-testing-framework.git
```

## [1.4.1] - 2026-01-14

### Fixed

- **AI Model Versions**: Updated to Claude 4.5 series to fix 404 errors
  - Updated Sonnet: `claude-3-5-sonnet-20241022` → `claude-sonnet-4-5-20250929`
  - Updated Opus: `claude-3-opus-20240229` → `claude-opus-4-5-20251101`
  - Kept Haiku: `claude-3-haiku-20240307` (latest stable)
  - Location: `config/ai-client.ts`
  - Documentation: Updated `docs/AI-MODEL-STRATEGY.md`, `CLAUDE.md`, `.env.example`
  - Resolves: AI feature tests failing with "model not found" errors
  - Testing: All models validated and working correctly

**Impact:** This fixes the pre-existing issue where AI-powered features (self-healing selectors, AI assertions, test generation, test case planning) were failing with 404 errors due to deprecated model versions. All AI features now use the latest Claude 4.5 models.

## [1.4.0] - 2026-01-14

### Added

- **Test Case Planner**: AI-powered feature to generate manual test case documentation from screenshots
  - New command: `npm run ai:plan-tests <url-or-screenshot> <screen-name>`
  - Location: `utils/ai-helpers/test-case-planner.ts`
  - Analyzes UI screenshots and identifies comprehensive test scenarios
  - Generates structured test documentation with:
    - Test case IDs (TC-XX-001, TC-XX-002, etc.)
    - Priorities (P1/P2/P3) based on criticality and risk
    - Preconditions, steps, and expected results
    - Automation recommendations
    - Summary with breakdown by priority
  - Output: `docs/{SCREEN}-TEST-CASES.md` in Markdown format
  - Model: Sonnet (~$0.05-0.15 per analysis)

**Use Case:** Generate comprehensive test documentation BEFORE automation. Ideal for:
- Identifying all test scenarios without logging into systems
- Planning and prioritizing test coverage with team
- Reviewing test cases before writing automation code
- Deciding which tests to automate (P1) vs. document (P2/P3)
- Faster test planning than manual documentation

**Workflow Integration:**
1. Generate test docs: `npm run ai:plan-tests http://localhost:3000/login login`
2. Review and adjust priorities with team
3. Automate P1 tests: `/new-screen login`
4. Keep P2/P3 tests documented for future implementation

**Benefits:**
- Comprehensive test coverage identification
- Better prioritization before coding
- Team collaboration on test strategy
- Reduced waste (only automate critical tests)
- Faster than manual test case writing

### Documentation

- **docs/EXAMPLE-TEST-CASE-PLANNING.md**: Complete example of generated test documentation (400+ lines)
  - Shows realistic login screen test case analysis
  - Demonstrates P1/P2/P3 prioritization
  - Includes 10 test cases with full details
  - Workflow integration examples
- **docs/AI-MODEL-STRATEGY.md**: Added Test Case Planning cost analysis
  - Use case explanation
  - Cost estimation
  - Benefits and workflow
- **CLAUDE.md**: Added Test Case Planning section
  - Feature overview and benefits
  - Usage examples (URL and screenshot)
  - Complete workflow with /new-screen integration
  - Cost information
- **CLAUDE-DEV.md**: Updated AI helpers list
  - Added test-case-planner.ts to framework code inventory

### Scripts

- **package.json**: Added `ai:plan-tests` npm script
  - Command: `npm run ai:plan-tests`
  - Accepts URL or screenshot path + screen name
  - Integrates with existing AI features

## [1.3.0] - 2026-01-13

### Added

- **Two-Level Command System**: Separate commands for framework development vs. framework usage
  - `.claude/commands-dev/`: Commands for developers working ON the framework
    - `/improve-framework`: Add new features to framework code
    - `/fix-framework`: Fix bugs in framework code
    - `/review-changes`: AI-powered code review before PR
  - `.claude/commands-user/`: Commands for QA testers using the framework
    - `/new-screen`: Automate tests for new screens/features
    - `/fix-test`: Debug and fix failing tests
    - `/add-coverage`: Add more coverage to existing features
    - `/review-changes`: AI-powered code review before PR
- **CLAUDE-DEV.md**: Comprehensive guide for framework developers
  - What is framework code vs. user code
  - Framework development workflows
  - Git branching strategy (framework/* branches)
  - When to update template with `npm run create-template`
  - Cost optimization guidelines
  - Documentation requirements
- **AI-Powered Code Review Command**: `/review-changes [base_branch]`
  - Comprehensive analysis of all changed files
  - Reviews code quality, architecture, bugs, security, tests, documentation
  - Severity levels: Critical / Important / Suggestions
  - Verdict: Ready for PR / Needs Changes / Blocked
  - Available for both framework and feature development
- **Template Script Enhancements**: `scripts/create-template.ts`
  - `removeFrameworkDevFiles()`: Removes framework dev files from template
  - `copyUserCommands()`: Copies user commands to `.claude/commands/`
  - Pre-flight validation to ensure script runs from project root
  - Directory existence checks for graceful error handling

### Fixed

- **Script Validation**: Added pre-flight checks in `create-template.ts` to verify package.json and playwright.config.ts exist
- **Directory Safety**: Added existence checks in `copyUserCommands()` to handle missing directories gracefully
- **Branch Naming Consistency**: Standardized fix branch naming to `fix/description-of-issue` in fix-test.md
- **Circular Reference**: Clarified CLAUDE-DEV.md is source-only and removed from template

### Documentation

- **CLAUDE-DEV.md**: Complete framework development guide with command documentation
- **CLAUDE.md**: Updated with user commands and `/review-changes` documentation
- **Command Files**: Comprehensive 400-500 line command workflows with:
  - Phase-by-phase structured approach
  - "Think hard" reminders before coding
  - Mandatory test validation before commits
  - Project-specific constraints and best practices
  - Common scenarios and troubleshooting

### Architecture

- **Clear Separation**: Framework development (working ON) vs. framework usage (working WITH)
- **Template Generation**: Framework dev files automatically removed when creating template
- **Command Organization**: Hierarchical command structure for different user roles
- **Git Workflow**: Distinct branching strategies for framework vs. feature work

## [1.2.0] - 2026-01-13

### Added

- **Code Standards Section**: New "Code Standards" section in `CLAUDE.md` enforcing English-only code
  - Explicit requirement for all code, comments, tests, and AI-generated content to be in English
  - Clear guidelines for variables, functions, JSDoc, and inline comments
  - Exception documented for user-facing localized documentation

### Fixed

- **Auth Helper URL Validation**: Removed hardcoded fallback URL in `auth-helper.ts` constructor
  - Now throws descriptive error if `APP_URL` is not configured in `.env`
  - Prevents silent failures with incorrect URLs
  - Improves template reusability across projects
- **AI Client System Prompts**: Fixed `askWithImage()` method not accepting system prompts
  - Added optional `systemPrompt` parameter to `AIClient.askWithImage()`
  - Updated all AI helpers to properly pass system prompts
  - Ensures AI model receives proper instructions for all vision-based operations

### Changed

- **Language Standardization**: Updated all code and AI prompts to enforce English output
  - Translated Spanish comments to English in `auth-helper.ts`
  - Updated `test-generator.ts` prompts to explicitly request English code generation
  - Updated `ai-assertions.ts` prompts for English-only responses (visual, layout, accessibility)
  - Updated `test-maintainer.ts` prompts for English-only analysis and suggestions
  - Updated `self-healing.ts` to pass system prompts correctly
- **AI Helper Improvements**: Enhanced all AI helpers with explicit English output requirements
  - `test-generator.ts`: System prompt enforces English for all generated code
  - `ai-assertions.ts`: All assertion methods request English explanations
  - `test-maintainer.ts`: Analysis and refactoring produce English output

### Documentation

- Enhanced `CLAUDE.md` with code standards for international consistency
- All AI-generated content will now follow English-only convention

## [1.1.0] - 2026-01-12

### Added

- **OTP Authentication Support**: Complete email-based verification code extraction system
  - `OTPHelper` facade for easy OTP extraction from emails
  - `MailtrapProvider` integration for Mailtrap email service
  - AI-powered OTP extraction using Claude Haiku (~$0.0001 per extraction)
  - Regex fallback for OTP extraction when AI is disabled
  - Polling mechanism with configurable timeout and retry logic
  - Email filtering by subject and sender
  - Example test suite in `tests/examples/otp-auth-example.spec.ts`
- Extensible email provider architecture (`BaseEmailProvider` interface)
- Environment variables for OTP configuration in `.env.example`
- Documentation for OTP authentication in `CLAUDE.md` and `README.md`
- Cost optimization: OTP extraction uses Haiku model for minimal cost

### Changed

- Updated `CLAUDE.md` with OTP authentication section and patterns
- Updated `README.md` with OTP feature showcase
- Enhanced `.env.example` with Mailtrap credentials placeholders

### Documentation

- Added comprehensive OTP usage examples
- Documented Mailtrap setup process
- Added troubleshooting notes for OTP feature

## [1.0.0] - 2026-01-12

### Added

- Initial release of AI-Powered Playwright Testing Framework
- **AI Integration**: Claude AI for test generation, self-healing, and intelligent assertions
- **Multi-Model Optimization**: Automatic model selection (Haiku/Sonnet/Opus) based on task complexity
- **Self-Healing Selectors**: Auto-repair broken selectors using AI vision + DOM analysis
- **Smart Assertions**: Visual, semantic, layout, and accessibility assertions powered by AI
- **Test Generation**: Generate tests from screenshots using AI vision
- **Test Maintenance Tools**: Analyze and refactor test code
- **Cost Optimization**: Intelligent caching and model selection to minimize API costs
- Helper-based test architecture
- Priority-based test organization (P1/P2/P3)
- Comprehensive documentation in `CLAUDE.md`
- Example tests demonstrating all AI features
- TypeScript configuration with strict type checking
- Playwright configuration with multiple browsers

### Documentation

- `README.md`: Project overview and quick start guide
- `CLAUDE.md`: Comprehensive guide for Claude Code integration
- `GETTING-STARTED.md`: Detailed setup instructions
- `QUICK-REFERENCE.md`: Command reference
- `docs/AI-MODEL-STRATEGY.md`: Cost optimization strategy
- `docs/MODEL-OPTIMIZATION-SUMMARY.md`: Implementation summary
- `docs/EXAMPLE-P2-P3-TESTS.md`: Test documentation template

---

## Version History

- **1.4.0**: Test case planner for manual test documentation
- **1.3.0**: Two-level command system and AI-powered code review
- **1.2.0**: Code standards enforcement and bug fixes
- **1.1.0**: OTP authentication feature
- **1.0.0**: Initial release

## Links

- [Repository](https://github.com/gal099/playwright-ai-testing-framework)
- [Issues](https://github.com/gal099/playwright-ai-testing-framework/issues)
