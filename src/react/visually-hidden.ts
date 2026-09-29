import { createElement, type ElementType, type HTMLAttributes, type ReactElement } from 'react';
import { visuallyHidden } from '../core/visually-hidden.js';

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLElement> {
  /** Element to render. Default: 'span'. */
  as?: ElementType;
}

/**
 * Renders content that screen readers announce but sighted users do not see.
 *
 * @example
 * <button>
 *   <TrashIcon aria-hidden="true" />
 *   <VisuallyHidden>Delete item</VisuallyHidden>
 * </button>
 */
export function VisuallyHidden({
  as = 'span',
  style,
  ...props
}: VisuallyHiddenProps): ReactElement {
  return createElement(as, { ...props, style: { ...visuallyHidden, ...style } });
}
