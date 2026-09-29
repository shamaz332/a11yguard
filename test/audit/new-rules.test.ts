import { describe, it, expect, afterEach } from 'vitest';
import { auditEAA } from '../../src/audit/index.js';

function run(rule: string, html: string, level?: 'A' | 'AA' | 'AAA'): ReturnType<typeof auditEAA> {
  document.body.innerHTML = html;
  return auditEAA({ rules: [rule], ...(level ? { level } : {}) });
}

afterEach(() => {
  document.body.innerHTML = '';
  document.title = '';
});

describe('duplicate-id rule', () => {
  it('flags repeated ids as moderate', () => {
    const r = run('duplicate-id', '<div id="a"></div><div id="a"></div><div id="b"></div>');
    expect(r.violations).toHaveLength(1);
    expect(r.violations[0]?.severity).toBe('moderate');
    expect(r.violations[0]?.eaa).toContain('EN 301 549: 9.4.1.1');
  });

  it('is serious when the id is referenced', () => {
    const r = run(
      'duplicate-id',
      '<label for="email">Email</label><input id="email"><input id="email">'
    );
    expect(r.violations[0]?.severity).toBe('serious');
  });

  it('passes unique ids', () => {
    expect(run('duplicate-id', '<div id="a"></div><div id="b"></div>').violations).toHaveLength(0);
  });
});

describe('aria-valid-attr rule', () => {
  it('flags misspelled aria attributes', () => {
    const r = run('aria-valid-attr', '<button aria-labeledby="x">Go</button>');
    expect(r.violations).toHaveLength(1);
    expect(r.violations[0]?.message).toContain('aria-labeledby');
  });

  it('passes valid attributes', () => {
    const r = run(
      'aria-valid-attr',
      '<div role="status" aria-live="polite" aria-atomic="true"></div><input aria-describedby="h" aria-invalid="true">'
    );
    expect(r.violations).toHaveLength(0);
  });
});

describe('aria-valid-role rule', () => {
  it('flags unknown and abstract roles', () => {
    const r = run('aria-valid-role', '<div role="buton"></div><div role="widget"></div>');
    expect(r.violations).toHaveLength(2);
  });

  it('passes valid, fallback-list, DPUB and case-insensitive roles', () => {
    const r = run(
      'aria-valid-role',
      '<div role="switch checkbox"></div><div role="made-up button"></div><section role="doc-chapter"></section><div role="Dialog"></div>'
    );
    expect(r.violations).toHaveLength(0);
  });
});

describe('aria-hidden-focus rule', () => {
  it('flags focusable content inside aria-hidden', () => {
    const r = run(
      'aria-hidden-focus',
      '<div aria-hidden="true"><a href="/x">x</a><button>b</button></div>'
    );
    expect(r.violations).toHaveLength(2);
  });

  it('flags an aria-hidden element that is itself focusable', () => {
    expect(
      run('aria-hidden-focus', '<button aria-hidden="true">x</button>').violations
    ).toHaveLength(1);
  });

  it('passes tabindex=-1, disabled, and inert content', () => {
    const r = run(
      'aria-hidden-focus',
      '<div aria-hidden="true"><a href="/x" tabindex="-1">x</a><button disabled>b</button><div inert><button>c</button></div><span>text</span></div>'
    );
    expect(r.violations).toHaveLength(0);
  });
});

describe('document-title rule', () => {
  it('flags a missing title for document audits', () => {
    document.title = '';
    expect(run('document-title', '<main></main>').violations).toHaveLength(1);
  });

  it('passes with a title', () => {
    document.title = 'Checkout';
    expect(run('document-title', '<main></main>').violations).toHaveLength(0);
  });

  it('is skipped when auditing an element', () => {
    document.title = '';
    document.body.innerHTML = '<section id="s"></section>';
    const root = document.getElementById('s') as HTMLElement;
    expect(auditEAA({ root, rules: ['document-title'] }).violations).toHaveLength(0);
  });
});

describe('frame-title rule', () => {
  it('flags an untitled iframe', () => {
    expect(run('frame-title', '<iframe src="about:blank"></iframe>').violations).toHaveLength(1);
  });

  it('passes titled or hidden iframes', () => {
    const r = run(
      'frame-title',
      '<iframe title="Map"></iframe><iframe aria-label="Video"></iframe><iframe aria-hidden="true"></iframe>'
    );
    expect(r.violations).toHaveLength(0);
  });
});

describe('table-headers rule', () => {
  const rows = '<tr><td>a</td><td>b</td></tr><tr><td>c</td><td>d</td></tr>';

  it('flags a data table without th', () => {
    expect(run('table-headers', `<table>${rows}</table>`).violations).toHaveLength(1);
  });

  it('passes tables with th or header roles', () => {
    const r = run(
      'table-headers',
      `<table><tr><th>A</th><th>B</th></tr>${rows}</table><table><tr><td role="columnheader">A</td><td>B</td></tr>${rows}</table>`
    );
    expect(r.violations).toHaveLength(0);
  });

  it('ignores layout tables and single-row/column tables', () => {
    const r = run(
      'table-headers',
      `<table role="presentation">${rows}</table><table><tr><td>a</td><td>b</td></tr></table><table><tr><td>a</td></tr><tr><td>b</td></tr></table>`
    );
    expect(r.violations).toHaveLength(0);
  });
});

describe('autocomplete-valid rule', () => {
  it('flags invalid tokens', () => {
    const r = run(
      'autocomplete-valid',
      '<input autocomplete="e-mail"><input autocomplete="nope"><input autocomplete="home street-address">'
    );
    expect(r.violations).toHaveLength(3);
    expect(r.violations[0]?.eaa).toContain('EN 301 549: 9.1.3.5');
  });

  it('passes valid values', () => {
    const r = run(
      'autocomplete-valid',
      '<input autocomplete="email"><input autocomplete="off"><input autocomplete="section-a shipping postal-code"><input autocomplete="work tel"><input autocomplete="username webauthn"><select autocomplete="country"></select>'
    );
    expect(r.violations).toHaveLength(0);
  });

  it('is skipped at level A', () => {
    expect(run('autocomplete-valid', '<input autocomplete="nope">', 'A').violations).toHaveLength(
      0
    );
  });
});
