import { createEffect, createRenderEffect, on, onCleanup, onMount, type Accessor } from 'solid-js';
import { lockScroll, unlockScroll } from '../core/scroll-lock.js';
import { pushFocus, popFocus } from '../core/focus-stack.js';
import { injectSkipLink } from '../core/skip-link.js';
import { announceRouteChange } from '../core/route-announcer.js';
import type { RouteChangeOptions, SkipLinkOptions } from '../core/types.js';

/**
 * Solid primitive that locks body scroll while `active()` is true.
 *
 * @example
 * createScrollLock(() => props.open);
 */
export function createScrollLock(active: Accessor<boolean>): void {
  createEffect(() => {
    if (!active()) return;
    lockScroll();
    onCleanup(unlockScroll);
  });
}

/**
 * Solid primitive that saves the focused element when `active()` becomes true
 * and restores focus when it becomes false or the owner is disposed.
 *
 * @example
 * createFocusRestore(() => props.open);
 */
export function createFocusRestore(active: Accessor<boolean>): void {
  // Render effect: runs before children mount, so autofocus cannot overwrite the saved element
  createRenderEffect(() => {
    if (!active()) return;
    pushFocus();
    onCleanup(() => {
      popFocus();
    });
  });
}

/**
 * Solid primitive that injects a "Skip to main content" link while mounted.
 *
 * @example
 * createSkipLink({ target: '#main' });
 */
export function createSkipLink(options: SkipLinkOptions = {}): void {
  onMount(() => onCleanup(injectSkipLink(options)));
}

/**
 * Solid primitive that announces client-side navigations to screen reader users
 * and moves focus to the new page heading. Nothing happens on the first run.
 *
 * @example
 * // @solidjs/router
 * const location = useLocation();
 * createRouteAnnouncer(() => location.pathname);
 */
export function createRouteAnnouncer(
  source: Accessor<unknown>,
  options: RouteChangeOptions = {}
): void {
  createEffect(on(source, () => announceRouteChange(options), { defer: true }));
}
