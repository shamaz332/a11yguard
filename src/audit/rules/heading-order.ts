import type { AuditRule, Violation, WCAGLevel } from '../types.js';
import { makeViolation, queryAll } from '../utils.js';

const WCAG = ['1.3.1'];

export const headingOrder: AuditRule = {
  id: 'heading-order',
  wcag: WCAG,
  severity: 'moderate',

  check(root: Element | Document, _level: WCAGLevel): Violation[] {
    const violations: Violation[] = [];
    const headings = queryAll(root, 'h1,h2,h3,h4,h5,h6');

    let prevLevel = 0;
    for (const el of headings) {
      const level = parseInt(el.tagName[1]!, 10);
      if (prevLevel > 0 && level > prevLevel + 1) {
        violations.push(
          makeViolation(
            'heading-order',
            WCAG,
            'moderate',
            el,
            `Heading level skipped: h${prevLevel} → h${level}`,
            `Do not skip heading levels. After h${prevLevel}, use h${prevLevel + 1}.`,
          ),
        );
      }
      prevLevel = level;
    }

    return violations;
  },
};
