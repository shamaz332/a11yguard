import { useRef, useEffect, type RefObject } from 'react';
import { createKeyboardNav } from '../core/keyboard-nav.js';
import type { KeyboardNavOptions } from '../core/types.js';

/**
 * React hook that attaches keyboard navigation to a container element.
 * Returns a ref to attach to the container.
 *
 * @example
 * function Listbox({ items, onSelect }) {
 *   const ref = useKeyboardNav({
 *     role: 'listbox',
 *     items: '[role="option"]',
 *     onSelect: (el) => onSelect(el.dataset.value),
 *   });
 *   return <div ref={ref} role="listbox">{items.map(...)}</div>;
 * }
 */
export function useKeyboardNav(options: KeyboardNavOptions): RefObject<HTMLElement> {
  const ref = useRef<HTMLElement>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nav = createKeyboardNav(el, optionsRef.current);
    return () => nav.destroy();
  }, [ref.current]); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}
