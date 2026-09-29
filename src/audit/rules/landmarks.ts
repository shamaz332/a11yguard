import type { AuditRule, Violation, WCAGLevel } from '../types.js';
import { makeViolation } from '../utils.js';

const WCAG = ['1.3.1'];

export const landmarks: AuditRule = {
  id: 'landmarks',
  wcag: WCAG,
  severity: 'serious',

  check(root: Element | Document, _level: WCAGLevel): Violation[] {
    const hasMain =
      root.querySelector('main') !== null || root.querySelector('[role="main"]') !== null;

    if (hasMain) return [];

    const target = root instanceof Document ? root.documentElement : root;

    return [
      makeViolation(
        'landmarks',
        WCAG,
        'serious',
        target,
        'Page has no <main> landmark',
        'Add a <main> element or role="main" to identify the primary content region.'
      ),
    ];
  },
};
