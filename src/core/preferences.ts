import type { ColorScheme } from './types.js';
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
