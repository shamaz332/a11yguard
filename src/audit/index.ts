import type { AuditOptions, AuditResult, AuditRule, WCAGLevel } from './types.js';
import { imagesAlt } from './rules/images-alt.js';
import { formLabels } from './rules/form-labels.js';
import { headingOrder } from './rules/heading-order.js';
import { landmarks } from './rules/landmarks.js';
import { pageLang } from './rules/page-lang.js';
import { contrast } from './rules/contrast.js';
import { focusVisible } from './rules/focus-visible.js';
import { linkPurpose } from './rules/link-purpose.js';
import { buttonName } from './rules/button-name.js';
import { targetSize } from './rules/target-size.js';

export type { AuditOptions, AuditResult, WCAGLevel } from './types.js';
export type { Violation, Severity, AuditRule } from './types.js';
export { eaaMap, getEAAArticles } from './eaa-map.js';

const ALL_RULES: AuditRule[] = [
  imagesAlt,
  formLabels,
  headingOrder,
  landmarks,
  pageLang,
  contrast,
  focusVisible,
  linkPurpose,
  buttonName,
  targetSize,
];

/**
 * Runs a WCAG 2.1/2.2 accessibility audit on the provided root element.
 * Maps all violations to their corresponding EN 301 549 / EAA Annex I references.
 *
 * @example
 * const result = auditEAA();
 * console.log(`Found ${result.violations.length} violations`);
 * result.violations.forEach(v => {
 *   console.log(`[${v.severity}] ${v.message} — ${v.eaa.join(', ')}`);
 * });
 */
export function auditEAA(options: AuditOptions = {}): AuditResult {
  const root: Element | Document =
    options.root ?? (typeof document !== 'undefined' ? document : ({} as Document));
  const level: WCAGLevel = options.level ?? 'AA';

  const activeRules = ALL_RULES.filter((rule) => {
    if (options.rules && !options.rules.includes(rule.id)) return false;
    if (options.exclude?.includes(rule.id)) return false;
    return true;
  });

  const violations = activeRules.flatMap((rule) => {
    try {
      return rule.check(root, level);
    } catch {
      return [];
    }
  });

  const totalChecks = activeRules.length;

  return {
    violations,
    passes: totalChecks - new Set(violations.map((v) => v.ruleId)).size,
    timestamp: Date.now(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    level,
  };
}

/**
 * Watches the DOM for changes and re-runs the audit, calling onChange with
 * updated results. Uses MutationObserver with a 250ms debounce.
 * Returns a stop function to disconnect the observer.
 *
 * @example
 * const stop = watchEAA((result) => {
 *   console.log('Violations:', result.violations.length);
 * });
 * // Later:
 * stop();
 */
export function watchEAA(
  onChange: (result: AuditResult) => void,
  options: AuditOptions = {}
): () => void {
  if (typeof MutationObserver === 'undefined') {
    return () => undefined;
  }

  const root: Element | Document =
    options.root ?? (typeof document !== 'undefined' ? document : ({} as Document));

  let timer: ReturnType<typeof setTimeout> | null = null;

  const observer = new MutationObserver(() => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      onChange(auditEAA(options));
    }, 250);
  });

  const observeTarget = root instanceof Document ? root.documentElement : root;
  if (observeTarget) {
    observer.observe(observeTarget, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: false,
    });
  }

  // Run immediately on first call
  setTimeout(() => onChange(auditEAA(options)), 0);

  return () => {
    observer.disconnect();
    if (timer !== null) clearTimeout(timer);
  };
}
