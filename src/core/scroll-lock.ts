/** Reference count — multiple callers can lock; must unlock same number of times. */
let lockCount = 0;
let savedScrollY = 0;
let savedBodyStyles: {
  position: string;
  top: string;
  width: string;
  overflowY: string;
  paddingRight: string;
} | null = null;

/**
 * Locks body scroll. Safe on iOS Safari (uses `position: fixed` + saved offset).
 * Reference-counted — multiple components can call lockScroll() independently.
 * Preserves scrollbar width to prevent layout shift.
 *
 * @example
 * lockScroll();   // e.g. when modal opens
 * // ...
 * unlockScroll(); // when modal closes
 */
export function lockScroll(): void {
  if (typeof document === 'undefined') return;
  lockCount++;
  if (lockCount > 1) return; // already locked

  savedScrollY = window.scrollY;

  // Measure scrollbar width before locking
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  const body = document.body;
  savedBodyStyles = {
    position: body.style.position,
    top: body.style.top,
    width: body.style.width,
    overflowY: body.style.overflowY,
    paddingRight: body.style.paddingRight,
  };

  body.style.position = 'fixed';
  body.style.top = `-${savedScrollY}px`;
  body.style.width = '100%';
  body.style.overflowY = 'scroll'; // keep scrollbar in layout
  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${scrollbarWidth}px`;
  }
}

/**
 * Unlocks body scroll. Decrements the reference count.
 * Scroll position is restored only when count reaches zero.
 *
 * @example
 * unlockScroll(); // when modal closes
 */
export function unlockScroll(): void {
  if (typeof document === 'undefined') return;
  if (lockCount === 0) return;
  lockCount--;
  if (lockCount > 0) return; // still locked by another caller

  const body = document.body;
  if (savedBodyStyles) {
    body.style.position = savedBodyStyles.position;
    body.style.top = savedBodyStyles.top;
    body.style.width = savedBodyStyles.width;
    body.style.overflowY = savedBodyStyles.overflowY;
    body.style.paddingRight = savedBodyStyles.paddingRight;
    savedBodyStyles = null;
  }

  window.scrollTo(0, savedScrollY);
  savedScrollY = 0;
}

/** Returns true if scroll is currently locked (useful for testing). */
export function isScrollLocked(): boolean {
  return lockCount > 0;
}
