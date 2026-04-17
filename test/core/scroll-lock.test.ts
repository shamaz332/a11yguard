import { describe, it, expect, beforeEach, vi } from 'vitest';
import { lockScroll, unlockScroll, isScrollLocked } from '../../src/core/scroll-lock.js';

// jsdom does not implement window.scrollTo — stub it
vi.stubGlobal('scrollTo', vi.fn());

beforeEach(() => {
  // Ensure clean state: unlock any leftover locks
  while (isScrollLocked()) unlockScroll();
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  document.body.style.overflowY = '';
  document.body.style.paddingRight = '';
});

describe('lockScroll / unlockScroll', () => {
  it('sets position:fixed on body when locked', () => {
    lockScroll();
    expect(document.body.style.position).toBe('fixed');
    expect(isScrollLocked()).toBe(true);
    unlockScroll();
  });

  it('restores body styles on unlock', () => {
    lockScroll();
    unlockScroll();
    expect(document.body.style.position).toBe('');
    expect(isScrollLocked()).toBe(false);
  });

  it('is reference-counted — single unlock does not release when locked twice', () => {
    lockScroll();
    lockScroll();
    expect(isScrollLocked()).toBe(true);
    unlockScroll();
    expect(isScrollLocked()).toBe(true); // still locked
    unlockScroll();
    expect(isScrollLocked()).toBe(false);
  });

  it('extra unlocks do not throw', () => {
    expect(() => unlockScroll()).not.toThrow();
    expect(() => unlockScroll()).not.toThrow();
  });

  it('sets body top to negative scrollY offset', () => {
    // jsdom has scrollY = 0, so top is '-0px' which browsers normalise to '0px'
    lockScroll();
    expect(document.body.style.top).toBe('0px');
    unlockScroll();
  });
});

describe('isScrollLocked', () => {
  it('returns false initially', () => {
    expect(isScrollLocked()).toBe(false);
  });

  it('returns true after lock', () => {
    lockScroll();
    expect(isScrollLocked()).toBe(true);
    unlockScroll();
  });
});
