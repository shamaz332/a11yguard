export { A11yGuardModule } from './a11yguard.module.js';
export { FocusTrapDirective } from './focus-trap.directive.js';
export { KeyboardNavDirective } from './keyboard-nav.directive.js';
export { AnnouncerService } from './announcer.service.js';
export { PreferencesService } from './preferences.service.js';
export { RouteAnnouncerService } from './route-announcer.service.js';
export { A11yService } from './focus.service.js';
export { SkipLinkDirective } from './skip-link.directive.js';

// Re-export shared types
export type {
  FocusTrapOptions,
  AnnouncePriority,
  KeyboardNavOptions,
  KeyboardNavRole,
  ColorScheme,
  RouteChangeOptions,
} from '../core/types.js';
