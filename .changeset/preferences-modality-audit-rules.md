---
'@shamaz332/a11yguard': minor
---

More user preferences, input modality tracking and eight new audit rules:

- **Preferences** — `prefersContrast()`, `forcedColors()` (Windows High Contrast) and `prefersReducedTransparency()`, each with an `on…Change()` subscriber and wrappers in every adapter.
- **Input modality** — `getInputModality()` / `onInputModalityChange()` report `'keyboard'` or `'pointer'` and set `data-input-modality` on `<html>` for keyboard-only focus rings. Adapters: `useInputModality`, `inputModality$`, `inputModality`, `createInputModality`.
- **Audit rules** — `duplicate-id`, `aria-valid-attr`, `aria-valid-role`, `aria-hidden-focus`, `document-title`, `frame-title`, `table-headers`, `autocomplete-valid`. Each maps to its EN 301 549 clause.
