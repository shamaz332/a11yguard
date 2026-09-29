import { lockScroll, unlockScroll } from '../core/scroll-lock.js';
import { pushFocus, popFocus } from '../core/focus-stack.js';
import { injectSkipLink } from '../core/skip-link.js';
import { ensureId } from '../core/id.js';

/**
 * Svelte action that locks body scroll while the element is mounted and `active` is true.
 *
 * @example
 * {#if open}<div use:scrollLock role="dialog">...</div>{/if}
 */
export function scrollLock(
  _node: HTMLElement,
  active = true
): { update(active: boolean): void; destroy(): void } {
  let locked = false;
  function set(next: boolean): void {
    if (next && !locked) lockScroll();
    else if (!next && locked) unlockScroll();
    locked = next;
  }
  set(active);
  return { update: set, destroy: () => set(false) };
}

/**
 * Svelte action that saves the focused element when the element mounts and
 * restores focus to it when the element is removed.
 *
 * @example
 * {#if menuOpen}<ul use:focusRestore role="menu">...</ul>{/if}
 */
export function focusRestore(_node: HTMLElement): { destroy(): void } {
  pushFocus();
  return {
    destroy(): void {
      popFocus();
    },
  };
}

/**
 * Svelte action for the main content element. Injects a skip link that targets it.
 * Pass a custom label if needed.
 *
 * @example
 * <main use:skipLink>...</main>
 * <main use:skipLink={'Skip to content'}>...</main>
 */
export function skipLink(node: HTMLElement, label?: string): { destroy(): void } {
  const target = `#${ensureId(node, 'main')}`;
  const cleanup = injectSkipLink(label ? { target, label } : { target });
  return { destroy: cleanup };
}
