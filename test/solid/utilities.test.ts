import { describe, it, expect, vi } from 'vitest';
import { createRoot, createSignal } from 'solid-js';
import {
  createScrollLock,
  createFocusRestore,
  createSkipLink,
  createRouteAnnouncer,
} from '../../src/solid/create-utilities.js';
import { isScrollLocked } from '../../src/core/scroll-lock.js';

vi.stubGlobal('scrollTo', vi.fn());

const tick = (): Promise<void> => new Promise((r) => setTimeout(r));

describe('createScrollLock', () => {
  it('locks while active and unlocks on dispose', async () => {
    const [open, setOpen] = createSignal(false);
    const dispose = createRoot((d) => {
      createScrollLock(open);
      return d;
    });
    await tick();
    expect(isScrollLocked()).toBe(false);
    setOpen(true);
    await tick();
    expect(isScrollLocked()).toBe(true);
    dispose();
    expect(isScrollLocked()).toBe(false);
  });
});

describe('createFocusRestore', () => {
  it('restores focus when active becomes false', () => {
    const trigger = document.createElement('button');
    const inner = document.createElement('button');
    document.body.append(trigger, inner);
    trigger.focus();
    const [open, setOpen] = createSignal(true);
    const dispose = createRoot((d) => {
      createFocusRestore(open);
      return d;
    });
    inner.focus();
    setOpen(false);
    expect(document.activeElement).toBe(trigger);
    dispose();
  });
});

describe('createSkipLink', () => {
  it('injects on mount and removes on dispose', async () => {
    const dispose = createRoot((d) => {
      createSkipLink({ target: '#main' });
      return d;
    });
    await tick();
    expect(document.querySelector('[data-a11yguard-skip-link]')).toBeTruthy();
    dispose();
    expect(document.querySelector('[data-a11yguard-skip-link]')).toBeNull();
  });
});

describe('createRouteAnnouncer', () => {
  it('focuses the heading on change but not initially', async () => {
    document.body.innerHTML = '<h1>Page</h1>';
    const [path, setPath] = createSignal('/a');
    const dispose = createRoot((d) => {
      createRouteAnnouncer(path);
      return d;
    });
    await tick();
    expect(document.activeElement).toBe(document.body);
    setPath('/b');
    await tick();
    expect(document.activeElement?.tagName).toBe('H1');
    dispose();
  });
});
