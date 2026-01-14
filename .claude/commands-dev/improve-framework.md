---
description: Add new feature to the framework itself following best practices workflow
arguments:
  - name: feature_description
    description: Description of the framework feature to implement
    required: true
---

# Framework Feature Implementation

Your task is to implement the following framework feature: $ARGUMENTS

Follow this structured workflow strictly. **Do not skip phases.**

---

## Phase 0: Create Framework Branch

**Objective:** Isolate framework development work in a dedicated branch.

1. **Check current branch status**:
   ```bash
   git status
   ```
   Ensure working tree is clean before creating a new branch.

2. **Create and checkout a framework branch** with descriptive naming:
   ```bash
   git checkout -b framework/add-descriptive-feature-name
   ```

   **Branch naming convention:**
   - Use `framework/` prefix (distinguishes from project-specific `feature/` branches)
   - Use kebab-case (lowercase with hyphens)
   - Be descriptive but concise
   - Examples:
     - `framework/add-otp-extraction`
     - `framework/add-image-comparison-assertion`
     - `framework/improve-self-healing-cache`
     - `framework/add-pdf-assertion-helper`

3. **Confirm you're on the new branch**:
   ```bash
   git branch --show-current
   ```

---

## Phase 1: Explore & Understand (READ-ONLY - No Code Yet!)

**Objective:** Thoroughly understand the problem space before writing any code.

1. **Think hard** about the feature requirements:
   - What problem does this solve for QA testers?
   - How will this feature be used in real test scenarios?
   - What are the cost implications (AI API calls)?
   - Are there any ambiguities that need clarification?

2. **Explore the framework architecture** (use Explore subagent for complex investigations):
   - Read `docs/AI-MODEL-STRATEGY.md` to understand model selection strategy
   - Review existing AI helpers in `utils/ai-helpers/`
   - Check `fixtures/ai-fixtures.ts` for integration patterns
   - Examine `config/ai-client.ts` for API client usage
   - Look at `tests/examples/` for how features are demonstrated
   - Read the CLAUDE.md file for project conventions
   - Find similar features or functionality
   - Understand dependencies and potential impacts

3. **Ask clarifying questions** if the feature description is unclear or incomplete

4. **DO NOT write any code yet** - this phase is for understanding only

---

## Phase 2: Plan & Design

**Objective:** Create a detailed implementation plan before coding.

1. **Think harder** about different implementation approaches:
   - Which Claude model should be used? (Haiku/Sonnet/Opus)
   - What is the cost-benefit trade-off?
   - How does this integrate with existing fixtures?
   - Should this be a helper, fixture, or utility function?
   - Consider edge cases and error handling
   - Think about testing strategy

2. **Create a detailed plan** including:
   - Files to create or modify (with line numbers if modifying)
   - Which AI model to use and why (cost vs quality)
   - Functions/classes/interfaces to add
   - How the feature integrates with existing code
   - Edge cases and error handling approach
   - Testing strategy (which example tests to create)
   - Estimated API cost per usage
   - Type definitions and interfaces needed

3. **Present the plan** and wait for approval before proceeding

4. **Consider using Plan subagent** for complex features requiring architectural decisions

---

## Phase 3: Implementation

**Objective:** Implement the framework feature following the approved plan.

1. **Write the code** following your plan:
   - Follow existing code patterns and conventions (check CLAUDE.md)
   - Add appropriate error handling
   - Include JSDoc comments for public APIs
   - Use TypeScript types properly
   - Follow the multi-model optimization strategy
   - Add caching where appropriate to reduce costs

2. **Think** about edge cases as you implement each piece:
   - What if the API call fails?
   - What if the input is invalid?
   - What if the feature is used incorrectly?
   - How can we make error messages helpful?

3. **Use subagents to verify** that implementation isn't overfitting or missing edge cases

4. **Iterate as needed**:
   - Run the code
   - Check outputs
   - Refine implementation
   - Repeat until working correctly

---

## Phase 4: Testing & Validation

**Objective:** Verify the feature works correctly and doesn't break existing functionality.

1. **Create example test**:
   - Add example to `tests/examples/` demonstrating the feature
   - Include comments explaining how to use it
   - Show both success and error cases
   - Test with realistic data

2. **Test the feature thoroughly**:
   - Manual testing with representative inputs
   - Test both success and error cases
   - Verify AI model selection is correct
   - Check that caching works (if applicable)
   - Test error messages are helpful
   - Verify cost is reasonable

3. **Verify no regressions**:
   - Run existing tests:
     ```bash
     npm test
     ```
   - Check that existing examples still work
   - Verify no breaking changes to public APIs

4. **Code quality checks**:
   - Proper formatting (Prettier/ESLint)
   - No obvious issues or vulnerabilities
   - TypeScript compiles without errors:
     ```bash
     npx tsc --noEmit
     ```
   - No console errors or warnings

5. **CRITICAL: Iterate until ALL tests pass**:
   - Run the full test suite:
     ```bash
     npm test
     ```
   - Run all tests (unit tests, integration tests, examples)
   - If ANY test fails, fix the issue and rerun the full test suite
   - **DO NOT proceed to Phase 5 until ALL tests are passing**
   - **Iterate as many times as needed** - no shortcuts
   - **MANDATORY: All tests must pass before committing** - this is non-negotiable

---

## Phase 5: Documentation & Commit

**Objective:** Document changes and create a clean commit.

**PREREQUISITE:** All tests must be passing before proceeding. If you haven't run `npm test` in Phase 4 and verified all tests pass, go back and do that now.

1. **Update documentation**:
   - Update `docs/AI-MODEL-STRATEGY.md` with:
     - Model used for this feature
     - Estimated cost per usage
     - Token limits and why they were chosen
   - Add example to `tests/examples/` with clear comments
   - Update `CLAUDE.md` if introducing new patterns:
     - Add to "AI Helpers" section if it's a helper
     - Add to "Key Design Patterns" if it's a new pattern
     - Update "Commands Reference" if adding new npm scripts
   - Update README.md only if this is a major user-facing feature

2. **Verify tests one final time before committing**:
   ```bash
   npm test
   ```
   All tests must pass. If any fail, return to Phase 4.

3. **Create a descriptive commit message**:
   ```
   framework: add [brief one-line description]

   [Detailed explanation of what was added, why it was needed,
   and any important implementation details. Keep it concise but
   informative.]

   Technical Details:
   - Model: [Haiku/Sonnet/Opus]
   - Cost: ~$X.XX per usage
   - Location: [file path]
   - Example: tests/examples/[example-file].spec.ts

   Tests: All tests passing (npm test)

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   ```

   **Example:**
   ```
   framework: add OTP extraction helper with AI fallback

   Adds OTPHelper class that extracts verification codes from emails
   using regex patterns with AI-powered fallback for complex formats.

   Technical Details:
   - Model: Haiku (fast and cheap for text extraction)
   - Cost: ~$0.0001 per extraction
   - Location: utils/api/otp-helper.ts
   - Example: tests/examples/otp-auth-example.spec.ts

   Features:
   - Mailtrap integration (extensible to other providers)
   - Regex-first with AI fallback
   - Configurable timeout and polling
   - Email filtering by subject/sender

   Tests: All tests passing (npm test)

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   ```

4. **Commit the changes**:
   - Stage relevant files only
   - Verify nothing is being committed that shouldn't be
   - Create the commit

5. **Push the framework branch** (optional, for backup/collaboration):
   ```bash
   git push -u origin framework/your-feature-name
   ```

---

## Phase 6: Create Documentation (Optional but Recommended)

**Objective:** Document the work completed with context for future framework development.

1. **Get the current branch name**:
   ```bash
   git branch --show-current
   ```

2. **Create branch-specific results directory** (optional for major features):
   ```bash
   mkdir -p new_ideas/results/<branch-name>
   ```

3. **Create CONTEXT.md** at `new_ideas/results/<branch-name>/CONTEXT.md`:

   This file maintains important context for future framework work:

   ```markdown
   # Context: <branch-name>

   **Last Updated:** YYYY-MM-DD HH:MM
   **Status:** [In Progress / Completed / Blocked]

   ## Quick Summary

   [1-2 sentence summary of what this framework feature does]

   ## Important Decisions Made

   - Model Selection: [Why this model was chosen]
   - Cost Optimization: [How costs were minimized]
   - Architecture: [Key architectural decisions]
   - Trade-offs: [What was prioritized and why]

   ## Critical Files & Locations

   - `path/to/helper.ts:123-145` - [What this code does and why it matters]
   - `tests/examples/example.spec.ts:67` - [Example usage]

   ## Cost Analysis

   - Model: [Haiku/Sonnet/Opus]
   - Estimated cost per call: $X.XX
   - Token usage: ~X tokens input, ~Y tokens output
   - Caching: [Yes/No and impact]

   ## Next Steps

   1. [Potential improvements]
   2. [Related features to add]
   3. [Optimizations to consider]

   ## Important Notes for Future Development

   - [Gotchas to remember]
   - [Integration considerations]
   - [Known limitations]
   - [API constraints to be aware of]
   ```

---

## Framework-Specific Constraints

**Critical Requirements:**
- ✅ All code must be in English (code, comments, docs, test descriptions)
- ✅ Follow helper-based architecture patterns
- ✅ Use appropriate AI model (Haiku for cheap tasks, Sonnet for complex)
- ✅ Implement caching where possible to reduce costs
- ✅ Add comprehensive error handling
- ✅ Include TypeScript types and JSDoc comments
- ✅ Create example tests in `tests/examples/`
- ✅ Update `docs/AI-MODEL-STRATEGY.md` with costs

**Never Commit:**
- `node_modules/`
- `test-results/`, `playwright-report/`
- `.env` (only `.env.example`)
- `*.log` files
- Personal development notes in `new_ideas/` (unless documenting major features)

**Framework File Structure (Stable - Don't Break):**
- `config/ai-client.ts` - Unified Claude API client
- `fixtures/ai-fixtures.ts` - AI-enhanced Playwright fixtures
- `utils/ai-helpers/` - AI-powered utilities
- `utils/selectors/self-healing.ts` - Self-healing selectors
- `utils/api/` - Helper classes (auth, OTP, etc.)
- `tests/examples/` - Example tests demonstrating features

---

## Workflow Reminders

- **Start with Phase 0** - Create framework branch before any work
- **DO NOT skip Phase 1 & 2** - Jumping straight to code reduces quality
- **Use subagents liberally** for exploration and verification
- **Ask for approval** after presenting the plan (Phase 2)
- **Iterate in Phase 3** - First version is rarely perfect
- **Phase 4 is critical** - Iterate until ALL tests pass, no exceptions
- **Run `npm test` before committing** - All tests must pass, this is mandatory
- **Document costs in AI-MODEL-STRATEGY.md** - Help users understand expenses
- **Create examples in tests/examples/** - Users learn from examples
- **Keep commits atomic** - One feature per commit
- **Push to framework branch** - Keep main branch clean

---

## Cost Optimization Guidelines

When implementing AI features, always consider cost:

1. **Choose the cheapest model that works**:
   - Haiku (~$0.001): Simple text tasks, data validation, basic parsing
   - Sonnet (~$0.01): Visual analysis, complex reasoning, code generation
   - Opus (~$0.10): Last resort for very complex cases

2. **Implement caching**:
   - Cache results when possible (e.g., `.selector-cache.json`)
   - Document cache invalidation strategy
   - Make caching optional but encouraged

3. **Optimize token usage**:
   - Use appropriate `maxTokens` limits
   - Don't send unnecessary context
   - Truncate large outputs when possible

4. **Provide fallbacks**:
   - Try regex/simple logic first
   - Fall back to AI only when needed
   - Make AI features optional (check `ENABLE_*` env vars)

---

**Ready to begin?** Start with Phase 0: Create a framework branch. Then proceed to Phase 1: Explore & Understand. Do not write any code until you have completed Phase 2 and received approval for your plan.

**When finished:** Update documentation and create a clean commit with technical details including model selection and cost estimates.
