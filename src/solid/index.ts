export { createFocusTrap } from './create-focus-trap.js';
export { createAnnouncer } from './create-announcer.js';
export { createReducedMotion, createColorScheme } from './create-preferences.js';
export {
  createContrastPreference,
  createForcedColors,
  createReducedTransparency,
  createInputModality,
} from './create-more-preferences.js';
export { createKeyboardNav } from './create-keyboard-nav.js';
export {
  createScrollLock,
  createFocusRestore,
  createSkipLink,
  createRouteAnnouncer,
} from './create-utilities.js';

export type { SolidFocusTrapOptions } from './create-focus-trap.js';

// Re-export shared types
export type {
  FocusTrapOptions,
  AnnouncePriority,
  KeyboardNavOptions,
  ColorScheme,
  ContrastPreference,
  InputModality,
  RouteChangeOptions,
  SkipLinkOptions,
} from '../core/types.js';
