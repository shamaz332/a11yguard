import { createSignal, onCleanup, type Accessor } from 'solid-js';
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

function createSubscribedValue<T>(
  read: () => T,
  subscribe: (cb: (value: T) => void) => () => void
): Accessor<T> {
  const [value, setValue] = createSignal<T>(read());
  onCleanup(subscribe((next) => setValue(() => next)));
  return value;
}

/**
 * Solid primitive for the user's `prefers-contrast` setting.
 *
 * @example
 * const contrast = createContrastPreference();
 * <div data-contrast={contrast()} />
 */
export function createContrastPreference(): Accessor<ContrastPreference> {
  return createSubscribedValue(prefersContrast, onContrastChange);
}

/** Solid primitive that is true while forced colors (Windows High Contrast) are active. */
export function createForcedColors(): Accessor<boolean> {
  return createSubscribedValue(forcedColors, onForcedColorsChange);
}

/** Solid primitive that is true if the user prefers reduced transparency. */
export function createReducedTransparency(): Accessor<boolean> {
  return createSubscribedValue(prefersReducedTransparency, onReducedTransparencyChange);
}

/** Solid primitive for how the user last interacted: 'keyboard' or 'pointer'. */
export function createInputModality(): Accessor<InputModality> {
  return createSubscribedValue(getInputModality, onInputModalityChange);
}
