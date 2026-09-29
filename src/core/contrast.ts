import type { ColorInput, ContrastOptions, ContrastResult } from './types.js';
import { parseColor, relativeLuminance, apcaLuminance } from './utils/color.js';

// ─── WCAG 2.1 Algorithm ───────────────────────────────────────────────────────

function wcagRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function wcagRequiredRatio(level: 'AA' | 'AAA', largeText: boolean): number {
  if (level === 'AAA') return largeText ? 4.5 : 7;
  return largeText ? 3 : 4.5;
}

function wcagPassLevel(ratio: number, largeText: boolean): 'AAA' | 'AA' | 'fail' {
  if (ratio >= wcagRequiredRatio('AAA', largeText)) return 'AAA';
  if (ratio >= wcagRequiredRatio('AA', largeText)) return 'AA';
  return 'fail';
}

// ─── APCA (Advanced Perceptual Contrast Algorithm) ───────────────────────────
//
// Clean-room implementation based on the public APCA-W3 specification:
// https://www.w3.org/WAI/GL/task-forces/silver/wiki/Visual_Contrast_of_Text_Subgroup
//
// This is NOT a port of apca-w3 (GPL-licensed). It implements the same public
// mathematical specification independently.

const APCA_NT = 0.57; // Normal text exponent (dark on light)
const APCA_RT = 0.62; // Reverse text exponent (light on dark)
const APCA_BG = 0.56; // Background exponent (dark on light)
const APCA_BR = 0.65; // Background reverse exponent (light on dark)
const APCA_SCALE = 1.14;
const APCA_LOW_CLIP = 0.1;
const APCA_DELTA_LUM_MIN = 0.0005;

/**
 * Calculates APCA Lightness Contrast (Lc) value.
 * Positive = text is darker than background.
 * Negative = text is lighter than background.
 */
function apcaLc(textColor: [number, number, number], bgColor: [number, number, number]): number {
  const Yt = apcaLuminance(textColor);
  const Yb = apcaLuminance(bgColor);

  if (Math.abs(Yb - Yt) < APCA_DELTA_LUM_MIN) return 0;

  let Lc: number;

  if (Yb >= Yt) {
    // Dark text on light background (positive Lc)
    const sapc = Math.pow(Yb, APCA_BG) - Math.pow(Yt, APCA_NT);
    Lc = sapc < APCA_LOW_CLIP ? 0 : sapc * APCA_SCALE * 100;
  } else {
    // Light text on dark background (negative Lc)
    const sapc = Math.pow(Yb, APCA_BR) - Math.pow(Yt, APCA_RT);
    Lc = sapc > -APCA_LOW_CLIP ? 0 : sapc * APCA_SCALE * 100;
  }

  return Math.round(Lc * 10) / 10;
}

/**
 * Lookup table: minimum |Lc| required for a given font-weight + size bucket.
 * Based on APCA Bronze Simple Mode lookup table (public spec).
 * Rows: font-weight buckets [100, 200, 300, 400, 500, 600, 700+]
 * Cols: font-size buckets [12, 14, 16, 18, 24, 32, 48+] (CSS px)
 */
const APCA_LOOKUP: number[][] = [
  // 100   200   300   400   500   600   700+
  [100, 100, 100, 90, 75, 60, 45], // 12px
  [100, 100, 90, 75, 60, 55, 45], // 14px
  [100, 90, 75, 60, 55, 50, 40], // 16px
  [90, 75, 70, 55, 50, 45, 38], // 18px
  [75, 70, 60, 50, 45, 40, 35], // 24px
  [70, 60, 55, 45, 40, 38, 30], // 32px
  [60, 55, 45, 40, 35, 30, 25], // 48px+
];

const SIZE_BUCKETS = [12, 14, 16, 18, 24, 32, 48];
const WEIGHT_BUCKETS = [100, 200, 300, 400, 500, 600, 700];

function apcaMinLc(fontSize: number, fontWeight: number): number {
  let sIdx = SIZE_BUCKETS.length - 1;
  for (let i = 0; i < SIZE_BUCKETS.length; i++) {
    if (fontSize <= (SIZE_BUCKETS[i] ?? 0)) {
      sIdx = i;
      break;
    }
  }

  let wIdx = WEIGHT_BUCKETS.length - 1;
  for (let i = 0; i < WEIGHT_BUCKETS.length; i++) {
    if (fontWeight <= (WEIGHT_BUCKETS[i] ?? 0)) {
      wIdx = i;
      break;
    }
  }

  return APCA_LOOKUP[sIdx]?.[wIdx] ?? 60;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Checks color contrast between foreground and background using WCAG 2.1
 * and/or APCA algorithms.
 *
 * @example
 * // WCAG only (default)
 * const result = checkContrast('#000', '#fff');
 * console.log(result.wcag?.ratio);   // 21
 * console.log(result.wcag?.passes);  // true
 *
 * @example
 * // Both algorithms
 * const result = checkContrast('#333', '#fff', { algorithm: 'both', fontSize: 16 });
 * console.log(result.wcag?.ratio);  // contrast ratio
 * console.log(result.apca?.lc);     // Lc value
 */
export function checkContrast(
  foreground: ColorInput,
  background: ColorInput,
  options: ContrastOptions = {}
): ContrastResult {
  const {
    algorithm = 'wcag',
    level = 'AA',
    largeText = false,
    fontSize = 16,
    fontWeight = 400,
  } = options;

  const fg = parseColor(foreground);
  const bg = parseColor(background);

  const result: ContrastResult = {};

  if (algorithm === 'wcag' || algorithm === 'both') {
    const fgL = relativeLuminance(fg);
    const bgL = relativeLuminance(bg);
    const ratio = Math.round(wcagRatio(fgL, bgL) * 100) / 100;
    const passedLevel = wcagPassLevel(ratio, largeText);
    result.wcag = {
      ratio,
      passes:
        passedLevel !== 'fail' &&
        (level === 'AA' ? passedLevel === 'AA' || passedLevel === 'AAA' : passedLevel === 'AAA'),
      level: passedLevel,
    };
  }

  if (algorithm === 'apca' || algorithm === 'both') {
    const lc = apcaLc(fg, bg);
    const absLc = Math.abs(lc);
    const minRequired = apcaMinLc(fontSize, fontWeight);
    result.apca = {
      lc,
      passes: absLc >= minRequired,
      minRequired,
    };
  }

  return result;
}
