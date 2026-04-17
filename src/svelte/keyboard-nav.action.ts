import { createKeyboardNav } from '../core/keyboard-nav.js';
import type { KeyboardNavOptions, KeyboardNav } from '../core/types.js';

/**
 * Svelte action for keyboard navigation on composite widgets.
 *
 * @example
 * <ul use:keyboardNav={{ role: 'menu', items: '[role="menuitem"]' }}>
 *   <li role="menuitem" tabindex="0">Item 1</li>
 * </ul>
 */
export function keyboardNav(
  node: HTMLElement,
  options: KeyboardNavOptions
): { update(opts: KeyboardNavOptions): void; destroy(): void } {
  let nav: KeyboardNav = createKeyboardNav(node, options);

  return {
    update(newOptions: KeyboardNavOptions): void {
      nav.destroy();
      nav = createKeyboardNav(node, newOptions);
    },
    destroy(): void {
      nav.destroy();
    },
  };
}
