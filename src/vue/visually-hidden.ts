import { defineComponent, h } from 'vue';
import { visuallyHidden } from '../core/visually-hidden.js';

/**
 * Renders content that screen readers announce but sighted users do not see.
 *
 * @example
 * <button>
 *   <TrashIcon aria-hidden="true" />
 *   <VisuallyHidden>Delete item</VisuallyHidden>
 * </button>
 */
export const VisuallyHidden = defineComponent({
  name: 'VisuallyHidden',
  props: {
    /** Element to render. Default: 'span'. */
    as: { type: String, default: 'span' },
  },
  setup(props, { slots }) {
    return () => h(props.as, { style: visuallyHidden }, slots.default?.());
  },
});
