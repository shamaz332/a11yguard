import { announce as coreAnnounce } from '../core/announce.js';
import type { AnnouncePriority } from '../core/types.js';

/**
 * Solid primitive that returns a stable `announce` function.
 * Delegates to the core singleton live region.
 *
 * @example
 * function Toast(props) {
 *   const announce = createAnnouncer();
 *   createEffect(() => { if (props.message) announce(props.message); });
 *   return null;
 * }
 */
export function createAnnouncer(): (message: string, priority?: AnnouncePriority) => void {
  return (message: string, priority?: AnnouncePriority) => {
    coreAnnounce(message, priority);
  };
}
