import { announce as coreAnnounce } from '../core/announce.js';
import type { AnnouncePriority } from '../core/types.js';

/**
 * Vue composable that returns a stable `announce` function backed by the core
 * singleton live region. Lazily creates the region on first call.
 *
 * @example
 * const announce = useAnnouncer();
 * announce('Item saved', 'polite');
 */
export function useAnnouncer(): (message: string, priority?: AnnouncePriority) => void {
  return (message: string, priority?: AnnouncePriority) => {
    coreAnnounce(message, priority);
  };
}
