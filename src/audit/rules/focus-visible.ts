import type { AuditRule, Violation, WCAGLevel } from '../types.js';
import { makeViolation, queryAll } from '../utils.js';

const WCAG = ['2.4.7'];

const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function hasOutlineNone(rule: CSSStyleRule): boolean {
  const style = rule.style;
  const outline = style.getPropertyValue('outline');
  const outlineWidth = style.getPropertyValue('outline-width');
  const outlineStyle = style.getPropertyValue('outline-style');
  return (
    outline === 'none' ||
    outline === '0' ||
    outlineWidth === '0' ||
    outlineWidth === '0px' ||
    outlineStyle === 'none'
  );
}

function collectFocusSuppressions(): Set<string> {
  const selectors = new Set<string>();
  if (typeof document === 'undefined') return selectors;

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList | null = null;
    try {
      rules = sheet.cssRules;
    } catch {
      // cross-origin stylesheet — skip
      continue;
    }
    if (!rules) continue;

    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSStyleRule)) continue;
      const sel = rule.selectorText ?? '';
      if (!sel.includes(':focus')) continue;

      // If this rule removes outline on :focus, track the base selector
      if (hasOutlineNone(rule)) {
        // Check that there's no corresponding :focus-visible rule with outline
        const focusVisibleSel = sel.replace(/:focus(?!-visible)/g, ':focus-visible');
        const hasFocusVisible = Array.from(rules).some(
          (r) =>
            r instanceof CSSStyleRule &&
            r.selectorText === focusVisibleSel &&
            !hasOutlineNone(r),
        );
        if (!hasFocusVisible) {
          // Extract base selector before :focus
          const base = sel.replace(/:focus.*$/, '').trim();
          if (base) selectors.add(base);
        }
      }
    }
  }

  return selectors;
}

export const focusVisible: AuditRule = {
  id: 'focus-visible',
  wcag: WCAG,
  severity: 'serious',

  check(root: Element | Document, _level: WCAGLevel): Violation[] {
    const suppressedSelectors = collectFocusSuppressions();
    if (suppressedSelectors.size === 0) return [];

    const violations: Violation[] = [];

    for (const base of suppressedSelectors) {
      // Match elements in root that fit the base selector
      let matched: Element[] = [];
      try {
        matched = queryAll(root, base || FOCUSABLE);
      } catch {
        matched = queryAll(root, FOCUSABLE);
      }

      for (const el of matched) {
        violations.push(
          makeViolation(
            'focus-visible',
            WCAG,
            'serious',
            el,
            'Focus indicator removed without :focus-visible alternative',
            'Replace :focus { outline: none } with a :focus-visible rule that provides a visible focus indicator.',
          ),
        );
      }
    }

    return violations;
  },
};
