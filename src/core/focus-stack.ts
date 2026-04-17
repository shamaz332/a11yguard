/** Module-level stack storing previously focused elements for later restoration. */
const stack: HTMLElement[] = [];

/**
 * Saves the currently focused element to the focus stack.
 * Call this before opening a modal, drawer, or any overlay.
 *
 * @example
 * pushFocus();         // saves document.activeElement
 * modal.hidden = false;
 * firstInput.focus();
 */
export function pushFocus(): void {
  const el = document.activeElement;
  if (el && el instanceof HTMLElement) {
    stack.push(el);
  }
}

/**
 * Restores focus to the last saved element and removes it from the stack.
 * Returns true if focus was successfully restored, false otherwise.
 *
 * @example
 * modal.hidden = true;
 * const restored = popFocus(); // true if focus returned to trigger button
 */
export function popFocus(): boolean {
  const el = stack.pop();
  if (!el) return false;
  try {
    el.focus();
    return document.activeElement === el;
  } catch {
    return false;
  }
}

/**
 * Clears the entire focus stack without restoring focus.
 * Use on full route changes or when the previous context is no longer valid.
 *
 * @example
 * router.on('navigate', clearFocusStack);
 */
export function clearFocusStack(): void {
  stack.length = 0;
}

/** Returns the current stack depth (mainly useful for testing). */
export function focusStackDepth(): number {
  return stack.length;
}
