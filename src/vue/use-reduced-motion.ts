import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import { prefersReducedMotion, onReducedMotionChange } from '../core/preferences.js';

/**
 * Vue composable that returns a reactive ref reflecting `prefers-reduced-motion`.
 * Updates automatically when the OS setting changes.
 * SSR-safe — initialises to `false`.
 *
 * @example
 * const reduced = useReducedMotion();
 * // In template: :style="{ transition: reduced ? 'none' : 'all 0.3s' }"
 */
export function useReducedMotion(): Ref<boolean> {
  const value = ref<boolean>(false);
  let unsub: (() => void) | null = null;

  onMounted(() => {
    value.value = prefersReducedMotion();
    unsub = onReducedMotionChange((v) => {
      value.value = v;
    });
  });

  onUnmounted(() => unsub?.());

  return value;
}
