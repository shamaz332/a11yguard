import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createFocusTrap } from '../../src/core/focus-trap.js';

function buildModal(buttons = 2): HTMLDivElement {
  const modal = document.createElement('div');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  for (let i = 0; i < buttons; i++) {
    const btn = document.createElement('button');
    btn.id = `btn-${i}`;
    btn.textContent = `Button ${i}`;
    modal.appendChild(btn);
  }
  document.body.appendChild(modal);
  return modal;
}

describe('createFocusTrap', () => {
  it('returns an object with the expected API', () => {
    const modal = buildModal();
    const trap = createFocusTrap(modal);
    expect(typeof trap.activate).toBe('function');
    expect(typeof trap.deactivate).toBe('function');
    expect(typeof trap.pause).toBe('function');
    expect(typeof trap.unpause).toBe('function');
    expect(typeof trap.destroy).toBe('function');
  });

  it('active is false before activation', () => {
    const modal = buildModal();
    const trap = createFocusTrap(modal);
    expect(trap.active).toBe(false);
  });

  it('active is true after activation', () => {
    const modal = buildModal();
    const trap = createFocusTrap(modal);
    trap.activate();
    expect(trap.active).toBe(true);
    trap.destroy();
  });

  it('active is false after deactivation', () => {
    const modal = buildModal();
    const trap = createFocusTrap(modal);
    trap.activate();
    trap.deactivate();
    expect(trap.active).toBe(false);
  });

  it('active is false when paused', () => {
    const modal = buildModal();
    const trap = createFocusTrap(modal);
    trap.activate();
    trap.pause();
    expect(trap.active).toBe(false);
    trap.destroy();
  });

  it('active is true after unpause', () => {
    const modal = buildModal();
    const trap = createFocusTrap(modal);
    trap.activate();
    trap.pause();
    trap.unpause();
    expect(trap.active).toBe(true);
    trap.destroy();
  });

  it('calls onActivate callback', () => {
    const modal = buildModal();
    const onActivate = vi.fn();
    const trap = createFocusTrap(modal, { onActivate });
    trap.activate();
    expect(onActivate).toHaveBeenCalledOnce();
    trap.destroy();
  });

  it('calls onDeactivate callback', () => {
    const modal = buildModal();
    const onDeactivate = vi.fn();
    const trap = createFocusTrap(modal, { onDeactivate });
    trap.activate();
    trap.deactivate();
    expect(onDeactivate).toHaveBeenCalledOnce();
  });

  it('cancels deactivation when onDeactivate returns false', () => {
    const modal = buildModal();
    const trap = createFocusTrap(modal, { onDeactivate: () => false });
    trap.activate();
    trap.deactivate();
    expect(trap.active).toBe(true);
    // Force cleanup
    trap['_paused'] = false;
    trap.destroy();
  });

  it('deactivates on Escape key when escapeDeactivates is true', () => {
    const modal = buildModal();
    const trap = createFocusTrap(modal, { escapeDeactivates: true });
    trap.activate();

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    document.dispatchEvent(event);

    expect(trap.active).toBe(false);
  });

  it('does not deactivate on Escape when escapeDeactivates is false', () => {
    const modal = buildModal();
    const trap = createFocusTrap(modal, { escapeDeactivates: false });
    trap.activate();

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    document.dispatchEvent(event);

    expect(trap.active).toBe(true);
    trap.destroy();
  });

  it('does not throw on double-activate', () => {
    const modal = buildModal();
    const trap = createFocusTrap(modal);
    expect(() => {
      trap.activate();
      trap.activate();
    }).not.toThrow();
    trap.destroy();
  });

  it('does not throw on double-destroy', () => {
    const modal = buildModal();
    const trap = createFocusTrap(modal);
    trap.activate();
    expect(() => {
      trap.destroy();
      trap.destroy();
    }).not.toThrow();
  });

  it('applies inert to sibling elements when isolate is true', () => {
    const sibling = document.createElement('div');
    sibling.id = 'sibling';
    document.body.appendChild(sibling);

    const modal = buildModal();
    const trap = createFocusTrap(modal, { isolate: true });
    trap.activate();

    expect(sibling.inert).toBe(true);

    trap.deactivate();

    expect(sibling.inert).toBe(false);
  });
});
