import { watch, onUnmounted, type MaybeRef, unref } from 'vue';
import { lockScroll, unlockScroll } from '../core/scroll-lock.js';

/**
 * Vue composable that locks body scroll when `active` is true.
 * Accepts a plain boolean or a reactive ref/computed.
 *
 * @example
 * const isOpen = ref(false);
 * useScrollLock(isOpen);
 */
export function useScrollLock(active: MaybeRef<boolean>): void {
  let locked = false;

  watch(
    () => unref(active),
    (isActive) => {
      if (isActive && !locked) {
        lockScroll();
        locked = true;
      } else if (!isActive && locked) {
        unlockScroll();
        locked = false;
      }
    },
    { immediate: true }
  );

  onUnmounted(() => {
    if (locked) {
      unlockScroll();
      locked = false;
    }
  });
}
