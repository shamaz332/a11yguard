import { useEffect, useRef } from 'react';

/**
 * React hook that remembers the focused element when `active` becomes true and
 * restores focus to it when `active` becomes false or the component unmounts.
 * Use it for menus, drawers and popovers that return focus to their trigger.
 *
 * The element is captured during render, so `autoFocus` inside the panel does
 * not overwrite it.
 *
 * @example
 * function Drawer({ open }) {
 *   useFocusRestore(open);
 *   return open ? <aside>...</aside> : null;
 * }
 */
export function useFocusRestore(active: boolean): void {
  const saved = useRef<HTMLElement | null>(null);

  if (!active) {
    saved.current = null;
  } else if (!saved.current && typeof document !== 'undefined') {
    const el = document.activeElement;
    if (el instanceof HTMLElement && el !== document.body) saved.current = el;
  }

  useEffect(() => {
    if (!active) return;
    const el = saved.current;
    return () => {
      if (el?.isConnected) el.focus();
    };
  }, [active]);
}
