import { useEffect, useRef } from 'react';
import { announceRouteChange } from '../core/route-announcer.js';
import type { RouteChangeOptions } from '../core/types.js';

/**
 * React hook that announces client-side navigations to screen reader users and
 * moves focus to the new page heading. Pass anything that changes per route,
 * typically the pathname. Nothing happens on the first render.
 *
 * @example
 * // React Router
 * const { pathname } = useLocation();
 * useRouteAnnouncer(pathname);
 *
 * @example
 * // Next.js App Router
 * useRouteAnnouncer(usePathname(), { focus: 'main h1' });
 */
export function useRouteAnnouncer(routeKey: unknown, options: RouteChangeOptions = {}): void {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    announceRouteChange(optionsRef.current);
  }, [routeKey]);
}
