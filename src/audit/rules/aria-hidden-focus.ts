import type { AuditRule, Violation, WCAGLevel } from '../types.js';
import { makeViolation, queryAll } from '../utils.js';
import { FOCUSABLE } from '../aria-data.js';

const WCAG = ['4.1.2'];

function isTabbable(el: Element): boolean {
  if (!el.matches(FOCUSABLE)) return false;
  if (el.getAttribute('tabindex') === '-1') return false;
  if (el.closest('[inert]')) return false;
  return true;
}

export const ariaHiddenFocus: AuditRule = {
  id: 'aria-hidden-focus',
  wcag: WCAG,
  severity: 'serious',

  check(root: Element | Document, _level: WCAGLevel): Violation[] {
    const violations: Violation[] = [];
    for (const hidden of queryAll(root, '[aria-hidden="true"]')) {
      const candidates = [hidden, ...Array.from(hidden.querySelectorAll(FOCUSABLE))];
      for (const el of candidates) {
        if (!isTabbable(el)) continue;
        violations.push(
          makeViolation(
            'aria-hidden-focus',
            WCAG,
            'serious',
            el,
            'Focusable element is hidden from assistive technology with aria-hidden="true"',
            'Remove aria-hidden, add tabindex="-1", or use the inert attribute so keyboard users cannot reach content screen readers cannot see.'
          )
        );
      }
    }
    return violations;
  },
};
