import { useEffect } from 'react';
import { injectSkipLink } from '../core/skip-link.js';
import type { SkipLinkOptions } from '../core/types.js';

/**
 * React hook that injects a "Skip to main content" link while the component is mounted.
 * Use it once, in your root layout.
 *
 * @example
 * function Layout({ children }) {
 *   useSkipLink({ target: '#main' });
 *   return <main id="main">{children}</main>;
 * }
 */
export function useSkipLink(options: SkipLinkOptions = {}): void {
  const { target, label } = options;
  useEffect(
    () =>
      injectSkipLink({
        ...(target !== undefined && { target }),
        ...(label !== undefined && { label }),
      }),
    [target, label]
  );
}
