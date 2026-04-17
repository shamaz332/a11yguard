import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Observable, fromEventPattern, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { safeMatchMedia } from '../core/utils/media.js';
import type { ColorScheme } from '../core/types.js';

/**
 * Angular service exposing user OS preferences as RxJS Observables.
 * All observables emit the current value immediately on subscription.
 *
 * @example
 * constructor(private prefs: PreferencesService) {
 *   prefs.reducedMotion$.subscribe(reduced => {
 *     this.animate = !reduced;
 *   });
 * }
 */
@Injectable({ providedIn: 'root' })
export class PreferencesService implements OnDestroy {
  /** Emits `true` when the user prefers reduced motion. */
  readonly reducedMotion$: Observable<boolean>;

  /** Emits the user's preferred color scheme. */
  readonly colorScheme$: Observable<ColorScheme>;

  constructor(private ngZone: NgZone) {
    this.reducedMotion$ = this.createMediaObservable(
      '(prefers-reduced-motion: reduce)',
      (mq) => mq.matches
    );

    this.colorScheme$ = this.createColorSchemeObservable();
  }

  private createMediaObservable<T>(
    query: string,
    project: (mq: MediaQueryList) => T
  ): Observable<T> {
    const mq = safeMatchMedia(query);

    if (!mq) {
      return new Observable<T>((sub) => {
        // SSR fallback: emit nothing, or cast sensible default
        sub.complete();
      });
    }

    return fromEventPattern<MediaQueryListEvent>(
      (handler) => mq.addEventListener('change', handler as EventListenerOrEventListenerObject),
      (handler) => mq.removeEventListener('change', handler as EventListenerOrEventListenerObject)
    ).pipe(
      map(() => project(mq)),
      startWith(project(mq))
    );
  }

  private createColorSchemeObservable(): Observable<ColorScheme> {
    const mqDark = safeMatchMedia('(prefers-color-scheme: dark)');
    const mqLight = safeMatchMedia('(prefers-color-scheme: light)');

    const resolve = (): ColorScheme => {
      if (mqDark?.matches) return 'dark';
      if (mqLight?.matches) return 'light';
      return 'no-preference';
    };

    if (!mqDark || !mqLight) {
      return new Observable<ColorScheme>((sub) => {
        sub.next('light');
        sub.complete();
      });
    }

    return new Observable<ColorScheme>((subscriber) => {
      const handler = (): void => {
        this.ngZone.run(() => subscriber.next(resolve()));
      };

      mqDark.addEventListener('change', handler);
      mqLight.addEventListener('change', handler);
      subscriber.next(resolve());

      return () => {
        mqDark.removeEventListener('change', handler);
        mqLight.removeEventListener('change', handler);
      };
    });
  }

  ngOnDestroy(): void {
    // Observables clean themselves up via subscriber teardown
  }
}
