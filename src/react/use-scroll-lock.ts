import { useEffect } from 'react';
import { lockScroll, unlockScroll } from '../core/scroll-lock.js';

/**
 * React hook that locks body scroll when `active` is true.
 * Automatically unlocks on unmount or when `active` becomes false.
 *
 * @example
 * function Modal({ open }) {
 *   useScrollLock(open);
 *   return open ? <div role="dialog">...</div> : null;
 * }
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    lockScroll();
    return () => unlockScroll();
  }, [active]);
}
