import type { AuditRule, Violation, WCAGLevel } from '../types.js';
import { makeViolation, queryAll } from '../utils.js';
import { checkContrast } from '../../core/contrast.js';
import { parseColor } from '../../core/utils/color.js';

const WCAG = ['1.4.3'];

const AA_NORMAL = 4.5;
const AA_LARGE = 3.0;
const AAA_NORMAL = 7.0;
const AAA_LARGE = 4.5;

const TEXT_TAGS = new Set([
  'p',
  'span',
  'a',
  'li',
  'td',
  'th',
  'dt',
  'dd',
  'label',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'button',
  'legend',
]);

function isLargeText(style: CSSStyleDeclaration): boolean {
  const size = parseFloat(style.fontSize);
  const weight = parseInt(style.fontWeight, 10);
  const isBold = weight >= 700;
  // 18pt = 24px, 14pt bold = ~18.67px
  return size >= 24 || (isBold && size >= 18.67);
}

function getEffectiveBg(el: Element): string | null {
  let node: Element | null = el;
  while (node) {
    const style = window.getComputedStyle(node);
    const bg = style.backgroundColor;
    if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
      return bg;
    }
    node = node.parentElement;
  }
  return 'rgb(255, 255, 255)';
}

function tryParseColor(value: string): [number, number, number] | null {
  try {
    return parseColor(value);
  } catch {
    return null;
  }
}

export const contrast: AuditRule = {
  id: 'contrast',
  wcag: WCAG,
  severity: 'serious',

  check(root: Element | Document, level: WCAGLevel): Violation[] {
    if (typeof window === 'undefined') return [];

    const violations: Violation[] = [];
    const minRatio = level === 'AAA' ? AAA_NORMAL : AA_NORMAL;
    const minLarge = level === 'AAA' ? AAA_LARGE : AA_LARGE;

    for (const el of queryAll(root, Array.from(TEXT_TAGS).join(','))) {
      if (!el.textContent?.trim()) continue;

      const style = window.getComputedStyle(el);
      const fg = tryParseColor(style.color);
      const bgRaw = getEffectiveBg(el);
      const bg = bgRaw ? tryParseColor(bgRaw) : null;

      if (!fg || !bg) continue;

      const result = checkContrast(
        `rgb(${fg[0]},${fg[1]},${fg[2]})`,
        `rgb(${bg[0]},${bg[1]},${bg[2]})`,
        { algorithm: 'wcag' }
      );

      if (!result.wcag) continue;

      const required = isLargeText(style) ? minLarge : minRatio;
      if (result.wcag.ratio < required) {
        violations.push(
          makeViolation(
            'contrast',
            WCAG,
            'serious',
            el,
            `Insufficient colour contrast: ${result.wcag.ratio.toFixed(2)}:1 (required ${required}:1)`,
            `Increase the contrast between the text colour and its background to at least ${required}:1.`
          )
        );
      }
    }

    return violations;
  },
};
