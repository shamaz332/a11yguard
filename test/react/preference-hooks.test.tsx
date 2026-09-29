import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import {
  useContrastPreference,
  useForcedColors,
  useReducedTransparency,
  useInputModality,
} from '../../src/react/use-preferences.js';

vi.stubGlobal(
  'matchMedia',
  vi.fn((query: string) => ({
    matches: query === '(prefers-contrast: more)' || query === '(forced-colors: active)',
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
);

function Prefs(): React.ReactElement {
  return (
    <div
      data-testid="p"
      data-contrast={useContrastPreference()}
      data-forced={String(useForcedColors())}
      data-transparency={String(useReducedTransparency())}
      data-modality={useInputModality()}
    />
  );
}

describe('preference hooks', () => {
  it('read current values after mount', () => {
    render(<Prefs />);
    const el = screen.getByTestId('p');
    expect(el.getAttribute('data-contrast')).toBe('more');
    expect(el.getAttribute('data-forced')).toBe('true');
    expect(el.getAttribute('data-transparency')).toBe('false');
  });

  it('useInputModality updates on pointer and keyboard input', () => {
    render(<Prefs />);
    const el = screen.getByTestId('p');
    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });
    expect(el.getAttribute('data-modality')).toBe('pointer');
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    });
    expect(el.getAttribute('data-modality')).toBe('keyboard');
  });
});
