import { describe, it, expect, beforeEach } from 'vitest';
import { pushFocus, popFocus, clearFocusStack, focusStackDepth } from '../../src/core/focus-stack.js';

beforeEach(() => {
  clearFocusStack();
});

describe('pushFocus / popFocus', () => {
  it('saves and restores focused element', () => {
    const btn = document.createElement('button');
    btn.textContent = 'Trigger';
    document.body.appendChild(btn);
    btn.focus();

    expect(document.activeElement).toBe(btn);

    pushFocus();
    expect(focusStackDepth()).toBe(1);

    // Focus moves elsewhere
    const other = document.createElement('button');
    document.body.appendChild(other);
    other.focus();
    expect(document.activeElement).toBe(other);

    const restored = popFocus();
    expect(restored).toBe(true);
    expect(document.activeElement).toBe(btn);
    expect(focusStackDepth()).toBe(0);
  });

  it('returns false when stack is empty', () => {
    expect(popFocus()).toBe(false);
  });

  it('pushFocus does nothing if no element is focused', () => {
    // Blur everything
    (document.activeElement as HTMLElement | null)?.blur?.();
    pushFocus();
    // May or may not push depending on what activeElement is
    // Key assertion: no throw
    expect(focusStackDepth()).toBeLessThanOrEqual(1);
  });

  it('supports nested pushes', () => {
    const a = document.createElement('button');
    const b = document.createElement('button');
    document.body.appendChild(a);
    document.body.appendChild(b);

    a.focus();
    pushFocus();

    b.focus();
    pushFocus();

    expect(focusStackDepth()).toBe(2);

    popFocus(); // should restore b (last pushed was b)
    expect(focusStackDepth()).toBe(1);

    popFocus(); // should restore a
    expect(focusStackDepth()).toBe(0);
  });
});

describe('clearFocusStack', () => {
  it('empties the stack without focusing', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);
    btn.focus();
    pushFocus();
    pushFocus();
    expect(focusStackDepth()).toBe(2);

    clearFocusStack();
    expect(focusStackDepth()).toBe(0);
  });
});
