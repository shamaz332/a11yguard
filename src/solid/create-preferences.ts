import { createSignal, onCleanup, type Accessor } from 'solid-js';
import {
  prefersReducedMotion,
  onReducedMotionChange,
  prefersColorScheme,
  onColorSchemeChange,
} from '../core/preferences.js';
import type { ColorScheme } from '../core/types.js';

/**
 * Solid primitive that returns a reactive `Accessor<boolean>` for
 * `prefers-reduced-motion`. Updates when the OS setting changes.
 * SSR-safe — returns `false` on the server.
 *
 * @example
 * function AnimatedEl() {
 *   const reduced = createReducedMotion();
 *   return <div style={{ transition: reduced() ? 'none' : 'all 0.3s' }} />;
 * }
 */
export function createReducedMotion(): Accessor<boolean> {
  const [value, setValue] = createSignal<boolean>(prefersReducedMotion());
  const unsub = onReducedMotionChange(setValue);
  onCleanup(unsub);
  return value;
}

/**
 * Solid primitive that returns a reactive `Accessor<ColorScheme>` for
 * `prefers-color-scheme`. Updates when the OS setting changes.
 * SSR-safe — returns `'light'` on the server.
 *
 * @example
 * function ThemedApp() {
 *   const scheme = createColorScheme();
 *   return <div data-theme={scheme()}>...</div>;
 * }
 */
export function createColorScheme(): Accessor<ColorScheme> {
  const [scheme, setScheme] = createSignal<ColorScheme>(prefersColorScheme());
  const unsub = onColorSchemeChange(setScheme);
  onCleanup(unsub);
  return scheme;
}
