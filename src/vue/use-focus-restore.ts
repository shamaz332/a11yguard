import { watch, onUnmounted, type MaybeRef, unref } from 'vue';
import { pushFocus, popFocus } from '../core/focus-stack.js';

/**
 * Vue composable that saves the focused element when `active` becomes true and
 * restores focus to it when `active` becomes false or the component unmounts.
 *
 * @example
 * const open = ref(false);
 * useFocusRestore(open);
 */
export function useFocusRestore(active: MaybeRef<boolean>): void {
  let saved = false;

  watch(
    () => unref(active),
    (isActive) => {
      if (isActive && !saved) {
        pushFocus();
        saved = true;
      } else if (!isActive && saved) {
        popFocus();
        saved = false;
      }
    },
    { immediate: true }
  );

  onUnmounted(() => {
    if (saved) {
      popFocus();
      saved = false;
    }
  });
}
