import type { AnnouncePriority, Announcer } from './types.js';

const VISUALLY_HIDDEN: Partial<CSSStyleDeclaration> = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: '0',
};

function applyVisuallyHidden(el: HTMLElement): void {
  Object.assign(el.style, VISUALLY_HIDDEN);
}

interface LiveRegion {
  polite: HTMLDivElement;
  assertive: HTMLDivElement;
}

function createLiveRegion(): LiveRegion {
  const polite = document.createElement('div');
  polite.setAttribute('role', 'status');
  polite.setAttribute('aria-live', 'polite');
  polite.setAttribute('aria-atomic', 'true');
  applyVisuallyHidden(polite);

  const assertive = document.createElement('div');
  assertive.setAttribute('role', 'alert');
  assertive.setAttribute('aria-live', 'assertive');
  assertive.setAttribute('aria-atomic', 'true');
  applyVisuallyHidden(assertive);

  document.body.appendChild(polite);
  document.body.appendChild(assertive);

  return { polite, assertive };
}

/** Singleton region used by the fire-and-forget `announce()` function. */
let sharedRegion: LiveRegion | null = null;

function getSharedRegion(): LiveRegion {
  if (!sharedRegion || !sharedRegion.polite.isConnected) {
    sharedRegion = createLiveRegion();
  }
  return sharedRegion;
}

/**
 * Fire-and-forget screen reader announcement using a shared live region.
 * Creates the live region on first call and reuses it thereafter.
 * SSR-safe — does nothing if called outside a browser environment.
 *
 * @example
 * import { announce } from '@shamaz332/a11yguard';
 * announce('Item deleted', 'assertive');
 */
export function announce(message: string, priority: AnnouncePriority = 'polite'): void {
  if (typeof document === 'undefined') return;
  const region = getSharedRegion();
  updateRegion(region, message, priority);
}

/**
 * Creates an independent announcer instance with its own live regions.
 * Use this when you need multiple independent live regions or want lifecycle control.
 *
 * @example
 * const announcer = createAnnouncer();
 * announcer.announce('Loading complete', 'polite');
 * // when component unmounts:
 * announcer.destroy();
 */
export function createAnnouncer(): Announcer {
  if (typeof document === 'undefined') {
    return {
      announce: () => undefined,
      destroy: () => undefined,
    };
  }

  const region = createLiveRegion();

  return {
    announce(message: string, priority: AnnouncePriority = 'polite'): void {
      updateRegion(region, message, priority);
    },
    destroy(): void {
      region.polite.remove();
      region.assertive.remove();
    },
  };
}

/** Debounce map: tracks last message per priority to avoid screen reader stutter. */
const lastMessages = new Map<string, string>();
const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

function updateRegion(region: LiveRegion, message: string, priority: AnnouncePriority): void {
  const key = `${priority}-${region.polite.id || Math.random()}`;
  const lastMessage = lastMessages.get(key);

  if (lastMessage === message) {
    clearTimeout(debounceTimers.get(key));
    debounceTimers.set(
      key,
      setTimeout(() => {
        doAnnounce(region, message, priority);
        lastMessages.delete(key);
      }, 100)
    );
    return;
  }

  doAnnounce(region, message, priority);
  lastMessages.set(key, message);

  // Clear the "same message" tracking after a short window
  setTimeout(() => lastMessages.delete(key), 200);
}

function doAnnounce(region: LiveRegion, message: string, priority: AnnouncePriority): void {
  const el = priority === 'assertive' ? region.assertive : region.polite;
  // Clear first so re-announcing the same string is detected by the AT
  el.textContent = '';
  requestAnimationFrame(() => {
    el.textContent = message;
  });
}
