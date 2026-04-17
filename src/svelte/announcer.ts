import { announce as coreAnnounce } from '../core/announce.js';
import type { AnnouncePriority } from '../core/types.js';

/**
 * Svelte singleton announcer. Delegates to the core live region.
 * The live region is created lazily on first `announce()` call.
 *
 * @example
 * <script>
 *   import { announcer } from '@shamaz332/a11yguard/svelte';
 * </script>
 * <button on:click={() => announcer.announce('Saved!', 'polite')}>Save</button>
 */
export const announcer = {
  announce(message: string, priority: AnnouncePriority = 'polite'): void {
    coreAnnounce(message, priority);
  },
};
