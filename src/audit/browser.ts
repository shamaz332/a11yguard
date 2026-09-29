/**
 * Browser build of the audit, bundled as an IIFE (`dist/browser/audit.global.js`)
 * and injected into pages by the Playwright helper. Exposes `window.__a11yguardAudit`.
 */
import { auditEAA } from './index.js';
import { scopedExclude } from './scope.js';
import type { AuditOptions, SerializedAuditResult } from './types.js';

export interface BrowserAuditOptions extends Omit<AuditOptions, 'root'> {
  /**
   * CSS selector of the element to audit. Default: the whole document.
   * Page-level rules (page-lang, landmarks, document-title) are skipped for an element.
   */
  include?: string;
}

/**
 * Runs the audit in the page and returns a result without DOM references.
 */
export function run(options: BrowserAuditOptions = {}): SerializedAuditResult {
  const { include, ...rest } = options;
  const root = include ? document.querySelector(include) : document;
  if (!root) throw new Error(`[a11yguard] No element matches "${include ?? ''}"`);
  const exclude = scopedExclude(root, rest);
  const result = auditEAA({ ...rest, ...(exclude && { exclude }), root });
  return {
    ...result,
    violations: result.violations.map(({ element: _element, ...v }) => v),
  };
}
