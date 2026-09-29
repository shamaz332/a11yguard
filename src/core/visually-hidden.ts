/**
 * Styles that hide content visually while keeping it available to screen readers.
 * Keys are camelCase, so the object works as a React `style` prop or with `Object.assign(el.style, …)`.
 *
 * @example
 * <button><Icon /><span style={visuallyHidden}>Close dialog</span></button>
 */
export const visuallyHidden = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: '0',
} as const;

/**
 * The same rules as a CSS declaration block, for stylesheets or a utility class.
 *
 * @example
 * const style = document.createElement('style');
 * style.textContent = `.sr-only { ${visuallyHiddenCss} }`;
 */
export const visuallyHiddenCss =
  'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';

/**
 * Applies the visually-hidden styles to an element.
 *
 * @example
 * applyVisuallyHidden(document.querySelector('#status')!);
 */
export function applyVisuallyHidden(el: HTMLElement): void {
  Object.assign(el.style, visuallyHidden);
}
