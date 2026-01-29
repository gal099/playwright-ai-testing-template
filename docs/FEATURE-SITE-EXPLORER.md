# Feature Specification: Interactive Site Explorer

> **Status:** Planning
> **Created:** 2026-01-21
> **Target Release:** v1.6.0
> **Feature Type:** New AI-powered tool for incremental test case discovery

---

## 📋 Overview

Add an **Interactive Site Explorer** that allows users to incrementally crawl and analyze a website, generating test case documentation for each discovered page. This addresses the limitation that current `ai:plan-tests` can only analyze one page at a time.

### Problem Statement

Current workflow for large sites:
```bash
# Manual, repetitive for each page
npm run ai:plan-tests http://localhost:3000/login login
npm run ai:plan-tests http://localhost:3000/dashboard dashboard
npm run ai:plan-tests http://localhost:3000/users users
# ... user must know all URLs beforehand
```

**Issues:**
- ❌ User must manually discover and type each URL
- ❌ No visibility of site navigation structure
- ❌ Repetitive command execution
- ❌ No way to pause/resume exploration
- ❌ No consolidated site map

### Proposed Solution

**Interactive mode** where the tool discovers navigation links and lets user choose which pages to explore next:

```bash
npm run ai:explore http://localhost:3000/login

📋 Analyzing: /login
✅ Test cases generated: docs/LOGIN-TEST-CASES.md

🔗 Found 5 navigation links:
  [1] /dashboard (button: "Login")
  [2] /forgot-password (link: "Forgot password?")
  [3] /register (link: "Create account")
  [4] /home (link: "Back to home")
  [5] /help (link: "Need help?")

? Which page do you want to explore next? (Enter number, 'all', or 'quit'):
> 1

📋 Analyzing: /dashboard
...
```

---

## 🎯 Release Plan (Incremental Development)

### Release 1.0 - MVP Interactive Mode (THIS FEATURE)

**Target Version:** v1.6.0
**Estimated Effort:** 1-2 days
**Command:** `npm run ai:explore <url> [options]`

#### Features

✅ **Interactive page-by-page exploration**
- Start from a URL
- Analyze page and generate test cases
- Discover navigation links (CTAs, menu items, etc.)
- AI-filtered to show only significant navigation
- User chooses which page to explore next
- Loop until user quits

✅ **Automatic persistence**
- Save exploration progress to `.exploration-map.json`
- Track explored pages, discovered links, generated docs
- Enable manual inspection of site structure

✅ **Smart link detection**
- Extract interactive elements (buttons, links, nav items)
- Use AI to filter only navigation-relevant links
- Exclude tooltips, modals, non-navigation elements
- Deduplicate URLs (same path = same page)

✅ **Authentication support**
- Optional login before exploration
- Use existing AuthHelper integration
- Support credentials from .env

✅ **Output**
- Individual test case docs per page
- Exploration map JSON file
- Summary report at the end

#### Implementation Scope

**New files to create:**
- `utils/ai-helpers/site-explorer.ts` - Core explorer logic
- `scripts/explore-site.ts` - CLI interface
- `.exploration-map.json` - Persistence file (git-ignored)

**Existing files to reference/reuse:**
- `utils/ai-helpers/test-case-planner.ts` - Reuse test case generation
- `config/ai-client.ts` - Reuse AI client
- `utils/api/auth-helper.ts` - Reuse authentication

**Config changes:**
- `package.json` - Add `"ai:explore"` script
- `.gitignore` - Add `.exploration-map.json`
- `.claudeignore` - Add `.exploration-map.json`

---

### Release 1.1 - Persistence and Replay (FUTURE)

**Target Version:** v1.7.0
**Estimated Effort:** 0.5-1 day

#### Features

✅ **Resume interrupted exploration**
```bash
npm run ai:explore --resume
# Continues from last explored page
```

✅ **Replay saved exploration**
```bash
npm run ai:explore --config .exploration-map.json
# Re-analyzes all previously explored pages
```

✅ **Exploration history**
- View previously explored pages
- Re-generate docs for specific pages
- Update test cases after UI changes

---

### Release 1.2 - Declarative Mode (FUTURE)

**Target Version:** v1.8.0
**Estimated Effort:** 0.5-1 day

#### Features

✅ **Predefined page list**
```bash
npm run ai:explore http://localhost:3000 --pages "/login,/dashboard,/users"
# Non-interactive, runs automatically
```

✅ **Save config from interactive session**
```bash
npm run ai:explore http://localhost:3000/login --save-config my-site.json
# After interactive exploration, saves to config file
```

✅ **Batch execution**
- Define pages in config file
- Execute without user interaction
- Ideal for CI/CD regeneration

---

### Release 1.3 - Advanced Features (FUTURE)

**Target Version:** v2.0.0
**Estimated Effort:** 2-3 days

#### Features

✅ **Auto-discovery (crawling)**
```bash
npm run ai:explore http://localhost:3000 --auto-discover --max-depth 3
# Automatically follows links up to depth 3
```

✅ **Advanced filtering**
```bash
npm run ai:explore http://localhost:3000 --include "/admin/*" --exclude "/api/*"
# URL pattern matching
```

✅ **Visual site map**
```bash
npm run ai:explore-map --format html
# Generates interactive HTML site map
```

---

## 🏗️ Technical Design (Release 1.0)

### Data Structures

#### ExplorationMap (`.exploration-map.json`)

```typescript
interface ExplorationMap {
  baseUrl: string;
  startedAt: string; // ISO timestamp
  lastUpdatedAt: string;
  explored: ExploredPage[];
  queue: string[]; // URLs discovered but not yet explored
  ignored: string[]; // URLs user chose to ignore
}

interface ExploredPage {
  url: string;
  exploredAt: string;
  testCasesDoc: string; // Path to generated doc
  pageTitle: string;
  discoveredLinks: DiscoveredLink[];
}

interface DiscoveredLink {
  url: string;
  type: 'button' | 'link' | 'nav' | 'form-action'; // Element type
  text: string; // Display text
  selector: string; // How to click it
  explored: boolean; // Has this link been explored?
  ignored: boolean; // User chose to ignore
}
```

---

## 📁 Files Reference

### Existing Files to Read/Reuse

| File | Purpose | What to Reuse |
|------|---------|---------------|
| `utils/ai-helpers/test-case-planner.ts` | Test case documentation generator | `TestCasePlanner.generateTestCases()`, `captureScreenshotFromUrl()`, `extractInteractiveElements()` |
| `config/ai-client.ts` | Claude API client | `aiClient.ask()` for link filtering |
| `utils/api/auth-helper.ts` | Authentication | `AuthHelper.loginAsOrgAdmin()` for pre-login |
| `playwright.config.ts` | Playwright configuration | Browser launch settings |
| `package.json` | Scripts configuration | Add new `"ai:explore"` script |

### New Files to Create

| File | Purpose | Size Estimate |
|------|---------|---------------|
| `utils/ai-helpers/site-explorer.ts` | Core explorer logic | ~400-500 lines |
| `scripts/explore-site.ts` | CLI interface | ~100-150 lines |
| `.exploration-map.json` | Persistence (generated) | Dynamic |

### Configuration Updates

#### package.json
```json
{
  "scripts": {
    "ai:explore": "ts-node scripts/explore-site.ts"
  }
}
```

#### .gitignore
```
# Exploration state
.exploration-map.json
```

#### .claudeignore
```
# Exploration state (avoid token waste)
.exploration-map.json
```

---

## 💰 Cost Analysis

### Per-Page Cost Breakdown

| Operation | Model | Cost | Notes |
|-----------|-------|------|-------|
| Test case generation | Sonnet | ~$0.05-0.15 | Existing cost from `ai:plan-tests` |
| Link filtering | Haiku | ~$0.001 | New cost, but minimal |
| **Total per page** | - | **~$0.05-0.16** | ~2% increase over current |

### Example Session Costs

| Scenario | Pages | Total Cost |
|----------|-------|------------|
| Small site (5 pages) | 5 | ~$0.25-0.80 |
| Medium site (15 pages) | 15 | ~$0.75-2.40 |
| Large site (50 pages) | 50 | ~$2.50-8.00 |

**Cost control:**
- User chooses which pages to explore (no wasted analysis)
- Can quit anytime
- Exploration map prevents re-analyzing same pages

---

## ✅ Acceptance Criteria (v1.0)

### Must Have

- [ ] Command `npm run ai:explore <url>` launches interactive exploration
- [ ] Analyzes starting page and generates test case documentation
- [ ] Discovers and displays navigation links from the page
- [ ] AI filters links to show only navigation-relevant items
- [ ] User can choose which link to explore next via number input
- [ ] User can quit exploration anytime by typing "quit"
- [ ] Saves exploration progress to `.exploration-map.json` after each page
- [ ] Displays summary at the end (pages explored, links found, docs generated)
- [ ] Reuses existing `TestCasePlanner` for test case generation
- [ ] URLs are deduplicated (same path = same page)
- [ ] Handles page load errors gracefully

### Should Have

- [ ] `--login-first` flag to authenticate before exploration
- [ ] Progress indicators for long operations (AI analysis)
- [ ] Clear error messages with recovery suggestions
- [ ] `.exploration-map.json` added to `.gitignore` and `.claudeignore`

### Nice to Have (Future)

- [ ] Better interactive prompts (inquirer library)
- [ ] "Back" navigation to previous page
- [ ] Visual progress bar
- [ ] Colored console output

---

## 🧪 Testing Strategy

### Manual Testing Checklist

- [ ] Test with simple 2-3 page site (happy path)
- [ ] Test with site requiring authentication
- [ ] Test with site having 10+ links per page (link filtering)
- [ ] Test quit functionality (early exit)
- [ ] Test with invalid URL
- [ ] Test with page that times out
- [ ] Test with page that has no links
- [ ] Verify `.exploration-map.json` is created and updated
- [ ] Verify test case docs are generated correctly
- [ ] Verify deduplication (don't analyze same URL twice)

### Edge Cases to Handle

- [ ] Page with 0 navigation links
- [ ] Page with 100+ navigation links (need pagination?)
- [ ] Circular navigation (A → B → A)
- [ ] External links (should be filtered out)
- [ ] JavaScript navigation (SPAs)
- [ ] Authentication redirects
- [ ] 404 pages
- [ ] Slow loading pages

---

## 🚀 Implementation Steps

### Phase 1: Core Implementation (Day 1)

1. **Create `utils/ai-helpers/site-explorer.ts`**
   - [ ] `SiteExplorer` class skeleton
   - [ ] `exploreInteractive()` main loop
   - [ ] `analyzePage()` using TestCasePlanner
   - [ ] `discoverNavigationLinks()` with Playwright
   - [ ] `urlToScreenName()` helper
   - [ ] Basic persistence (save/load map)

2. **Create `scripts/explore-site.ts`**
   - [ ] CLI argument parsing
   - [ ] Help message
   - [ ] Call SiteExplorer.exploreInteractive()
   - [ ] Error handling

3. **Update `package.json`**
   - [ ] Add `"ai:explore"` script

4. **Test basic flow**
   - [ ] Manual test on example site
   - [ ] Verify docs generated
   - [ ] Verify map saved

### Phase 2: AI Filtering & Polish (Day 2)

5. **Implement AI link filtering**
   - [ ] `filterNavigationLinks()` with Haiku
   - [ ] Prompt engineering for filtering
   - [ ] Fallback on AI failure

6. **Add interactive prompts**
   - [ ] Simple readline for v1.0
   - [ ] Input validation
   - [ ] Quit handling

7. **Add authentication support**
   - [ ] `--login-first` flag
   - [ ] Integration with AuthHelper

8. **Polish & error handling**
   - [ ] Graceful error handling
   - [ ] Progress indicators
   - [ ] Summary report

### Phase 3: Documentation & Release (Day 2-3)

9. **Update documentation**
   - [ ] README.md
   - [ ] CLAUDE.md
   - [ ] GETTING-STARTED.md
   - [ ] PROJECT-OVERVIEW.md

10. **Manual testing**
    - [ ] Run through checklist
    - [ ] Test on real application

11. **Create PR**
    - [ ] Use `/review-changes` before PR
    - [ ] Update CHANGELOG.md

---

## 📚 Related Documentation

- Current test case planner: `utils/ai-helpers/test-case-planner.ts`
- AI model strategy: `docs/AI-MODEL-STRATEGY.md`
- Project overview: `docs/PROJECT-OVERVIEW.md`
- User guide: `CLAUDE.md`

---

## 🔮 Future Enhancements (Post v1.0)

### v1.1 - Persistence
- Resume interrupted exploration
- Replay saved exploration
- Update specific pages

### v1.2 - Declarative Mode
- Config file support
- Non-interactive execution
- Save config from interactive session

### v1.3 - Advanced Features
- Auto-discovery (crawling)
- Max depth limit
- URL pattern filtering
- Visual site map (HTML)
- Better authentication flow
- SPA support
- Parallel page analysis

---

**Last Updated:** 2026-01-21
**Author:** Juan (with Claude Code assistance)
**Status:** Ready for implementation with `/improve-framework`
