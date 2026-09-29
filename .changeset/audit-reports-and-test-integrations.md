---
'@shamaz332/a11yguard': minor
---

Use the EAA audit in tests and CI:

- **Reports** — `formatReport(result, 'text' | 'markdown' | 'json')` and `logReport(result)` for development console warnings (`watchEAA(logReport)`).
- **`@shamaz332/a11yguard/testing`** — `toHaveNoEAAViolations()` matcher for Vitest and Jest. Page-level rules are skipped when auditing a single element.
- **`@shamaz332/a11yguard/playwright`** — `checkEAA(page, options)` and `assertNoEAAViolations(page, options)` run the audit inside a real browser page and return serializable results. No Playwright dependency.
