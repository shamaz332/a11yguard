import { createEffect, onCleanup, type Accessor } from 'solid-js';
import { createKeyboardNav as coreKeyboardNav } from '../core/keyboard-nav.js';
import type { KeyboardNavOptions } from '../core/types.js';

/**
 * Solid primitive that attaches keyboard navigation to a container element.
 *
 * @example
 * function Menu() {
 *   let ref: HTMLDivElement | undefined;
 *   createKeyboardNav(() => ref, {
 *     role: 'menu',
 *     items: '[role="menuitem"]',
 *     onSelect: (el) => el.click(),
 *   });
 *   return <div ref={ref} role="menu">...</div>;
 * }
 */
export function createKeyboardNav(
  element: Accessor<HTMLElement | undefined>,
  options: KeyboardNavOptions
): void {
  createEffect(() => {
    const el = element();
    if (!el) return;

    const nav = coreKeyboardNav(el, options);
    onCleanup(() => nav.destroy());
  });
}
