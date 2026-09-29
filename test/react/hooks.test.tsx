import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useFocusTrap } from '../../src/react/use-focus-trap.js';
import { useAnnouncer } from '../../src/react/use-announcer.js';
import { useReducedMotion } from '../../src/react/use-reduced-motion.js';
import { useColorScheme } from '../../src/react/use-color-scheme.js';
import { useScrollLock } from '../../src/react/use-scroll-lock.js';
import { useKeyboardNav } from '../../src/react/use-keyboard-nav.js';
import { isScrollLocked, unlockScroll } from '../../src/core/scroll-lock.js';

// ─── useFocusTrap ─────────────────────────────────────────────────────────────

function FocusTrapModal({ open, onClose }: { open: boolean; onClose?: () => void }) {
  const ref = useFocusTrap({
    active: open,
    escapeDeactivates: true,
    ...(onClose ? { onDeactivate: onClose } : {}),
  });
  return open ? (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      role="dialog"
      aria-modal="true"
      data-testid="modal"
    >
      <button data-testid="first">First</button>
      <button data-testid="close" onClick={onClose}>
        Close
      </button>
    </div>
  ) : null;
}

describe('useFocusTrap', () => {
  it('renders and attaches ref when active', () => {
    render(<FocusTrapModal open={true} />);
    expect(screen.getByTestId('modal')).toBeTruthy();
  });

  it('does not render when not active', () => {
    render(<FocusTrapModal open={false} />);
    expect(screen.queryByTestId('modal')).toBeNull();
  });

  it('returned ref is a RefObject', () => {
    function TestHook() {
      const ref = useFocusTrap();
      return <div ref={ref as React.RefObject<HTMLDivElement>} data-testid="container" />;
    }
    render(<TestHook />);
    expect(screen.getByTestId('container')).toBeTruthy();
  });
});

// ─── useAnnouncer ─────────────────────────────────────────────────────────────

function AnnouncerComponent({ message }: { message: string }) {
  const announce = useAnnouncer();
  return (
    <button onClick={() => announce(message)} data-testid="btn">
      Announce
    </button>
  );
}

describe('useAnnouncer', () => {
  it('returns a callable function', () => {
    render(<AnnouncerComponent message="Hello" />);
    expect(() => screen.getByTestId('btn').click()).not.toThrow();
  });

  it('injects a live region into the document when announce is called', () => {
    render(<AnnouncerComponent message="Test" />);
    // Trigger the announce by clicking the button
    screen.getByTestId('btn').click();
    const region = document.querySelector('[aria-live]');
    expect(region).toBeTruthy();
  });

  it('function identity is stable across re-renders', () => {
    let prev: ((...args: unknown[]) => void) | null = null;
    function Stable() {
      const announce = useAnnouncer();
      if (prev === null) prev = announce as (...args: unknown[]) => void;
      else expect(announce).toBe(prev);
      return <div />;
    }
    const { rerender } = render(<Stable />);
    rerender(<Stable />);
  });
});

// ─── useReducedMotion ─────────────────────────────────────────────────────────

describe('useReducedMotion', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))
    );
  });

  it('returns a boolean', () => {
    function TestHook() {
      const reduced = useReducedMotion();
      return <div data-reduced={String(reduced)} data-testid="el" />;
    }
    render(<TestHook />);
    const el = screen.getByTestId('el');
    expect(['true', 'false']).toContain(el.getAttribute('data-reduced'));
  });
});

// ─── useColorScheme ───────────────────────────────────────────────────────────

describe('useColorScheme', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))
    );
  });

  it('returns a ColorScheme string', () => {
    function TestHook() {
      const scheme = useColorScheme();
      return <div data-scheme={scheme} data-testid="el" />;
    }
    render(<TestHook />);
    const el = screen.getByTestId('el');
    expect(['light', 'dark', 'no-preference']).toContain(el.getAttribute('data-scheme'));
  });
});

// ─── useScrollLock ────────────────────────────────────────────────────────────

// Stub scrollTo for jsdom
vi.stubGlobal('scrollTo', vi.fn());

describe('useScrollLock', () => {
  beforeEach(() => {
    while (isScrollLocked()) {
      unlockScroll();
    }
  });

  it('locks scroll when active=true', () => {
    function TestHook() {
      useScrollLock(true);
      return <div />;
    }
    render(<TestHook />);
    expect(isScrollLocked()).toBe(true);
  });

  it('does not lock scroll when active=false', () => {
    function TestHook() {
      useScrollLock(false);
      return <div />;
    }
    render(<TestHook />);
    expect(isScrollLocked()).toBe(false);
  });

  it('unlocks on unmount', () => {
    function TestHook() {
      useScrollLock(true);
      return <div />;
    }
    const { unmount } = render(<TestHook />);
    expect(isScrollLocked()).toBe(true);
    unmount();
    expect(isScrollLocked()).toBe(false);
  });
});

// ─── useKeyboardNav ───────────────────────────────────────────────────────────

describe('useKeyboardNav', () => {
  it('attaches keyboard nav to container', () => {
    function TestNav() {
      const ref = useKeyboardNav({ role: 'menu', items: 'button' });
      return (
        <div ref={ref as React.RefObject<HTMLDivElement>} role="menu" data-testid="menu">
          <button>A</button>
          <button>B</button>
        </div>
      );
    }
    render(<TestNav />);
    const menu = screen.getByTestId('menu');
    expect(menu).toBeTruthy();
    // Verify it responds to arrow keys without throwing
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
    expect(() => menu.dispatchEvent(event)).not.toThrow();
  });
});
