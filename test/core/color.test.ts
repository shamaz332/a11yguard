import { describe, it, expect } from 'vitest';
import {
  parseColor,
  toLinear,
  relativeLuminance,
  apcaLuminance,
} from '../../src/core/utils/color.js';

describe('parseColor', () => {
  it('parses 6-digit hex', () => {
    expect(parseColor('#ff0000')).toEqual([255, 0, 0]);
    expect(parseColor('#ffffff')).toEqual([255, 255, 255]);
    expect(parseColor('#000000')).toEqual([0, 0, 0]);
  });

  it('parses 3-digit hex', () => {
    expect(parseColor('#f00')).toEqual([255, 0, 0]);
    expect(parseColor('#fff')).toEqual([255, 255, 255]);
  });

  it('parses 8-digit hex (ignores alpha)', () => {
    expect(parseColor('#ff0000ff')).toEqual([255, 0, 0]);
  });

  it('parses rgb()', () => {
    expect(parseColor('rgb(255, 0, 0)')).toEqual([255, 0, 0]);
    expect(parseColor('rgb(0,128,0)')).toEqual([0, 128, 0]);
  });

  it('parses rgba()', () => {
    expect(parseColor('rgba(0, 0, 255, 0.5)')).toEqual([0, 0, 255]);
  });

  it('parses hsl() — red', () => {
    const [r, g, b] = parseColor('hsl(0, 100%, 50%)');
    expect(r).toBe(255);
    expect(g).toBe(0);
    expect(b).toBe(0);
  });

  it('parses hsl() — green', () => {
    const [r, g, b] = parseColor('hsl(120, 100%, 50%)');
    expect(r).toBe(0);
    expect(g).toBe(255);
    expect(b).toBe(0);
  });

  it('parses CSS keywords', () => {
    expect(parseColor('white')).toEqual([255, 255, 255]);
    expect(parseColor('black')).toEqual([0, 0, 0]);
    expect(parseColor('red')).toEqual([255, 0, 0]);
  });

  it('throws on unknown color', () => {
    expect(() => parseColor('notacolor')).toThrow();
  });

  it('is case-insensitive for keywords', () => {
    expect(parseColor('WHITE')).toEqual([255, 255, 255]);
  });
});

describe('toLinear', () => {
  it('returns 0 for black', () => {
    expect(toLinear(0)).toBe(0);
  });

  it('returns ~1 for white', () => {
    expect(toLinear(255)).toBeCloseTo(1, 5);
  });

  it('converts midtones', () => {
    // 128 should be roughly 0.216 in linear
    const v = toLinear(128);
    expect(v).toBeGreaterThan(0.2);
    expect(v).toBeLessThan(0.25);
  });
});

describe('relativeLuminance', () => {
  it('returns 1 for white', () => {
    expect(relativeLuminance([255, 255, 255])).toBeCloseTo(1, 5);
  });

  it('returns 0 for black', () => {
    expect(relativeLuminance([0, 0, 0])).toBe(0);
  });

  it('returns expected value for red', () => {
    // pure red luminance ≈ 0.2126
    expect(relativeLuminance([255, 0, 0])).toBeCloseTo(0.2126, 3);
  });

  it('returns value between 0 and 1', () => {
    const l = relativeLuminance([100, 150, 200]);
    expect(l).toBeGreaterThan(0);
    expect(l).toBeLessThan(1);
  });
});

describe('apcaLuminance', () => {
  it('returns 1 for white', () => {
    expect(apcaLuminance([255, 255, 255])).toBeCloseTo(1, 2);
  });

  it('returns 0 for black', () => {
    expect(apcaLuminance([0, 0, 0])).toBe(0);
  });
});
