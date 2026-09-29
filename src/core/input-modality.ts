import type { InputModality } from './types.js';

let modality: InputModality = 'keyboard';
let tracking = false;
const listeners = new Set<(modality: InputModality) => void>();

function set(next: InputModality): void {
  if (next === modality) return;
  modality = next;
  document.documentElement.setAttribute('data-input-modality', next);
  listeners.forEach((cb) => cb(next));
}

function onKeyDown(e: KeyboardEvent): void {
  // Shortcuts like Cmd+C do not move focus, so they don't count as keyboard navigation
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  set('keyboard');
}

function onPointerDown(): void {
  set('pointer');
}

function startTracking(): void {
  if (tracking || typeof document === 'undefined') return;
  tracking = true;
  document.documentElement.setAttribute('data-input-modality', modality);
  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('mousedown', onPointerDown, true);
  document.addEventListener('touchstart', onPointerDown, { capture: true, passive: true });
}

/**
 * Returns how the user last interacted: 'keyboard' or 'pointer' (mouse, touch, pen).
 * The first call starts tracking and sets `data-input-modality` on `<html>`, so CSS
 * can show focus rings only for keyboard users:
 *
 * `[data-input-modality="pointer"] .custom-control:focus { outline: none; }`
 *
 * Defaults to 'keyboard' until the user interacts. SSR-safe.
 *
 * @example
 * if (getInputModality() === 'keyboard') showFocusRing();
 */
export function getInputModality(): InputModality {
  startTracking();
  return modality;
}

/**
 * Subscribes to input modality changes. Starts tracking if needed.
 * Returns an unsubscribe function.
 *
 * @example
 * const unsub = onInputModalityChange((m) => console.log('now using', m));
 */
export function onInputModalityChange(callback: (modality: InputModality) => void): () => void {
  startTracking();
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}
