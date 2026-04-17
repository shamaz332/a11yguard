import type { AuditRule, Violation, WCAGLevel } from '../types.js';
import { makeViolation, queryAll } from '../utils.js';

const WCAG = ['1.3.1', '3.3.2', '4.1.2'];
const LABELED_TYPES = new Set([
  'text', 'password', 'email', 'search', 'url', 'tel',
  'number', 'date', 'time', 'datetime-local', 'month', 'week',
  'color', 'range', 'file', 'checkbox', 'radio',
]);

function isLabelable(el: Element): boolean {
  const tag = el.tagName.toLowerCase();
  if (tag === 'textarea' || tag === 'select') return true;
  if (tag === 'input') {
    const type = (el.getAttribute('type') ?? 'text').toLowerCase();
    return LABELED_TYPES.has(type) && type !== 'hidden';
  }
  return false;
}

function getDoc(root: Element | Document): Document {
  if (root instanceof Document) return root;
  return root.ownerDocument ?? document;
}

function hasAccessibleLabel(el: Element, root: Element | Document): boolean {
  if (el.getAttribute('aria-label')?.trim()) return true;

  const labelledBy = el.getAttribute('aria-labelledby');
  if (labelledBy) {
    const doc = getDoc(root);
    return labelledBy
      .trim()
      .split(/\s+/)
      .some((id) => doc.getElementById(id) !== null);
  }

  if (el.getAttribute('title')?.trim()) return true;
  if (el.getAttribute('placeholder')?.trim()) return true;

  const id = el.getAttribute('id');
  if (id) {
    const doc = getDoc(root);
    // Iterate label[for] elements and compare attribute value directly
    // (avoids CSS.escape which may not be available in all environments)
    const hasLabel = Array.from(doc.querySelectorAll('label[for]')).some(
      (l) => l.getAttribute('for') === id,
    );
    if (hasLabel) return true;
  }

  // Check if wrapped in <label>
  let ancestor = el.parentElement;
  while (ancestor) {
    if (ancestor.tagName.toLowerCase() === 'label') return true;
    ancestor = ancestor.parentElement;
  }

  return false;
}

export const formLabels: AuditRule = {
  id: 'form-labels',
  wcag: WCAG,
  severity: 'critical',

  check(root: Element | Document, _level: WCAGLevel): Violation[] {
    const violations: Violation[] = [];

    for (const el of queryAll(root, 'input, textarea, select')) {
      if (!isLabelable(el)) continue;
      if (!hasAccessibleLabel(el, root)) {
        violations.push(
          makeViolation(
            'form-labels',
            WCAG,
            'critical',
            el,
            `Form ${el.tagName.toLowerCase()} is missing an accessible label`,
            'Associate a <label> element, or add aria-label / aria-labelledby.',
          ),
        );
      }
    }

    return violations;
  },
};
