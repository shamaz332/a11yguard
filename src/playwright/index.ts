import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatReport } from '../audit/report.js';
import type { BrowserAuditOptions } from '../audit/browser.js';
import type { SerializedAuditResult } from '../audit/types.js';

/** The parts of a Playwright `Page` this helper uses. */
export interface PageLike {
  addScriptTag(options: { path: string }): Promise<unknown>;
  evaluate<R, A>(fn: (arg: A) => R, arg: A): Promise<R>;
}

interface AuditGlobal {
  __a11yguardAudit?: { run(options: BrowserAuditOptions): SerializedAuditResult };
}

/** Path of the browser bundle that gets injected into the page. */
export const auditScriptPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'browser',
  'audit.global.js'
);

/**
 * Runs the EAA audit inside a Playwright page and returns the result.
 * The audit script is injected once per page.
 *
 * @example
 * import { checkEAA } from '@shamaz332/a11yguard/playwright';
 *
 * test('checkout is accessible', async ({ page }) => {
 *   await page.goto('/checkout');
 *   const result = await checkEAA(page, { include: 'main' });
 *   expect(result.violations).toEqual([]);
 * });
 */
export async function checkEAA(
  page: PageLike,
  options: BrowserAuditOptions = {}
): Promise<SerializedAuditResult> {
  const loaded = await page.evaluate(
    () => Boolean((globalThis as AuditGlobal).__a11yguardAudit),
    undefined
  );
  if (!loaded) await page.addScriptTag({ path: auditScriptPath });

  return page.evaluate((opts: BrowserAuditOptions) => {
    const audit = (globalThis as AuditGlobal).__a11yguardAudit;
    if (!audit) throw new Error('[a11yguard] audit script failed to load');
    return audit.run(opts);
  }, options);
}

/**
 * Like `checkEAA`, but throws with a readable report when violations are found.
 *
 * @example
 * await page.goto('/');
 * await assertNoEAAViolations(page, { exclude: ['contrast'] });
 */
export async function assertNoEAAViolations(
  page: PageLike,
  options: BrowserAuditOptions = {}
): Promise<SerializedAuditResult> {
  const result = await checkEAA(page, options);
  if (result.violations.length) {
    throw new Error(`Accessibility violations found:\n\n${formatReport(result)}`);
  }
  return result;
}

export { formatReport } from '../audit/report.js';
export type { BrowserAuditOptions } from '../audit/browser.js';
export type { SerializedAuditResult, SerializedViolation } from '../audit/types.js';
