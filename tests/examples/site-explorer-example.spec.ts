/**
 * Example tests demonstrating the Interactive Site Explorer
 *
 * NOTE: These tests are marked as skipped by default because they require:
 * 1. A running application to explore
 * 2. ANTHROPIC_API_KEY configured
 *
 * To run these examples:
 * 1. Set APP_URL in .env to a running application
 * 2. Set ANTHROPIC_API_KEY in .env
 * 3. Set RUN_EXAMPLES=true in environment
 * 4. Run: RUN_EXAMPLES=true npm test
 */

import { test, expect } from '@playwright/test';
import { SiteExplorer } from '../../utils/ai-helpers/site-explorer';
import * as fs from 'fs';
import * as path from 'path';

// Skip all tests unless RUN_EXAMPLES environment variable is set
const shouldRun = process.env.RUN_EXAMPLES === 'true';
const describeOrSkip = shouldRun ? test.describe : test.describe.skip;

describeOrSkip('Site Explorer Examples', () => {
  const testMapPath = '.exploration-map-test.json';

  // Cleanup after each test
  test.afterEach(async () => {
    if (fs.existsSync(testMapPath)) {
      fs.unlinkSync(testMapPath);
    }
  });

  test.skip('programmatic usage: analyze single page', async () => {
    // This example shows how to use SiteExplorer programmatically
    // instead of via the CLI

    const explorer = new SiteExplorer({ mapFilePath: testMapPath });

    // This would normally require a running application and AI key
    // Skipped by default - uncomment and modify for your use case

    /*
    const startUrl = process.env.APP_URL || 'http://localhost:3000';

    // Note: In a real scenario, you'd handle the interactive prompts programmatically
    // This is a simplified example showing the API

    // The explorer will:
    // 1. Analyze the page
    // 2. Generate test case documentation
    // 3. Discover navigation links
    // 4. Save exploration state

    await explorer.exploreInteractive(startUrl);

    // Verify exploration map was created
    expect(fs.existsSync(testMapPath)).toBeTruthy();

    // Read and verify the exploration map structure
    const mapData = JSON.parse(fs.readFileSync(testMapPath, 'utf-8'));
    expect(mapData).toHaveProperty('baseUrl');
    expect(mapData).toHaveProperty('explored');
    expect(mapData.explored.length).toBeGreaterThan(0);
    */
  });

  test('verify SiteExplorer class exists and is importable', async () => {
    // Basic smoke test - verify the class exists and can be instantiated
    expect(SiteExplorer).toBeDefined();

    const explorer = new SiteExplorer({ mapFilePath: testMapPath });
    expect(explorer).toBeDefined();

    // Verify map file is created (empty state)
    expect(fs.existsSync(testMapPath)).toBeTruthy();

    const mapData = JSON.parse(fs.readFileSync(testMapPath, 'utf-8'));
    expect(mapData).toHaveProperty('baseUrl');
    expect(mapData).toHaveProperty('startedAt');
    expect(mapData).toHaveProperty('explored');
    expect(mapData.explored).toEqual([]);
  });

  test.skip('CLI usage example - see help text', async () => {
    // The primary way to use Site Explorer is via CLI:
    // npm run ai:explore http://localhost:3000/login

    // This test demonstrates that the CLI is available
    // Actual CLI testing requires manual interaction or mocking stdin

    /*
    Example CLI session:

    $ npm run ai:explore http://localhost:3000/login

    📋 Analyzing: http://localhost:3000/login
    ✅ Test cases generated: docs/LOGIN-TEST-CASES.md
    🔗 Found 5 navigation link(s)

    🔗 Available navigation links:
      [1] http://localhost:3000/dashboard
          button: "Sign In"
      [2] http://localhost:3000/register
          link: "Create account"

    ? Which page to explore next? (Enter number or "quit"): 1

    📋 Analyzing: http://localhost:3000/dashboard
    ...
    */

    expect(true).toBeTruthy(); // Placeholder
  });

  test.skip('exploration state persistence', async () => {
    // This example shows how the exploration map persists state

    /*
    const explorer = new SiteExplorer({ mapFilePath: testMapPath });
    const startUrl = 'http://localhost:3000';

    // First exploration session
    await explorer.exploreInteractive(startUrl);

    // Verify state was saved
    const mapData1 = JSON.parse(fs.readFileSync(testMapPath, 'utf-8'));
    expect(mapData1.explored.length).toBeGreaterThan(0);

    // Create new explorer instance - should load existing state
    const explorer2 = new SiteExplorer({ mapFilePath: testMapPath });

    // Continue exploration from saved state
    // The explorer remembers which pages were already visited
    */
  });

  test.skip('URL deduplication', async () => {
    // Site Explorer automatically deduplicates URLs
    // Same path with different query params = same page

    /*
    Examples of URLs that would be deduplicated:
    - http://localhost:3000/users
    - http://localhost:3000/users?tab=active
    - http://localhost:3000/users#section1

    All three would be treated as the same page: http://localhost:3000/users
    */
  });

  test.skip('AI link filtering', async () => {
    // Site Explorer uses AI (Haiku) to filter navigation links
    // This removes noise like tooltips, modals, external links

    /*
    Raw extraction might find 50+ links on a page:
    - Navigation menu (keep)
    - Tooltips (filter out)
    - Modals (filter out)
    - External links (filter out)
    - Footer links like "Terms" (filter out)
    - Social media links (filter out)

    AI filtering reduces this to ~5-10 significant navigation links
    Cost: ~$0.001 per page (very cheap with Haiku)
    */
  });

  test.skip('cost analysis for site exploration', async () => {
    // Cost breakdown per page:
    // - Test case generation: ~$0.05-0.15 (Sonnet, via TestCasePlanner)
    // - Link filtering: ~$0.001 (Haiku)
    // Total: ~$0.05-0.16 per page

    /*
    Example costs:
    - Small site (5 pages): ~$0.25-0.80
    - Medium site (15 pages): ~$0.75-2.40
    - Large site (50 pages): ~$2.50-8.00

    Cost control features:
    - User chooses which pages to explore (no wasted analysis)
    - Can quit anytime
    - Exploration map prevents re-analyzing same pages
    */
  });
});

/**
 * Usage Notes
 *
 * Interactive Site Explorer is primarily a CLI tool:
 *
 * Basic usage:
 *   npm run ai:explore http://localhost:3000/login
 *
 * Features:
 *   - Discovers navigation links automatically
 *   - AI filters out non-navigation elements
 *   - Generates test case docs for each page
 *   - Saves exploration state to .exploration-map.json
 *   - URL deduplication prevents re-analyzing same pages
 *
 * Output:
 *   - docs/{PAGE}-TEST-CASES.md for each explored page
 *   - .exploration-map.json with exploration state
 *
 * Workflow:
 *   1. Run npm run ai:explore <start-url>
 *   2. Choose pages to explore interactively
 *   3. Type "quit" when done
 *   4. Review generated test case docs
 *   5. Use /new-screen to automate P1 tests
 */
