import { readable, type Readable } from 'svelte/store';
import {
  prefersContrast,
  onContrastChange,
  forcedColors as readForcedColors,
  onForcedColorsChange,
  prefersReducedTransparency,
  onReducedTransparencyChange,
} from '../core/preferences.js';
import { getInputModality, onInputModalityChange } from '../core/input-modality.js';
import type { ContrastPreference, InputModality } from '../core/types.js';

function subscribedStore<T>(
  initial: T,
  read: () => T,
  subscribe: (cb: (value: T) => void) => () => void
): Readable<T> {
  return readable<T>(initial, (set) => {
    if (typeof window === 'undefined') return;
    set(read());
    return subscribe(set);
  });
}

/**
 * Svelte store for the user's `prefers-contrast` setting.
 *
 * @example
 * <div data-contrast={$contrast}>...</div>
 */
export const contrast: Readable<ContrastPreference> = subscribedStore(
  'no-preference' as ContrastPreference,
  prefersContrast,
  onContrastChange
);

/** Svelte store that is true while forced colors (Windows High Contrast) are active. */
export const forcedColors: Readable<boolean> = subscribedStore(
  false,
  readForcedColors,
  onForcedColorsChange
);

/** Svelte store that is true if the user prefers reduced transparency. */
export const reducedTransparency: Readable<boolean> = subscribedStore(
  false,
  prefersReducedTransparency,
  onReducedTransparencyChange
);

/**
 * Svelte store for how the user last interacted: 'keyboard' or 'pointer'.
 *
 * @example
 * <div class:show-focus={$inputModality === 'keyboard'}>...</div>
 */
export const inputModality: Readable<InputModality> = subscribedStore(
  'keyboard' as InputModality,
  getInputModality,
  onInputModalityChange
);
