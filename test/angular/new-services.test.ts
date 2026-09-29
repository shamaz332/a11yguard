import { describe, it, expect, vi } from 'vitest';
import { ElementRef, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { RouteAnnouncerService } from '../../src/angular/route-announcer.service.js';
import { A11yService } from '../../src/angular/focus.service.js';
import { SkipLinkDirective } from '../../src/angular/skip-link.directive.js';

vi.stubGlobal('scrollTo', vi.fn());

describe('RouteAnnouncerService', () => {
  it('announce() focuses the page heading', () => {
    document.body.innerHTML = '<h1>Home</h1>';
    new RouteAnnouncerService().announce();
    expect(document.activeElement?.tagName).toBe('H1');
  });

  it('watch() announces after each emission, one task later', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<h1>Page</h1>';
    const service = new RouteAnnouncerService();
    const nav$ = new Subject<void>();
    service.watch(nav$);
    nav$.next();
    expect(document.activeElement).toBe(document.body);
    vi.runAllTimers();
    expect(document.activeElement?.tagName).toBe('H1');
    service.ngOnDestroy();
    vi.useRealTimers();
  });

  it('stops watching on destroy', () => {
    const service = new RouteAnnouncerService();
    const nav$ = new Subject<void>();
    service.watch(nav$);
    service.ngOnDestroy();
    expect(nav$.observed).toBe(false);
  });
});

describe('A11yService', () => {
  it('saves and restores focus', () => {
    const trigger = document.createElement('button');
    const other = document.createElement('button');
    document.body.append(trigger, other);
    const a11y = new A11yService();
    trigger.focus();
    a11y.saveFocus();
    other.focus();
    expect(a11y.restoreFocus()).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it('locks and unlocks scroll', () => {
    const a11y = new A11yService();
    a11y.lockScroll();
    expect(a11y.scrollLocked).toBe(true);
    a11y.unlockScroll();
    expect(a11y.scrollLocked).toBe(false);
  });

  it('creates ids', () => {
    expect(new A11yService().createId('tip')).toMatch(/^tip-\d+$/);
  });
});

describe('SkipLinkDirective', () => {
  it('targets the host, assigning an id, and cleans up', () => {
    const main = document.createElement('main');
    document.body.appendChild(main);
    const dir = new SkipLinkDirective({ nativeElement: main } as ElementRef<HTMLElement>);
    dir.ngOnInit();
    const link = document.querySelector('[data-a11yguard-skip-link]');
    expect(main.id).toBeTruthy();
    expect(link?.getAttribute('href')).toBe(`#${main.id}`);
    dir.ngOnDestroy();
    expect(document.querySelector('[data-a11yguard-skip-link]')).toBeNull();
  });

  it('uses the bound label', () => {
    const main = document.createElement('main');
    main.id = 'content';
    document.body.appendChild(main);
    const dir = new SkipLinkDirective({ nativeElement: main } as ElementRef<HTMLElement>);
    dir.label = 'Skip ahead';
    dir.ngOnInit();
    const link = document.querySelector('[data-a11yguard-skip-link]');
    expect(link?.textContent).toBe('Skip ahead');
    expect(link?.getAttribute('href')).toBe('#content');
  });
});

describe('PreferencesService (new observables)', () => {
  it('emits contrast, forced colors, transparency and modality', async () => {
    const { PreferencesService } = await import('../../src/angular/preferences.service.js');
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: query === '(prefers-contrast: more)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))
    );
    const zone = { run: (fn: () => void) => fn() } as unknown as NgZone;
    const prefs = new PreferencesService(zone);
    const seen: Record<string, unknown> = {};
    prefs.contrast$.subscribe((v) => (seen.contrast = v)).unsubscribe();
    prefs.forcedColors$.subscribe((v) => (seen.forced = v)).unsubscribe();
    prefs.reducedTransparency$.subscribe((v) => (seen.transparency = v)).unsubscribe();
    const modalities: string[] = [];
    const sub = prefs.inputModality$.subscribe((v) => modalities.push(v));
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    sub.unsubscribe();
    expect(seen).toEqual({ contrast: 'more', forced: false, transparency: false });
    expect(modalities.at(-1)).toBe('pointer');
  });
});
