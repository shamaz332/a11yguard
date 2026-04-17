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

// Color Contrast
export { checkContrast } from './contrast.js';

// Keyboard Navigation
export { createKeyboardNav } from './keyboard-nav.js';

// Focus Stack
export { pushFocus, popFocus, clearFocusStack, focusStackDepth } from './focus-stack.js';

// Scroll Lock
export { lockScroll, unlockScroll, isScrollLocked } from './scroll-lock.js';

// Skip Link
export { injectSkipLink } from './skip-link.js';

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
