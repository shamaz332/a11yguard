import { watch, type WatchSource } from 'vue';
import { announceRouteChange } from '../core/route-announcer.js';
import type { RouteChangeOptions } from '../core/types.js';

/**
 * Vue composable that announces client-side navigations to screen reader users and
 * moves focus to the new page heading. Pass a source that changes per route.
 * Runs after the DOM has updated; nothing happens on the initial render.
 *
 * @example
 * // App.vue with Vue Router
 * const route = useRoute();
 * useRouteAnnouncer(() => route.fullPath);
 */
export function useRouteAnnouncer(source: WatchSource, options: RouteChangeOptions = {}): void {
  watch(source, () => announceRouteChange(options), { flush: 'post' });
}
