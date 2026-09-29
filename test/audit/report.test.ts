import { describe, it, expect, vi, afterEach } from 'vitest';
import { auditEAA, formatReport, logReport } from '../../src/audit/index.js';

function audit(): ReturnType<typeof auditEAA> {
  document.body.innerHTML =
    '<main><h1>t</h1><h3>skip</h3><img src="x.png"><a href="/x">click here</a></main>';
  return auditEAA({ rules: ['images-alt', 'heading-order', 'link-purpose'] });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('formatReport', () => {
  it('text: summary line, severity order, fields', () => {
    const text = formatReport(audit());
    const lines = text.split('\n');
    expect(lines[0]).toBe('3 violations at WCAG AA');
    expect(text.indexOf('[critical]')).toBeLessThan(text.indexOf('[moderate]'));
    expect(text).toContain('Element: img');
    expect(text).toContain('EAA ref: EN 301 549: 9.1.1.1');
    expect(text).toContain('Fix:');
  });

  it('text: singular wording', () => {
    document.body.innerHTML = '<main><img src="x.png"></main>';
    expect(formatReport(auditEAA({ rules: ['images-alt'] }))).toMatch(/^1 violation at/);
  });

  it('markdown: table with a row per violation, pipes escaped', () => {
    const result = audit();
    result.violations[0] = { ...result.violations[0]!, message: 'a | b' };
    const md = formatReport(result, 'markdown');
    expect(md).toContain('| Severity | Rule | Element | WCAG | EN 301 549 | Issue |');
    expect(
      md.split('\n').filter((l) => l.startsWith('| ') && !l.startsWith('| Severity'))
    ).toHaveLength(3);
    expect(md).toContain('a \\| b');
  });

  it('markdown: says when there are no violations', () => {
    document.body.innerHTML = '<main><h1>ok</h1></main>';
    expect(formatReport(auditEAA({ rules: ['images-alt'] }), 'markdown')).toContain(
      'No violations found.'
    );
  });

  it('json: serializable without DOM elements', () => {
    const parsed = JSON.parse(formatReport(audit(), 'json')) as {
      level: string;
      violations: Record<string, unknown>[];
    };
    expect(parsed.level).toBe('AA');
    expect(parsed.violations).toHaveLength(3);
    expect(parsed.violations[0]).not.toHaveProperty('element');
    expect(parsed.violations[0]).toHaveProperty('selector');
  });
});

describe('logReport', () => {
  it('warns once per violation plus a summary, with the element attached', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const result = audit();
    logReport(result);
    expect(warn).toHaveBeenCalledTimes(4);
    expect(warn.mock.calls[0]?.[0]).toContain('3 violations');
    expect(warn.mock.calls[1]?.[1]).toBeInstanceOf(Element);
  });

  it('is silent without violations', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    document.body.innerHTML = '<main></main>';
    logReport(auditEAA({ rules: ['images-alt'] }));
    expect(warn).not.toHaveBeenCalled();
  });
});
