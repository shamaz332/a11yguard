import { describe, it, expect, vi } from 'vitest';
import { announceRouteChange } from '../../src/core/route-announcer.js';
import { pushFocus, focusStackDepth } from '../../src/core/focus-stack.js';

function flushAnimationFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function renderPage(html: string, title = 'Settings'): void {
  document.title = title;
  document.body.innerHTML = html;
}

describe('announceRouteChange', () => {
  it('announces the document title politely', async () => {
    renderPage('<main><h1>Settings</h1></main>');
    announceRouteChange();
    await flushAnimationFrame();
    const region = document.querySelector('[aria-live="polite"]');
    expect(region?.textContent).toBe('Navigated to Settings');
  });

  it('uses a custom title and message', async () => {
    renderPage('<h1>x</h1>');
    announceRouteChange({ title: 'Cart', message: (t) => `${t} page` });
    await flushAnimationFrame();
    expect(document.querySelector('[aria-live="polite"]')?.textContent).toBe('Cart page');
  });

  it('focuses the h1 by default and makes it focusable', () => {
    renderPage('<main><h1>Settings</h1></main>');
    announceRouteChange();
    const h1 = document.querySelector('h1');
    expect(document.activeElement).toBe(h1);
    expect(h1?.getAttribute('tabindex')).toBe('-1');
  });

  it('removes the temporary tabindex on blur', () => {
    renderPage('<main><h1>Settings</h1><button>b</button></main>');
    announceRouteChange();
    document.querySelector('button')?.focus();
    expect(document.querySelector('h1')?.hasAttribute('tabindex')).toBe(false);
  });

  it('falls back to main when there is no h1', () => {
    renderPage('<main id="m"><p>content</p></main>');
    announceRouteChange();
    expect(document.activeElement?.id).toBe('m');
  });

  it('accepts a selector or element as focus target', () => {
    renderPage('<h1>t</h1><div id="content"></div><section id="s"></section>');
    announceRouteChange({ focus: '#content' });
    expect(document.activeElement?.id).toBe('content');
    const section = document.getElementById('s') as HTMLElement;
    announceRouteChange({ focus: section });
    expect(document.activeElement).toBe(section);
  });

  it('leaves focus alone with focus: false', () => {
    renderPage('<h1>t</h1><button>keep</button>');
    const btn = document.querySelector('button') as HTMLButtonElement;
    btn.focus();
    announceRouteChange({ focus: false });
    expect(document.activeElement).toBe(btn);
  });

  it('clears the focus stack by default', () => {
    renderPage('<h1>t</h1><button>b</button>');
    document.querySelector('button')?.focus();
    pushFocus();
    announceRouteChange();
    expect(focusStackDepth()).toBe(0);
  });

  it('keeps the focus stack when clearFocusStack is false', () => {
    renderPage('<h1>t</h1><button>b</button>');
    document.querySelector('button')?.focus();
    pushFocus();
    announceRouteChange({ clearFocusStack: false });
    expect(focusStackDepth()).toBe(1);
  });

  it('does not announce when there is no title', () => {
    renderPage('<h1>t</h1>', '');
    const spy = vi.spyOn(document.body, 'appendChild');
    announceRouteChange();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
