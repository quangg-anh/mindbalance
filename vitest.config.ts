import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { exclude: ['**/node_modules/**', '**/dist/**', '**/dist-types/**', 'e2e/**', 'apps/api/src/index.test.ts'], coverage: { reporter: ['text', 'html'] } } });
