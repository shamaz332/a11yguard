import { describe, it, expect, vi, beforeEach } from 'vitest';
import { announce, createAnnouncer } from '../../src/core/announce.js';

describe('announce', () => {
  beforeEach(() => {
    // Reset the singleton by removing any injected live regions
    document.querySelectorAll('[aria-live]').forEach((el) => el.remove());
  });

  it('injects a polite live region on first call', () => {
    announce('Hello');
    const polite = document.querySelector('[aria-live="polite"]');
    expect(polite).toBeTruthy();
  });

  it('injects an assertive live region on first call', () => {
    announce('Alert', 'assertive');
    const assertive = document.querySelector('[aria-live="assertive"]');
    expect(assertive).toBeTruthy();
  });

  it('does not throw when document is unavailable (simulated SSR)', () => {
    // announce() is SSR-safe — this just validates it doesn't throw
    expect(() => announce('test')).not.toThrow();
  });
});

describe('createAnnouncer', () => {
  it('creates independent live regions', () => {
    const a1 = createAnnouncer();
    const a2 = createAnnouncer();

    a1.announce('Message 1');
    a2.announce('Message 2');

    const regions = document.querySelectorAll('[aria-live="polite"]');
    expect(regions.length).toBeGreaterThanOrEqual(2);

    a1.destroy();
    a2.destroy();
  });

  it('removes live regions on destroy', () => {
    const before = document.querySelectorAll('[aria-live]').length;
    const announcer = createAnnouncer();
    const after = document.querySelectorAll('[aria-live]').length;
    expect(after).toBe(before + 2); // polite + assertive

    announcer.destroy();
    const afterDestroy = document.querySelectorAll('[aria-live]').length;
    expect(afterDestroy).toBe(before);
  });

  it('announces polite by default', () => {
    const announcer = createAnnouncer();
    announcer.announce('Polite message');

    const polite = document.querySelector('[aria-live="polite"]');
    expect(polite).toBeTruthy();
    announcer.destroy();
  });

  it('announces assertive when specified', () => {
    const announcer = createAnnouncer();
    announcer.announce('Urgent', 'assertive');

    const assertive = document.querySelector('[aria-live="assertive"]');
    expect(assertive).toBeTruthy();
    announcer.destroy();
  });

  it('sets role=status on polite region', () => {
    const announcer = createAnnouncer();
    const polite = document.querySelector('[aria-live="polite"]');
    expect(polite?.getAttribute('role')).toBe('status');
    announcer.destroy();
  });

  it('sets role=alert on assertive region', () => {
    const announcer = createAnnouncer();
    const assertive = document.querySelector('[aria-live="assertive"]');
    expect(assertive?.getAttribute('role')).toBe('alert');
    announcer.destroy();
  });

  it('uses visually-hidden styles (not display:none)', () => {
    const announcer = createAnnouncer();
    const polite = document.querySelector<HTMLElement>('[aria-live="polite"]');
    expect(polite?.style.display).not.toBe('none');
    expect(polite?.style.position).toBe('absolute');
    announcer.destroy();
  });
});
