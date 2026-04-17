import type { SkipLinkOptions } from './types.js';

const SKIP_LINK_STYLES = `
  position: absolute;
  top: -9999px;
  left: 8px;
  z-index: 9999;
  padding: 8px 16px;
  background: #000;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 0 0 4px 4px;
  clip-path: inset(100%);
  overflow: hidden;
  white-space: nowrap;
  transition: clip-path 0.1s, top 0.1s;
`.trim();

const SKIP_LINK_FOCUS_STYLES = `
  top: 0;
  clip-path: inset(0%);
  overflow: visible;
  white-space: normal;
`;

/**
 * Injects a skip-navigation link as the first focusable element in the page.
 * The link is visually hidden until focused, then snaps into view.
 * Returns a cleanup function to remove the link.
 *
 * Required for WCAG 2.4.1 (Bypass Blocks) — EAA Annex I.
 *
 * @example
 * // In your app entry point:
 * const cleanup = injectSkipLink({ target: '#main', label: 'Skip to main content' });
 * // On unmount or SPA route destroy:
 * cleanup();
 */
export function injectSkipLink(options: SkipLinkOptions = {}): () => void {
  if (typeof document === 'undefined') return () => undefined;

  const { target = '#main', label = 'Skip to main content' } = options;

  const link = document.createElement('a');
  link.href = target;
  link.textContent = label;
  link.setAttribute('style', SKIP_LINK_STYLES);
  link.setAttribute('data-a11yguard-skip-link', '');

  link.addEventListener('focus', () => {
    link.setAttribute('style', SKIP_LINK_STYLES + SKIP_LINK_FOCUS_STYLES);
  });

  link.addEventListener('blur', () => {
    link.setAttribute('style', SKIP_LINK_STYLES);
  });

  // Smooth scroll to target on click, then focus it
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetEl = document.querySelector<HTMLElement>(target);
    if (targetEl) {
      // Make target programmatically focusable if it isn't already
      if (!targetEl.hasAttribute('tabindex')) {
        targetEl.setAttribute('tabindex', '-1');
        targetEl.addEventListener(
          'blur',
          () => targetEl.removeAttribute('tabindex'),
          { once: true }
        );
      }
      targetEl.focus();
    }
  });

  // Insert as first child of body so it is the first element in tab order
  const firstChild = document.body.firstChild;
  document.body.insertBefore(link, firstChild);

  return (): void => {
    link.remove();
  };
}
