import { announce } from './announce.js';
import { clearFocusStack } from './focus-stack.js';
import { focusElement } from './utils/dom.js';
import type { RouteChangeOptions } from './types.js';

function resolveFocusTarget(focus: RouteChangeOptions['focus']): HTMLElement | null {
  if (focus === false) return null;
  if (focus instanceof HTMLElement) return focus;
  if (typeof focus === 'string') return document.querySelector<HTMLElement>(focus);
  return (
    document.querySelector<HTMLElement>('h1') ??
    document.querySelector<HTMLElement>('main, [role="main"]') ??
    document.body
  );
}

/**
 * Tells screen reader users that a client-side navigation happened.
 * Announces the new page title, moves focus to the page heading and clears the
 * focus stack. Call it after the new route has rendered.
 *
 * Covers WCAG 2.4.3 (Focus Order) and 4.1.3 (Status Messages) for single-page apps.
 *
 * @example
 * router.afterEach(() => {
 *   announceRouteChange();
 * });
 *
 * @example
 * announceRouteChange({ focus: '#content', message: (t) => `${t} loaded` });
 */
export function announceRouteChange(options: RouteChangeOptions = {}): void {
  if (typeof document === 'undefined') return;

  const {
    title = document.title,
    message = (t: string): string => `Navigated to ${t}`,
    focus,
    clearFocusStack: shouldClear = true,
  } = options;

  if (shouldClear) clearFocusStack();

  const target = resolveFocusTarget(focus);
  if (target) focusElement(target);

  if (title) announce(message(title), 'polite');
}
