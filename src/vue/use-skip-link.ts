import { onMounted, onUnmounted } from 'vue';
import { injectSkipLink } from '../core/skip-link.js';
import type { SkipLinkOptions } from '../core/types.js';

/**
 * Vue composable that injects a "Skip to main content" link while the component is mounted.
 * Use it once, in your root layout.
 *
 * @example
 * useSkipLink({ target: '#main' });
 */
export function useSkipLink(options: SkipLinkOptions = {}): void {
  let cleanup: (() => void) | null = null;
  onMounted(() => {
    cleanup = injectSkipLink(options);
  });
  onUnmounted(() => cleanup?.());
}
