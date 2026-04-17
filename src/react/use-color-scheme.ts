import { useState, useEffect } from 'react';
import { prefersColorScheme, onColorSchemeChange } from '../core/preferences.js';
import type { ColorScheme } from '../core/types.js';

/**
 * React hook that returns the user's preferred color scheme.
 * Reactively updates when the OS setting changes.
 * SSR-safe — returns `'light'` on the server.
 *
 * @example
 * function App() {
 *   const scheme = useColorScheme();
 *   return <div data-theme={scheme}>...</div>;
 * }
 */
export function useColorScheme(): ColorScheme {
  const [scheme, setScheme] = useState<ColorScheme>(() => prefersColorScheme());

  useEffect(() => {
    setScheme(prefersColorScheme());
    return onColorSchemeChange(setScheme);
  }, []);

  return scheme;
}
