import type { AuditRule, Violation, WCAGLevel } from '../types.js';
import { makeViolation, queryAll } from '../utils.js';

const WCAG = ['4.1.2'];

export const frameTitle: AuditRule = {
  id: 'frame-title',
  wcag: WCAG,
  severity: 'serious',

  check(root: Element | Document, _level: WCAGLevel): Violation[] {
    const violations: Violation[] = [];
    for (const el of queryAll(root, 'iframe, frame')) {
      if (el.getAttribute('aria-hidden') === 'true') continue;
      const named = ['title', 'aria-label', 'aria-labelledby'].some((a) =>
        el.getAttribute(a)?.trim()
      );
      if (named) continue;
      violations.push(
        makeViolation(
          'frame-title',
          WCAG,
          'serious',
          el,
          '<iframe> has no accessible name',
          'Add a title attribute describing the frame content, e.g. title="Payment form".'
        )
      );
    }
    return violations;
  },
};
