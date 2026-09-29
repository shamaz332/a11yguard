import type { AuditRule, Violation, WCAGLevel } from '../types.js';
import { makeViolation, queryAll } from '../utils.js';

const WCAG = ['2.5.8'];
const MIN_SIZE_PX = 24;

const INTERACTIVE = [
  'a[href]',
  'button:not([disabled])',
  'input[type="checkbox"]',
  'input[type="radio"]',
  'select',
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="menuitem"]',
].join(',');

export const targetSize: AuditRule = {
  id: 'target-size',
  wcag: WCAG,
  severity: 'serious',

  check(root: Element | Document, _level: WCAGLevel): Violation[] {
    if (typeof window === 'undefined') return [];

    const violations: Violation[] = [];

    for (const el of queryAll(root, INTERACTIVE)) {
      const rect = el.getBoundingClientRect();
      // Skip elements with no layout (hidden, or jsdom fallback of 0x0)
      if (rect.width === 0 && rect.height === 0) continue;

      if (rect.width < MIN_SIZE_PX || rect.height < MIN_SIZE_PX) {
        violations.push(
          makeViolation(
            'target-size',
            WCAG,
            'serious',
            el,
            `Touch target is ${rect.width.toFixed(0)}×${rect.height.toFixed(0)}px (minimum ${MIN_SIZE_PX}×${MIN_SIZE_PX}px per WCAG 2.5.8)`,
            `Increase the size of the interactive target to at least ${MIN_SIZE_PX}×${MIN_SIZE_PX} CSS pixels.`
          )
        );
      }
    }

    return violations;
  },
};
