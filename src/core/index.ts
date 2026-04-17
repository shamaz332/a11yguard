// Focus Trap
export { createFocusTrap } from './focus-trap.js';

// Announcer
export { announce, createAnnouncer } from './announce.js';

// User Preferences
export {
  prefersReducedMotion,
  onReducedMotionChange,
  prefersColorScheme,
  onColorSchemeChange,
} from './preferences.js';

// Types
export type {
  FocusTrap,
  FocusTrapOptions,
  AnnouncePriority,
  Announcer,
  ColorInput,
  ContrastOptions,
  ContrastResult,
  WcagContrastResult,
  ApcaContrastResult,
  KeyboardNavRole,
  KeyboardNavOptions,
  KeyboardNav,
  SkipLinkOptions,
  ColorScheme,
} from './types.js';
