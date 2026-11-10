import { defineConfig, devices } from '@playwright/test';

/**
 * TEJAS Multi-Device Playwright Configuration
 * 
 * Configured for serial execution in dev environments to prevent
 * Next.js on-demand compilation timeouts, with direct database reporting.
 */
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45 * 1000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [
    ['list'],
    ['./tests/reporters/dashboard-reporter.ts'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3004',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'Mobile Android (Pixel 7)',
      use: {
        ...devices['Pixel 7'],
      },
    },
    {
      name: 'Mobile iOS (iPhone 13)',
      use: {
        ...devices['iPhone 13'],
      },
    },
  ],
});
