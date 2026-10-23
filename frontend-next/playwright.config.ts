import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const root = path.join(__dirname, '..');

export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  fullyParallel: false,
  retries: 0,
  use: {
    ...devices['Desktop Chrome'],
    trace: 'on-first-retry'
  },
  webServer: [
    {
      command: 'npm run dev --workspace=api',
      url: 'http://localhost:8010',
      reuseExistingServer: !process.env.CI,
      cwd: root,
      timeout: 120000
    },
    {
      command: 'npm run dev --workspace=frontend-next',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      cwd: root,
      timeout: 120000
    }
  ]
});
