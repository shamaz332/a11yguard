import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import {
  prefersContrast,
  onContrastChange,
  forcedColors,
  onForcedColorsChange,
  prefersReducedTransparency,
  onReducedTransparencyChange,
} from '../core/preferences.js';
import { getInputModality, onInputModalityChange } from '../core/input-modality.js';
import type { ContrastPreference, InputModality } from '../core/types.js';

function useSubscribedValue<T>(
  read: () => T,
  subscribe: (cb: (value: T) => void) => () => void,
  serverValue: T
): Ref<T> {
  const value = ref(serverValue) as Ref<T>;
  let unsub: (() => void) | null = null;
  onMounted(() => {
    value.value = read();
    unsub = subscribe((next) => {
      value.value = next;
    });
  });
  onUnmounted(() => unsub?.());
  return value;
}

/**
 * Vue composable for the user's `prefers-contrast` setting.
 *
 * @example
 * const contrast = useContrastPreference(); // Ref<'more' | 'less' | 'custom' | 'no-preference'>
 */
export function useContrastPreference(): Ref<ContrastPreference> {
  return useSubscribedValue(prefersContrast, onContrastChange, 'no-preference');
}

/**
 * Vue composable that is true while forced colors (Windows High Contrast) are active.
 */
export function useForcedColors(): Ref<boolean> {
  return useSubscribedValue(forcedColors, onForcedColorsChange, false);
}

/**
 * Vue composable that is true if the user prefers reduced transparency.
 */
export function useReducedTransparency(): Ref<boolean> {
  return useSubscribedValue(prefersReducedTransparency, onReducedTransparencyChange, false);
}

/**
 * Vue composable for how the user last interacted: 'keyboard' or 'pointer'.
 *
 * @example
 * const modality = useInputModality();
 */
export function useInputModality(): Ref<InputModality> {
  return useSubscribedValue(getInputModality, onInputModalityChange, 'keyboard');
}
