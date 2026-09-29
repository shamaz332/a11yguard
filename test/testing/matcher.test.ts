import { describe, it, expect, afterEach } from 'vitest';
import { toHaveNoEAAViolations, eaaMatchers, type EAAMatchers } from '../../src/testing/index.js';

expect.extend(eaaMatchers);

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-explicit-any
  interface Assertion<T = any> extends EAAMatchers<T> {}
}

function mountHtml(html: string): HTMLElement {
  const el = document.createElement('div');
  el.innerHTML = html;
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.documentElement.lang = 'en';
});

describe('toHaveNoEAAViolations', () => {
  it('passes an accessible component', () => {
    expect(mountHtml('<button>Save</button>')).toHaveNoEAAViolations();
  });

  it('fails with a readable report', () => {
    const el = mountHtml('<img src="x.png">');
    const result = toHaveNoEAAViolations(el);
    expect(result.pass).toBe(false);
    expect(result.message()).toContain('images-alt');
    expect(() => expect(el).toHaveNoEAAViolations()).toThrow(/images-alt/);
  });

  it('works with .not', () => {
    expect(mountHtml('<img src="x.png">')).not.toHaveNoEAAViolations();
  });

  it('skips page-level rules for element roots', () => {
    document.documentElement.removeAttribute('lang');
    // No <main>, no lang, no title — none of that is the component's concern
    expect(mountHtml('<p>Hello</p>')).toHaveNoEAAViolations();
  });

  it('runs page-level rules when auditing the document', () => {
    document.documentElement.removeAttribute('lang');
    mountHtml('<main><h1>x</h1></main>');
    expect(toHaveNoEAAViolations(document).message()).toContain('page-lang');
  });

  it('runs page-level rules when chosen explicitly', () => {
    expect(toHaveNoEAAViolations(mountHtml('<p>x</p>'), { rules: ['landmarks'] }).pass).toBe(false);
  });

  it('respects exclude', () => {
    expect(mountHtml('<img src="x.png">')).toHaveNoEAAViolations({ exclude: ['images-alt'] });
  });
});
