import { defineConfig } from '@playwright/test';

const URL = 'http://localhost:5173';

export default defineConfig({
  testDir: './src/e2e',
  fullyParallel: true,
  retries: 1,
  use: {
    baseURL: URL,
    headless: true,
    viewport: { width: 1280, height: 720 },
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'npm run dev',
    url: URL,
    reuseExistingServer: true
  }
});
