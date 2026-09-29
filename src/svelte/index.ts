export { focusTrap } from './focus-trap.action.js';
export { keyboardNav } from './keyboard-nav.action.js';
export { reducedMotion, colorScheme } from './preferences.js';
export { announcer } from './announcer.js';
export { scrollLock, focusRestore, skipLink } from './utility.actions.js';

export type { FocusTrapActionOptions } from './focus-trap.action.js';

// Re-export shared types
export type {
  FocusTrapOptions,
  AnnouncePriority,
  KeyboardNavOptions,
  ColorScheme,
  RouteChangeOptions,
} from '../core/types.js';
