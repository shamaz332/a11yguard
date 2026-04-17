# Contributing to @shamaz332/a11yguard

Thank you for your interest in contributing. This document covers how to set up
the project, run tests, add new features, and submit pull requests.

---

## Development setup

**Requirements**: Node 18+, pnpm 9+

```bash
git clone https://github.com/shamaz332/a11yguard.git
cd a11yguard
pnpm install
pnpm build
pnpm test
```

---

## Project structure

```
src/
  core/         Zero-dependency primitives (focus-trap, announce, etc.)
  react/        React hooks
  vue/          Vue composables
  angular/      Angular directives + services
  svelte/       Svelte actions + stores
  solid/        SolidJS primitives
  audit/        WCAG audit rules + auditEAA / watchEAA
test/
  core/         Unit tests for core primitives
  react/        React hook tests (@testing-library/react)
  vue/          Vue composable tests (@vue/test-utils)
  angular/      Angular directive/service tests (no TestBed)
  svelte/       Svelte action/store tests
  solid/        Solid primitive tests
  audit/        Integration tests for audit rules
examples/
  react-vite/
  vue-vite/
  angular/
  svelte-kit/
  solid-vite/
```

---

## Scripts

| Command | Purpose |
|---|---|
| `pnpm build` | Build ESM + CJS + DTS for all 7 entries |
| `pnpm test` | Run the full test suite (vitest + jsdom) |
| `pnpm test:watch` | Watch mode |
| `pnpm test:coverage` | Generate coverage report |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm size` | Check bundle size budgets |

All of these must pass before opening a pull request.

---

## Adding a new audit rule

1. Create `src/audit/rules/your-rule.ts`. Export an `AuditRule` object:

```ts
import type { AuditRule, Violation, WCAGLevel } from '../types.js';
import { makeViolation, queryAll } from '../utils.js';

export const yourRule: AuditRule = {
  id: 'your-rule',
  wcag: ['X.X.X'],         // WCAG success criterion ID
  severity: 'serious',     // 'critical' | 'serious' | 'moderate' | 'minor'

  check(root: Element | Document, level: WCAGLevel): Violation[] {
    const violations: Violation[] = [];
    for (const el of queryAll(root, 'your-selector')) {
      if (/* fails condition */) {
        violations.push(
          makeViolation('your-rule', ['X.X.X'], 'serious', el, 'Message', 'How to fix'),
        );
      }
    }
    return violations;
  },
};
```

2. Import and add it to the `ALL_RULES` array in `src/audit/index.ts`.
3. Add integration tests in `test/audit/audit.test.ts` — cover both the passing and failing cases.
4. Verify the WCAG criterion ID exists in `src/audit/eaa-map.ts`. If not, add it.

---

## Commit conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(core): add new focus-trap option
fix(react): handle ref cleanup on strict mode unmount
docs: update SvelteKit installation guide
test(audit): add contrast rule edge case
chore: bump tsup to 8.1.0
```

Scopes: `core`, `react`, `vue`, `angular`, `svelte`, `solid`, `audit`, `docs`, `ci`.

---

## Pull request checklist

- [ ] `pnpm test` passes (all 220+ tests)
- [ ] `pnpm build` succeeds for all 7 entries
- [ ] `pnpm typecheck` passes with no errors
- [ ] New public API has JSDoc `@example` blocks
- [ ] New audit rules have integration tests covering pass and fail cases
- [ ] Bundle size (`pnpm size`) stays within budget
- [ ] PR description explains _why_, not just _what_

---

## Releasing

Releases are managed with [Changesets](https://github.com/changesets/changesets).

```bash
# Create a changeset for your changes
pnpm changeset

# (maintainers only) Version bump + publish
pnpm changeset version
pnpm publish --access public
```

The CI `release` workflow runs `changeset version` + `npm publish` automatically
when a `changeset/release` PR is merged into `main`.

---

## Code style

- TypeScript strict mode, ES2022
- No comments that explain *what* — only *why* (hidden constraints, non-obvious invariants)
- No `any` — use proper types or `unknown`
- No runtime dependencies — if you find yourself reaching for an npm package, implement the minimal subset you need
- SSR-safe by default — guard every `window`/`document` access

---

## Accessibility standards references

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/)
- [EN 301 549 v3.2.1](https://www.etsi.org/deliver/etsi_en/301500_302000/301549/03.02.01_60/en_301549v030201p.pdf)
- [EU Directive 2019/882 (EAA)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882)
- [APCA public specification](https://git.apcaw3.com/Myndex/SAPC-APCA)
