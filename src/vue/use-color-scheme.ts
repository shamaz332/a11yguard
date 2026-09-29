import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import { prefersColorScheme, onColorSchemeChange } from '../core/preferences.js';
import type { ColorScheme } from '../core/types.js';

/**
 * Vue composable that returns a reactive ref reflecting `prefers-color-scheme`.
 * Updates automatically when the OS setting changes.
 * SSR-safe — initialises to `'light'`.
 *
 * @example
 * const scheme = useColorScheme();
 * // In template: :data-theme="scheme"
 */
export function useColorScheme(): Ref<ColorScheme> {
  const scheme = ref<ColorScheme>('light');
  let unsub: (() => void) | null = null;

  onMounted(() => {
    scheme.value = prefersColorScheme();
    unsub = onColorSchemeChange((v) => {
      scheme.value = v;
    });
  });

  onUnmounted(() => unsub?.());

  return scheme;
}
