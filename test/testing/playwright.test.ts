import { describe, it, expect, afterEach } from 'vitest';
import {
  checkEAA,
  assertNoEAAViolations,
  auditScriptPath,
  type PageLike,
} from '../../src/playwright/index.js';
import { run } from '../../src/audit/browser.js';

interface AuditGlobal {
  __a11yguardAudit?: { run: typeof run };
}

/** Fake Playwright page backed by jsdom: addScriptTag installs the browser build. */
function fakePage(): PageLike & { scriptTags: number } {
  const page = {
    scriptTags: 0,
    addScriptTag(_options: { path: string }): Promise<unknown> {
      page.scriptTags += 1;
      (globalThis as AuditGlobal).__a11yguardAudit = { run };
      return Promise.resolve();
    },
    evaluate: <R, A>(fn: (arg: A) => R, arg: A): Promise<R> => Promise.resolve(fn(arg)),
  };
  return page;
}

afterEach(() => {
  delete (globalThis as AuditGlobal).__a11yguardAudit;
  document.documentElement.lang = 'en';
  document.title = '';
});

describe('playwright helper', () => {
  it('points at the browser bundle', () => {
    expect(auditScriptPath.replace(/\\/g, '/')).toMatch(/\/browser\/audit\.global\.js$/);
  });

  it('injects the script once and returns serializable results', async () => {
    document.body.innerHTML = '<main><img src="x.png"></main>';
    const page = fakePage();
    const result = await checkEAA(page, { rules: ['images-alt'] });
    await checkEAA(page, { rules: ['images-alt'] });
    expect(page.scriptTags).toBe(1);
    expect(result.violations).toHaveLength(1);
    expect(result.violations[0]).not.toHaveProperty('element');
    expect(() => JSON.stringify(result)).not.toThrow();
  });

  it('scopes to include and skips page-level rules there', async () => {
    document.documentElement.removeAttribute('lang');
    document.body.innerHTML = '<img src="x.png"><section id="s"><p>ok</p></section>';
    const result = await checkEAA(fakePage(), { include: '#s' });
    expect(result.violations).toHaveLength(0);
  });

  it('throws for an include selector that matches nothing', async () => {
    await expect(checkEAA(fakePage(), { include: '#missing' })).rejects.toThrow('#missing');
  });

  it('assertNoEAAViolations throws a report', async () => {
    document.body.innerHTML = '<main><img src="x.png"></main>';
    await expect(assertNoEAAViolations(fakePage(), { rules: ['images-alt'] })).rejects.toThrow(
      /images-alt/
    );
  });

  it('assertNoEAAViolations resolves when clean', async () => {
    document.title = 'Home';
    document.body.innerHTML = '<main><h1>Home</h1></main>';
    const result = await assertNoEAAViolations(fakePage());
    expect(result.violations).toHaveLength(0);
  });
});
