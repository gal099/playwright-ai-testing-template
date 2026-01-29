import { test, expect } from '@playwright/test';
import { TestCasePlanner } from '../../utils/ai-helpers/test-case-planner';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Test Case Planner Example
 *
 * This example demonstrates how to use the Test Case Planner to generate
 * manual test case documentation from screenshots.
 *
 * The Test Case Planner is useful for:
 * - Identifying test scenarios without logging into systems
 * - Planning test coverage before automation
 * - Generating documentation for team review
 * - Prioritizing tests (P1/P2/P3) before coding
 *
 * Workflow:
 * 1. Generate test docs: npm run ai:plan-tests <url> <screen-name>
 * 2. Review and prioritize with team
 * 3. Automate P1 tests: /new-screen <screen-name>
 * 4. Keep P2/P3 as documentation for future
 *
 * Cost: ~$0.05-0.15 per analysis (Sonnet model)
 *
 * Note: These tests are skipped by default to avoid API costs.
 * Remove .skip to run them when testing the feature.
 */

test.describe('Test Case Planner Examples', () => {
  const outputDir = './test-results';
  const planner = new TestCasePlanner();

  test.afterEach(() => {
    // Cleanup: Remove generated test files after each test
    const files = fs.readdirSync(outputDir).filter((f) => f.endsWith('-TEST-CASES.md'));
    files.forEach((file) => {
      const filePath = path.join(outputDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  });

  test.skip('generate test cases from URL', async () => {
    // Example: Generate test case documentation from a live URL
    //
    // This captures a screenshot and analyzes the UI to identify test scenarios.
    // Useful when you have access to the running application.

    const filePath = await planner.generateTestCases({
      urlOrScreenshot: 'https://playwright.dev',
      screenName: 'playwright-home',
      outputPath: outputDir,
      exploreDuration: 3000, // Wait 3 seconds for page to stabilize
    });

    // Verify the file was created
    expect(fs.existsSync(filePath)).toBeTruthy();

    // Read the generated documentation
    const content = fs.readFileSync(filePath, 'utf-8');

    // Verify structure
    expect(content).toContain('# Playwright Home - Test Cases');
    expect(content).toContain('## Test Scenarios Identified');
    expect(content).toContain('## Test Cases');
    expect(content).toContain('## Summary');

    // Verify test case IDs use correct format (TC-PL-XXX)
    expect(content).toMatch(/TC-PL-\d{3}/);

    // Verify priorities are assigned
    expect(content).toContain('P1');
    expect(content).toMatch(/Priority.*P[123]/);

    // Verify structure elements
    expect(content).toContain('Preconditions:');
    expect(content).toContain('Steps:');
    expect(content).toContain('Expected Result:');

    console.log(`✅ Generated test case documentation: ${filePath}`);
  });

  test.skip('generate test cases from screenshot file', async () => {
    // Example: Generate test case documentation from an existing screenshot
    //
    // This is useful when:
    // - You don't have access to the running application
    // - You have mockups or designs to test
    // - You want to plan tests before development is complete

    // For this example, we'll first capture a screenshot to use
    const { chromium } = require('@playwright/test');
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('https://playwright.dev');
    const screenshotPath = path.join(outputDir, 'example-screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    await browser.close();

    // Now use the screenshot to generate test cases
    const filePath = await planner.generateTestCases({
      urlOrScreenshot: screenshotPath,
      screenName: 'example-screen',
      outputPath: outputDir,
    });

    // Verify the file was created
    expect(fs.existsSync(filePath)).toBeTruthy();

    // Read the generated documentation
    const content = fs.readFileSync(filePath, 'utf-8');

    // Verify basic structure
    expect(content).toContain('# Example Screen - Test Cases');
    expect(content).toContain('TC-EX-'); // Test case ID format

    console.log(`✅ Generated test case documentation from screenshot: ${filePath}`);

    // Cleanup screenshot
    if (fs.existsSync(screenshotPath)) {
      fs.unlinkSync(screenshotPath);
    }
  });

  test.skip('verify output format and content quality', async () => {
    // Example: Verify that generated documentation meets quality standards
    //
    // This test checks that the AI generates comprehensive, well-structured
    // test case documentation with all required sections.

    const filePath = await planner.generateTestCases({
      urlOrScreenshot: 'https://playwright.dev',
      screenName: 'quality-check',
      outputPath: outputDir,
      exploreDuration: 2000,
    });

    const content = fs.readFileSync(filePath, 'utf-8');

    // Verify all test cases have required sections
    const testCaseMatches = content.match(/### TC-\w+-\d{3}:/g);
    expect(testCaseMatches).toBeTruthy();
    expect(testCaseMatches!.length).toBeGreaterThan(0);

    console.log(`Found ${testCaseMatches!.length} test cases`);

    // Verify summary section exists and contains counts
    expect(content).toContain('**Total Test Cases:**');
    expect(content).toContain('**P1 (Alta):**');
    expect(content).toContain('**P2 (Media):**');
    expect(content).toContain('**P3 (Baja):**');

    // Verify automation recommendations
    expect(content).toContain('**Recommended for Automation (P1):**');
    expect(content).toContain('**Document but Don\'t Automate (P2/P3):**');

    // Verify next steps guidance
    expect(content).toContain('## Next Steps');

    console.log('✅ Output format and content quality verified');
  });

  test('documentation example exists', () => {
    // This test always runs (not skipped) to verify documentation
    //
    // Checks that the example documentation file exists and has expected content
    const examplePath = path.join(process.cwd(), 'docs/EXAMPLE-TEST-CASE-PLANNING.md');

    expect(fs.existsSync(examplePath)).toBeTruthy();

    const content = fs.readFileSync(examplePath, 'utf-8');

    // Verify example structure
    expect(content).toContain('# Example: Test Case Planning Output');
    expect(content).toContain('# Login Screen - Test Cases');
    expect(content).toContain('TC-LG-001');
    expect(content).toContain('npm run ai:plan-tests');

    console.log('✅ Example documentation file verified');
  });
});

/**
 * CLI Usage Examples (run these manually when testing):
 *
 * # Generate from URL
 * npm run ai:plan-tests http://localhost:3000/login login
 * npm run ai:plan-tests https://example.com/checkout checkout
 *
 * # Generate from screenshot
 * npm run ai:plan-tests screenshots/dashboard.png dashboard
 * npm run ai:plan-tests ./mockups/login-design.png login
 *
 * # Output
 * docs/LOGIN-TEST-CASES.md
 * docs/CHECKOUT-TEST-CASES.md
 * docs/DASHBOARD-TEST-CASES.md
 *
 * # Next Steps After Generation
 * 1. Review the generated test cases with your team
 * 2. Adjust priorities if needed
 * 3. Add any missing scenarios or edge cases
 * 4. Use /new-screen command to automate P1 tests
 * 5. Keep P2/P3 tests as documentation for future implementation
 */
