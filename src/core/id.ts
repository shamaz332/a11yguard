let counter = 0;

/**
 * Returns a unique DOM id, for wiring `aria-labelledby`, `aria-describedby`,
 * `aria-controls` and similar attributes.
 *
 * Ids are sequential, so ids generated during server rendering will not match the
 * client. In React 18+ or Vue 3.5+ use the adapter's `useA11yId()` for SSR.
 *
 * @example
 * const id = createId('tooltip'); // 'tooltip-1'
 * tooltip.id = id;
 * button.setAttribute('aria-describedby', id);
 */
export function createId(prefix = 'a11yguard'): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

/**
 * Returns the element's id, assigning a generated one first if it has none.
 *
 * @example
 * input.setAttribute('aria-describedby', ensureId(hint));
 */
export function ensureId(el: HTMLElement, prefix?: string): string {
  if (!el.id) el.id = createId(prefix);
  return el.id;
}
