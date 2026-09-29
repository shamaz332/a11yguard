import { describe, it, expect, vi } from 'vitest';
import { get } from 'svelte/store';
import {
  contrast,
  forcedColors,
  reducedTransparency,
  inputModality,
} from '../../src/svelte/more-preferences.js';

vi.stubGlobal(
  'matchMedia',
  vi.fn((query: string) => ({
    matches: query === '(prefers-contrast: custom)',
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
);

describe('svelte preference stores', () => {
  it('read current values', () => {
    expect(get(contrast)).toBe('custom');
    expect(get(forcedColors)).toBe(false);
    expect(get(reducedTransparency)).toBe(false);
  });

  it('inputModality follows input', () => {
    const values: string[] = [];
    const unsub = inputModality.subscribe((v) => values.push(v));
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(values.at(-1)).toBe('pointer');
    unsub();
  });
});
