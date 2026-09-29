import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'solid-js';
import {
  createContrastPreference,
  createForcedColors,
  createReducedTransparency,
  createInputModality,
} from '../../src/solid/create-more-preferences.js';

vi.stubGlobal(
  'matchMedia',
  vi.fn((query: string) => ({
    matches: query === '(forced-colors: active)',
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
);

describe('solid preference primitives', () => {
  it('read current values and track modality', () => {
    createRoot((dispose) => {
      expect(createContrastPreference()()).toBe('no-preference');
      expect(createForcedColors()()).toBe(true);
      expect(createReducedTransparency()()).toBe(false);
      const modality = createInputModality();
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(modality()).toBe('pointer');
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
      expect(modality()).toBe('keyboard');
      dispose();
    });
  });
});
