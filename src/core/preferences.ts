import type { ColorScheme, ContrastPreference } from './types.js';
import { safeMatchMedia } from './utils/media.js';

/**
 * Returns true if the user has requested reduced motion via OS settings.
 * SSR-safe — returns false on the server.
 *
 * @example
 * if (prefersReducedMotion()) {
 *   element.style.transition = 'none';
 * }
 */
export function prefersReducedMotion(): boolean {
  return safeMatchMedia('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

/**
 * Subscribes to changes in the user's reduced-motion preference.
 * Returns an unsubscribe function.
 *
 * @example
 * const unsub = onReducedMotionChange((reduced) => {
 *   document.body.classList.toggle('no-motion', reduced);
 * });
 * // later: unsub();
 */
export function onReducedMotionChange(callback: (reduced: boolean) => void): () => void {
  const mq = safeMatchMedia('(prefers-reduced-motion: reduce)');
  if (!mq) return () => undefined;

  const handler = (e: MediaQueryListEvent): void => callback(e.matches);
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}

/**
 * Returns the user's preferred color scheme.
 * SSR-safe — returns 'light' on the server.
 *
 * @example
 * const scheme = prefersColorScheme(); // 'dark' | 'light' | 'no-preference'
 */
export function prefersColorScheme(): ColorScheme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light';
  if (safeMatchMedia('(prefers-color-scheme: dark)')?.matches) return 'dark';
  if (safeMatchMedia('(prefers-color-scheme: light)')?.matches) return 'light';
  return 'no-preference';
}

/**
 * Subscribes to changes in the user's color scheme preference.
 * Returns an unsubscribe function.
 *
 * @example
 * const unsub = onColorSchemeChange((scheme) => {
 *   document.documentElement.dataset.theme = scheme;
 * });
 */
export function onColorSchemeChange(callback: (scheme: ColorScheme) => void): () => void {
  const mqDark = safeMatchMedia('(prefers-color-scheme: dark)');
  const mqLight = safeMatchMedia('(prefers-color-scheme: light)');

  if (!mqDark || !mqLight) return () => undefined;

  const resolve = (): ColorScheme => {
    if (mqDark.matches) return 'dark';
    if (mqLight.matches) return 'light';
    return 'no-preference';
  };

  const handler = (): void => callback(resolve());
  mqDark.addEventListener('change', handler);
  mqLight.addEventListener('change', handler);

  return (): void => {
    mqDark.removeEventListener('change', handler);
    mqLight.removeEventListener('change', handler);
  };
}

function watchMedia(query: string, callback: (matches: boolean) => void): () => void {
  const mq = safeMatchMedia(query);
  if (!mq) return () => undefined;
  const handler = (e: MediaQueryListEvent): void => callback(e.matches);
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}

const CONTRAST_QUERIES: [ContrastPreference, string][] = [
  ['more', '(prefers-contrast: more)'],
  ['less', '(prefers-contrast: less)'],
  ['custom', '(prefers-contrast: custom)'],
];

/**
 * Returns the user's contrast preference (`prefers-contrast`).
 * SSR-safe — returns 'no-preference' on the server.
 *
 * @example
 * if (prefersContrast() === 'more') document.body.classList.add('high-contrast');
 */
export function prefersContrast(): ContrastPreference {
  for (const [value, query] of CONTRAST_QUERIES) {
    if (safeMatchMedia(query)?.matches) return value;
  }
  return 'no-preference';
}

/**
 * Subscribes to changes in the user's contrast preference. Returns an unsubscribe function.
 *
 * @example
 * const unsub = onContrastChange((pref) => { document.documentElement.dataset.contrast = pref; });
 */
export function onContrastChange(callback: (pref: ContrastPreference) => void): () => void {
  const unsubs = CONTRAST_QUERIES.map(([, query]) =>
    watchMedia(query, () => callback(prefersContrast()))
  );
  return () => unsubs.forEach((unsub) => unsub());
}

/**
 * Returns true when forced colors are active (e.g. Windows High Contrast mode).
 * Custom colors are overridden by the system palette, so avoid conveying
 * meaning through color or background images alone.
 * SSR-safe — returns false on the server.
 *
 * @example
 * if (forcedColors()) chart.useSystemColors();
 */
export function forcedColors(): boolean {
  return safeMatchMedia('(forced-colors: active)')?.matches ?? false;
}

/**
 * Subscribes to forced-colors mode changes. Returns an unsubscribe function.
 */
export function onForcedColorsChange(callback: (active: boolean) => void): () => void {
  return watchMedia('(forced-colors: active)', callback);
}

/**
 * Returns true if the user prefers reduced transparency (`prefers-reduced-transparency`).
 * SSR-safe — returns false on the server.
 *
 * @example
 * panel.style.backdropFilter = prefersReducedTransparency() ? 'none' : 'blur(8px)';
 */
export function prefersReducedTransparency(): boolean {
  return safeMatchMedia('(prefers-reduced-transparency: reduce)')?.matches ?? false;
}

/**
 * Subscribes to reduced-transparency preference changes. Returns an unsubscribe function.
 */
export function onReducedTransparencyChange(callback: (reduced: boolean) => void): () => void {
  return watchMedia('(prefers-reduced-transparency: reduce)', callback);
}
