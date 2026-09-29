import { announce } from './announce.js';
import { ensureId } from './id.js';
import type { DescribeFieldOptions, FieldDescription } from './types.js';

const MANAGED_ATTRS = [
  'aria-labelledby',
  'aria-describedby',
  'aria-invalid',
  'aria-errormessage',
] as const;

function addToken(el: HTMLElement, attr: string, token: string): void {
  const tokens = (el.getAttribute(attr) ?? '').split(/\s+/).filter(Boolean);
  if (!tokens.includes(token)) tokens.push(token);
  el.setAttribute(attr, tokens.join(' '));
}

function removeToken(el: HTMLElement, attr: string, token: string): void {
  const tokens = (el.getAttribute(attr) ?? '').split(/\s+/).filter((t) => t && t !== token);
  if (tokens.length) el.setAttribute(attr, tokens.join(' '));
  else el.removeAttribute(attr);
}

/**
 * Connects a form control to its label, hint and error message, and keeps
 * `aria-invalid` / `aria-errormessage` in sync with the error state.
 * New errors are announced to screen reader users.
 *
 * Covers WCAG 1.3.1 (Info and Relationships), 3.3.1 (Error Identification)
 * and 3.3.2 (Labels or Instructions).
 *
 * @example
 * const field = describeField(emailInput, { label, hint, error: errorEl });
 * field.setError('Enter a valid email address');
 * field.setError(null); // clears the error
 * field.destroy();
 */
export function describeField(
  input: HTMLElement,
  options: DescribeFieldOptions = {}
): FieldDescription {
  const { label, hint, error, announce: priority = 'polite' } = options;

  const original = new Map<string, string | null>(
    MANAGED_ATTRS.map((attr) => [attr, input.getAttribute(attr)])
  );
  const originalFor = label?.getAttribute('for') ?? null;
  const originalErrorHidden = error?.hidden ?? false;

  if (label) {
    if (label instanceof HTMLLabelElement) label.htmlFor = ensureId(input, 'field');
    else addToken(input, 'aria-labelledby', ensureId(label, 'field-label'));
  }
  if (hint) addToken(input, 'aria-describedby', ensureId(hint, 'field-hint'));

  const errorId = error ? ensureId(error, 'field-error') : null;
  let currentError: string | null = null;

  function setError(message: string | null): void {
    const hasError = Boolean(message);
    if (hasError) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');

    if (error && errorId) {
      error.textContent = message ?? '';
      error.hidden = !hasError;
      if (hasError) {
        input.setAttribute('aria-errormessage', errorId);
        addToken(input, 'aria-describedby', errorId);
      } else {
        input.removeAttribute('aria-errormessage');
        removeToken(input, 'aria-describedby', errorId);
      }
    }

    if (message && message !== currentError && priority) announce(message, priority);
    currentError = message || null;
  }

  if (error) error.hidden = true;

  return {
    setError,
    destroy(): void {
      for (const [attr, value] of original) {
        if (value === null) input.removeAttribute(attr);
        else input.setAttribute(attr, value);
      }
      if (label instanceof HTMLLabelElement) {
        if (originalFor === null) label.removeAttribute('for');
        else label.setAttribute('for', originalFor);
      }
      if (error) error.hidden = originalErrorHidden;
    },
  };
}
