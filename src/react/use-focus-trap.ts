import { useRef, useEffect, type RefObject } from 'react';
import { createFocusTrap } from '../core/focus-trap.js';
import type { FocusTrapOptions, FocusTrap } from '../core/types.js';

export interface UseFocusTrapOptions extends FocusTrapOptions {
  /** Whether the trap is currently active. Default: true once the ref is attached. */
  active?: boolean;
}

/**
 * React hook that creates a focus trap on a container element.
 * Returns a ref to attach to the container.
 *
 * @example
 * function Modal({ open, onClose }) {
 *   const ref = useFocusTrap({ active: open, onDeactivate: onClose });
 *   return open ? <div ref={ref} role="dialog" aria-modal="true">...</div> : null;
 * }
 */
export function useFocusTrap(options: UseFocusTrapOptions = {}): RefObject<HTMLElement> {
  const ref = useRef<HTMLElement>(null);
  const trapRef = useRef<FocusTrap | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { active = true, ...trapOptions } = optionsRef.current;

    trapRef.current = createFocusTrap(el, trapOptions);

    if (active) {
      trapRef.current.activate();
    }

    return () => {
      trapRef.current?.destroy();
      trapRef.current = null;
    };
  }, [ref.current]); // eslint-disable-line react-hooks/exhaustive-deps

  // React to active prop changes after mount
  useEffect(() => {
    const trap = trapRef.current;
    if (!trap) return;
    const { active = true } = optionsRef.current;
    if (active && !trap.active) {
      trap.activate();
    } else if (!active && trap.active) {
      trap.deactivate();
    }
  }, [options.active]);

  return ref;
}
