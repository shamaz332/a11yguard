import { describe, it, expect, vi } from 'vitest';
import { getInputModality, onInputModalityChange } from '../../src/core/input-modality.js';

function key(init: KeyboardEventInit = {}): void {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, ...init }));
}

function click(): void {
  document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
}

describe('input modality', () => {
  it('defaults to keyboard and marks <html>', () => {
    expect(getInputModality()).toBe('keyboard');
    expect(document.documentElement.getAttribute('data-input-modality')).toBe('keyboard');
  });

  it('switches to pointer on mouse down and back on key press', () => {
    getInputModality();
    click();
    expect(getInputModality()).toBe('pointer');
    expect(document.documentElement.getAttribute('data-input-modality')).toBe('pointer');
    key();
    expect(getInputModality()).toBe('keyboard');
  });

  it('ignores modifier shortcuts', () => {
    click();
    key({ key: 'c', metaKey: true });
    key({ key: 'c', ctrlKey: true });
    expect(getInputModality()).toBe('pointer');
    key();
  });

  it('notifies subscribers only on change', () => {
    const cb = vi.fn();
    const unsub = onInputModalityChange(cb);
    key();
    expect(cb).not.toHaveBeenCalled();
    click();
    click();
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith('pointer');
    unsub();
    key();
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
