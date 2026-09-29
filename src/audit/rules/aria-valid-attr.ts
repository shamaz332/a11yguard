import type { AuditRule, Violation, WCAGLevel } from '../types.js';
import { makeViolation, queryAll } from '../utils.js';
import { ARIA_ATTRS } from '../aria-data.js';

const WCAG = ['4.1.2'];

export const ariaValidAttr: AuditRule = {
  id: 'aria-valid-attr',
  wcag: WCAG,
  severity: 'critical',

  check(root: Element | Document, _level: WCAGLevel): Violation[] {
    const violations: Violation[] = [];
    for (const el of queryAll(root, '*')) {
      for (const { name } of Array.from(el.attributes)) {
        if (!name.startsWith('aria-') || ARIA_ATTRS.has(name.slice(5))) continue;
        violations.push(
          makeViolation(
            'aria-valid-attr',
            WCAG,
            'critical',
            el,
            `Unknown ARIA attribute "${name}"`,
            'Check the spelling against the WAI-ARIA specification, e.g. aria-labelledby, not aria-labeledby.'
          )
        );
      }
    }
    return violations;
  },
};
