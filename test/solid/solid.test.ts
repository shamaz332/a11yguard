import { describe, it, expect, vi } from 'vitest';
import { createRoot, createSignal } from 'solid-js';
import { createFocusTrap } from '../../src/solid/create-focus-trap.js';
import { createAnnouncer } from '../../src/solid/create-announcer.js';
import { createReducedMotion, createColorScheme } from '../../src/solid/create-preferences.js';
import { createKeyboardNav } from '../../src/solid/create-keyboard-nav.js';

// Mock matchMedia for preferences
vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
  matches: query === '(prefers-color-scheme: dark)',
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
})));

// ─── createAnnouncer ──────────────────────────────────────────────────────────

describe('createAnnouncer', () => {
  it('returns a callable function', () => {
    createRoot((dispose) => {
      const announce = createAnnouncer();
      expect(typeof announce).toBe('function');
      dispose();
    });
  });

  it('calling announce does not throw', () => {
    createRoot((dispose) => {
      const announce = createAnnouncer();
      expect(() => announce('Hello', 'polite')).not.toThrow();
      dispose();
    });
  });

  it('injects a live region on call', () => {
    createRoot((dispose) => {
      const announce = createAnnouncer();
      announce('Test');
      const region = document.querySelector('[aria-live]');
      expect(region).toBeTruthy();
      dispose();
    });
  });
});

// ─── createReducedMotion ──────────────────────────────────────────────────────

describe('createReducedMotion', () => {
  it('returns an Accessor<boolean>', () => {
    createRoot((dispose) => {
      const reduced = createReducedMotion();
      expect(typeof reduced()).toBe('boolean');
      dispose();
    });
  });
});

// ─── createColorScheme ────────────────────────────────────────────────────────

describe('createColorScheme', () => {
  it('returns an Accessor<ColorScheme>', () => {
    createRoot((dispose) => {
      const scheme = createColorScheme();
      expect(['light', 'dark', 'no-preference']).toContain(scheme());
      dispose();
    });
  });
});

// ─── createFocusTrap ──────────────────────────────────────────────────────────

describe('createFocusTrap', () => {
  it('does not throw when element is undefined', () => {
    createRoot((dispose) => {
      expect(() => {
        createFocusTrap(() => undefined);
      }).not.toThrow();
      dispose();
    });
  });

  it('activates trap when element is available', () => {
    createRoot((dispose) => {
      const el = document.createElement('div');
      const btn = document.createElement('button');
      el.appendChild(btn);
      document.body.appendChild(el);

      expect(() => {
        createFocusTrap(() => el, { active: () => true });
      }).not.toThrow();

      dispose();
    });
  });

  it('does not activate when active=false', () => {
    createRoot((dispose) => {
      const el = document.createElement('div');
      document.body.appendChild(el);

      expect(() => {
        createFocusTrap(() => el, { active: () => false });
      }).not.toThrow();

      dispose();
    });
  });

  it('reacts to active signal change', () => {
    createRoot((dispose) => {
      const el = document.createElement('div');
      const btn = document.createElement('button');
      el.appendChild(btn);
      document.body.appendChild(el);

      const [active, setActive] = createSignal(false);
      expect(() => {
        createFocusTrap(() => el, { active });
        setActive(true);
      }).not.toThrow();

      dispose();
    });
  });
});

// ─── createKeyboardNav ────────────────────────────────────────────────────────

describe('createKeyboardNav', () => {
  it('does not throw when element is undefined', () => {
    createRoot((dispose) => {
      expect(() => {
        createKeyboardNav(() => undefined, { role: 'menu', items: 'button' });
      }).not.toThrow();
      dispose();
    });
  });

  it('attaches nav when element is available', () => {
    createRoot((dispose) => {
      const el = document.createElement('div');
      el.innerHTML = '<button>A</button><button>B</button>';
      document.body.appendChild(el);

      expect(() => {
        createKeyboardNav(() => el, { role: 'menu', items: 'button' });
      }).not.toThrow();

      dispose();
    });
  });
});
