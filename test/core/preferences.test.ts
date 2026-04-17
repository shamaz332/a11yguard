import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  prefersReducedMotion,
  onReducedMotionChange,
  prefersColorScheme,
  onColorSchemeChange,
} from '../../src/core/preferences.js';

// jsdom doesn't implement matchMedia — we stub it
function mockMatchMedia(matches: Record<string, boolean>): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string): MediaQueryList => {
      const matched = matches[query] ?? false;
      const listeners: Array<(e: MediaQueryListEvent) => void> = [];
      return {
        matches: matched,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((_, fn) => listeners.push(fn as (e: MediaQueryListEvent) => void)),
        removeEventListener: vi.fn((_, fn) => {
          const idx = listeners.indexOf(fn as (e: MediaQueryListEvent) => void);
          if (idx !== -1) listeners.splice(idx, 1);
        }),
        dispatchEvent: vi.fn(),
      } as MediaQueryList;
    })
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('prefersReducedMotion', () => {
  it('returns true when prefers-reduced-motion: reduce', () => {
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': true });
    expect(prefersReducedMotion()).toBe(true);
  });

  it('returns false when no preference', () => {
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': false });
    expect(prefersReducedMotion()).toBe(false);
  });

  it('returns false in SSR (no matchMedia)', () => {
    vi.stubGlobal('matchMedia', undefined);
    expect(prefersReducedMotion()).toBe(false);
  });
});

describe('onReducedMotionChange', () => {
  it('returns an unsubscribe function', () => {
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': false });
    const unsub = onReducedMotionChange(() => undefined);
    expect(typeof unsub).toBe('function');
    unsub();
  });

  it('returns no-op in SSR', () => {
    vi.stubGlobal('matchMedia', undefined);
    const unsub = onReducedMotionChange(() => undefined);
    expect(() => unsub()).not.toThrow();
  });
});

describe('prefersColorScheme', () => {
  it('returns "dark" when dark mode is active', () => {
    mockMatchMedia({
      '(prefers-color-scheme: dark)': true,
      '(prefers-color-scheme: light)': false,
    });
    expect(prefersColorScheme()).toBe('dark');
  });

  it('returns "light" when light mode is active', () => {
    mockMatchMedia({
      '(prefers-color-scheme: dark)': false,
      '(prefers-color-scheme: light)': true,
    });
    expect(prefersColorScheme()).toBe('light');
  });

  it('returns "no-preference" when neither matches', () => {
    mockMatchMedia({
      '(prefers-color-scheme: dark)': false,
      '(prefers-color-scheme: light)': false,
    });
    expect(prefersColorScheme()).toBe('no-preference');
  });

  it('returns "light" in SSR', () => {
    vi.stubGlobal('matchMedia', undefined);
    expect(prefersColorScheme()).toBe('light');
  });
});

describe('onColorSchemeChange', () => {
  it('returns an unsubscribe function', () => {
    mockMatchMedia({
      '(prefers-color-scheme: dark)': false,
      '(prefers-color-scheme: light)': true,
    });
    const unsub = onColorSchemeChange(() => undefined);
    expect(typeof unsub).toBe('function');
    unsub();
  });
});
