import { defineConfig, devices } from '@playwright/test';
export default defineConfig({ testDir: './e2e', webServer: { command: 'npm run dev:frontend', port: 4173, reuseExistingServer: true }, use: { baseURL: 'http://localhost:4173' }, projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }, { name: 'mobile', use: { ...devices['Pixel 7'] } }] });
