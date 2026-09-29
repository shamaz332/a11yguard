import type { AuditRule, Violation, WCAGLevel } from '../types.js';
import { makeViolation, queryAll } from '../utils.js';

const WCAG = ['4.1.1'];
const REFERENCE_ATTRS = [
  'for',
  'aria-labelledby',
  'aria-describedby',
  'aria-controls',
  'aria-owns',
  'aria-activedescendant',
  'aria-errormessage',
  'aria-details',
  'aria-flowto',
];

export const duplicateId: AuditRule = {
  id: 'duplicate-id',
  wcag: WCAG,
  severity: 'serious',

  check(root: Element | Document, _level: WCAGLevel): Violation[] {
    const referenced = new Set<string>();
    for (const el of queryAll(root, REFERENCE_ATTRS.map((a) => `[${a}]`).join(','))) {
      for (const attr of REFERENCE_ATTRS) {
        el.getAttribute(attr)
          ?.split(/\s+/)
          .forEach((id) => id && referenced.add(id));
      }
    }

    const seen = new Set<string>();
    const violations: Violation[] = [];
    for (const el of queryAll(root, '[id]')) {
      const id = el.id;
      if (!id) continue;
      if (!seen.has(id)) {
        seen.add(id);
        continue;
      }
      const isReferenced = referenced.has(id);
      violations.push(
        makeViolation(
          'duplicate-id',
          WCAG,
          isReferenced ? 'serious' : 'moderate',
          el,
          `id "${id}" is used more than once${isReferenced ? ' and is referenced by a label or ARIA attribute' : ''}`,
          'Give every element a unique id so labels and ARIA references point to the right element.'
        )
      );
    }
    return violations;
  },
};
