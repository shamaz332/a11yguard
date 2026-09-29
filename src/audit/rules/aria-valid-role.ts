import type { AuditRule, Violation, WCAGLevel } from '../types.js';
import { makeViolation, queryAll } from '../utils.js';
import { ARIA_ROLES } from '../aria-data.js';

const WCAG = ['4.1.2'];

function isValidRole(token: string): boolean {
  // DPUB-ARIA and Graphics-ARIA roles are valid module extensions
  return ARIA_ROLES.has(token) || token.startsWith('doc-') || token.startsWith('graphics-');
}

export const ariaValidRole: AuditRule = {
  id: 'aria-valid-role',
  wcag: WCAG,
  severity: 'serious',

  check(root: Element | Document, _level: WCAGLevel): Violation[] {
    const violations: Violation[] = [];
    for (const el of queryAll(root, '[role]')) {
      const tokens = (el.getAttribute('role') ?? '').trim().toLowerCase().split(/\s+/);
      // A role list is a fallback chain: valid if any token is a concrete role
      if (tokens.some(isValidRole)) continue;
      violations.push(
        makeViolation(
          'aria-valid-role',
          WCAG,
          'serious',
          el,
          `role="${el.getAttribute('role') ?? ''}" is not a valid ARIA role`,
          'Use a concrete WAI-ARIA role (e.g. button, dialog, navigation) or remove the attribute.'
        )
      );
    }
    return violations;
  },
};
