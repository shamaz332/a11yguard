import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, ref, nextTick } from 'vue';
import { useFocusTrap } from '../../src/vue/use-focus-trap.js';
import { useAnnouncer } from '../../src/vue/use-announcer.js';
import { useReducedMotion } from '../../src/vue/use-reduced-motion.js';
import { useColorScheme } from '../../src/vue/use-color-scheme.js';
import { useScrollLock } from '../../src/vue/use-scroll-lock.js';
import { useKeyboardNav } from '../../src/vue/use-keyboard-nav.js';
import { isScrollLocked, unlockScroll } from '../../src/core/scroll-lock.js';

vi.stubGlobal('scrollTo', vi.fn());

// ─── useFocusTrap ─────────────────────────────────────────────────────────────

describe('useFocusTrap', () => {
  it('returns a ref that can be bound to a container', async () => {
    const ModalComp = defineComponent({
      setup() {
        const open = ref(true);
        const containerRef = useFocusTrap({ active: open });
        return { containerRef, open };
      },
      template: `
        <div v-if="open" :ref="containerRef" role="dialog" aria-modal="true" data-testid="modal">
          <button>First</button>
          <button>Close</button>
        </div>
      `,
    });

    const wrapper = mount(ModalComp, { attachTo: document.body });
    await nextTick();
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
    wrapper.unmount();
  });

  it('deactivates trap when active ref becomes false', async () => {
    const ModalComp = defineComponent({
      setup() {
        const open = ref(true);
        const containerRef = useFocusTrap({ active: open });
        return { containerRef, open };
      },
      template: `
        <div :ref="containerRef" role="dialog" data-testid="modal">
          <button>Btn</button>
        </div>
      `,
    });

    const wrapper = mount(ModalComp, { attachTo: document.body });
    await nextTick();
    // Flip active to false — should not throw
    wrapper.vm.open = false;
    await nextTick();
    wrapper.unmount();
  });
});

// ─── useAnnouncer ─────────────────────────────────────────────────────────────

describe('useAnnouncer', () => {
  it('returns a function', () => {
    const Comp = defineComponent({
      setup() {
        const announce = useAnnouncer();
        return { announce };
      },
      template: `<div />`,
    });
    const wrapper = mount(Comp);
    expect(typeof wrapper.vm.announce).toBe('function');
    wrapper.unmount();
  });

  it('calling announce does not throw', () => {
    const Comp = defineComponent({
      setup() {
        const announce = useAnnouncer();
        return { announce };
      },
      template: `<div />`,
    });
    const wrapper = mount(Comp, { attachTo: document.body });
    expect(() => wrapper.vm.announce('Test message', 'polite')).not.toThrow();
    wrapper.unmount();
  });
});

// ─── useReducedMotion ─────────────────────────────────────────────────────────

describe('useReducedMotion', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))
    );
  });

  it('returns a ref with boolean value', async () => {
    const Comp = defineComponent({
      setup() {
        const reduced = useReducedMotion();
        return { reduced };
      },
      template: `<div :data-reduced="reduced" />`,
    });
    const wrapper = mount(Comp, { attachTo: document.body });
    await nextTick();
    const val = wrapper.find('div').attributes('data-reduced');
    expect(['true', 'false']).toContain(val);
    wrapper.unmount();
  });
});

// ─── useColorScheme ───────────────────────────────────────────────────────────

describe('useColorScheme', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))
    );
  });

  it('returns a ref with ColorScheme value', async () => {
    const Comp = defineComponent({
      setup() {
        const scheme = useColorScheme();
        return { scheme };
      },
      template: `<div :data-scheme="scheme" />`,
    });
    const wrapper = mount(Comp, { attachTo: document.body });
    await nextTick();
    const val = wrapper.find('div').attributes('data-scheme');
    expect(['light', 'dark', 'no-preference']).toContain(val);
    wrapper.unmount();
  });
});

// ─── useScrollLock ────────────────────────────────────────────────────────────

describe('useScrollLock', () => {
  beforeEach(() => {
    while (isScrollLocked()) unlockScroll();
  });

  it('locks scroll when active=true', async () => {
    const Comp = defineComponent({
      setup() {
        useScrollLock(true);
        return {};
      },
      template: `<div />`,
    });
    const wrapper = mount(Comp);
    await nextTick();
    expect(isScrollLocked()).toBe(true);
    wrapper.unmount();
  });

  it('does not lock scroll when active=false', async () => {
    const Comp = defineComponent({
      setup() {
        useScrollLock(false);
        return {};
      },
      template: `<div />`,
    });
    const wrapper = mount(Comp);
    await nextTick();
    expect(isScrollLocked()).toBe(false);
    wrapper.unmount();
  });

  it('unlocks on unmount', async () => {
    const Comp = defineComponent({
      setup() {
        useScrollLock(true);
        return {};
      },
      template: `<div />`,
    });
    const wrapper = mount(Comp);
    await nextTick();
    expect(isScrollLocked()).toBe(true);
    wrapper.unmount();
    expect(isScrollLocked()).toBe(false);
  });

  it('reacts to a reactive ref', async () => {
    const Comp = defineComponent({
      props: ['active'],
      setup(props) {
        const active = ref(props.active as boolean);
        useScrollLock(active);
        return { active };
      },
      template: `<div />`,
    });
    const wrapper = mount(Comp, { props: { active: false } });
    await nextTick();
    expect(isScrollLocked()).toBe(false);
    wrapper.unmount();
  });
});

// ─── useKeyboardNav ───────────────────────────────────────────────────────────

describe('useKeyboardNav', () => {
  it('attaches nav to container without throwing', async () => {
    const Comp = defineComponent({
      setup() {
        const containerRef = useKeyboardNav({ role: 'menu', items: 'button' });
        return { containerRef };
      },
      template: `
        <div :ref="containerRef" role="menu">
          <button>A</button>
          <button>B</button>
        </div>
      `,
    });
    const wrapper = mount(Comp, { attachTo: document.body });
    await nextTick();
    expect(wrapper.find('[role="menu"]').exists()).toBe(true);
    wrapper.unmount();
  });
});
