import { createEffect, onCleanup, type Accessor } from 'solid-js';
import { createFocusTrap as coreFocusTrap } from '../core/focus-trap.js';
import type { FocusTrapOptions } from '../core/types.js';

export interface SolidFocusTrapOptions extends FocusTrapOptions {
  /** Reactive accessor controlling whether the trap is active. */
  active?: Accessor<boolean>;
}

/**
 * Solid primitive that manages a focus trap on a container element.
 * The element accessor is typically a Solid `ref` signal.
 *
 * @example
 * function Modal(props) {
 *   let ref: HTMLDivElement | undefined;
 *   createFocusTrap(() => ref, { active: () => props.open });
 *   return <div ref={ref} role="dialog" aria-modal="true">{props.children}</div>;
 * }
 */
export function createFocusTrap(
  element: Accessor<HTMLElement | undefined>,
  options: SolidFocusTrapOptions = {}
): void {
  const { active, ...trapOptions } = options;

  createEffect(() => {
    const el = element();
    // Also track active so the effect re-runs when it changes
    const isActive = active ? active() : true;
    if (!el) return;

    const trap = coreFocusTrap(el, trapOptions);
    if (isActive) trap.activate();

    onCleanup(() => trap.destroy());
  });
}
