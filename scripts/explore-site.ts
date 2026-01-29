#!/usr/bin/env ts-node

import { SiteExplorer } from '../utils/ai-helpers/site-explorer';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * CLI interface for Interactive Site Explorer
 *
 * Usage: npm run ai:explore <start-url> [options]
 */
async function main() {
  const args = process.argv.slice(2);

  // Show help if no arguments provided
  if (args.length < 1 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  const startUrl = args[0];

  // Validate URL
  if (!isValidUrl(startUrl)) {
    console.error(`\n❌ Error: Invalid URL provided: ${startUrl}`);
    console.error('Please provide a valid URL starting with http:// or https://\n');
    process.exit(1);
  }

  console.log('\n🗺️  Interactive Site Explorer');
  console.log('════════════════════════════════════════════════════════════\n');

  // Check if AI features are enabled
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ Error: ANTHROPIC_API_KEY not found in environment variables');
    console.error('Please set ANTHROPIC_API_KEY in your .env file to use this feature.\n');
    process.exit(1);
  }

  const explorer = new SiteExplorer();

  try {
    await explorer.exploreInteractive(startUrl);
    console.log('\n✨ Exploration completed successfully!\n');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Exploration failed:', error.message);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    console.error('\n');
    process.exit(1);
  }
}

/**
 * Validate URL format
 */
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

/**
 * Display help message
 */
function showHelp() {
  console.log(`
🗺️  Interactive Site Explorer - Discover and document test cases incrementally

Usage: npm run ai:explore <start-url>

Arguments:
  start-url         URL to start exploration from (required)
                    Must be a valid HTTP or HTTPS URL

Options:
  --help, -h        Show this help message

Examples:
  # Start exploring from login page
  npm run ai:explore http://localhost:3000/login

  # Start exploring from dashboard
  npm run ai:explore https://example.com/dashboard

How it works:
  1. Analyzes the starting page and generates test case documentation
  2. Discovers navigation links (buttons, menu items, links, etc.)
  3. Uses AI to filter only significant navigation links
  4. Lets you choose which page to explore next
  5. Repeats the process until you quit (type "quit")
  6. Saves exploration progress to .exploration-map.json
  7. Generates test case docs in docs/ directory for each page

Features:
  ✅ Interactive page-by-page exploration
  ✅ AI-powered link filtering (removes noise)
  ✅ Automatic test case documentation generation
  ✅ Persistent exploration state (.exploration-map.json)
  ✅ URL deduplication (same page not analyzed twice)
  ✅ Graceful error handling

Cost:
  ~$0.05-0.16 per page analyzed
  - Test case generation: ~$0.05-0.15 (Sonnet via ai:plan-tests)
  - Link filtering: ~$0.001 (Haiku)

Example session:
  $ npm run ai:explore http://localhost:3000/login

  📋 Analyzing: http://localhost:3000/login
  ✅ Test cases generated: docs/LOGIN-TEST-CASES.md
  🔗 Found 5 navigation link(s)

  🔗 Available navigation links:
    [1] http://localhost:3000/dashboard
        button: "Sign In"
    [2] http://localhost:3000/register
        link: "Create account"
    [3] http://localhost:3000/forgot-password
        link: "Forgot password?"

  ? Which page to explore next? (Enter number or "quit"): 1

  📋 Analyzing: http://localhost:3000/dashboard
  ...

Requirements:
  - ANTHROPIC_API_KEY must be set in .env
  - Application must be running and accessible

Output files:
  - docs/{PAGE}-TEST-CASES.md - Test case documentation for each page
  - .exploration-map.json - Exploration state (git-ignored)

Next steps after exploration:
  1. Review generated test case documents in docs/
  2. Use /new-screen command to automate P1 tests
  3. Keep P2/P3 tests as documentation for future
  `);
}

// Run the CLI
main();
