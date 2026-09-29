import { describe, it, expect } from 'vitest';
import {
  visuallyHidden,
  visuallyHiddenCss,
  applyVisuallyHidden,
} from '../../src/core/visually-hidden.js';

describe('visuallyHidden', () => {
  it('exposes the standard clip pattern', () => {
    expect(visuallyHidden.position).toBe('absolute');
    expect(visuallyHidden.width).toBe('1px');
    expect(visuallyHidden.clip).toBe('rect(0,0,0,0)');
  });

  it('css string matches the style object', () => {
    const el = document.createElement('span');
    el.setAttribute('style', visuallyHiddenCss);
    expect(el.style.position).toBe('absolute');
    expect(el.style.whiteSpace).toBe('nowrap');
    expect(el.style.margin).toBe('-1px');
  });

  it('applyVisuallyHidden sets inline styles', () => {
    const el = document.createElement('span');
    applyVisuallyHidden(el);
    expect(el.style.position).toBe('absolute');
    expect(el.style.overflow).toBe('hidden');
  });
});
