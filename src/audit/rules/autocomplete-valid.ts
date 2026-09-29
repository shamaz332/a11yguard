import type { AuditRule, Violation, WCAGLevel } from '../types.js';
import { makeViolation, queryAll } from '../utils.js';
import { AUTOCOMPLETE_FIELDS } from '../aria-data.js';

const WCAG = ['1.3.5'];
const ADDRESS_TYPES = new Set(['shipping', 'billing']);
const CONTACT_TYPES = new Set(['home', 'work', 'mobile', 'fax', 'pager']);

function isValidAutocomplete(value: string): boolean {
  const tokens = value.trim().toLowerCase().split(/\s+/);
  if (tokens.length === 1 && (tokens[0] === 'on' || tokens[0] === 'off')) return true;
  if (tokens[tokens.length - 1] === 'webauthn') tokens.pop();

  const field = tokens.pop();
  if (!field || !AUTOCOMPLETE_FIELDS.has(field)) return false;

  // home/work/mobile/fax/pager only apply to phone, email and messaging fields
  const isContactField = field.startsWith('tel') || field === 'email' || field === 'impp';
  return tokens.every(
    (t) =>
      t.startsWith('section-') || ADDRESS_TYPES.has(t) || (CONTACT_TYPES.has(t) && isContactField)
  );
}

export const autocompleteValid: AuditRule = {
  id: 'autocomplete-valid',
  wcag: WCAG,
  severity: 'serious',

  check(root: Element | Document, level: WCAGLevel): Violation[] {
    // 1.3.5 Identify Input Purpose is a level AA criterion
    if (level === 'A') return [];

    const violations: Violation[] = [];
    for (const el of queryAll(
      root,
      'input[autocomplete], select[autocomplete], textarea[autocomplete]'
    )) {
      const value = el.getAttribute('autocomplete') ?? '';
      if (!value.trim() || isValidAutocomplete(value)) continue;
      violations.push(
        makeViolation(
          'autocomplete-valid',
          WCAG,
          'serious',
          el,
          `autocomplete="${value}" is not a valid autofill value`,
          'Use a standard token such as "email", "given-name", "tel" or "street-address" so browsers and assistive tech can fill the field.'
        )
      );
    }
    return violations;
  },
};
