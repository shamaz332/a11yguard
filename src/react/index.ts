export { useFocusTrap } from './use-focus-trap.js';
export { useAnnouncer } from './use-announcer.js';
export { useReducedMotion } from './use-reduced-motion.js';
export { useColorScheme } from './use-color-scheme.js';
export { useKeyboardNav } from './use-keyboard-nav.js';
export { useScrollLock } from './use-scroll-lock.js';

export { useRouteAnnouncer } from './use-route-announcer.js';
export { useSkipLink } from './use-skip-link.js';
export { useFocusRestore } from './use-focus-restore.js';
export { useA11yId } from './use-a11y-id.js';
export { VisuallyHidden } from './visually-hidden.js';
export type { VisuallyHiddenProps } from './visually-hidden.js';
export type { UseFocusTrapOptions } from './use-focus-trap.js';

// Re-export shared types for convenience
export type {
  FocusTrapOptions,
  AnnouncePriority,
  KeyboardNavOptions,
  ColorScheme,
  RouteChangeOptions,
  SkipLinkOptions,
} from '../core/types.js';
