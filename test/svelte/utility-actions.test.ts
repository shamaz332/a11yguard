import { describe, it, expect, vi } from 'vitest';
import { scrollLock, focusRestore, skipLink } from '../../src/svelte/utility.actions.js';
import { isScrollLocked } from '../../src/core/scroll-lock.js';

vi.stubGlobal('scrollTo', vi.fn());

describe('scrollLock action', () => {
  it('locks while active and unlocks on destroy', () => {
    const node = document.createElement('div');
    const action = scrollLock(node);
    expect(isScrollLocked()).toBe(true);
    action.destroy();
    expect(isScrollLocked()).toBe(false);
  });

  it('follows update()', () => {
    const node = document.createElement('div');
    const action = scrollLock(node, false);
    expect(isScrollLocked()).toBe(false);
    action.update(true);
    expect(isScrollLocked()).toBe(true);
    action.update(false);
    expect(isScrollLocked()).toBe(false);
    action.destroy();
  });
});

describe('focusRestore action', () => {
  it('returns focus to the previously focused element on destroy', () => {
    const trigger = document.createElement('button');
    const node = document.createElement('div');
    const inner = document.createElement('button');
    node.appendChild(inner);
    document.body.append(trigger, node);
    trigger.focus();
    const action = focusRestore(node);
    inner.focus();
    action.destroy();
    expect(document.activeElement).toBe(trigger);
  });
});

describe('skipLink action', () => {
  it('injects a link to the node and removes it on destroy', () => {
    const main = document.createElement('main');
    document.body.appendChild(main);
    const action = skipLink(main, 'Skip to content');
    const link = document.querySelector('[data-a11yguard-skip-link]');
    expect(link?.getAttribute('href')).toBe(`#${main.id}`);
    expect(link?.textContent).toBe('Skip to content');
    action.destroy();
    expect(document.querySelector('[data-a11yguard-skip-link]')).toBeNull();
  });
});
