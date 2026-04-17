# @shamaz332/a11yguard

## 1.0.0

### Major Changes

Initial release of `@shamaz332/a11yguard`.

**Core primitives** (zero runtime dependencies):
- `createFocusTrap` — nested focus traps, `inert` isolation, shadow DOM support
- `announce` / `createAnnouncer` — singleton live-region announcer with reconnection detection
- `createKeyboardNav` — arrow key navigation, typeahead, grid mode, `aria-activedescendant`
- `lockScroll` / `unlockScroll` — iOS-safe reference-counted body scroll lock
- `pushFocus` / `popFocus` — stack-based focus restoration for layered UI
- `injectSkipLink` — visually-hidden skip-to-main link, revealed on focus
- `checkContrast` — WCAG 2.1 ratio + clean-room APCA Lc implementation
- `prefersReducedMotion` / `prefersColorScheme` — SSR-safe, reactive user preferences

**Framework adapters**:
- `@shamaz332/a11yguard/react` — hooks: `useFocusTrap`, `useAnnouncer`, `useKeyboardNav`, `useScrollLock`, `useReducedMotion`, `useColorScheme`
- `@shamaz332/a11yguard/vue` — composables: same API surface as React hooks
- `@shamaz332/a11yguard/angular` — `FocusTrapDirective`, `KeyboardNavDirective`, `AnnouncerService`, `PreferencesService`, `A11yGuardModule`
- `@shamaz332/a11yguard/svelte` — actions `focusTrap`, `keyboardNav` + readable stores + announcer
- `@shamaz332/a11yguard/solid` — `createFocusTrap`, `createAnnouncer`, `createKeyboardNav`, `createReducedMotion`, `createColorScheme`

**EAA audit module** (`@shamaz332/a11yguard/audit`):
- `auditEAA(options?)` — one-shot audit with 10 WCAG rules
- `watchEAA(onChange, options?)` — live MutationObserver-based watcher
- Each violation maps to its EN 301 549 / EAA Annex I clause reference
- Rules: `images-alt`, `form-labels`, `heading-order`, `landmarks`, `page-lang`, `contrast`, `focus-visible`, `link-purpose`, `button-name`, `target-size`
