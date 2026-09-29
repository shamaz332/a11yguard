import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'core/index': 'src/core/index.ts',
    'react/index': 'src/react/index.ts',
    'vue/index': 'src/vue/index.ts',
    'angular/index': 'src/angular/index.ts',
    'svelte/index': 'src/svelte/index.ts',
    'solid/index': 'src/solid/index.ts',
    'audit/index': 'src/audit/index.ts',
    'testing/index': 'src/testing/index.ts',
    'playwright/index': 'src/playwright/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  outDir: 'dist',
  target: 'es2022',
  // Provides import.meta.url in the CJS build of the Playwright helper
  shims: true,
  external: [
    'react',
    'react-dom',
    'vue',
    '@angular/core',
    '@angular/common',
    'rxjs',
    'svelte',
    'svelte/store',
    'solid-js',
  ],
});
