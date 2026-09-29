import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { announceRouteChange } from '../core/route-announcer.js';
import type { RouteChangeOptions } from '../core/types.js';

/**
 * Angular service that announces client-side navigations to screen reader users
 * and moves focus to the new page heading.
 *
 * @example
 * // app.component.ts
 * constructor(router: Router, routeAnnouncer: RouteAnnouncerService) {
 *   routeAnnouncer.watch(router.events.pipe(filter((e) => e instanceof NavigationEnd)));
 * }
 */
@Injectable({ providedIn: 'root' })
export class RouteAnnouncerService implements OnDestroy {
  private subscription = new Subscription();

  /** Announce a navigation now. Call after the new view has rendered. */
  announce(options: RouteChangeOptions = {}): void {
    announceRouteChange(options);
  }

  /**
   * Announce every time `navigationEnd$` emits. The announcement waits one task
   * so the new route's view has rendered before focus moves.
   */
  watch(navigationEnd$: Observable<unknown>, options: RouteChangeOptions = {}): Subscription {
    const sub = navigationEnd$.subscribe(() => {
      setTimeout(() => announceRouteChange(options));
    });
    this.subscription.add(sub);
    return sub;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
