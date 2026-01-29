import { chromium, Page } from '@playwright/test';
import { aiClient } from '../../config/ai-client';
import * as fs from 'fs';
import * as path from 'path';

interface TestCasePlannerOptions {
  urlOrScreenshot: string;
  screenName: string;
  outputPath?: string;
  exploreDuration?: number;
}

export class TestCasePlanner {
  /**
   * Generate manual test case documentation from screenshot or URL
   *
   * Unlike test-generator.ts which generates automated test CODE,
   * this generates manual test case DOCUMENTATION for review and prioritization.
   *
   * @param options Configuration options
   * @returns Path to generated documentation file
   */
  async generateTestCases(options: TestCasePlannerOptions): Promise<string> {
    const {
      urlOrScreenshot,
      screenName,
      outputPath = './docs',
      exploreDuration = 5000,
    } = options;

    console.log(`📋 Generating test case documentation for: ${screenName}`);

    let screenshotBase64: string;
    let pageTitle = '';
    let interactiveElements: any[] = [];

    // Determine if input is URL or screenshot path
    const isUrl = urlOrScreenshot.startsWith('http://') || urlOrScreenshot.startsWith('https://');

    if (isUrl) {
      // Capture screenshot from URL
      console.log(`🌐 Navigating to URL: ${urlOrScreenshot}`);
      const result = await this.captureScreenshotFromUrl(urlOrScreenshot, exploreDuration);
      screenshotBase64 = result.screenshotBase64;
      pageTitle = result.pageTitle;
      interactiveElements = result.interactiveElements;
    } else {
      // Load existing screenshot
      console.log(`📸 Loading screenshot from: ${urlOrScreenshot}`);
      screenshotBase64 = await this.loadScreenshot(urlOrScreenshot);
    }

    // Generate test case documentation using AI
    const documentation = await this.generateDocumentation(
      screenshotBase64,
      screenName,
      pageTitle,
      interactiveElements
    );

    // Save the documentation
    const fileName = `${screenName.toUpperCase()}-TEST-CASES.md`;
    const fullPath = path.join(outputPath, fileName);

    // Ensure directory exists
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    fs.writeFileSync(fullPath, documentation);

    console.log(`✅ Test case documentation generated: ${fullPath}`);

    return fullPath;
  }

  private async captureScreenshotFromUrl(
    url: string,
    exploreDuration: number
  ): Promise<{ screenshotBase64: string; pageTitle: string; interactiveElements: any[] }> {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(exploreDuration);

      const pageTitle = await page.title();
      const screenshot = await page.screenshot({ fullPage: true });
      const screenshotBase64 = screenshot.toString('base64');
      const interactiveElements = await this.extractInteractiveElements(page);

      return { screenshotBase64, pageTitle, interactiveElements };
    } finally {
      await browser.close();
    }
  }

  private async loadScreenshot(screenshotPath: string): Promise<string> {
    if (!fs.existsSync(screenshotPath)) {
      throw new Error(`Screenshot not found: ${screenshotPath}`);
    }

    const screenshot = fs.readFileSync(screenshotPath);
    return screenshot.toString('base64');
  }

  private async extractInteractiveElements(page: Page) {
    return await page.evaluate(() => {
      const elements: Array<{
        tag: string;
        type?: string;
        text?: string;
        id?: string;
        name?: string;
        testId?: string;
        role?: string;
      }> = [];

      // Buttons
      document.querySelectorAll('button').forEach((el) => {
        elements.push({
          tag: 'button',
          text: el.textContent?.trim().substring(0, 50),
          id: el.id,
          testId: el.getAttribute('data-testid') || undefined,
          role: el.getAttribute('role') || undefined,
        });
      });

      // Links
      document.querySelectorAll('a[href]').forEach((el) => {
        elements.push({
          tag: 'a',
          text: el.textContent?.trim().substring(0, 50),
          id: el.id,
          testId: el.getAttribute('data-testid') || undefined,
        });
      });

      // Inputs
      document.querySelectorAll('input').forEach((el) => {
        elements.push({
          tag: 'input',
          type: el.type,
          id: el.id,
          name: el.name,
          testId: el.getAttribute('data-testid') || undefined,
        });
      });

      // Select dropdowns
      document.querySelectorAll('select').forEach((el) => {
        elements.push({
          tag: 'select',
          id: el.id,
          name: el.name,
          testId: el.getAttribute('data-testid') || undefined,
        });
      });

      // Forms
      document.querySelectorAll('form').forEach((el) => {
        elements.push({
          tag: 'form',
          id: el.id,
          testId: el.getAttribute('data-testid') || undefined,
        });
      });

      return elements.slice(0, 50); // Limit to first 50 elements
    });
  }

  private async generateDocumentation(
    screenshotBase64: string,
    screenName: string,
    pageTitle: string,
    interactiveElements: any[]
  ): Promise<string> {
    const date = new Date().toISOString().split('T')[0];
    const screenNameUpper = screenName.toUpperCase();
    const screenNameTitle = screenName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const prompt = `
Analyze this screenshot of a web application screen and generate comprehensive MANUAL TEST CASE DOCUMENTATION.

Screen Name: ${screenNameTitle}
${pageTitle ? `Page Title: ${pageTitle}` : ''}
${interactiveElements.length > 0 ? `Interactive Elements Found:\n${JSON.stringify(interactiveElements, null, 2)}` : ''}

Your task is to create a detailed test case document in Markdown format that:

1. **Identifies Test Scenarios**: Group related test cases into logical scenarios
2. **Creates Test Cases**: For each test case, include:
   - Test Case ID (format: TC-${screenNameUpper.substring(0, 2)}-XXX, starting from 001)
   - Test Name (descriptive, actionable)
   - Priority (P1 for critical path, P2 for important features, P3 for nice-to-have)
   - Type (Functional, UI/UX, Negative Testing, Performance, Security, etc.)
   - Preconditions (what must be true before test)
   - Steps (numbered, clear, actionable)
   - Expected Result (what should happen)
   - Notes (automation recommendations, edge cases, etc.)

3. **Prioritize Tests**:
   - P1 (Alta): Critical path, must work, high risk if broken
   - P2 (Media): Important features, should work, medium risk
   - P3 (Baja): Nice-to-have, edge cases, low risk

4. **Provide Summary**:
   - Total test cases count
   - Breakdown by priority (P1/P2/P3)
   - Recommended tests for automation (P1 tests)
   - Tests to document but not automate (P2/P3 tests)

5. **Consider Multiple Aspects**:
   - Happy path scenarios (positive testing)
   - Error handling (negative testing)
   - UI/UX validation (visual correctness)
   - Edge cases and boundary conditions
   - Accessibility considerations
   - Cross-browser compatibility concerns

IMPORTANT:
- Write ALL content in ENGLISH ONLY
- Use the format TC-${screenNameUpper.substring(0, 2)}-XXX for test case IDs
- Be specific and actionable in test steps
- Focus on MANUAL test documentation, not automated test code
- Prioritize realistically (not everything is P1)
- Include automation recommendations in Notes section

Return ONLY the Markdown documentation following this structure:

# ${screenNameTitle} - Test Cases

Auto-generated from screenshot analysis on ${date}

## Test Scenarios Identified

[List main scenarios here]

---

## Test Cases

### TC-XX-001: [Test name] (P1 - Alta)

**Priority:** P1 (Critical Path)
**Type:** [Type]
**Estimated Effort:** [Low/Medium/High]

**Preconditions:**
- [List preconditions]

**Steps:**
1. [Step 1]
2. [Step 2]

**Expected Result:**
- [Expected outcome]

**Notes:**
- [Automation recommendations, edge cases, etc.]

---

[More test cases...]

---

## Summary

**Total Test Cases:** X
**P1 (Alta):** X test cases
**P2 (Media):** X test cases
**P3 (Baja):** X test cases

**Recommended for Automation (P1):**
- TC-XX-001: [Test name]
- TC-XX-002: [Test name]

**Document but Don't Automate (P2/P3):**
- TC-XX-XXX: [Test name]
- TC-XX-XXX: [Test name]

---

## Next Steps

1. Review and adjust priorities with team
2. Add any missing scenarios or edge cases
3. Use \`/new-screen ${screenName}\` command to automate P1 tests
4. Keep P2/P3 as documentation for future implementation
`;

    const systemPrompt = `You are an expert QA Test Analyst specializing in test case design and documentation.
Your role is to analyze application screenshots and create comprehensive, well-structured manual test case documentation.

Focus on:
- Identifying realistic test scenarios from visual analysis
- Creating clear, actionable test cases with proper structure
- Prioritizing tests appropriately (not everything is P1)
- Providing automation recommendations
- Considering multiple testing aspects (functional, UI/UX, negative, edge cases)

IMPORTANT: Generate ALL documentation in English only.
This includes test case names, steps, expected results, notes, and all other content.`;

    // Use Sonnet for balanced quality and cost in test planning
    const documentation = await aiClient.askWithImage(
      prompt,
      screenshotBase64,
      'image/png',
      {
        model: 'sonnet',
        maxTokens: 4096,
      },
      systemPrompt
    );

    return documentation.trim();
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(`
📋 Test Case Planner - Generate manual test documentation from screenshots

Usage: npm run ai:plan-tests <url-or-screenshot> <screen-name>

Arguments:
  url-or-screenshot  URL to capture screenshot from OR path to existing screenshot
  screen-name        Name for the screen (used in file naming and test IDs)

Examples:
  # From URL
  npm run ai:plan-tests http://localhost:3000/login login
  npm run ai:plan-tests https://example.com/checkout checkout

  # From existing screenshot
  npm run ai:plan-tests screenshots/dashboard.png dashboard
  npm run ai:plan-tests ./login-screen.png login

Output:
  Generates: docs/{SCREEN-NAME}-TEST-CASES.md

What it does:
  1. Captures/loads screenshot
  2. Analyzes UI and identifies test scenarios
  3. Generates manual test case documentation with:
     - Test case IDs (TC-XX-001, TC-XX-002, ...)
     - Priorities (P1/P2/P3)
     - Preconditions, steps, expected results
     - Automation recommendations
  4. Saves to docs/ directory

Next steps after generation:
  1. Review and adjust test cases
  2. Use /new-screen command to automate P1 tests
  3. Keep P2/P3 as documentation for future
    `);
    process.exit(1);
  }

  const planner = new TestCasePlanner();
  const [urlOrScreenshot, screenName] = args;

  planner
    .generateTestCases({ urlOrScreenshot, screenName })
    .then((filePath) => {
      console.log(`\n🎉 Test case documentation saved to: ${filePath}`);
      console.log('\nNext steps:');
      console.log('1. Review the generated test cases');
      console.log(`2. Use /new-screen ${screenName} to automate P1 tests`);
      console.log('3. Keep P2/P3 tests as documentation for future');
    })
    .catch((error) => {
      console.error('❌ Error generating test cases:', error);
      process.exit(1);
    });
}

export default TestCasePlanner;
