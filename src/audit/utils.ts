import { getEAAArticles } from './eaa-map.js';
import type { Violation, Severity } from './types.js';

export function makeViolation(
  ruleId: string,
  wcag: string[],
  severity: Severity,
  element: Element,
  message: string,
  help: string,
): Violation {
  return {
    ruleId,
    wcag,
    eaa: getEAAArticles(wcag),
    severity,
    element,
    selector: getSelector(element),
    message,
    help,
  };
}

export function getSelector(el: Element): string {
  if (el.id) return `#${el.id}`;
  const tag = el.tagName.toLowerCase();
  const classes = Array.from(el.classList)
    .slice(0, 2)
    .map((c) => `.${c}`)
    .join('');
  const parent = el.parentElement;
  if (!parent) return tag + classes;
  const siblings = Array.from(parent.children).filter(
    (c) => c.tagName === el.tagName,
  );
  if (siblings.length > 1) {
    const idx = siblings.indexOf(el) + 1;
    return `${tag + classes}:nth-of-type(${idx})`;
  }
  return tag + classes;
}

export function getTextContent(el: Element): string {
  return (el.textContent ?? '').trim().replace(/\s+/g, ' ');
}

export function queryAll(root: Element | Document, selector: string): Element[] {
  return Array.from(root.querySelectorAll(selector));
}
