import type { AuditRule, Violation, WCAGLevel } from '../types.js';
import { makeViolation, queryAll, getTextContent } from '../utils.js';

const WCAG = ['2.4.4'];

const AMBIGUOUS = new Set([
  'click here', 'here', 'read more', 'more', 'learn more',
  'more info', 'more information', 'details', 'link', 'this link',
  'click', 'go', 'continue', 'info',
]);

export const linkPurpose: AuditRule = {
  id: 'link-purpose',
  wcag: WCAG,
  severity: 'moderate',

  check(root: Element | Document, _level: WCAGLevel): Violation[] {
    const violations: Violation[] = [];

    for (const el of queryAll(root, 'a[href]')) {
      const ariaLabel = el.getAttribute('aria-label')?.trim();
      const ariaLabelledby = el.getAttribute('aria-labelledby');
      if (ariaLabel || ariaLabelledby) continue;

      const text = getTextContent(el).toLowerCase();
      if (!text) continue;

      if (AMBIGUOUS.has(text)) {
        violations.push(
          makeViolation(
            'link-purpose',
            WCAG,
            'moderate',
            el,
            `Link text "${getTextContent(el)}" is ambiguous out of context`,
            'Use descriptive link text that explains the destination, or add aria-label with a more specific description.',
          ),
        );
      }
    }

    return violations;
  },
};
