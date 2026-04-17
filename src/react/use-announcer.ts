import { useCallback } from 'react';
import { announce as coreAnnounce } from '../core/announce.js';
import type { AnnouncePriority } from '../core/types.js';

/**
 * React hook that returns a stable `announce` function backed by the core
 * singleton live region. The region is lazily created and automatically
 * reconnected if the DOM is reset.
 *
 * @example
 * function Toast({ message }) {
 *   const announce = useAnnouncer();
 *   useEffect(() => { announce(message); }, [message]);
 * }
 */
export function useAnnouncer(): (message: string, priority?: AnnouncePriority) => void {
  return useCallback(
    (message: string, priority?: AnnouncePriority) => {
      coreAnnounce(message, priority);
    },
    [] // stable across renders — delegates to core singleton
  );
}
