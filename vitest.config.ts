import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Resolve browser builds (e.g. solid-js ships a no-op server build under the node condition)
  resolve: { conditions: ['browser', 'development'] },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts'],
    },
  },
});
