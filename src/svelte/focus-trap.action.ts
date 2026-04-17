import { createFocusTrap } from '../core/focus-trap.js';
import type { FocusTrapOptions, FocusTrap } from '../core/types.js';

export interface FocusTrapActionOptions extends FocusTrapOptions {
  /** Whether the trap is active. Default: true. */
  active?: boolean;
}

/**
 * Svelte action that creates a focus trap on the element.
 * Use with `use:focusTrap={{ active: isOpen }}`.
 *
 * @example
 * <div use:focusTrap={{ active: isOpen }} role="dialog" aria-modal="true">
 *   <button>Close</button>
 * </div>
 */
export function focusTrap(
  node: HTMLElement,
  options: FocusTrapActionOptions = {}
): { update(opts: FocusTrapActionOptions): void; destroy(): void } {
  const { active = true, ...trapOptions } = options;
  let trap: FocusTrap = createFocusTrap(node, trapOptions);

  if (active) trap.activate();

  return {
    update(newOptions: FocusTrapActionOptions): void {
      const { active: newActive = true, ...newTrapOptions } = newOptions;

      // Recreate trap if structural options changed
      trap.destroy();
      trap = createFocusTrap(node, newTrapOptions);
      if (newActive) trap.activate();
    },

    destroy(): void {
      trap.destroy();
    },
  };
}
