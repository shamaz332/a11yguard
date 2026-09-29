import type { Severity, WCAGLevel } from './types.js';

/** The serializable parts of a violation — what a report needs. */
export interface ReportViolation {
  ruleId: string;
  wcag: string[];
  eaa: string[];
  severity: Severity;
  selector: string;
  message: string;
  help: string;
}

/** Any audit result, including one serialized from a browser (e.g. Playwright). */
export interface ReportInput {
  violations: ReportViolation[];
  level: WCAGLevel;
  url?: string;
}

export type ReportFormat = 'text' | 'markdown' | 'json';

const SEVERITY_ORDER: Severity[] = ['critical', 'serious', 'moderate', 'minor'];

function sortBySeverity(violations: ReportViolation[]): ReportViolation[] {
  return [...violations].sort(
    (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
  );
}

function plural(n: number): string {
  return `${n} violation${n === 1 ? '' : 's'}`;
}

function toText(result: ReportInput): string {
  const lines = [`${plural(result.violations.length)} at WCAG ${result.level}`];
  for (const v of sortBySeverity(result.violations)) {
    lines.push(
      '',
      `[${v.severity}]`.padEnd(12) + `${v.ruleId}: ${v.message}`,
      `  Element: ${v.selector}`,
      `  WCAG:    ${v.wcag.join(', ')}`,
      `  EAA ref: ${v.eaa.join(', ') || '—'}`,
      `  Fix:     ${v.help}`
    );
  }
  return lines.join('\n');
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function toMarkdown(result: ReportInput): string {
  const heading = `### Accessibility audit — ${plural(result.violations.length)} at WCAG ${result.level}`;
  if (!result.violations.length) return `${heading}\n\nNo violations found.`;
  const rows = sortBySeverity(result.violations).map(
    (v) =>
      `| ${v.severity} | \`${v.ruleId}\` | \`${escapeCell(v.selector)}\` | ${v.wcag.join(', ')} | ${escapeCell(v.eaa.join(', '))} | ${escapeCell(v.message)} |`
  );
  return [
    heading,
    '',
    '| Severity | Rule | Element | WCAG | EN 301 549 | Issue |',
    '|---|---|---|---|---|---|',
    ...rows,
  ].join('\n');
}

function toJson(result: ReportInput): string {
  const { violations, level, url } = result;
  return JSON.stringify(
    {
      level,
      url,
      violations: violations.map(({ ruleId, wcag, eaa, severity, selector, message, help }) => ({
        ruleId,
        wcag,
        eaa,
        severity,
        selector,
        message,
        help,
      })),
    },
    null,
    2
  );
}

/**
 * Formats an audit result as plain text (for terminals and test failures),
 * Markdown (for PR comments and compliance records) or JSON (for tooling).
 * Violations are sorted by severity.
 *
 * @example
 * console.log(formatReport(auditEAA()));
 * fs.writeFileSync('a11y-report.md', formatReport(result, 'markdown'));
 */
export function formatReport(result: ReportInput, format: ReportFormat = 'text'): string {
  if (format === 'markdown') return toMarkdown(result);
  if (format === 'json') return toJson(result);
  return toText(result);
}

/**
 * Logs an audit result to the console as a warning, grouped per violation with the
 * offending element attached so it can be inspected in DevTools. Does nothing when
 * there are no violations. Intended for development builds.
 *
 * @example
 * if (import.meta.env.DEV) watchEAA(logReport);
 */
export function logReport(result: ReportInput & { violations: { element?: Element }[] }): void {
  if (!result.violations.length || typeof console === 'undefined') return;
  console.warn(`[a11yguard] ${plural(result.violations.length)} at WCAG ${result.level}`);
  for (const v of sortBySeverity(result.violations) as (ReportViolation & {
    element?: Element;
  })[]) {
    console.warn(
      `[${v.severity}] ${v.ruleId}: ${v.message}\n  Fix: ${v.help}`,
      v.element ?? v.selector
    );
  }
}
