import { describe, it, expect } from 'vitest';
import { checkContrast } from '../../src/core/contrast.js';

describe('checkContrast — WCAG', () => {
  it('black on white: ratio 21, AAA', () => {
    const r = checkContrast('#000000', '#ffffff');
    expect(r.wcag?.ratio).toBe(21);
    expect(r.wcag?.passes).toBe(true);
    expect(r.wcag?.level).toBe('AAA');
  });

  it('white on white: ratio 1, fail', () => {
    const r = checkContrast('#ffffff', '#ffffff');
    expect(r.wcag?.ratio).toBe(1);
    expect(r.wcag?.passes).toBe(false);
    expect(r.wcag?.level).toBe('fail');
  });

  it('ratio is symmetrical (fg/bg can be swapped)', () => {
    const r1 = checkContrast('#000', '#fff');
    const r2 = checkContrast('#fff', '#000');
    expect(r1.wcag?.ratio).toBe(r2.wcag?.ratio);
  });

  it('passes AA at ratio >= 4.5', () => {
    // #595959 on white: ~7.0 ratio → AAA
    const r = checkContrast('#595959', '#ffffff');
    expect(r.wcag?.passes).toBe(true);
    expect(r.wcag?.level).toBe('AAA');
  });

  it('fails AA at ratio < 4.5 (normal text)', () => {
    // Light grey on white: very low contrast
    const r = checkContrast('#cccccc', '#ffffff');
    expect(r.wcag?.passes).toBe(false);
    expect(r.wcag?.level).toBe('fail');
  });

  it('passes AA large text at ratio >= 3', () => {
    // ratio ~3.something, should pass large text AA
    const r = checkContrast('#767676', '#ffffff', { largeText: true });
    // #767676 on white is ~4.54 — passes AA normal and large
    expect(r.wcag?.passes).toBe(true);
  });

  it('returns AAA level when level option is AAA', () => {
    const r = checkContrast('#000', '#fff', { level: 'AAA' });
    expect(r.wcag?.passes).toBe(true);
    expect(r.wcag?.level).toBe('AAA');
  });

  it('fails AAA level when ratio < 7', () => {
    // ~4.5 ratio won't pass AAA normal text
    const r = checkContrast('#767676', '#ffffff', { level: 'AAA' });
    expect(r.wcag?.passes).toBe(false);
  });

  it('only returns wcag result when algorithm is "wcag"', () => {
    const r = checkContrast('#000', '#fff', { algorithm: 'wcag' });
    expect(r.wcag).toBeDefined();
    expect(r.apca).toBeUndefined();
  });

  it('accepts rgb() colors', () => {
    const r = checkContrast('rgb(0,0,0)', 'rgb(255,255,255)');
    expect(r.wcag?.ratio).toBe(21);
  });

  it('accepts CSS keywords', () => {
    const r = checkContrast('black', 'white');
    expect(r.wcag?.ratio).toBe(21);
  });
});

describe('checkContrast — APCA', () => {
  it('only returns apca result when algorithm is "apca"', () => {
    const r = checkContrast('#000', '#fff', { algorithm: 'apca' });
    expect(r.apca).toBeDefined();
    expect(r.wcag).toBeUndefined();
  });

  it('returns both results when algorithm is "both"', () => {
    const r = checkContrast('#000', '#fff', { algorithm: 'both' });
    expect(r.wcag).toBeDefined();
    expect(r.apca).toBeDefined();
  });

  it('black text on white background: high positive Lc', () => {
    const r = checkContrast('#000000', '#ffffff', { algorithm: 'apca' });
    expect(r.apca?.lc).toBeGreaterThan(100);
    expect(r.apca?.passes).toBe(true);
  });

  it('white text on black background: negative Lc', () => {
    const r = checkContrast('#ffffff', '#000000', { algorithm: 'apca' });
    expect(r.apca?.lc).toBeLessThan(-100);
    expect(r.apca?.passes).toBe(true);
  });

  it('same color: Lc near 0, fails', () => {
    const r = checkContrast('#ffffff', '#ffffff', { algorithm: 'apca' });
    expect(Math.abs(r.apca?.lc ?? 0)).toBeLessThan(5);
    expect(r.apca?.passes).toBe(false);
  });

  it('respects fontSize option for minRequired', () => {
    const small = checkContrast('#777', '#fff', { algorithm: 'apca', fontSize: 12 });
    const large = checkContrast('#777', '#fff', { algorithm: 'apca', fontSize: 48 });
    // Smaller font needs higher Lc
    expect((small.apca?.minRequired ?? 0)).toBeGreaterThanOrEqual(large.apca?.minRequired ?? 0);
  });

  it('respects fontWeight for minRequired', () => {
    const thin = checkContrast('#777', '#fff', { algorithm: 'apca', fontSize: 16, fontWeight: 100 });
    const bold = checkContrast('#777', '#fff', { algorithm: 'apca', fontSize: 16, fontWeight: 700 });
    // Thin weight needs higher Lc
    expect((thin.apca?.minRequired ?? 0)).toBeGreaterThanOrEqual(bold.apca?.minRequired ?? 0);
  });
});
