# AI Model Selection Strategy

This document explains how different Claude models are used to optimize costs and performance.

## Available Models

The framework uses three Claude model families, each optimized for different use cases. Specific model versions are managed in `config/model-versions.ts` and updated as Anthropic releases new versions.

### Haiku (Claude 3 Haiku)
- **Cost:** Low (~$0.00025 / 1K tokens input, ~$0.00125 / 1K tokens output)
- **Speed:** Fast
- **Use:** Simple text tasks and basic analysis
- **Best for:** Self-healing selectors, semantic assertions, high-volume operations

### Sonnet (Claude Sonnet 4.5)
- **Cost:** Medium (~$0.003 / 1K tokens input, ~$0.015 / 1K tokens output)
- **Speed:** Moderate
- **Use:** Balance between quality and cost, AI vision
- **Best for:** Test generation, visual assertions, layout verification, test planning

### Opus (Claude Opus 4.5)
- **Cost:** High (~$0.015 / 1K tokens input, ~$0.075 / 1K tokens output)
- **Speed:** Slower
- **Use:** Complex cases requiring maximum capability
- **Best for:** Fallback for complex scenarios, rarely used by default

**Model Versions:** See [`config/model-versions.ts`](../config/model-versions.ts) for current model IDs and version management.

## Feature Assignment

### Self-Healing Selectors → **Haiku**
```typescript
// utils/selectors/self-healing.ts
model: 'haiku'
maxTokens: 1024
```
**Reason:** Simple DOM analysis and selector suggestions. Doesn't require complex reasoning.

**Estimated cost:** ~$0.002 per healed selector

### Test Generation → **Sonnet**
```typescript
// utils/ai-helpers/test-generator.ts
model: 'sonnet'
maxTokens: 4096
```
**Reason:** Requires AI vision to analyze screenshots and generate complex code.

**Estimated cost:** ~$0.05-0.15 per generated test

### Test Case Planning → **Sonnet**
```typescript
// utils/ai-helpers/test-case-planner.ts
model: 'sonnet'
maxTokens: 4096
```
**Reason:** Requires AI vision to analyze screenshots and generate comprehensive test documentation. Similar to test generation but outputs structured documentation instead of code.

**Use Case:** Generate manual test case documentation from screenshots before automation. Ideal for:
- Identifying all test scenarios without logging into systems
- Planning and prioritizing test coverage (P1/P2/P3)
- Creating test documentation for team review
- Deciding which tests to automate vs. document

**Estimated cost:** ~$0.05-0.15 per analysis (similar to test generation)

**Benefits:**
- Faster test planning without system access
- Better prioritization before automation
- Complete test documentation (P1 automated, P2/P3 documented)
- Team can review test cases before code is written

### Interactive Site Explorer → **Sonnet + Haiku**
```typescript
// utils/ai-helpers/site-explorer.ts
// Test case generation: Sonnet (via TestCasePlanner)
// Link filtering: Haiku
model: 'haiku' // for link filtering only
maxTokens: 2048
```
**Reason:** Combines TestCasePlanner (Sonnet) for test case generation with Haiku for cheap link filtering. The link filtering task is simple (categorizing links as navigation vs. non-navigation) so Haiku is sufficient.

**Use Case:** Incrementally explore a website and generate test case documentation for multiple pages. Ideal for:
- Discovering site structure without knowing all URLs upfront
- Batch generation of test cases across multiple pages
- Understanding application navigation flow
- Interactive exploration with user control over which pages to analyze

**Estimated cost per page:** ~$0.05-0.16
- Test case generation: ~$0.05-0.15 (Sonnet, reuses TestCasePlanner)
- Link filtering: ~$0.001 (Haiku, simple categorization task)

**Example session costs:**
- Small site (5 pages): ~$0.25-0.80
- Medium site (15 pages): ~$0.75-2.40
- Large site (50 pages): ~$2.50-8.00

**Benefits:**
- No need to manually discover and type each URL
- Cost-efficient (~2% overhead for link filtering vs manual approach)
- User controls exploration (no wasted analysis on irrelevant pages)
- Persistent exploration state allows pausing and resuming
- Automatic URL deduplication prevents re-analyzing same pages

### Automatic Selector Extraction → **Sonnet**
```typescript
// utils/ai-helpers/selector-extractor.ts
model: 'sonnet'
maxTokens: 2048
```
**Reason:** Requires AI vision to analyze screenshots and identify interactive elements with high accuracy. Sonnet provides the best balance of visual recognition quality and cost. Needs to distinguish between different element types (inputs, buttons, links) and generate stable Playwright selectors.

**Use Case:** Automatically extract selectors from a page without manual codegen exploration. Used by the `/new-screen` command. Ideal for:
- Eliminating manual codegen workflow (saves 5-10 minutes per screen)
- Automatic identification of input fields, buttons, and links
- Generation of stable Playwright selectors (prioritizes data-testid, role, text)
- Quick analysis of new pages before writing tests
- Understanding page structure without manual exploration

**Estimated cost per page:** ~$0.05-0.10
- Input: ~3000 tokens (screenshot base64 + DOM structure JSON)
- Output: ~500 tokens (JSON object with selectors, redirectUrl, timing, confidence)
- Total: ~$0.08 per extraction

**What it extracts:**
- Input field selectors (email, password, username, search, etc.)
- Button selectors (submit, cancel, back, etc.)
- Link selectors (navigation, help, terms, etc.)
- Error message locations
- Success indicators
- Expected redirect URL after action
- Load timing configuration (load/networkidle/domcontentloaded)
- Confidence score (0.0-1.0) based on selector stability

**Confidence Score:**
- 1.0 = All elements have data-testid or stable attributes
- 0.8-0.9 = Mix of stable and moderately stable selectors
- 0.6-0.7 = Some selectors rely on text or structure
- <0.6 = Many fragile selectors (recommend manual review)

**Benefits:**
- Saves 5-10 minutes per screen (95% time reduction)
- No manual codegen exploration needed
- Generates helper-ready selector code
- Provides timing and async operation guidance
- Includes confidence score for quality assessment
- Falls back gracefully if extraction fails
- Worth the $0.08 cost for massive time savings

**When used:**
- Automatically triggered by `/new-screen` command in Phase 1
- Can be used standalone via `SelectorExtractor` class
- Results NOT cached (each page is unique), but saved in generated helper files

**Example workflow:**
```bash
User: /new-screen login

Phase 1: Automatic UI Analysis
- Captures screenshot from APP_URL/login
- Extracts DOM structure (buttons, inputs, links)
- AI vision identifies ~10-15 selectors in ~5 seconds
- Returns: { selectors, redirectUrl, timing, confidence: 0.85 }
- Total cost: ~$0.08

Result: Helper generated with accurate selectors, no manual work!
```

### AI Assertions

#### Visual State → **Sonnet**
```typescript
model: 'sonnet'
maxTokens: 2048
```
**Reason:** Requires advanced AI vision capabilities.

**Estimated cost:** ~$0.01-0.02 per assertion

#### Semantic Content → **Haiku**
```typescript
model: 'haiku'
maxTokens: 512
```
**Reason:** Simple text comparison, doesn't require vision.

**Estimated cost:** ~$0.001 per assertion

#### Layout → **Sonnet**
```typescript
model: 'sonnet'
maxTokens: 2048
```
**Reason:** Visual analysis of layout and structure.

**Estimated cost:** ~$0.01-0.02 per assertion

#### Accessibility → **Sonnet**
```typescript
model: 'sonnet'
maxTokens: 2048
```
**Reason:** Requires visual analysis + understanding of a11y standards.

**Estimated cost:** ~$0.01-0.02 per assertion

#### Data Validation → **Haiku**
```typescript
model: 'haiku'
maxTokens: 512
```
**Reason:** Simple logical validation of textual data.

**Estimated cost:** ~$0.001 per validation

### Test Maintenance → **Sonnet**

#### Analysis
```typescript
model: 'sonnet'
maxTokens: 3072
```
**Reason:** Requires deep understanding of code patterns.

**Estimated cost:** ~$0.02-0.05 per analyzed file

#### Refactoring
```typescript
model: 'sonnet'
maxTokens: 4096
```
**Reason:** Complex code generation while maintaining logic.

**Estimated cost:** ~$0.05-0.10 per refactored file

## Cost Estimation

### Typical Test Suite (100 tests)

**Initial development:**
- Test generation: 20 tests × $0.10 = **$2.00**
- Manual tests: 80 tests (no AI cost)

**Daily execution:**
- Self-healing: 5 failures × $0.002 = **$0.01**
- AI assertions: 20 assertions × $0.015 = **$0.30**
- Total per run: **~$0.31**

**Monthly maintenance:**
- Suite analysis: 100 tests × $0.03 = **$3.00**
- Refactoring: 10 tests × $0.075 = **$0.75**
- Monthly total: **~$3.75**

**Estimated total first month cost:** ~$6.06
**Recurring monthly cost:** ~$10-15 (with daily runs)

## Single Model Comparison

If using **only Opus** for everything:
- Cost would be **~5-8x higher**
- 100-test suite: ~$30-50/month

If using **only Haiku** for everything:
- Cost would be **~80% lower**
- But test generation and visual assertion quality would be inferior

## Additional Optimizations

### 1. Self-Healing Cache
Healed selectors are cached, reducing repeated calls.

### 2. Disable AI in CI/CD
For fast smoke tests, configure:
```bash
ENABLE_SELF_HEALING=false
ENABLE_AI_ASSERTIONS=false
```

### 3. Selective AI Assertions
Use AI assertions only in critical tests, not all tests.

### 4. Batch Analysis
Analyze multiple tests together in maintenance.

## When to Use Opus

Currently Opus is the default fallback, but can be explicitly used for:
- Debugging complex cases
- First-time test generation for very complex applications
- Deep analysis of accessibility issues

To use Opus explicitly, modify the specific feature code.

## Cost Monitoring

To track real costs:
1. Review Anthropic dashboard
2. Logs show which model is used in each call
3. Consider adding custom telemetry

## Model Updates

This document was last updated: 2025-12-19

Review regularly:
- New Anthropic models
- Pricing changes
- Capability improvements

## References

- [Anthropic Pricing](https://www.anthropic.com/pricing)
- [Model Comparison](https://docs.anthropic.com/en/docs/models-overview)
