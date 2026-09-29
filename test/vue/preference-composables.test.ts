import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';
import {
  useContrastPreference,
  useForcedColors,
  useReducedTransparency,
  useInputModality,
} from '../../src/vue/use-preferences.js';

vi.stubGlobal(
  'matchMedia',
  vi.fn((query: string) => ({
    matches:
      query === '(prefers-contrast: less)' || query === '(prefers-reduced-transparency: reduce)',
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
);

describe('preference composables', () => {
  it('read current values and track modality', async () => {
    const Comp = defineComponent({
      setup() {
        return {
          contrast: useContrastPreference(),
          forced: useForcedColors(),
          transparency: useReducedTransparency(),
          modality: useInputModality(),
        };
      },
      template: `<div :data-c="contrast" :data-f="forced" :data-t="transparency" :data-m="modality" />`,
    });
    const wrapper = mount(Comp, { attachTo: document.body });
    await nextTick();
    const div = wrapper.find('div');
    expect(div.attributes('data-c')).toBe('less');
    expect(div.attributes('data-f')).toBe('false');
    expect(div.attributes('data-t')).toBe('true');
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await nextTick();
    expect(wrapper.find('div').attributes('data-m')).toBe('pointer');
    wrapper.unmount();
  });
});
