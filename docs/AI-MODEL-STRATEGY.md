# AI Model Selection Strategy

This document explains how different Claude models are used to optimize costs and performance.

## Available Models

### Haiku (claude-3-haiku-20240307)
- **Cost:** Low (~$0.00025 / 1K tokens input, ~$0.00125 / 1K tokens output)
- **Speed:** Fast
- **Use:** Simple text tasks and basic analysis
- **Note:** Claude 3 Haiku (latest stable version)

### Sonnet (claude-sonnet-4-5-20250929)
- **Cost:** Medium (~$0.003 / 1K tokens input, ~$0.015 / 1K tokens output)
- **Speed:** Moderate
- **Use:** Balance between quality and cost, AI vision
- **Note:** Claude Sonnet 4.5 (latest version, upgraded from 3.5)

### Opus (claude-opus-4-5-20251101)
- **Cost:** High (~$0.015 / 1K tokens input, ~$0.075 / 1K tokens output)
- **Speed:** Slower
- **Use:** Complex cases requiring maximum capability
- **Note:** Claude Opus 4.5 (latest version, upgraded from 3)

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
