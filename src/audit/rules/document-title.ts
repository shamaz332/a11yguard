import type { AuditRule, Violation, WCAGLevel } from '../types.js';
import { makeViolation } from '../utils.js';

const WCAG = ['2.4.2'];

export const documentTitle: AuditRule = {
  id: 'document-title',
  wcag: WCAG,
  severity: 'serious',

  check(root: Element | Document, _level: WCAGLevel): Violation[] {
    // Only meaningful for whole-page audits
    if (!(root instanceof Document)) return [];
    if (root.title.trim()) return [];
    return [
      makeViolation(
        'document-title',
        WCAG,
        'serious',
        root.documentElement,
        'Page has no <title>',
        'Add a <title> that describes the page, and update it on client-side navigation.'
      ),
    ];
  },
};
