import { ref, watch, onUnmounted, type Ref, type MaybeRef, unref } from 'vue';
import { createFocusTrap } from '../core/focus-trap.js';
import type { FocusTrapOptions, FocusTrap } from '../core/types.js';

export interface VueFocusTrapOptions extends FocusTrapOptions {
  /** Reactive flag — trap activates when true, deactivates when false. */
  active?: MaybeRef<boolean>;
}

/**
 * Vue composable that creates a focus trap on a container element.
 * Returns a template ref to bind to your container with `ref="containerRef"`.
 *
 * @example
 * <script setup>
 * const open = ref(false);
 * const containerRef = useFocusTrap({ active: open });
 * </script>
 * <template>
 *   <div v-if="open" :ref="containerRef" role="dialog" aria-modal="true">...</div>
 * </template>
 */
export function useFocusTrap(options: VueFocusTrapOptions = {}): Ref<HTMLElement | null> {
  const containerRef = ref<HTMLElement | null>(null);
  let trap: FocusTrap | null = null;

  const { active: activeProp, ...trapOptions } = options;

  function setup(el: HTMLElement): void {
    trap = createFocusTrap(el, trapOptions);
    const isActive = unref(activeProp) !== false;
    if (isActive) trap.activate();
  }

  function teardown(): void {
    trap?.destroy();
    trap = null;
  }

  // Watch for the element being mounted/unmounted
  watch(containerRef, (el, prevEl) => {
    if (prevEl) teardown();
    if (el) setup(el);
  });

  // Watch the reactive active flag
  if (activeProp !== undefined) {
    watch(
      () => unref(activeProp),
      (isActive) => {
        if (!trap) return;
        if (isActive && !trap.active) trap.activate();
        else if (!isActive && trap.active) trap.deactivate();
      }
    );
  }

  onUnmounted(teardown);

  return containerRef;
}
