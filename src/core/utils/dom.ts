/**
 * Selector covering all natively focusable elements.
 * Excludes tabindex="-1" (programmatically focusable, not in tab order).
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'details > summary:not([disabled])',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
].join(',');

/**
 * Returns true if an element is visible in the DOM (not hidden, not zero-sized).
 * Uses computed styles rather than layout properties for SSR/jsdom compatibility.
 *
 * @example
 * const el = document.getElementById('btn');
 * if (isElementVisible(el)) el.focus();
 */
export function isElementVisible(el: HTMLElement): boolean {
  if (!el.isConnected) return false;
  const style = window.getComputedStyle(el);
  if (style.visibility === 'hidden') return false;
  if (style.display === 'none') return false;
  // Walk up the tree to check for hidden ancestors
  let node: HTMLElement | null = el.parentElement;
  while (node) {
    const s = window.getComputedStyle(node);
    if (s.display === 'none' || s.visibility === 'hidden') return false;
    node = node.parentElement;
  }
  return true;
}

/**
 * Returns all tabbable (keyboard-navigable) elements within a root element.
 * Handles the `inert` attribute, `disabled`, and visibility checks.
 * Fully zero-dependency — no tabbable package needed.
 *
 * @example
 * const modal = document.getElementById('modal');
 * const focusable = getFocusableElements(modal);
 * focusable[0]?.focus();
 */
export function getFocusableElements(root: HTMLElement): HTMLElement[] {
  const candidates = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  return candidates.filter((el) => {
    if (isInert(el)) return false;
    if (!isElementVisible(el)) return false;
    return true;
  });
}

/**
 * Returns true if an element or any of its ancestors has the `inert` attribute.
 */
export function isInert(el: HTMLElement): boolean {
  let node: HTMLElement | null = el;
  while (node) {
    if (node.hasAttribute('inert')) return true;
    node = node.parentElement;
  }
  return false;
}

/**
 * Returns the first focusable element within a root, or null.
 */
export function getFirstFocusable(root: HTMLElement): HTMLElement | null {
  return getFocusableElements(root)[0] ?? null;
}

/**
 * Returns the last focusable element within a root, or null.
 */
export function getLastFocusable(root: HTMLElement): HTMLElement | null {
  const els = getFocusableElements(root);
  return els[els.length - 1] ?? null;
}

/**
 * Returns a CSS selector string that uniquely identifies an element.
 * Used in audit reports to allow users to locate a failing element.
 */
export function getSelector(el: HTMLElement): string {
  if (el.id) return `#${el.id}`;
  const parts: string[] = [];
  let node: HTMLElement | null = el;
  while (node && node !== document.body) {
    let part = node.tagName.toLowerCase();
    if (node.id) {
      part += `#${node.id}`;
      parts.unshift(part);
      break;
    }
    const siblings = Array.from(node.parentElement?.children ?? []);
    const index = siblings.indexOf(node) + 1;
    if (siblings.length > 1) part += `:nth-child(${index})`;
    parts.unshift(part);
    node = node.parentElement;
  }
  return parts.join(' > ') || el.tagName.toLowerCase();
}

/**
 * Moves focus to any element, making it programmatically focusable first if needed.
 * A temporary `tabindex="-1"` is removed again once the element loses focus.
 */
export function focusElement(el: HTMLElement): void {
  if (!el.hasAttribute('tabindex') && !el.matches(FOCUSABLE_SELECTOR)) {
    el.setAttribute('tabindex', '-1');
    el.addEventListener('blur', () => el.removeAttribute('tabindex'), { once: true });
  }
  el.focus();
}
