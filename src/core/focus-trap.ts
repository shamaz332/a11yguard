import type { FocusTrap, FocusTrapOptions } from './types.js';
import { getFocusableElements } from './utils/dom.js';

/** Module-level stack to support nested focus traps. */
const trapStack: FocusTrapInstance[] = [];

interface FocusTrapInstance extends FocusTrap {
  _container: HTMLElement;
  _paused: boolean;
}

/**
 * Creates a focus trap that confines keyboard focus to a container element.
 * Implements WCAG 2.4.3 (Focus Order) and supports EAA dialog patterns.
 *
 * Features:
 * - Nested trap support via a module-level stack
 * - `inert`-based sibling isolation (with aria-hidden fallback)
 * - Shadow DOM support via composedPath()
 * - Escape key deactivation
 * - Click-outside deactivation
 *
 * @example
 * const modal = document.getElementById('modal');
 * const trap = createFocusTrap(modal, { escapeDeactivates: true });
 * trap.activate();
 * // later:
 * trap.deactivate();
 * trap.destroy();
 */
export function createFocusTrap(container: HTMLElement, options: FocusTrapOptions = {}): FocusTrap {
  const {
    escapeDeactivates = true,
    clickOutsideDeactivates = false,
    isolate = true,
    onDeactivate,
    onActivate,
  } = options;

  let previouslyFocused: HTMLElement | null = null;
  let paused = false;
  let active = false;
  let inertedElements: HTMLElement[] = [];

  function getInitialFocus(): HTMLElement | null {
    if (options.initialFocus === false) return null;
    if (typeof options.initialFocus === 'function') return options.initialFocus();
    if (options.initialFocus instanceof HTMLElement) return options.initialFocus;
    return getFocusableElements(container)[0] ?? null;
  }

  function getReturnFocus(): HTMLElement | null {
    if (typeof options.returnFocusTo === 'function') return options.returnFocusTo();
    if (options.returnFocusTo instanceof HTMLElement) return options.returnFocusTo;
    return previouslyFocused;
  }

  function applyIsolation(): void {
    if (!isolate) return;
    const siblings = Array.from(document.body.children) as HTMLElement[];
    inertedElements = siblings.filter((el) => el !== container && !el.contains(container));
    for (const el of inertedElements) {
      el.inert = true;
    }
  }

  function removeIsolation(): void {
    for (const el of inertedElements) {
      el.inert = false;
    }
    inertedElements = [];
  }

  function handleKeyDown(e: KeyboardEvent): void {
    if (paused) return;

    if (e.key === 'Escape' && escapeDeactivates) {
      e.preventDefault();
      instance.deactivate();
      return;
    }

    if (e.key !== 'Tab') return;

    const focusable = getFocusableElements(container);
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;

    // Determine focused element through shadow DOM
    const target = (e.composedPath()[0] as HTMLElement | undefined) ?? (e.target as HTMLElement);

    if (e.shiftKey) {
      if (target === first || !container.contains(target)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (target === last || !container.contains(target)) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function handlePointerDown(e: MouseEvent): void {
    if (paused || !clickOutsideDeactivates) return;
    const target = (e.composedPath()[0] as Element | undefined) ?? (e.target as Element);
    if (!container.contains(target)) {
      instance.deactivate();
    }
  }

  const instance: FocusTrapInstance = {
    _container: container,
    _paused: false,

    activate(): void {
      if (active) return;

      // Pause any currently active trap
      const currentTrap = trapStack[trapStack.length - 1];
      currentTrap?.pause();

      previouslyFocused = document.activeElement as HTMLElement | null;
      active = true;
      paused = false;
      trapStack.push(instance);

      applyIsolation();

      document.addEventListener('keydown', handleKeyDown, true);
      document.addEventListener('mousedown', handlePointerDown, true);

      const initial = getInitialFocus();
      if (initial) {
        // Defer focus to allow the DOM to settle (e.g. after CSS transitions)
        requestAnimationFrame(() => initial.focus());
      }

      onActivate?.();
    },

    deactivate(): void {
      if (!active) return;
      const result = onDeactivate?.();
      if (result === false) return;

      active = false;
      removeIsolation();
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('mousedown', handlePointerDown, true);

      const idx = trapStack.indexOf(instance);
      if (idx !== -1) trapStack.splice(idx, 1);

      // Restore focus
      const returnTo = getReturnFocus();
      if (returnTo && typeof returnTo.focus === 'function') {
        requestAnimationFrame(() => returnTo.focus());
      }

      // Unpause the trap below us in the stack
      const prevTrap = trapStack[trapStack.length - 1];
      prevTrap?.unpause();
    },

    pause(): void {
      paused = true;
      instance._paused = true;
    },

    unpause(): void {
      paused = false;
      instance._paused = false;
    },

    get active(): boolean {
      return active && !paused;
    },

    destroy(): void {
      if (active) instance.deactivate();
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('mousedown', handlePointerDown, true);
    },
  };

  return instance;
}
