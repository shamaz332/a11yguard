import { auditEAA } from '../audit/index.js';
import { formatReport } from '../audit/report.js';
import { scopedExclude } from '../audit/scope.js';
import type { AuditOptions } from '../audit/types.js';

export interface MatcherResult {
  pass: boolean;
  message: () => string;
}

/**
 * Matcher for Vitest and Jest: asserts that an element or document has no
 * accessibility violations. When given an element, page-level rules
 * (`page-lang`, `landmarks`, `document-title`) are skipped unless `rules` is set.
 *
 * @example
 * // vitest.setup.ts
 * import { expect } from 'vitest';
 * import { eaaMatchers } from '@shamaz332/a11yguard/testing';
 * expect.extend(eaaMatchers);
 *
 * // component.test.ts
 * expect(container).toHaveNoEAAViolations();
 * expect(container).toHaveNoEAAViolations({ exclude: ['contrast'] });
 */
export function toHaveNoEAAViolations(
  received: Element | Document,
  options: Omit<AuditOptions, 'root'> = {}
): MatcherResult {
  const exclude = scopedExclude(received, options);
  const result = auditEAA({ ...options, ...(exclude && { exclude }), root: received });
  const pass = result.violations.length === 0;
  return {
    pass,
    message: () =>
      pass
        ? 'Expected accessibility violations, but none were found'
        : `Expected no accessibility violations:\n\n${formatReport(result)}`,
  };
}

/** Pass to `expect.extend()` in Vitest or Jest. */
export const eaaMatchers = { toHaveNoEAAViolations };

/**
 * Type for the matcher, to merge into your test runner's `Assertion` / `Matchers` interface.
 *
 * @example
 * // vitest.d.ts
 * import type { EAAMatchers } from '@shamaz332/a11yguard/testing';
 * declare module 'vitest' {
 *   interface Assertion<T = any> extends EAAMatchers<T> {}
 * }
 */
export interface EAAMatchers<R = unknown> {
  toHaveNoEAAViolations(options?: Omit<AuditOptions, 'root'>): R;
}

export { formatReport } from '../audit/report.js';
export type { AuditOptions } from '../audit/types.js';
