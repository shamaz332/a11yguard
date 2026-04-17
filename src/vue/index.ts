export { useFocusTrap } from './use-focus-trap.js';
export { useAnnouncer } from './use-announcer.js';
export { useReducedMotion } from './use-reduced-motion.js';
export { useColorScheme } from './use-color-scheme.js';
export { useKeyboardNav } from './use-keyboard-nav.js';
export { useScrollLock } from './use-scroll-lock.js';

export type { VueFocusTrapOptions } from './use-focus-trap.js';

// Re-export shared types for convenience
export type {
  FocusTrapOptions,
  AnnouncePriority,
  KeyboardNavOptions,
  ColorScheme,
} from '../core/types.js';
