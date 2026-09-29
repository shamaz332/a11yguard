import type { AuditOptions } from './types.js';

/** Rules that describe the whole page, not a single component. */
export const PAGE_RULES = ['page-lang', 'landmarks', 'document-title'];

/**
 * Returns the exclude list for an audit of `root`: page-level rules are skipped
 * for element roots unless the caller chose rules explicitly.
 */
export function scopedExclude(
  root: Element | Document,
  options: Omit<AuditOptions, 'root'>
): string[] | undefined {
  const isElement = typeof Element !== 'undefined' && root instanceof Element;
  if (!isElement || options.rules) return options.exclude;
  return [...PAGE_RULES, ...(options.exclude ?? [])];
}
