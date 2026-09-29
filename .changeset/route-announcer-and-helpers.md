---
'@shamaz332/a11yguard': minor
---

Add the everyday accessibility helpers most apps need:

- **Route announcer** — `announceRouteChange()` announces SPA navigations and moves focus to the new page heading. Adapters: `useRouteAnnouncer` (React, Vue), `RouteAnnouncerService` (Angular), `createRouteAnnouncer` (Solid).
- **Field descriptions** — `describeField()` wires labels, hints and error messages to inputs and keeps `aria-invalid` / `aria-errormessage` in sync.
- **IDs** — `createId()`, `ensureId()`, and SSR-safe `useA11yId()` for React 18+ and Vue 3.5+.
- **Visually hidden** — `visuallyHidden`, `visuallyHiddenCss`, `applyVisuallyHidden()`, plus `<VisuallyHidden>` for React and Vue.
- **Adapter parity** — skip link, focus restore and scroll lock in every framework: `useSkipLink`/`useFocusRestore` (React, Vue), `SkipLinkDirective`/`A11yService` (Angular), `scrollLock`/`focusRestore`/`skipLink` actions (Svelte), `createScrollLock`/`createFocusRestore`/`createSkipLink` (Solid).
