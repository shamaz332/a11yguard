import type { AuditRule, Violation, WCAGLevel } from '../types.js';
import { makeViolation } from '../utils.js';

const WCAG = ['3.1.1'];

export const pageLang: AuditRule = {
  id: 'page-lang',
  wcag: WCAG,
  severity: 'serious',

  check(root: Element | Document, _level: WCAGLevel): Violation[] {
    const doc = root instanceof Document ? root : root.ownerDocument;
    if (!doc) return [];

    const html = doc.documentElement;
    const lang = html.getAttribute('lang');

    if (!lang || !lang.trim()) {
      return [
        makeViolation(
          'page-lang',
          WCAG,
          'serious',
          html,
          '<html> element is missing a valid lang attribute',
          'Add lang="en" (or the appropriate BCP 47 language tag) to the <html> element.'
        ),
      ];
    }

    return [];
  },
};
