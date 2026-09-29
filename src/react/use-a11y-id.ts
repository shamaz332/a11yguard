import * as React from 'react';
import { createId } from '../core/id.js';

const reactUseId = (React as { useId?: () => string }).useId;

/**
 * React hook that returns a stable id for ARIA relationships.
 * Uses React's SSR-safe `useId` on React 18+, and falls back to `createId` on React 17.
 *
 * @example
 * function Field() {
 *   const hintId = useA11yId('hint');
 *   return <>
 *     <input aria-describedby={hintId} />
 *     <p id={hintId}>8+ characters</p>
 *   </>;
 * }
 */
export function useA11yId(prefix = 'a11yguard'): string {
  if (reactUseId) {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- the branch never changes at runtime
    const id = reactUseId();
    return `${prefix}-${id.replace(/:/g, '')}`;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks -- see above
  const [id] = React.useState(() => createId(prefix));
  return id;
}
