import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { auditEAA, watchEAA } from '../../src/audit/index.js';

// ─── helpers ──────────────────────────────────────────────────────────────────

function setBody(html: string): void {
  document.body.innerHTML = html;
}

function ids(violations: { ruleId: string }[]): string[] {
  return [...new Set(violations.map((v) => v.ruleId))].sort();
}

afterEach(() => {
  document.body.innerHTML = '';
  document.documentElement.lang = 'en';
});

// ─── auditEAA — general ───────────────────────────────────────────────────────

describe('auditEAA', () => {
  it('returns an AuditResult shape', () => {
    setBody('<main><h1>Hello</h1></main>');
    const result = auditEAA();
    expect(typeof result.timestamp).toBe('number');
    expect(Array.isArray(result.violations)).toBe(true);
    expect(typeof result.passes).toBe('number');
    expect(result.level).toBe('AA');
  });

  it('respects rules filter', () => {
    document.documentElement.removeAttribute('lang');
    setBody('<img src="x.png">');
    const result = auditEAA({ rules: ['page-lang'] });
    expect(ids(result.violations)).toEqual(['page-lang']);
  });

  it('respects exclude filter', () => {
    document.documentElement.removeAttribute('lang');
    setBody('<img src="x.png"><main></main>');
    const all = auditEAA();
    const excluded = auditEAA({ exclude: ['page-lang'] });
    expect(ids(excluded.violations)).not.toContain('page-lang');
    expect(ids(all.violations)).toContain('page-lang');
  });

  it('violations carry EAA references', () => {
    document.documentElement.removeAttribute('lang');
    const result = auditEAA({ rules: ['page-lang'] });
    expect(result.violations[0]?.eaa).toContain('EN 301 549: 9.3.1.1');
  });

  it('violations carry selector', () => {
    setBody('<img src="x.png"><main></main>');
    const result = auditEAA({ rules: ['images-alt'] });
    expect(typeof result.violations[0]?.selector).toBe('string');
  });
});

// ─── images-alt ───────────────────────────────────────────────────────────────

describe('images-alt rule', () => {
  it('flags <img> without alt', () => {
    setBody('<main><img src="photo.jpg"></main>');
    const r = auditEAA({ rules: ['images-alt'] });
    expect(r.violations).toHaveLength(1);
    expect(r.violations[0]?.ruleId).toBe('images-alt');
  });

  it('passes <img alt="">', () => {
    setBody('<main><img src="photo.jpg" alt=""></main>');
    const r = auditEAA({ rules: ['images-alt'] });
    expect(r.violations).toHaveLength(0);
  });

  it('flags role=img without accessible name', () => {
    setBody('<main><div role="img"></div></main>');
    const r = auditEAA({ rules: ['images-alt'] });
    expect(r.violations).toHaveLength(1);
  });

  it('passes role=img with aria-label', () => {
    setBody('<main><div role="img" aria-label="Chart showing growth"></div></main>');
    const r = auditEAA({ rules: ['images-alt'] });
    expect(r.violations).toHaveLength(0);
  });
});

// ─── form-labels ──────────────────────────────────────────────────────────────

describe('form-labels rule', () => {
  it('flags input without label', () => {
    setBody('<main><input type="text" id="name"></main>');
    const r = auditEAA({ rules: ['form-labels'] });
    expect(r.violations).toHaveLength(1);
  });

  it('passes input with for= label', () => {
    setBody('<main><label for="name">Name</label><input type="text" id="name"></main>');
    const r = auditEAA({ rules: ['form-labels'] });
    expect(r.violations).toHaveLength(0);
  });

  it('passes input wrapped in label', () => {
    setBody('<main><label>Name <input type="text"></label></main>');
    const r = auditEAA({ rules: ['form-labels'] });
    expect(r.violations).toHaveLength(0);
  });

  it('passes input with aria-label', () => {
    setBody('<main><input type="search" aria-label="Search site"></main>');
    const r = auditEAA({ rules: ['form-labels'] });
    expect(r.violations).toHaveLength(0);
  });

  it('does not flag input[type=hidden]', () => {
    setBody('<main><input type="hidden" name="csrf"></main>');
    const r = auditEAA({ rules: ['form-labels'] });
    expect(r.violations).toHaveLength(0);
  });

  it('flags textarea without label', () => {
    setBody('<main><textarea></textarea></main>');
    const r = auditEAA({ rules: ['form-labels'] });
    expect(r.violations).toHaveLength(1);
  });
});

// ─── heading-order ────────────────────────────────────────────────────────────

describe('heading-order rule', () => {
  it('flags h1 → h3 skip', () => {
    setBody('<main><h1>Title</h1><h3>Section</h3></main>');
    const r = auditEAA({ rules: ['heading-order'] });
    expect(r.violations).toHaveLength(1);
    expect(r.violations[0]?.message).toContain('h1 → h3');
  });

  it('passes h1 → h2 → h3', () => {
    setBody('<main><h1>Title</h1><h2>Section</h2><h3>Sub</h3></main>');
    const r = auditEAA({ rules: ['heading-order'] });
    expect(r.violations).toHaveLength(0);
  });

  it('passes a single h1', () => {
    setBody('<main><h1>Title</h1></main>');
    const r = auditEAA({ rules: ['heading-order'] });
    expect(r.violations).toHaveLength(0);
  });

  it('flags h2 → h4 skip', () => {
    setBody('<main><h1>T</h1><h2>S</h2><h4>Sub</h4></main>');
    const r = auditEAA({ rules: ['heading-order'] });
    expect(r.violations).toHaveLength(1);
  });
});

// ─── landmarks ────────────────────────────────────────────────────────────────

describe('landmarks rule', () => {
  it('flags page without <main>', () => {
    setBody('<div>content</div>');
    const r = auditEAA({ rules: ['landmarks'] });
    expect(r.violations).toHaveLength(1);
  });

  it('passes page with <main>', () => {
    setBody('<main>content</main>');
    const r = auditEAA({ rules: ['landmarks'] });
    expect(r.violations).toHaveLength(0);
  });

  it('passes page with role=main', () => {
    setBody('<div role="main">content</div>');
    const r = auditEAA({ rules: ['landmarks'] });
    expect(r.violations).toHaveLength(0);
  });
});

// ─── page-lang ────────────────────────────────────────────────────────────────

describe('page-lang rule', () => {
  it('flags missing lang attribute', () => {
    document.documentElement.removeAttribute('lang');
    const r = auditEAA({ rules: ['page-lang'] });
    expect(r.violations).toHaveLength(1);
    expect(r.violations[0]?.ruleId).toBe('page-lang');
  });

  it('flags empty lang attribute', () => {
    document.documentElement.setAttribute('lang', '');
    const r = auditEAA({ rules: ['page-lang'] });
    expect(r.violations).toHaveLength(1);
  });

  it('passes lang="en"', () => {
    document.documentElement.setAttribute('lang', 'en');
    const r = auditEAA({ rules: ['page-lang'] });
    expect(r.violations).toHaveLength(0);
  });

  it('passes lang="fr-CA"', () => {
    document.documentElement.setAttribute('lang', 'fr-CA');
    const r = auditEAA({ rules: ['page-lang'] });
    expect(r.violations).toHaveLength(0);
  });
});

// ─── link-purpose ─────────────────────────────────────────────────────────────

describe('link-purpose rule', () => {
  it('flags "click here" link text', () => {
    setBody('<main><a href="/page">Click here</a></main>');
    const r = auditEAA({ rules: ['link-purpose'] });
    expect(r.violations).toHaveLength(1);
  });

  it('flags "read more" link text', () => {
    setBody('<main><a href="/page">Read more</a></main>');
    const r = auditEAA({ rules: ['link-purpose'] });
    expect(r.violations).toHaveLength(1);
  });

  it('passes descriptive link text', () => {
    setBody('<main><a href="/report">Download the 2024 annual report</a></main>');
    const r = auditEAA({ rules: ['link-purpose'] });
    expect(r.violations).toHaveLength(0);
  });

  it('passes ambiguous text when aria-label is present', () => {
    setBody('<main><a href="/report" aria-label="Download 2024 annual report">Read more</a></main>');
    const r = auditEAA({ rules: ['link-purpose'] });
    expect(r.violations).toHaveLength(0);
  });
});

// ─── button-name ──────────────────────────────────────────────────────────────

describe('button-name rule', () => {
  it('flags button with no text and no label', () => {
    setBody('<main><button></button></main>');
    const r = auditEAA({ rules: ['button-name'] });
    expect(r.violations).toHaveLength(1);
  });

  it('passes button with text content', () => {
    setBody('<main><button>Submit</button></main>');
    const r = auditEAA({ rules: ['button-name'] });
    expect(r.violations).toHaveLength(0);
  });

  it('passes button with aria-label', () => {
    setBody('<main><button aria-label="Close dialog"><span aria-hidden="true">×</span></button></main>');
    const r = auditEAA({ rules: ['button-name'] });
    expect(r.violations).toHaveLength(0);
  });

  it('passes button with title', () => {
    setBody('<main><button title="Delete item"></button></main>');
    const r = auditEAA({ rules: ['button-name'] });
    expect(r.violations).toHaveLength(0);
  });

  it('flags role=button with no name', () => {
    setBody('<main><div role="button" tabindex="0"></div></main>');
    const r = auditEAA({ rules: ['button-name'] });
    expect(r.violations).toHaveLength(1);
  });
});

// ─── watchEAA ─────────────────────────────────────────────────────────────────

describe('watchEAA', () => {
  it('returns a stop function', () => {
    const stop = watchEAA(() => undefined);
    expect(typeof stop).toBe('function');
    stop();
  });

  it('calls onChange immediately (via setTimeout)', async () => {
    setBody('<main></main>');
    const results: number[] = [];
    const stop = watchEAA((r) => results.push(r.violations.length));
    await new Promise((resolve) => setTimeout(resolve, 20));
    stop();
    expect(results.length).toBeGreaterThan(0);
  });

  it('stop() prevents further callbacks', async () => {
    setBody('<main></main>');
    let calls = 0;
    const stop = watchEAA(() => calls++);
    await new Promise((resolve) => setTimeout(resolve, 20));
    stop();
    const beforeStop = calls;
    document.body.appendChild(document.createElement('p'));
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(calls).toBe(beforeStop);
  });
});
