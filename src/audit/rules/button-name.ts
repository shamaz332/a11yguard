import type { AuditRule, Violation, WCAGLevel } from '../types.js';
import { makeViolation, queryAll, getTextContent } from '../utils.js';

const WCAG = ['4.1.2'];

function hasAccessibleName(el: Element): boolean {
  if (el.getAttribute('aria-label')?.trim()) return true;
  if (el.getAttribute('aria-labelledby')?.trim()) return true;
  if (el.getAttribute('title')?.trim()) return true;
  if (el.getAttribute('value')?.trim()) return true;

  // Check for an img with alt inside the button
  const img = el.querySelector('img[alt]');
  if (img && img.getAttribute('alt')) return true;

  // Check for aria-hidden child vs visible text
  const text = getTextContent(el);
  if (text) return true;

  return false;
}

export const buttonName: AuditRule = {
  id: 'button-name',
  wcag: WCAG,
  severity: 'critical',

  check(root: Element | Document, _level: WCAGLevel): Violation[] {
    const violations: Violation[] = [];

    for (const el of queryAll(root, 'button, [role="button"]')) {
      if (!hasAccessibleName(el)) {
        violations.push(
          makeViolation(
            'button-name',
            WCAG,
            'critical',
            el,
            'Button has no accessible name',
            'Add visible text content, aria-label, or aria-labelledby to the button.',
          ),
        );
      }
    }

    return violations;
  },
};
