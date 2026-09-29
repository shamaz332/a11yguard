import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  prefersContrast,
  onContrastChange,
  forcedColors,
  onForcedColorsChange,
  prefersReducedTransparency,
  onReducedTransparencyChange,
} from '../../src/core/preferences.js';

type Listener = (e: { matches: boolean }) => void;

/** matchMedia fake whose results can be flipped at runtime. */
function installMatchMedia(initial: Record<string, boolean>): (query: string, v: boolean) => void {
  const state = { ...initial };
  const listeners = new Map<string, Set<Listener>>();
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      get matches(): boolean {
        return state[query] ?? false;
      },
      addEventListener: (_: string, cb: Listener): void => {
        if (!listeners.has(query)) listeners.set(query, new Set());
        listeners.get(query)?.add(cb);
      },
      removeEventListener: (_: string, cb: Listener): boolean | undefined =>
        listeners.get(query)?.delete(cb),
    }))
  );
  return (query, value) => {
    state[query] = value;
    listeners.get(query)?.forEach((cb) => cb({ matches: value }));
  };
}

beforeEach(() => {
  installMatchMedia({});
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('prefersContrast', () => {
  it('returns no-preference by default', () => {
    expect(prefersContrast()).toBe('no-preference');
  });

  it.each(['more', 'less', 'custom'] as const)('detects %s', (value) => {
    installMatchMedia({ [`(prefers-contrast: ${value})`]: true });
    expect(prefersContrast()).toBe(value);
  });

  it('notifies subscribers and unsubscribes', () => {
    const set = installMatchMedia({});
    const cb = vi.fn();
    const unsub = onContrastChange(cb);
    set('(prefers-contrast: more)', true);
    expect(cb).toHaveBeenLastCalledWith('more');
    unsub();
    set('(prefers-contrast: more)', false);
    expect(cb).toHaveBeenCalledTimes(1);
  });
});

describe('forcedColors', () => {
  it('detects forced colors and changes', () => {
    const set = installMatchMedia({ '(forced-colors: active)': true });
    expect(forcedColors()).toBe(true);
    const cb = vi.fn();
    onForcedColorsChange(cb);
    set('(forced-colors: active)', false);
    expect(cb).toHaveBeenCalledWith(false);
  });
});

describe('prefersReducedTransparency', () => {
  it('detects the preference and changes', () => {
    const set = installMatchMedia({});
    expect(prefersReducedTransparency()).toBe(false);
    const cb = vi.fn();
    onReducedTransparencyChange(cb);
    set('(prefers-reduced-transparency: reduce)', true);
    expect(cb).toHaveBeenCalledWith(true);
  });
});

describe('SSR safety', () => {
  it('returns defaults without matchMedia', () => {
    vi.stubGlobal('matchMedia', undefined);
    expect(prefersContrast()).toBe('no-preference');
    expect(forcedColors()).toBe(false);
    expect(prefersReducedTransparency()).toBe(false);
    expect(() => onContrastChange(vi.fn())()).not.toThrow();
  });
});
