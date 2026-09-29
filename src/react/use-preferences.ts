import { useState, useEffect } from 'react';
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
): T {
  const [value, setValue] = useState<T>(serverValue);
  useEffect(() => {
    setValue(read());
    return subscribe(setValue);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- read/subscribe are module functions
  return value;
}

/**
 * React hook for the user's `prefers-contrast` setting.
 *
 * @example
 * const contrast = useContrastPreference(); // 'more' | 'less' | 'custom' | 'no-preference'
 */
export function useContrastPreference(): ContrastPreference {
  return useSubscribedValue(prefersContrast, onContrastChange, 'no-preference');
}

/**
 * React hook that returns true while forced colors (Windows High Contrast) are active.
 *
 * @example
 * const forced = useForcedColors();
 */
export function useForcedColors(): boolean {
  return useSubscribedValue(forcedColors, onForcedColorsChange, false);
}

/**
 * React hook that returns true if the user prefers reduced transparency.
 *
 * @example
 * const solid = useReducedTransparency();
 * <div style={{ backdropFilter: solid ? 'none' : 'blur(8px)' }} />
 */
export function useReducedTransparency(): boolean {
  return useSubscribedValue(prefersReducedTransparency, onReducedTransparencyChange, false);
}

/**
 * React hook that returns how the user last interacted: 'keyboard' or 'pointer'.
 *
 * @example
 * const modality = useInputModality();
 * <div className={modality === 'keyboard' ? 'show-focus' : ''} />
 */
export function useInputModality(): InputModality {
  return useSubscribedValue(getInputModality, onInputModalityChange, 'keyboard');
}
