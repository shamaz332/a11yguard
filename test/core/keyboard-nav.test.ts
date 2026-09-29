import { describe, it, expect, vi } from 'vitest';
import { createKeyboardNav } from '../../src/core/keyboard-nav.js';

function buildMenu(count = 3): { container: HTMLDivElement; items: HTMLButtonElement[] } {
  const container = document.createElement('div');
  container.setAttribute('role', 'menu');
  const items: HTMLButtonElement[] = [];
  for (let i = 0; i < count; i++) {
    const btn = document.createElement('button');
    btn.setAttribute('role', 'menuitem');
    btn.textContent = `Item ${i}`;
    btn.id = `item-${i}`;
    container.appendChild(btn);
    items.push(btn);
  }
  document.body.appendChild(container);
  return { container, items };
}

function fireKey(target: EventTarget, key: string, shift = false): void {
  target.dispatchEvent(
    new KeyboardEvent('keydown', { key, shiftKey: shift, bubbles: true, cancelable: true })
  );
}

describe('createKeyboardNav', () => {
  it('returns the expected API', () => {
    const { container } = buildMenu();
    const nav = createKeyboardNav(container, { role: 'menu', items: '[role="menuitem"]' });
    expect(typeof nav.focusItem).toBe('function');
    expect(typeof nav.currentIndex).toBe('number');
    expect(typeof nav.destroy).toBe('function');
    nav.destroy();
  });

  it('focusItem focuses the item at the given index', () => {
    const { container, items } = buildMenu();
    const nav = createKeyboardNav(container, { role: 'menu', items: '[role="menuitem"]' });
    const spy = vi.spyOn(items[1]!, 'focus');
    nav.focusItem(1);
    expect(spy).toHaveBeenCalled();
    nav.destroy();
  });

  it('ArrowDown moves focus to next item', () => {
    const { container, items } = buildMenu();
    const nav = createKeyboardNav(container, { role: 'menu', items: '[role="menuitem"]' });
    nav.focusItem(0);
    const spy = vi.spyOn(items[1]!, 'focus');
    fireKey(container, 'ArrowDown');
    expect(spy).toHaveBeenCalled();
    nav.destroy();
  });

  it('ArrowUp moves focus to previous item', () => {
    const { container, items } = buildMenu();
    const nav = createKeyboardNav(container, { role: 'menu', items: '[role="menuitem"]' });
    nav.focusItem(1);
    const spy = vi.spyOn(items[0]!, 'focus');
    fireKey(container, 'ArrowUp');
    expect(spy).toHaveBeenCalled();
    nav.destroy();
  });

  it('wraps from last to first on ArrowDown', () => {
    const { container, items } = buildMenu(3);
    const nav = createKeyboardNav(container, {
      role: 'menu',
      items: '[role="menuitem"]',
      wrap: true,
    });
    nav.focusItem(2);
    const spy = vi.spyOn(items[0]!, 'focus');
    fireKey(container, 'ArrowDown');
    expect(spy).toHaveBeenCalled();
    nav.destroy();
  });

  it('wraps from first to last on ArrowUp', () => {
    const { container, items } = buildMenu(3);
    const nav = createKeyboardNav(container, {
      role: 'menu',
      items: '[role="menuitem"]',
      wrap: true,
    });
    nav.focusItem(0);
    const spy = vi.spyOn(items[2]!, 'focus');
    fireKey(container, 'ArrowUp');
    expect(spy).toHaveBeenCalled();
    nav.destroy();
  });

  it('Home moves to first item', () => {
    const { container, items } = buildMenu();
    const nav = createKeyboardNav(container, { role: 'menu', items: '[role="menuitem"]' });
    nav.focusItem(2);
    const spy = vi.spyOn(items[0]!, 'focus');
    fireKey(container, 'Home');
    expect(spy).toHaveBeenCalled();
    nav.destroy();
  });

  it('End moves to last item', () => {
    const { container, items } = buildMenu(3);
    const nav = createKeyboardNav(container, { role: 'menu', items: '[role="menuitem"]' });
    nav.focusItem(0);
    const spy = vi.spyOn(items[2]!, 'focus');
    fireKey(container, 'End');
    expect(spy).toHaveBeenCalled();
    nav.destroy();
  });

  it('Enter calls onSelect with current item', () => {
    const { container, items } = buildMenu();
    const onSelect = vi.fn();
    const nav = createKeyboardNav(container, {
      role: 'menu',
      items: '[role="menuitem"]',
      onSelect,
    });
    nav.focusItem(1);
    fireKey(container, 'Enter');
    expect(onSelect).toHaveBeenCalledWith(items[1], 1);
    nav.destroy();
  });

  it('does not navigate when arrowKeys is false', () => {
    const { container, items } = buildMenu();
    const nav = createKeyboardNav(container, {
      role: 'menu',
      items: '[role="menuitem"]',
      arrowKeys: false,
    });
    nav.focusItem(0);
    const spy = vi.spyOn(items[1]!, 'focus');
    fireKey(container, 'ArrowDown');
    expect(spy).not.toHaveBeenCalled();
    nav.destroy();
  });

  it('horizontal nav uses ArrowRight/Left', () => {
    const { container, items } = buildMenu();
    const nav = createKeyboardNav(container, {
      role: 'tablist',
      items: '[role="menuitem"]',
      orientation: 'horizontal',
    });
    nav.focusItem(0);
    const spy = vi.spyOn(items[1]!, 'focus');
    fireKey(container, 'ArrowRight');
    expect(spy).toHaveBeenCalled();
    nav.destroy();
  });

  it('sets aria-activedescendant for menu role', () => {
    const { container } = buildMenu();
    const nav = createKeyboardNav(container, { role: 'menu', items: '[role="menuitem"]' });
    nav.focusItem(0);
    expect(container.getAttribute('aria-activedescendant')).toBeTruthy();
    nav.destroy();
  });

  it('destroy removes event listeners (no errors after destroy)', () => {
    const { container } = buildMenu();
    const nav = createKeyboardNav(container, { role: 'menu', items: '[role="menuitem"]' });
    nav.destroy();
    expect(() => fireKey(container, 'ArrowDown')).not.toThrow();
  });

  it('accepts function for items', () => {
    const { container, items } = buildMenu(2);
    const nav = createKeyboardNav(container, {
      role: 'menu',
      items: () => Array.from(container.querySelectorAll('button')),
    });
    const spy = vi.spyOn(items[1]!, 'focus');
    nav.focusItem(1);
    expect(spy).toHaveBeenCalled();
    nav.destroy();
  });
});
