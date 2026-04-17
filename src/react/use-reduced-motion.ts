import { useState, useEffect } from 'react';
import { prefersReducedMotion, onReducedMotionChange } from '../core/preferences.js';

/**
 * React hook that returns `true` if the user prefers reduced motion.
 * Reactively updates when the OS setting changes.
 * SSR-safe — returns `false` on the server.
 *
 * @example
 * function AnimatedPanel() {
 *   const reduced = useReducedMotion();
 *   return <div style={{ transition: reduced ? 'none' : 'all 0.3s' }}>...</div>;
 * }
 */
export function useReducedMotion(): boolean {
  const [value, setValue] = useState<boolean>(() => prefersReducedMotion());

  useEffect(() => {
    setValue(prefersReducedMotion());
    return onReducedMotionChange(setValue);
  }, []);

  return value;
}
