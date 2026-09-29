import { Injectable } from '@angular/core';
import { pushFocus, popFocus, clearFocusStack } from '../core/focus-stack.js';
import { lockScroll, unlockScroll, isScrollLocked } from '../core/scroll-lock.js';
import { createId } from '../core/id.js';

/**
 * Angular service for focus restoration, body scroll locking and id generation.
 *
 * @example
 * openDrawer() {
 *   this.a11y.saveFocus();
 *   this.a11y.lockScroll();
 * }
 * closeDrawer() {
 *   this.a11y.unlockScroll();
 *   this.a11y.restoreFocus();
 * }
 */
@Injectable({ providedIn: 'root' })
export class A11yService {
  /** Save the focused element, e.g. before opening an overlay. */
  saveFocus(): void {
    pushFocus();
  }

  /** Return focus to the last saved element. Returns true on success. */
  restoreFocus(): boolean {
    return popFocus();
  }

  /** Forget all saved elements without moving focus. */
  clearFocus(): void {
    clearFocusStack();
  }

  /** Lock body scroll (reference-counted). */
  lockScroll(): void {
    lockScroll();
  }

  /** Release one scroll lock. */
  unlockScroll(): void {
    unlockScroll();
  }

  get scrollLocked(): boolean {
    return isScrollLocked();
  }

  /** Generate a unique id for ARIA relationships. */
  createId(prefix?: string): string {
    return createId(prefix);
  }
}
