import { readable, type Readable } from 'svelte/store';
import {
  prefersReducedMotion,
  onReducedMotionChange,
  prefersColorScheme,
  onColorSchemeChange,
} from '../core/preferences.js';
import type { ColorScheme } from '../core/types.js';

/**
 * Svelte readable store that reflects `prefers-reduced-motion`.
 * Initialises to the current OS value and updates reactively.
 *
 * @example
 * <script>
 *   import { reducedMotion } from '@shamaz332/a11yguard/svelte';
 * </script>
 * <div style:transition={$reducedMotion ? 'none' : 'all 0.3s'}>...</div>
 */
export const reducedMotion: Readable<boolean> = readable<boolean>(
  false,
  (set) => {
    if (typeof window === 'undefined') return;
    set(prefersReducedMotion());
    return onReducedMotionChange(set);
  }
);

/**
 * Svelte readable store that reflects `prefers-color-scheme`.
 *
 * @example
 * <script>
 *   import { colorScheme } from '@shamaz332/a11yguard/svelte';
 * </script>
 * <div data-theme={$colorScheme}>...</div>
 */
export const colorScheme: Readable<ColorScheme> = readable<ColorScheme>(
  'light',
  (set) => {
    if (typeof window === 'undefined') return;
    set(prefersColorScheme());
    return onColorSchemeChange(set);
  }
);
