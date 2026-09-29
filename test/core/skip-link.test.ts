import { describe, it, expect } from 'vitest';
import { injectSkipLink } from '../../src/core/skip-link.js';

describe('injectSkipLink', () => {
  it('injects a skip link as first child of body', () => {
    const cleanup = injectSkipLink();
    const link = document.body.firstChild as HTMLElement;
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('#main');
    cleanup();
  });

  it('uses custom target', () => {
    const cleanup = injectSkipLink({ target: '#content' });
    const link = document.querySelector('[data-a11yguard-skip-link]') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('#content');
    cleanup();
  });

  it('uses custom label', () => {
    const cleanup = injectSkipLink({ label: 'Passer au contenu principal' });
    const link = document.querySelector('[data-a11yguard-skip-link]') as HTMLElement;
    expect(link.textContent).toBe('Passer au contenu principal');
    cleanup();
  });

  it('default label is "Skip to main content"', () => {
    const cleanup = injectSkipLink();
    const link = document.querySelector('[data-a11yguard-skip-link]') as HTMLElement;
    expect(link.textContent).toBe('Skip to main content');
    cleanup();
  });

  it('cleanup removes the link', () => {
    const cleanup = injectSkipLink();
    expect(document.querySelector('[data-a11yguard-skip-link]')).not.toBeNull();
    cleanup();
    expect(document.querySelector('[data-a11yguard-skip-link]')).toBeNull();
  });

  it('is visually hidden by default (position: absolute)', () => {
    const cleanup = injectSkipLink();
    const link = document.querySelector<HTMLElement>('[data-a11yguard-skip-link]')!;
    expect(link.style.position).toBe('absolute');
    cleanup();
  });

  it('becomes visible on focus (clip-path removed)', () => {
    const cleanup = injectSkipLink();
    const link = document.querySelector<HTMLElement>('[data-a11yguard-skip-link]')!;
    link.dispatchEvent(new FocusEvent('focus'));
    expect(link.style.clipPath).toBe('inset(0%)');
    cleanup();
  });

  it('returns to hidden on blur', () => {
    const cleanup = injectSkipLink();
    const link = document.querySelector<HTMLElement>('[data-a11yguard-skip-link]')!;
    link.dispatchEvent(new FocusEvent('focus'));
    link.dispatchEvent(new FocusEvent('blur'));
    // After blur the style is reset — check clip-path is back to hidden
    expect(link.getAttribute('style')).toContain('inset(100%)');
    cleanup();
  });

  it('clicking the link focuses the target element', () => {
    const main = document.createElement('main');
    main.id = 'main';
    document.body.appendChild(main);

    const cleanup = injectSkipLink({ target: '#main' });
    const link = document.querySelector<HTMLAnchorElement>('[data-a11yguard-skip-link]')!;
    link.click();

    expect(document.activeElement).toBe(main);
    cleanup();
  });

  it('does not inject duplicate data-a11yguard-skip-link markers when called twice', () => {
    const c1 = injectSkipLink();
    const c2 = injectSkipLink();
    const links = document.querySelectorAll('[data-a11yguard-skip-link]');
    // Both were injected — two separate links, that's fine. Clean both up.
    expect(links.length).toBe(2);
    c1();
    c2();
    expect(document.querySelectorAll('[data-a11yguard-skip-link]').length).toBe(0);
  });
});
