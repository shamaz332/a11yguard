/**
 * SSR-safe wrapper around window.matchMedia.
 * Returns null in environments without a window (SSR, Node.js, test environments
 * that don't implement matchMedia).
 *
 * @example
 * const mq = safeMatchMedia('(prefers-reduced-motion: reduce)');
 * if (mq?.matches) { ... }
 */
export function safeMatchMedia(query: string): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return null;
  }
  return window.matchMedia(query);
}
