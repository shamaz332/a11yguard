import { describe, it, expect } from 'vitest';
import { focusTrap } from '../../src/svelte/focus-trap.action.js';
import { keyboardNav } from '../../src/svelte/keyboard-nav.action.js';
import { announcer } from '../../src/svelte/announcer.js';
import { reducedMotion, colorScheme } from '../../src/svelte/preferences.js';
import { get } from 'svelte/store';

// ─── focusTrap action ─────────────────────────────────────────────────────────

function buildModal(): HTMLElement {
  const el = document.createElement('div');
  el.setAttribute('role', 'dialog');
  const btn = document.createElement('button');
  btn.textContent = 'Close';
  el.appendChild(btn);
  document.body.appendChild(el);
  return el;
}

describe('focusTrap action', () => {
  it('returns update and destroy', () => {
    const el = buildModal();
    const action = focusTrap(el, { active: false });
    expect(typeof action.update).toBe('function');
    expect(typeof action.destroy).toBe('function');
    action.destroy();
  });

  it('activates trap when active=true', () => {
    const el = buildModal();
    const action = focusTrap(el, { active: true });
    expect(() => action.destroy()).not.toThrow();
  });

  it('does not activate when active=false', () => {
    const el = buildModal();
    const action = focusTrap(el, { active: false });
    expect(() => action.destroy()).not.toThrow();
  });

  it('update changes active state', () => {
    const el = buildModal();
    const action = focusTrap(el, { active: false });
    expect(() => action.update({ active: true })).not.toThrow();
    action.destroy();
  });

  it('destroy cleans up without throw', () => {
    const el = buildModal();
    const action = focusTrap(el);
    expect(() => action.destroy()).not.toThrow();
  });
});

// ─── keyboardNav action ───────────────────────────────────────────────────────

describe('keyboardNav action', () => {
  it('returns update and destroy', () => {
    const el = document.createElement('div');
    el.innerHTML = '<button>A</button><button>B</button>';
    document.body.appendChild(el);

    const action = keyboardNav(el, { role: 'menu', items: 'button' });
    expect(typeof action.update).toBe('function');
    expect(typeof action.destroy).toBe('function');
    action.destroy();
  });

  it('responds to arrow keys after attachment', () => {
    const el = document.createElement('div');
    el.innerHTML = '<button>A</button><button>B</button>';
    document.body.appendChild(el);

    const action = keyboardNav(el, { role: 'menu', items: 'button' });
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
    expect(() => el.dispatchEvent(event)).not.toThrow();
    action.destroy();
  });

  it('update re-attaches nav', () => {
    const el = document.createElement('div');
    el.innerHTML = '<button>A</button>';
    document.body.appendChild(el);

    const action = keyboardNav(el, { role: 'menu', items: 'button' });
    expect(() => action.update({ role: 'listbox', items: 'button' })).not.toThrow();
    action.destroy();
  });
});

// ─── announcer ────────────────────────────────────────────────────────────────

describe('announcer', () => {
  it('announce() does not throw', () => {
    expect(() => announcer.announce('Test')).not.toThrow();
  });

  it('announce() with assertive priority does not throw', () => {
    expect(() => announcer.announce('Urgent', 'assertive')).not.toThrow();
  });

  it('creates a live region', () => {
    announcer.announce('Hello');
    const region = document.querySelector('[aria-live]');
    expect(region).toBeTruthy();
  });
});

// ─── preferences stores ───────────────────────────────────────────────────────

describe('reducedMotion store', () => {
  it('has a boolean value', () => {
    const val = get(reducedMotion);
    expect(typeof val).toBe('boolean');
  });
});

describe('colorScheme store', () => {
  it('has a valid ColorScheme value', () => {
    const val = get(colorScheme);
    expect(['light', 'dark', 'no-preference']).toContain(val);
  });
});
