import type { AuditRule, Violation, WCAGLevel } from '../types.js';
import { makeViolation, queryAll } from '../utils.js';

const WCAG = ['1.1.1'];

export const imagesAlt: AuditRule = {
  id: 'images-alt',
  wcag: WCAG,
  severity: 'critical',

  check(root: Element | Document, _level: WCAGLevel): Violation[] {
    const violations: Violation[] = [];

    for (const el of queryAll(root, 'img')) {
      if (!el.hasAttribute('alt')) {
        violations.push(
          makeViolation(
            'images-alt',
            WCAG,
            'critical',
            el,
            '<img> element is missing the alt attribute',
            'Add alt="" for decorative images or a descriptive alt text for meaningful images.'
          )
        );
      }
    }

    for (const el of queryAll(root, '[role="img"]')) {
      const label =
        el.getAttribute('aria-label') ??
        el.getAttribute('aria-labelledby') ??
        el.getAttribute('title');
      if (!label) {
        violations.push(
          makeViolation(
            'images-alt',
            WCAG,
            'serious',
            el,
            'Element with role="img" has no accessible name',
            'Add aria-label, aria-labelledby, or title to provide an accessible name.'
          )
        );
      }
    }

    return violations;
  },
};
