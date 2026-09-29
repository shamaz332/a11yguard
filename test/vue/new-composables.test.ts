import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref, nextTick } from 'vue';
import { useRouteAnnouncer } from '../../src/vue/use-route-announcer.js';
import { useSkipLink } from '../../src/vue/use-skip-link.js';
import { useFocusRestore } from '../../src/vue/use-focus-restore.js';
import { useA11yId } from '../../src/vue/use-a11y-id.js';
import { VisuallyHidden } from '../../src/vue/visually-hidden.js';

describe('useRouteAnnouncer', () => {
  it('focuses the heading after the route source changes, not on mount', async () => {
    const path = ref('/a');
    const Comp = defineComponent({
      setup() {
        useRouteAnnouncer(() => path.value);
        return { path };
      },
      template: `<main><h1>{{ path }}</h1></main>`,
    });
    const wrapper = mount(Comp, { attachTo: document.body });
    await nextTick();
    expect(document.activeElement).toBe(document.body);
    path.value = '/b';
    await nextTick();
    expect(document.activeElement?.tagName).toBe('H1');
    expect(document.activeElement?.textContent).toBe('/b');
    wrapper.unmount();
  });
});

describe('useSkipLink', () => {
  it('injects on mount and removes on unmount', () => {
    const Comp = defineComponent({
      setup() {
        useSkipLink({ target: '#content' });
        return {};
      },
      template: `<div id="content" />`,
    });
    const wrapper = mount(Comp, { attachTo: document.body });
    expect(document.querySelector('[data-a11yguard-skip-link]')?.getAttribute('href')).toBe(
      '#content'
    );
    wrapper.unmount();
    expect(document.querySelector('[data-a11yguard-skip-link]')).toBeNull();
  });
});

describe('useFocusRestore', () => {
  it('restores focus when active turns false', async () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const open = ref(false);
    const Comp = defineComponent({
      setup() {
        useFocusRestore(open);
        return {};
      },
      template: `<button id="inner">inner</button>`,
    });
    const wrapper = mount(Comp, { attachTo: document.body });
    open.value = true;
    await nextTick();
    (document.getElementById('inner') as HTMLElement).focus();
    open.value = false;
    await nextTick();
    expect(document.activeElement).toBe(trigger);
    wrapper.unmount();
  });

  it('restores focus on unmount while active', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    const Comp = defineComponent({
      setup() {
        useFocusRestore(true);
        return {};
      },
      template: `<button id="inner">inner</button>`,
    });
    const wrapper = mount(Comp, { attachTo: document.body });
    (document.getElementById('inner') as HTMLElement).focus();
    wrapper.unmount();
    expect(document.activeElement).toBe(trigger);
  });
});

describe('useA11yId', () => {
  it('returns distinct prefixed ids', () => {
    const Comp = defineComponent({
      setup() {
        return { a: useA11yId('hint'), b: useA11yId('hint') };
      },
      template: `<div :data-a="a" :data-b="b" />`,
    });
    const wrapper = mount(Comp);
    const a = wrapper.find('div').attributes('data-a');
    const b = wrapper.find('div').attributes('data-b');
    expect(a).toMatch(/^hint-/);
    expect(a).not.toBe(b);
    wrapper.unmount();
  });
});

describe('VisuallyHidden', () => {
  it('renders slot content with hidden styles', () => {
    const wrapper = mount(VisuallyHidden, { slots: { default: () => 'Delete' } });
    const el = wrapper.element as HTMLElement;
    expect(el.tagName).toBe('SPAN');
    expect(el.textContent).toBe('Delete');
    expect(el.style.position).toBe('absolute');
  });

  it('renders a custom element with as', () => {
    const wrapper = mount({ render: () => h(VisuallyHidden, { as: 'h2' }, () => 'Title') });
    expect((wrapper.element as HTMLElement).tagName).toBe('H2');
  });
});
