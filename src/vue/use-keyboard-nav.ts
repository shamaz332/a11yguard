import { ref, watch, onUnmounted, type Ref } from 'vue';
import { createKeyboardNav } from '../core/keyboard-nav.js';
import type { KeyboardNavOptions, KeyboardNav } from '../core/types.js';

/**
 * Vue composable that attaches keyboard navigation to a container element.
 * Returns a template ref to bind with `ref="containerRef"`.
 *
 * @example
 * const containerRef = useKeyboardNav({
 *   role: 'listbox',
 *   items: '[role="option"]',
 *   onSelect: (el) => selectValue(el.dataset.value),
 * });
 */
export function useKeyboardNav(options: KeyboardNavOptions): Ref<HTMLElement | null> {
  const containerRef = ref<HTMLElement | null>(null);
  let nav: KeyboardNav | null = null;

  watch(containerRef, (el, prevEl) => {
    if (prevEl) {
      nav?.destroy();
      nav = null;
    }
    if (el) nav = createKeyboardNav(el, options);
  });

  onUnmounted(() => {
    nav?.destroy();
    nav = null;
  });

  return containerRef;
}
