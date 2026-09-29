import * as Vue from 'vue';
import { createId } from '../core/id.js';

const vueUseId = (Vue as { useId?: () => string | undefined }).useId;

/**
 * Vue composable that returns a stable id for ARIA relationships.
 * Uses Vue's SSR-safe `useId` on Vue 3.5+, and falls back to `createId` on older versions.
 * Call it inside `setup`.
 *
 * @example
 * const hintId = useA11yId('hint');
 * // <input :aria-describedby="hintId" /> <p :id="hintId">8+ characters</p>
 */
export function useA11yId(prefix = 'a11yguard'): string {
  const id = vueUseId?.();
  return id ? `${prefix}-${id}` : createId(prefix);
}
