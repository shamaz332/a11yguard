/** CSS named colors — the 20 most common, sufficient for practical use. */
const CSS_KEYWORDS: Record<string, [number, number, number]> = {
  white: [255, 255, 255],
  black: [0, 0, 0],
  red: [255, 0, 0],
  green: [0, 128, 0],
  blue: [0, 0, 255],
  yellow: [255, 255, 0],
  orange: [255, 165, 0],
  purple: [128, 0, 128],
  pink: [255, 192, 203],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
  silver: [192, 192, 192],
  navy: [0, 0, 128],
  teal: [0, 128, 128],
  maroon: [128, 0, 0],
  olive: [128, 128, 0],
  lime: [0, 255, 0],
  aqua: [0, 255, 255],
  cyan: [0, 255, 255],
  fuchsia: [255, 0, 255],
  magenta: [255, 0, 255],
  transparent: [0, 0, 0],
};

/**
 * Parses a CSS color string into an [R, G, B] tuple (0–255 each).
 * Supports: hex (3/4/6/8-digit), rgb(), rgba(), hsl(), hsla(), CSS keywords.
 * Throws if the color cannot be parsed.
 *
 * @example
 * parseColor('#ff0000')    // [255, 0, 0]
 * parseColor('rgb(0,0,0)') // [0, 0, 0]
 * parseColor('hsl(120,100%,50%)') // [0, 255, 0]
 */
export function parseColor(input: string): [number, number, number] {
  const s = input.trim().toLowerCase();

  if (s in CSS_KEYWORDS) {
    return [...(CSS_KEYWORDS[s] as [number, number, number])];
  }

  if (s.startsWith('#')) {
    return parseHex(s);
  }

  if (s.startsWith('rgb')) {
    return parseRgb(s);
  }

  if (s.startsWith('hsl')) {
    return parseHsl(s);
  }

  throw new Error(`a11yguard: cannot parse color "${input}"`);
}

function parseHex(s: string): [number, number, number] {
  const hex = s.slice(1);
  if (hex.length === 3 || hex.length === 4) {
    const r = parseInt((hex[0] ?? '0') + (hex[0] ?? '0'), 16);
    const g = parseInt((hex[1] ?? '0') + (hex[1] ?? '0'), 16);
    const b = parseInt((hex[2] ?? '0') + (hex[2] ?? '0'), 16);
    return [r, g, b];
  }
  if (hex.length === 6 || hex.length === 8) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return [r, g, b];
  }
  throw new Error(`a11yguard: invalid hex color "${s}"`);
}

function parseRgb(s: string): [number, number, number] {
  const match = s.match(/rgba?\(\s*([\d.]+%?)\s*,\s*([\d.]+%?)\s*,\s*([\d.]+%?)/);
  if (!match) throw new Error(`a11yguard: invalid rgb color "${s}"`);
  const parse = (v: string): number => {
    if (v.endsWith('%')) return Math.round((parseFloat(v) / 100) * 255);
    return Math.round(parseFloat(v));
  };
  return [parse(match[1] ?? '0'), parse(match[2] ?? '0'), parse(match[3] ?? '0')];
}

function parseHsl(s: string): [number, number, number] {
  const match = s.match(/hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%/);
  if (!match) throw new Error(`a11yguard: invalid hsl color "${s}"`);
  const h = parseFloat(match[1] ?? '0') / 360;
  const sat = parseFloat(match[2] ?? '0') / 100;
  const l = parseFloat(match[3] ?? '0') / 100;

  if (sat === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }

  const q = l < 0.5 ? l * (1 + sat) : l + sat - l * sat;
  const p = 2 * l - q;
  return [
    Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
    Math.round(hueToRgb(p, q, h) * 255),
    Math.round(hueToRgb(p, q, h - 1 / 3) * 255),
  ];
}

function hueToRgb(p: number, q: number, t: number): number {
  let tt = t;
  if (tt < 0) tt += 1;
  if (tt > 1) tt -= 1;
  if (tt < 1 / 6) return p + (q - p) * 6 * tt;
  if (tt < 1 / 2) return q;
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
  return p;
}

/**
 * Converts an sRGB channel value (0–255) to linear light.
 * Uses the IEC 61966-2-1 standard (WCAG luminance formula).
 */
export function toLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Calculates WCAG relative luminance from an [R, G, B] tuple (0–255 each).
 * Result is in range [0, 1] where 0 = black, 1 = white.
 *
 * @example
 * relativeLuminance([255, 255, 255]) // 1
 * relativeLuminance([0, 0, 0])       // 0
 */
export function relativeLuminance([r, g, b]: [number, number, number]): number {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Converts an sRGB channel (0–255) to linearized display-referred for APCA.
 * Uses the APCA Ys exponent (2.4 gamma).
 */
export function toAPCALinear(channel: number): number {
  return Math.pow(channel / 255, 2.4);
}

/**
 * Calculates APCA screen luminance (Ys) from [R, G, B] (0–255 each).
 * Uses BT.709 coefficients as specified in the public APCA spec.
 */
export function apcaLuminance([r, g, b]: [number, number, number]): number {
  return 0.2126729 * toAPCALinear(r) + 0.7151522 * toAPCALinear(g) + 0.072175 * toAPCALinear(b);
}
