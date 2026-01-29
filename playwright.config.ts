import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // AI features will be injected via fixtures
  },

  // Ignore tests that depend on external apps or unstable external sites
  // Run ALL tests explicitly with: npm run test:examples
  testIgnore: process.env.RUN_EXAMPLES === 'true'
    ? []
    : [
        '**/tests/examples/ai-features-example.spec.ts', // Depends on playwright.dev structure (can change)
        '**/tests/example-feature/**'                     // User project example (depends on localhost:3000)
      ],
  // Keep: tests/examples/basic-example.spec.ts (stable)
  // Keep: tests/examples/otp-auth-example.spec.ts (auto-skipped if no config)

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  outputDir: 'test-results/',
});
