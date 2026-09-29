import { defineConfig } from 'tsup';

// Self-contained audit bundle that the Playwright helper injects into pages.
export default defineConfig({
  entry: { 'browser/audit': 'src/audit/browser.ts' },
  format: ['iife'],
  globalName: '__a11yguardAudit',
  outExtension: () => ({ js: '.global.js' }),
  minify: true,
  clean: false,
  outDir: 'dist',
  target: 'es2020',
});
