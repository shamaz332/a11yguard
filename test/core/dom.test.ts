import { describe, it, expect, beforeEach } from 'vitest';
import { getFocusableElements, isElementVisible, getFirstFocusable, getLastFocusable, getSelector } from '../../src/core/utils/dom.js';

describe('getFocusableElements', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('finds buttons', () => {
    container.innerHTML = '<button>Click</button>';
    expect(getFocusableElements(container)).toHaveLength(1);
  });

  it('finds links with href', () => {
    container.innerHTML = '<a href="/foo">Link</a><a>No href</a>';
    expect(getFocusableElements(container)).toHaveLength(1);
  });

  it('finds inputs, selects, textareas', () => {
    container.innerHTML = '<input /><select><option>A</option></select><textarea></textarea>';
    expect(getFocusableElements(container)).toHaveLength(3);
  });

  it('excludes disabled buttons', () => {
    container.innerHTML = '<button disabled>Disabled</button>';
    expect(getFocusableElements(container)).toHaveLength(0);
  });

  it('excludes disabled inputs', () => {
    container.innerHTML = '<input disabled />';
    expect(getFocusableElements(container)).toHaveLength(0);
  });

  it('excludes hidden inputs', () => {
    container.innerHTML = '<input type="hidden" />';
    expect(getFocusableElements(container)).toHaveLength(0);
  });

  it('finds elements with non-negative tabindex', () => {
    container.innerHTML = '<div tabindex="0">Focusable</div><span tabindex="-1">Not in tab order</span>';
    expect(getFocusableElements(container)).toHaveLength(1);
  });

  it('excludes elements with inert attribute', () => {
    container.innerHTML = '<div inert><button>Inside inert</button></div>';
    expect(getFocusableElements(container)).toHaveLength(0);
  });

  it('returns elements in DOM order', () => {
    container.innerHTML = '<button id="a">A</button><button id="b">B</button>';
    const els = getFocusableElements(container);
    expect(els[0]?.id).toBe('a');
    expect(els[1]?.id).toBe('b');
  });
});

describe('isElementVisible', () => {
  it('returns true for a normal element', () => {
    const el = document.createElement('button');
    document.body.appendChild(el);
    // jsdom does not compute layout but offsetParent is set
    expect(typeof isElementVisible(el)).toBe('boolean');
  });

  it('returns false for display:none', () => {
    const el = document.createElement('button');
    el.style.display = 'none';
    document.body.appendChild(el);
    expect(isElementVisible(el)).toBe(false);
  });

  it('returns false for visibility:hidden', () => {
    const el = document.createElement('button');
    el.style.visibility = 'hidden';
    document.body.appendChild(el);
    expect(isElementVisible(el)).toBe(false);
  });
});

describe('getFirstFocusable / getLastFocusable', () => {
  it('returns first and last focusable', () => {
    const container = document.createElement('div');
    container.innerHTML = '<button id="a">A</button><button id="b">B</button>';
    document.body.appendChild(container);
    expect(getFirstFocusable(container)?.id).toBe('a');
    expect(getLastFocusable(container)?.id).toBe('b');
  });

  it('returns null for empty container', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    expect(getFirstFocusable(container)).toBeNull();
    expect(getLastFocusable(container)).toBeNull();
  });
});

describe('getSelector', () => {
  it('uses id when available', () => {
    const el = document.createElement('div');
    el.id = 'my-div';
    document.body.appendChild(el);
    expect(getSelector(el)).toBe('#my-div');
  });

  it('builds path without id', () => {
    const el = document.createElement('span');
    document.body.appendChild(el);
    const sel = getSelector(el);
    expect(typeof sel).toBe('string');
    expect(sel.length).toBeGreaterThan(0);
  });
});
