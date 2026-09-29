# @shamaz332/a11yguard

[![npm](https://img.shields.io/npm/v/@shamaz332/a11yguard)](https://www.npmjs.com/package/@shamaz332/a11yguard)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@shamaz332/a11yguard)](https://bundlephobia.com/package/@shamaz332/a11yguard)
[![license](https://img.shields.io/npm/l/@shamaz332/a11yguard)](./LICENSE)
[![CI](https://github.com/shamaz332/a11yguard/actions/workflows/ci.yml/badge.svg)](https://github.com/shamaz332/a11yguard/actions)

**One install. Every framework. Zero dependencies. Full WCAG 2.2 AA + EAA compliance.**

---

## Why a11yguard?

The **European Accessibility Act (EAA)** — EU Directive 2019/882 — took full legal effect on **28 June 2025**. It mandates that digital products and services sold or operated in the EU meet WCAG 2.1 AA requirements (via EN 301 549), with fines and market-access restrictions for non-compliance. Similar legislation is in force or advancing in the US (Section 508, ADA), UK (PSBAR), Canada (ACA), and Australia (DDA).

Existing solutions either:
- Require a different install per framework (`react-focus-lock`, `vue-announcer`, Angular CDK, etc.)
- Carry runtime dependencies that bloat bundles
- Audit-only (axe-core, Lighthouse) — they find problems but don't fix them
- Are unmaintained (ally.js, focus-trap was archived in 2024)

**a11yguard** ships a complete accessibility toolkit in a single package:
- **Behaviour primitives** that work in every framework
- **Framework adapters** (React, Vue, Angular, Svelte, Solid) with idiomatic APIs
- **Runtime audit** that maps violations directly to EAA / EN 301 549 articles
- **Zero runtime dependencies** — no `tabbable`, no `focus-trap`, nothing

---

## What's included

| Feature | Import | Description |
|---|---|---|
| Focus trap | `@shamaz332/a11yguard` | Trap keyboard focus inside modals/dialogs. Nested traps, `inert` isolation, shadow DOM |
| Screen reader announcer | `@shamaz332/a11yguard` | Polite/assertive live-region messages. Singleton + reconnection detection |
| Keyboard navigation | `@shamaz332/a11yguard` | Arrow key nav, Home/End, typeahead, grid mode, `aria-activedescendant` |
| Scroll lock | `@shamaz332/a11yguard` | iOS-safe body scroll lock, reference-counted, prevents layout shift |
| Focus stack | `@shamaz332/a11yguard` | Push/pop focus for layered UI (modals stacking on drawers) |
| Skip link | `@shamaz332/a11yguard` | Inject a "Skip to main content" link as the first tab stop |
| Route announcer | `@shamaz332/a11yguard` | Announce SPA navigations and move focus to the new page heading |
| Field descriptions | `@shamaz332/a11yguard` | Wire labels, hints and error messages to inputs; announce new errors |
| IDs | `@shamaz332/a11yguard` | `createId()` / `ensureId()` for `aria-labelledby`, `aria-describedby`, `aria-controls` |
| Visually hidden | `@shamaz332/a11yguard` | Screen-reader-only text as a style object, CSS string or component |
| Contrast checker | `@shamaz332/a11yguard` | WCAG 2.1 ratio + APCA Lc (clean-room). Returns pass/fail per level |
| User preferences | `@shamaz332/a11yguard` | `prefers-reduced-motion`, `prefers-color-scheme`, `prefers-contrast`, `forced-colors`, `prefers-reduced-transparency` — SSR-safe, reactive |
| Input modality | `@shamaz332/a11yguard` | Know whether the user is on keyboard or pointer; sets `data-input-modality` on `<html>` for focus-ring CSS |
| **React hooks** | `@shamaz332/a11yguard/react` | `useFocusTrap`, `useAnnouncer`, `useKeyboardNav`, `useScrollLock`, `useReducedMotion`, `useColorScheme`, `useRouteAnnouncer`, `useSkipLink`, `useFocusRestore`, `useA11yId`, `<VisuallyHidden>` |
| **Vue composables** | `@shamaz332/a11yguard/vue` | `useFocusTrap`, `useAnnouncer`, `useKeyboardNav`, `useScrollLock`, `useReducedMotion`, `useColorScheme`, `useRouteAnnouncer`, `useSkipLink`, `useFocusRestore`, `useA11yId`, `<VisuallyHidden>` |
| **Angular directives** | `@shamaz332/a11yguard/angular` | `FocusTrapDirective`, `KeyboardNavDirective`, `SkipLinkDirective`, `AnnouncerService`, `PreferencesService`, `RouteAnnouncerService`, `A11yService`, `A11yGuardModule` |
| **Svelte actions** | `@shamaz332/a11yguard/svelte` | `focusTrap`, `keyboardNav`, `scrollLock`, `focusRestore`, `skipLink` actions + `reducedMotion`, `colorScheme` stores |
| **Solid primitives** | `@shamaz332/a11yguard/solid` | `createFocusTrap`, `createAnnouncer`, `createKeyboardNav`, `createReducedMotion`, `createColorScheme`, `createScrollLock`, `createFocusRestore`, `createSkipLink`, `createRouteAnnouncer` |
| **EAA audit** | `@shamaz332/a11yguard/audit` | `auditEAA()`, `watchEAA()` — 18 WCAG rules mapped to EN 301 549 / EAA articles |

---

## Bundle sizes (minified + gzipped)

| Entry | Size |
|---|---|
| `@shamaz332/a11yguard` (core) | ~8 KB |
| `@shamaz332/a11yguard/react` | ~7 KB |
| `@shamaz332/a11yguard/vue` | ~7 KB |
| `@shamaz332/a11yguard/angular` | ~7 KB |
| `@shamaz332/a11yguard/svelte` | ~6 KB |
| `@shamaz332/a11yguard/solid` | ~6 KB |
| `@shamaz332/a11yguard/audit` | ~9 KB |

You only pay for what you import. Tree-shaking removes everything you don't use.

---

## Zero dependencies

```
@shamaz332/a11yguard
└── (nothing)
```

There are **no runtime dependencies**. Everything — focusable element detection, contrast algorithms, live regions, MutationObserver watcher — is implemented from scratch in TypeScript, guided by the WCAG 2.1, WCAG 2.2, and APCA public specifications.

---

## Installation

```bash
# npm
npm install @shamaz332/a11yguard

# pnpm
pnpm add @shamaz332/a11yguard

# yarn
yarn add @shamaz332/a11yguard
```

No peer dependencies are required. Framework peer deps (`react`, `vue`, etc.) are optional — only install the one you use.

---

## Framework guides

### Vanilla JS / Browser script

```bash
npm install @shamaz332/a11yguard
```

```ts
import {
  createFocusTrap,
  announce,
  createKeyboardNav,
  lockScroll,
  unlockScroll,
  injectSkipLink,
  checkContrast,
  prefersReducedMotion,
  onReducedMotionChange,
} from '@shamaz332/a11yguard';

// Skip link — call once on page load
injectSkipLink();

// Screen reader announcements
announce('Page loaded', 'polite');
announce('Error: form invalid', 'assertive');

// Focus trap for a modal
const modal = document.getElementById('modal')!;
const trap = createFocusTrap(modal, { escapeDeactivates: true });

document.getElementById('open-btn')!.addEventListener('click', () => {
  modal.hidden = false;
  trap.activate();
  lockScroll();
});

document.getElementById('close-btn')!.addEventListener('click', () => {
  trap.deactivate();
  unlockScroll();
  modal.hidden = true;
});

// Keyboard navigation for a menu
const menu = document.querySelector('[role="menu"]')!;
const nav = createKeyboardNav(menu as HTMLElement, {
  role: 'menu',
  items: '[role="menuitem"]',
});

// Contrast check
const result = checkContrast('#1a1a1a', '#ffffff');
console.log(result.wcag?.ratio); // 18.1
console.log(result.wcag?.aa);    // true

// User preferences
if (prefersReducedMotion()) {
  document.documentElement.classList.add('reduce-motion');
}
onReducedMotionChange((reduced) => {
  document.documentElement.classList.toggle('reduce-motion', reduced);
});
```

**CDN (ESM via jsDelivr)**:

```html
<script type="module">
  import { injectSkipLink, announce } from 'https://cdn.jsdelivr.net/npm/@shamaz332/a11yguard/+esm';
  injectSkipLink();
</script>
```

---

### React + Vite

**Prerequisites**: Node 18+, Vite project created with `npm create vite@latest -- --template react-ts`

```bash
npm install @shamaz332/a11yguard
```

```tsx
// src/App.tsx
import { useEffect } from 'react';
import {
  useFocusTrap,
  useAnnouncer,
  useReducedMotion,
  useColorScheme,
  useKeyboardNav,
  useScrollLock,
} from '@shamaz332/a11yguard/react';
import { injectSkipLink } from '@shamaz332/a11yguard';

export default function App() {
  useEffect(() => injectSkipLink(), []);

  const [isOpen, setIsOpen] = useState(false);
  const announce = useAnnouncer();
  const reducedMotion = useReducedMotion();
  const colorScheme = useColorScheme();

  const modalRef = useFocusTrap<HTMLDivElement>({ active: isOpen });
  const menuRef = useKeyboardNav<HTMLDivElement>({
    role: 'menu',
    items: '[role="menuitem"]',
  });

  useScrollLock(isOpen);

  function openModal() {
    setIsOpen(true);
    announce('Dialog opened', 'polite');
  }

  function closeModal() {
    setIsOpen(false);
    announce('Dialog closed', 'polite');
  }

  return (
    <main id="main">
      <p>Motion: {String(reducedMotion)} | Scheme: {colorScheme}</p>

      <button onClick={openModal}>Open dialog</button>

      {isOpen && (
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          style={{ position: 'fixed', inset: 0, background: '#fff', padding: 32 }}
        >
          <h2 id="dialog-title">Accessible dialog</h2>
          <p>Focus is trapped here. Press Escape or Cancel to close.</p>
          <button onClick={closeModal}>Cancel</button>
          <button onClick={closeModal}>Confirm</button>
        </div>
      )}

      <nav>
        <div
          ref={menuRef}
          role="menu"
          aria-label="Actions"
        >
          <div role="menuitem" tabIndex={0}>Edit</div>
          <div role="menuitem" tabIndex={-1}>Delete</div>
          <div role="menuitem" tabIndex={-1}>Share</div>
        </div>
      </nav>
    </main>
  );
}
```

**TypeScript config**: The package ships with full `.d.ts` files. No extra `tsconfig` changes needed.

**Common gotchas**:
- `useFocusTrap` returns a ref — attach it to the dialog container, not the trigger button.
- `useScrollLock(isOpen)` locks/unlocks automatically when `isOpen` changes. No manual cleanup needed.
- `useAnnouncer()` returns a stable function — safe to call from event handlers or effects.

---

### Next.js — App Router

**Prerequisites**: Next.js 13.4+ with the App Router (`app/` directory)

```bash
npm install @shamaz332/a11yguard
```

All a11yguard hooks require a browser DOM. Mark any component that uses them with `'use client'`.

```tsx
// app/components/Modal.tsx
'use client';

import { useFocusTrap, useAnnouncer, useScrollLock } from '@shamaz332/a11yguard/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function Modal({ isOpen, onClose }: Props) {
  const ref = useFocusTrap<HTMLDivElement>({ active: isOpen });
  const announce = useAnnouncer();
  useScrollLock(isOpen);

  function handleClose() {
    announce('Dialog closed', 'polite');
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="modal"
    >
      <h2 id="modal-title">Confirm action</h2>
      <p>This action cannot be undone.</p>
      <button onClick={handleClose}>Cancel</button>
      <button onClick={handleClose}>Confirm</button>
    </div>
  );
}
```

```tsx
// app/layout.tsx
import { SkipLinkServer } from './components/SkipLinkServer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Render skip link in SSR — no JS needed */}
        <a
          href="#main"
          className="skip-link"
          style={{
            position: 'absolute',
            left: '-9999px',
            top: 0,
            zIndex: 9999,
          }}
          onFocus={(e) => { e.currentTarget.style.left = '0'; }}
          onBlur={(e) => { e.currentTarget.style.left = '-9999px'; }}
        >
          Skip to main content
        </a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
```

**SSR safety**: `useFocusTrap`, `useAnnouncer`, `useScrollLock` are all SSR-safe — they check `typeof window` before accessing the DOM. You can import them in `'use client'` components without guarding the import.

**Common gotchas**:
- Do **not** call `injectSkipLink()` in a Server Component — use the inline `<a>` approach shown above instead, or call it inside a `useEffect` in a `'use client'` component.
- `useReducedMotion()` returns `false` during SSR and updates on the client.

---

### Next.js — Pages Router

```bash
npm install @shamaz332/a11yguard
```

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { injectSkipLink } from '@shamaz332/a11yguard';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    injectSkipLink();
  }, []);

  return <Component {...pageProps} />;
}
```

```tsx
// pages/index.tsx
import { useState } from 'react';
import { useFocusTrap, useAnnouncer, useScrollLock } from '@shamaz332/a11yguard/react';

export default function Home() {
  const [open, setOpen] = useState(false);
  const ref = useFocusTrap<HTMLDivElement>({ active: open });
  const announce = useAnnouncer();
  useScrollLock(open);

  return (
    <main id="main">
      <h1>My accessible page</h1>
      <button onClick={() => { setOpen(true); announce('Dialog opened', 'polite'); }}>
        Open dialog
      </button>
      {open && (
        <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="dlg-title">
          <h2 id="dlg-title">Dialog</h2>
          <button onClick={() => setOpen(false)}>Close</button>
        </div>
      )}
    </main>
  );
}
```

**Common gotchas**:
- Pages Router components are always client-side rendered — no `'use client'` directive needed.
- `injectSkipLink()` in `_app.tsx` runs once on mount and inserts the link before all other body content.

---

### Vue 3 + Vite

**Prerequisites**: Vue 3 project from `npm create vue@latest`

```bash
npm install @shamaz332/a11yguard
```

```vue
<!-- src/App.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  useFocusTrap,
  useAnnouncer,
  useReducedMotion,
  useColorScheme,
  useKeyboardNav,
  useScrollLock,
} from '@shamaz332/a11yguard/vue';
import { injectSkipLink } from '@shamaz332/a11yguard';

onMounted(() => injectSkipLink());

const isOpen = ref(false);
const announce = useAnnouncer();
const reducedMotion = useReducedMotion();
const colorScheme = useColorScheme();

const modalRef = useFocusTrap({ active: isOpen });
const menuRef = useKeyboardNav({ role: 'menu', items: '[role="menuitem"]' });
useScrollLock(isOpen);

function openModal() {
  isOpen.value = true;
  announce('Dialog opened', 'polite');
}

function closeModal() {
  isOpen.value = false;
  announce('Dialog closed', 'polite');
}
</script>

<template>
  <main id="main">
    <p>Motion: {{ reducedMotion }} | Scheme: {{ colorScheme }}</p>

    <button @click="openModal">Open dialog</button>

    <Teleport to="body">
      <div v-if="isOpen" class="backdrop">
        <div
          :ref="(el) => (modalRef as any).value = el"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          class="modal"
        >
          <h2 id="modal-title">Accessible dialog</h2>
          <p>Focus is trapped here. Press Escape to close.</p>
          <button @click="closeModal">Cancel</button>
          <button @click="closeModal">Confirm</button>
        </div>
      </div>
    </Teleport>

    <div
      ref="menuRef"
      role="menu"
      aria-label="Actions"
    >
      <div role="menuitem" :tabindex="0">Edit</div>
      <div role="menuitem" :tabindex="-1">Delete</div>
    </div>
  </main>
</template>
```

**Common gotchas**:
- `useFocusTrap` returns a `Ref<HTMLElement | null>` — use it as a template ref via `:ref="(el) => modalRef.value = el"` or bind it directly with `ref="modalRef"` if using the Composition API's `ref` form.
- `useScrollLock` accepts a `Ref<boolean>` or a plain `boolean`.

---

### Nuxt 3

**Prerequisites**: Nuxt 3 project from `npx nuxi init`

```bash
npm install @shamaz332/a11yguard
```

Create a client-side plugin so the skip link and preferences are wired up on every page:

```ts
// plugins/a11yguard.client.ts
import { injectSkipLink, onReducedMotionChange } from '@shamaz332/a11yguard';

export default defineNuxtPlugin(() => {
  injectSkipLink();

  onReducedMotionChange((reduced) => {
    document.documentElement.classList.toggle('reduce-motion', reduced);
  });
});
```

Use composables in pages and components:

```vue
<!-- pages/index.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useFocusTrap, useAnnouncer, useScrollLock } from '@shamaz332/a11yguard/vue';

const isOpen = ref(false);
const announce = useAnnouncer();
const modalRef = useFocusTrap({ active: isOpen });
useScrollLock(isOpen);
</script>

<template>
  <main id="main">
    <button @click="isOpen = true">Open dialog</button>
    <ClientOnly>
      <Teleport to="body">
        <div v-if="isOpen" class="backdrop">
          <div ref="modalRef" role="dialog" aria-modal="true" aria-labelledby="title">
            <h2 id="title">Dialog</h2>
            <button @click="isOpen = false">Close</button>
          </div>
        </div>
      </Teleport>
    </ClientOnly>
  </main>
</template>
```

**SSR safety**: The plugin file is named `.client.ts` so Nuxt only loads it in the browser. Composables like `useFocusTrap` guard against SSR internally, but wrapping modals in `<ClientOnly>` avoids hydration mismatches.

**Common gotchas**:
- Wrap DOM-interactive components in `<ClientOnly>` to prevent hydration warnings.
- The `.client.ts` plugin suffix is the Nuxt convention — rename to `.ts` only if you add SSR guards yourself.

---

### Angular 17+ (standalone)

**Prerequisites**: Angular 17+ project from `ng new my-app --standalone`

```bash
npm install @shamaz332/a11yguard
```

Import directives and provide services in your standalone component or `app.config.ts`:

```ts
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
    // AnnouncerService and PreferencesService are providedIn: 'root'
    // so no extra registration is needed
  ],
};
```

```ts
// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FocusTrapDirective,
  KeyboardNavDirective,
  AnnouncerService,
  PreferencesService,
} from '@shamaz332/a11yguard/angular';
import { injectSkipLink } from '@shamaz332/a11yguard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FocusTrapDirective, KeyboardNavDirective],
  template: `
    <main id="main">
      <p>Motion: {{ reducedMotion }} | Scheme: {{ colorScheme }}</p>

      <button (click)="openModal()">Open dialog</button>

      <div *ngIf="isOpen" class="backdrop">
        <div
          a11yFocusTrap
          [active]="isOpen"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          class="modal"
        >
          <h2 id="modal-title">Accessible dialog</h2>
          <p>Focus is trapped here. Escape closes this.</p>
          <button (click)="closeModal()">Cancel</button>
          <button (click)="closeModal()">Confirm</button>
        </div>
      </div>

      <div
        a11yKeyboardNav
        navRole="menu"
        navItems="[role='menuitem']"
        role="menu"
        aria-label="Actions"
      >
        <div role="menuitem" tabindex="0">Edit</div>
        <div role="menuitem" tabindex="-1">Delete</div>
      </div>
    </main>
  `,
})
export class AppComponent implements OnInit {
  isOpen = false;
  reducedMotion = false;
  colorScheme = 'light';

  constructor(
    private announcer: AnnouncerService,
    private prefs: PreferencesService,
  ) {}

  ngOnInit(): void {
    injectSkipLink();
    this.prefs.reducedMotion$.subscribe((v) => (this.reducedMotion = v));
    this.prefs.colorScheme$.subscribe((v) => (this.colorScheme = v));
  }

  openModal(): void {
    this.isOpen = true;
    this.announcer.announce('Dialog opened', 'polite');
  }

  closeModal(): void {
    this.isOpen = false;
    this.announcer.announce('Dialog closed', 'polite');
  }
}
```

**`tsconfig.json` note**: Add `"experimentalDecorators": true` to `compilerOptions` to avoid Angular decorator errors:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

**Common gotchas**:
- `FocusTrapDirective` and `KeyboardNavDirective` must be listed in `imports: []` of your standalone component (or in `A11yGuardModule` for NgModule usage — see below).
- `AnnouncerService` is `providedIn: 'root'` — inject it directly, no extra provider registration needed.

---

### Angular 16 (NgModule)

```bash
npm install @shamaz332/a11yguard
```

```ts
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { A11yGuardModule } from '@shamaz332/a11yguard/angular';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, A11yGuardModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

The `A11yGuardModule` exports both `FocusTrapDirective` and `KeyboardNavDirective`, making them available to all components declared in the importing module.

```ts
// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { AnnouncerService, PreferencesService } from '@shamaz332/a11yguard/angular';
import { injectSkipLink } from '@shamaz332/a11yguard';

@Component({
  selector: 'app-root',
  // template same as standalone example above
  template: `...`,
})
export class AppComponent implements OnInit {
  isOpen = false;

  constructor(private announcer: AnnouncerService) {}

  ngOnInit(): void {
    injectSkipLink();
  }

  openModal(): void {
    this.isOpen = true;
    this.announcer.announce('Dialog opened', 'polite');
  }

  closeModal(): void {
    this.isOpen = false;
  }
}
```

---

### SvelteKit

**Prerequisites**: SvelteKit project from `npm create svelte@latest`

```bash
npm install @shamaz332/a11yguard
```

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { injectSkipLink } from '@shamaz332/a11yguard';

  onMount(() => {
    injectSkipLink();
  });
</script>

<slot />
```

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { focusTrap, keyboardNav, announcer, reducedMotion, colorScheme } from '@shamaz332/a11yguard/svelte';
  import { writable } from 'svelte/store';

  const isOpen = writable(false);

  function openModal() {
    isOpen.set(true);
    announcer.announce('Dialog opened', 'polite');
  }

  function closeModal() {
    isOpen.set(false);
    announcer.announce('Dialog closed', 'polite');
  }
</script>

<main id="main">
  <p>Motion: {$reducedMotion} | Scheme: {$colorScheme}</p>

  <button on:click={openModal}>Open dialog</button>

  {#if $isOpen}
    <div class="backdrop">
      <div
        use:focusTrap={{ active: $isOpen }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        class="modal"
      >
        <h2 id="modal-title">Accessible dialog</h2>
        <p>Focus is trapped here. Escape closes this.</p>
        <button on:click={closeModal}>Cancel</button>
        <button on:click={closeModal}>Confirm</button>
      </div>
    </div>
  {/if}

  <div
    use:keyboardNav={{ role: 'menu', items: '[role="menuitem"]' }}
    role="menu"
    aria-label="Actions"
  >
    <div role="menuitem" tabindex="0">Edit</div>
    <div role="menuitem" tabindex="-1">Delete</div>
  </div>
</main>
```

**SSR safety**: Actions (`use:focusTrap`, `use:keyboardNav`) only execute in the browser — Svelte does not run `use:` directives during SSR. The `reducedMotion` and `colorScheme` stores start with safe defaults (`false` / `'light'`) during SSR.

**Common gotchas**:
- `announcer` is a plain object (not a store) — call `announcer.announce(message, priority)` directly.
- `use:focusTrap` takes the current value of `isOpen`, not the store itself. Use `$isOpen` in the template.

---

### Svelte (Vite, no SSR)

Identical to SvelteKit except you can call `injectSkipLink()` at module level since there is no server rendering:

```svelte
<script lang="ts">
  import { injectSkipLink } from '@shamaz332/a11yguard';
  injectSkipLink(); // safe — always in browser
</script>
```

---

### SolidJS + Vite

**Prerequisites**: SolidJS project from `npm create vite@latest -- --template solid-ts`

```bash
npm install @shamaz332/a11yguard
```

```tsx
// src/App.tsx
import { createSignal } from 'solid-js';
import {
  createFocusTrap,
  createAnnouncer,
  createReducedMotion,
  createColorScheme,
  createKeyboardNav,
} from '@shamaz332/a11yguard/solid';
import { injectSkipLink } from '@shamaz332/a11yguard';

injectSkipLink();

export default function App() {
  const announce = createAnnouncer();
  const reducedMotion = createReducedMotion();
  const colorScheme = createColorScheme();
  const [isOpen, setIsOpen] = createSignal(false);

  let modalRef: HTMLDivElement | undefined;
  let menuRef: HTMLDivElement | undefined;

  createFocusTrap(() => modalRef, { active: isOpen });
  createKeyboardNav(() => menuRef, { role: 'menu', items: '[role="menuitem"]' });

  function openModal() {
    setIsOpen(true);
    announce('Dialog opened', 'polite');
  }

  function closeModal() {
    setIsOpen(false);
    announce('Dialog closed', 'polite');
  }

  return (
    <main id="main">
      <p>Motion: {String(reducedMotion())} | Scheme: {colorScheme()}</p>

      <button onClick={openModal}>Open dialog</button>

      {isOpen() && (
        <div class="backdrop">
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            class="modal"
          >
            <h2 id="modal-title">Accessible dialog</h2>
            <p>Focus is trapped. Escape closes this.</p>
            <button onClick={closeModal}>Cancel</button>
            <button onClick={closeModal}>Confirm</button>
          </div>
        </div>
      )}

      <div
        ref={menuRef}
        role="menu"
        aria-label="Actions"
      >
        <div role="menuitem" tabIndex={0}>Edit</div>
        <div role="menuitem" tabIndex={-1}>Delete</div>
      </div>
    </main>
  );
}
```

**Common gotchas**:
- `createFocusTrap` takes a signal accessor `() => modalRef`, not the ref directly. The ref is set by Solid's `ref={...}` binding before the component's body finishes executing.
- `reducedMotion()` and `colorScheme()` are accessors — call them with `()` in JSX.

---

### SolidStart

**Prerequisites**: SolidStart project from `npm create solid@latest`

```bash
npm install @shamaz332/a11yguard
```

```tsx
// src/app.tsx  (root layout — runs on server and client)
import { isServer } from 'solid-js/web';
import { onMount } from 'solid-js';
import { injectSkipLink } from '@shamaz332/a11yguard';

export default function App() {
  // Only inject the skip link on the client
  if (!isServer) {
    onMount(() => injectSkipLink());
  }

  return (
    <html lang="en">
      <head />
      <body>
        <main id="main">
          {/* routes render here */}
        </main>
      </body>
    </html>
  );
}
```

```tsx
// src/routes/index.tsx
import { createSignal, Show } from 'solid-js';
import { isServer } from 'solid-js/web';
import { createFocusTrap, createAnnouncer } from '@shamaz332/a11yguard/solid';

export default function Home() {
  const [isOpen, setIsOpen] = createSignal(false);
  const announce = isServer ? () => undefined : createAnnouncer();

  let modalRef: HTMLDivElement | undefined;

  if (!isServer) {
    createFocusTrap(() => modalRef, { active: isOpen });
  }

  return (
    <main id="main">
      <button onClick={() => { setIsOpen(true); announce('Dialog opened', 'polite'); }}>
        Open
      </button>
      <Show when={isOpen()}>
        <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="t">
          <h2 id="t">Dialog</h2>
          <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
      </Show>
    </main>
  );
}
```

**SSR safety**: All a11yguard solid primitives check `typeof window` internally, but wrapping them in `if (!isServer)` makes SSR intent explicit and avoids Solid hydration warnings.

---

## EAA Audit

```ts
import { auditEAA, watchEAA } from '@shamaz332/a11yguard/audit';

// One-shot audit of the whole page
const result = auditEAA();
console.log(`${result.violations.length} violations at WCAG ${result.level}`);

result.violations.forEach((v) => {
  console.log(`[${v.severity}] ${v.ruleId}: ${v.message}`);
  console.log(`  Element: ${v.selector}`);
  console.log(`  EAA ref: ${v.eaa.join(', ')}`);
  console.log(`  Fix:     ${v.help}`);
});

// Audit only specific rules
const imageResult = auditEAA({ rules: ['images-alt', 'button-name'] });

// Audit a subtree
const form = document.getElementById('checkout-form')!;
const formResult = auditEAA({ root: form, level: 'AAA' });

// Live watcher — re-audits on DOM mutations
const stop = watchEAA((result) => {
  document.getElementById('a11y-status')!.textContent =
    `${result.violations.length} accessibility issues`;
});

// Disconnect when done
stop();
```

**Sample output**:

```
3 violations at WCAG AA

[critical]  images-alt: <img> element is missing the alt attribute
  Element: img:nth-of-type(2)
  EAA ref: EN 301 549: 9.1.1.1
  Fix:     Add alt="" for decorative images or a descriptive alt text for meaningful images.

[serious]   contrast: Insufficient colour contrast: 2.31:1 (required 4.5:1)
  Element: p.subtitle
  EAA ref: EN 301 549: 9.1.4.3
  Fix:     Increase the contrast between the text colour and its background to at least 4.5:1.

[moderate]  heading-order: Heading level skipped: h1 → h3
  Element: h3
  EAA ref: EN 301 549: 9.1.3.1
  Fix:     Do not skip heading levels. After h1, use h2.
```

**Rules included**:

| Rule ID | WCAG | Severity | What it checks |
|---|---|---|---|
| `images-alt` | 1.1.1 | critical | `<img>` without alt; `role="img"` without accessible name |
| `form-labels` | 1.3.1, 3.3.2, 4.1.2 | critical | Inputs without a `<label>`, `aria-label`, or `aria-labelledby` |
| `heading-order` | 1.3.1 | moderate | Skipped heading levels (e.g. h1 → h3) |
| `landmarks` | 1.3.1 | serious | Page missing a `<main>` landmark |
| `page-lang` | 3.1.1 | serious | `<html>` element missing a valid `lang` attribute |
| `contrast` | 1.4.3 | serious | Text elements below WCAG AA/AAA contrast ratio |
| `focus-visible` | 2.4.7 | serious | `:focus { outline: none }` without `:focus-visible` fallback |
| `link-purpose` | 2.4.4 | moderate | Ambiguous link text ("click here", "read more", "here", etc.) |
| `button-name` | 4.1.2 | critical | Buttons with no accessible name |
| `target-size` | 2.5.8 | serious | Interactive targets smaller than 24×24 CSS px (WCAG 2.2) |
| `duplicate-id` | 4.1.1 | serious / moderate | Repeated `id` values (serious when a label or ARIA attribute points at it) |
| `aria-valid-attr` | 4.1.2 | critical | Misspelled or unknown `aria-*` attributes (e.g. `aria-labeledby`) |
| `aria-valid-role` | 4.1.2 | serious | `role` values that are not concrete WAI-ARIA roles |
| `aria-hidden-focus` | 4.1.2 | serious | Keyboard-focusable content inside `aria-hidden="true"` |
| `document-title` | 2.4.2 | serious | Page without a `<title>` (document audits only) |
| `frame-title` | 4.1.2 | serious | `<iframe>` without a title or ARIA label |
| `table-headers` | 1.3.1 | serious | Data tables with no `<th>` / header roles |
| `autocomplete-valid` | 1.3.5 | serious | Invalid `autocomplete` values (AA and above) |

---

## API Reference

### Core (`@shamaz332/a11yguard`)

#### `createFocusTrap(element, options?)`

Creates a focus trap on `element`. Returns a `FocusTrap` instance.

```ts
interface FocusTrapOptions {
  escapeDeactivates?: boolean;        // default: true
  clickOutsideDeactivates?: boolean;  // default: false
  initialFocus?: string | HTMLElement | false;
  returnFocusOnDeactivate?: boolean;  // default: true
  isolate?: boolean;                  // set inert on siblings, default: true
  onActivate?: () => void;
  onDeactivate?: () => void | false;  // return false to cancel
  onPostActivate?: () => void;
  onPostDeactivate?: () => void;
}

interface FocusTrap {
  activate(options?: { preventScroll?: boolean }): void;
  deactivate(options?: { returnFocus?: boolean }): void;
  pause(): void;
  unpause(): void;
  destroy(): void;
  readonly active: boolean;
}
```

#### `announce(message, priority?)`

Announce a message to screen readers.

```ts
function announce(message: string, priority?: 'polite' | 'assertive'): void;
// priority defaults to 'polite'
```

#### `createAnnouncer()`

Creates an isolated announcer instance (separate live region from the singleton).

```ts
function createAnnouncer(): (message: string, priority?: 'polite' | 'assertive') => void;
```

#### `createKeyboardNav(element, options)`

```ts
interface KeyboardNavOptions {
  role: 'menu' | 'listbox' | 'tablist' | 'tree' | 'grid' | 'radiogroup';
  items: string;       // CSS selector for nav items
  loop?: boolean;      // default: true — wrap at ends
  grid?: boolean;      // enable 2D grid navigation
  columns?: number;    // columns in grid mode
  onSelect?: (item: HTMLElement, index: number) => void;
}

interface KeyboardNav {
  focusItem(index: number): void;
  readonly currentIndex: number;
  destroy(): void;
}
```

#### `lockScroll()` / `unlockScroll()` / `isScrollLocked()`

Reference-counted scroll lock. Call `lockScroll()` N times, call `unlockScroll()` N times to fully release.

#### `pushFocus()` / `popFocus()` / `clearFocusStack()`

Stack-based focus restoration for layered UI patterns.

```ts
function pushFocus(): void;           // saves currently focused element
function popFocus(): boolean;         // restores and returns true if successful
function clearFocusStack(): void;     // empties the stack
```

#### `injectSkipLink(options?)`

```ts
interface SkipLinkOptions {
  label?: string;    // default: 'Skip to main content'
  target?: string;   // default: '#main'
}
function injectSkipLink(options?: SkipLinkOptions): () => void;
// Returns cleanup function that removes the injected link
```

#### `announceRouteChange(options?)`

Call after a client-side navigation has rendered. Announces the new page title, moves focus to the page heading (falling back to `main`, then `body`) and clears the focus stack. Covers WCAG 2.4.3 and 4.1.3 for single-page apps. Each framework adapter has a ready-made wrapper (`useRouteAnnouncer`, `RouteAnnouncerService`, `createRouteAnnouncer`).

```ts
interface RouteChangeOptions {
  title?: string;                       // default: document.title
  message?: (title: string) => string;  // default: t => `Navigated to ${t}`
  focus?: string | HTMLElement | false; // default: 'h1' → main → body
  clearFocusStack?: boolean;            // default: true
}
function announceRouteChange(options?: RouteChangeOptions): void;
```

```ts
// SvelteKit
afterNavigate(() => announceRouteChange());
```

#### `describeField(input, options?)`

Connects a form control to its label, hint and error message. `setError()` toggles `aria-invalid`, `aria-errormessage` and `aria-describedby`, shows or hides the error element and announces new errors. Covers WCAG 1.3.1, 3.3.1 and 3.3.2.

```ts
const field = describeField(emailInput, { label, hint, error: errorEl });
field.setError('Enter a valid email address');
field.setError(null);  // clear
field.destroy();       // restore original attributes

interface DescribeFieldOptions {
  label?: HTMLElement | null;           // <label> gets `for`, others use aria-labelledby
  hint?: HTMLElement | null;
  error?: HTMLElement | null;
  announce?: 'polite' | 'assertive' | false; // default: 'polite'
}
```

#### `createId(prefix?)` / `ensureId(el, prefix?)`

```ts
createId('tooltip');  // 'tooltip-1'
ensureId(hintEl);     // returns hintEl.id, assigning one if missing
```

Ids are sequential, so they will not match between server and client. For SSR use `useA11yId()` from the React (18+) or Vue (3.5+) adapter.

#### `visuallyHidden` / `visuallyHiddenCss` / `applyVisuallyHidden(el)`

Hide content visually while keeping it available to screen readers — for icon-only buttons, extra link context and so on.

```tsx
<button><TrashIcon aria-hidden="true" /><span style={visuallyHidden}>Delete</span></button>
```

```ts
style.textContent = `.sr-only { ${visuallyHiddenCss} }`;
```

#### `checkContrast(fg, bg, options?)`

```ts
interface ContrastOptions {
  algorithm?: 'wcag' | 'apca' | 'both';  // default: 'both'
  fontSize?: number;                       // in px, for APCA lookup
  fontWeight?: number;                     // for APCA lookup
}

interface ContrastResult {
  wcag?: {
    ratio: number;
    aa: boolean;
    aaLarge: boolean;
    aaa: boolean;
    aaaLarge: boolean;
  };
  apca?: {
    lc: number;       // Lightness Contrast value
    passes: boolean;  // based on font-size + weight lookup
  };
}

function checkContrast(fg: string, bg: string, options?: ContrastOptions): ContrastResult;
```

Supports hex (`#rgb`, `#rrggbb`, `#rrggbbaa`), `rgb()`, `rgba()`, `hsl()`, `hsla()`, and 21 CSS named colours.

#### `prefersReducedMotion()` / `onReducedMotionChange(cb)`

```ts
function prefersReducedMotion(): boolean;
function onReducedMotionChange(cb: (reduced: boolean) => void): () => void;
// Returns unsubscribe function
```

#### `prefersColorScheme()` / `onColorSchemeChange(cb)`

```ts
type ColorScheme = 'light' | 'dark' | 'no-preference';
function prefersColorScheme(): ColorScheme;
function onColorSchemeChange(cb: (scheme: ColorScheme) => void): () => void;
```

#### `prefersContrast()` / `forcedColors()` / `prefersReducedTransparency()`

```ts
type ContrastPreference = 'more' | 'less' | 'custom' | 'no-preference';
function prefersContrast(): ContrastPreference;
function onContrastChange(cb: (pref: ContrastPreference) => void): () => void;

function forcedColors(): boolean;              // Windows High Contrast / forced-colors: active
function onForcedColorsChange(cb: (active: boolean) => void): () => void;

function prefersReducedTransparency(): boolean;
function onReducedTransparencyChange(cb: (reduced: boolean) => void): () => void;
```

Adapters: `useContrastPreference`, `useForcedColors`, `useReducedTransparency` (React, Vue); `contrast$`, `forcedColors$`, `reducedTransparency$` on `PreferencesService` (Angular); `contrast`, `forcedColors`, `reducedTransparency` stores (Svelte); `createContrastPreference`, `createForcedColors`, `createReducedTransparency` (Solid).

#### `getInputModality()` / `onInputModalityChange(cb)`

Tracks whether the user last used the keyboard or a pointer (mouse, touch, pen). The first call starts tracking and sets `data-input-modality` on `<html>`, so custom controls can show focus rings only to keyboard users:

```css
[data-input-modality='pointer'] .custom-control:focus { outline: none; }
```

```ts
type InputModality = 'keyboard' | 'pointer';
function getInputModality(): InputModality;   // 'keyboard' until the user interacts
function onInputModalityChange(cb: (m: InputModality) => void): () => void;
```

Adapters: `useInputModality` (React, Vue), `inputModality$` (Angular), `inputModality` store (Svelte), `createInputModality` (Solid).

---

### React (`@shamaz332/a11yguard/react`)

```ts
function useFocusTrap<T extends HTMLElement = HTMLElement>(options?: FocusTrapOptions): RefObject<T>;
function useAnnouncer(): (message: string, priority?: 'polite' | 'assertive') => void;
function useKeyboardNav<T extends HTMLElement = HTMLElement>(options: KeyboardNavOptions): RefObject<T>;
function useScrollLock(active: boolean): void;
function useReducedMotion(): boolean;
function useColorScheme(): ColorScheme;
function useRouteAnnouncer(routeKey: unknown, options?: RouteChangeOptions): void; // e.g. useRouteAnnouncer(pathname)
function useSkipLink(options?: SkipLinkOptions): void;
function useFocusRestore(active: boolean): void;  // restores focus to the trigger when active turns false
function useA11yId(prefix?: string): string;      // SSR-safe on React 18+
function VisuallyHidden(props: { as?: ElementType } & HTMLAttributes<HTMLElement>): ReactElement;
```

---

### Vue (`@shamaz332/a11yguard/vue`)

```ts
function useFocusTrap(options?: { active?: MaybeRef<boolean> } & FocusTrapOptions): Ref<HTMLElement | null>;
function useAnnouncer(): (message: string, priority?: 'polite' | 'assertive') => void;
function useKeyboardNav(options: KeyboardNavOptions): Ref<HTMLElement | null>;
function useScrollLock(active: MaybeRef<boolean>): void;
function useReducedMotion(): Ref<boolean>;
function useColorScheme(): Ref<ColorScheme>;
function useRouteAnnouncer(source: WatchSource, options?: RouteChangeOptions): void; // e.g. () => route.fullPath
function useSkipLink(options?: SkipLinkOptions): void;
function useFocusRestore(active: MaybeRef<boolean>): void;
function useA11yId(prefix?: string): string;      // SSR-safe on Vue 3.5+
const VisuallyHidden: Component;                  // <VisuallyHidden as="span">…</VisuallyHidden>
```

---

### Angular (`@shamaz332/a11yguard/angular`)

| Export | Type | Description |
|---|---|---|
| `FocusTrapDirective` | `@Directive` | `[a11yFocusTrap]` with `[active]` input |
| `KeyboardNavDirective` | `@Directive` | `[a11yKeyboardNav]` with `navRole` and `navItems` inputs |
| `AnnouncerService` | `@Injectable` | `announce(message, priority?)` method |
| `PreferencesService` | `@Injectable` | `reducedMotion$: Observable<boolean>`, `colorScheme$: Observable<ColorScheme>` |
| `SkipLinkDirective` | `@Directive` | `<main a11ySkipLink>` or `<main a11ySkipLink="Skip to content">` — injects a skip link to the host |
| `RouteAnnouncerService` | `@Injectable` | `watch(router.events.pipe(filter(e => e instanceof NavigationEnd)))`, or `announce(options?)` |
| `A11yService` | `@Injectable` | `saveFocus()`, `restoreFocus()`, `clearFocus()`, `lockScroll()`, `unlockScroll()`, `scrollLocked`, `createId()` |
| `A11yGuardModule` | `NgModule` | Exports all directives for NgModule projects |

---

### Svelte (`@shamaz332/a11yguard/svelte`)

```ts
// Actions
function focusTrap(node: HTMLElement, options?: { active?: boolean } & FocusTrapOptions): ActionReturn;
function keyboardNav(node: HTMLElement, options: KeyboardNavOptions): ActionReturn;
function scrollLock(node: HTMLElement, active?: boolean): ActionReturn;  // use:scrollLock={open}
function focusRestore(node: HTMLElement): ActionReturn;                  // restores focus when the node is removed
function skipLink(node: HTMLElement, label?: string): ActionReturn;      // <main use:skipLink>

// Stores
const reducedMotion: Readable<boolean>;
const colorScheme: Readable<ColorScheme>;

// Announcer
const announcer: { announce(message: string, priority?: 'polite' | 'assertive'): void };
```

---

### Solid (`@shamaz332/a11yguard/solid`)

```ts
function createFocusTrap(
  element: Accessor<HTMLElement | undefined>,
  options?: { active?: Accessor<boolean> } & FocusTrapOptions
): void;

function createAnnouncer(): (message: string, priority?: 'polite' | 'assertive') => void;
function createKeyboardNav(element: Accessor<HTMLElement | undefined>, options: KeyboardNavOptions): void;
function createReducedMotion(): Accessor<boolean>;
function createColorScheme(): Accessor<ColorScheme>;
function createScrollLock(active: Accessor<boolean>): void;
function createFocusRestore(active: Accessor<boolean>): void;
function createSkipLink(options?: SkipLinkOptions): void;
function createRouteAnnouncer(source: Accessor<unknown>, options?: RouteChangeOptions): void; // e.g. () => location.pathname
```

---

## What a11yguard does NOT do

- **Does not replace manual testing.** Automated rules catch ~30–40% of WCAG violations. A real screen reader test and keyboard walkthrough are still required before claiming compliance.
- **Does not audit images for meaningful alt text.** It detects missing alt attributes, not semantically poor alt text (e.g. `alt="image1.jpg"`).
- **Does not check colour contrast on canvas or SVG** (no access to rendered pixel data).
- **Does not detect ARIA misuse** beyond the rules listed above.
- **Does not provide legal compliance certification.** A professional WCAG audit and statement of conformity require a human auditor.

---

## Manual testing checklist

Before shipping, test with real assistive technology:

### Keyboard
- [ ] Tab through every interactive element on the page in order
- [ ] Shift+Tab reverses tab order correctly
- [ ] All functionality reachable without a mouse
- [ ] Focus is always visible (not hidden by sticky headers or overlays)
- [ ] Dialogs trap focus; Escape closes them; focus returns to the trigger
- [ ] Skip link appears on first Tab press and skips to `#main`

### Screen reader
- [ ] **macOS**: VoiceOver (Cmd+F5) + Safari
- [ ] **Windows**: NVDA (free) + Firefox, or JAWS + Chrome
- [ ] **iOS**: VoiceOver + Safari
- [ ] **Android**: TalkBack + Chrome
- [ ] All images have meaningful announcements (or are silent for decorative)
- [ ] Form inputs announce their label, type, and error state
- [ ] Modals announce their role and title when opened
- [ ] Live regions announce status updates without moving focus

### Colour and motion
- [ ] Test at 200% browser zoom — no horizontal scroll, no overlapping content
- [ ] Enable "Reduce Motion" in OS settings — animations stop
- [ ] Test in Windows High Contrast mode
- [ ] Check all text and UI components with a contrast analyser

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

MIT © [Shamaz Saeed](https://github.com/shamaz332)

---

## Disclaimer

This package helps you implement accessible patterns and identify common WCAG violations. It does not guarantee legal compliance with the European Accessibility Act, Section 508, ADA, or any other accessibility regulation. Accessibility compliance requires human testing, professional auditing, and a documented conformance statement. The authors accept no liability for accessibility claims arising from the use of this software.
