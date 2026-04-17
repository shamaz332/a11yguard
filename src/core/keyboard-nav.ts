import type { KeyboardNav, KeyboardNavOptions } from './types.js';

/**
 * Creates a keyboard navigation controller for composite widgets.
 * Implements ARIA patterns for menu, grid, listbox, and tablist roles.
 *
 * Supports:
 * - Arrow key navigation (vertical, horizontal, or both)
 * - Home/End to jump to first/last item
 * - Typeahead: type a character to jump to matching item
 * - Wrap-around at boundaries
 * - aria-activedescendant management for menu/listbox
 *
 * @example
 * const nav = createKeyboardNav(menuEl, {
 *   role: 'menu',
 *   items: '[role="menuitem"]',
 *   onSelect: (item) => item.click(),
 * });
 * // later:
 * nav.destroy();
 */
export function createKeyboardNav(
  container: HTMLElement,
  options: KeyboardNavOptions
): KeyboardNav {
  const {
    role,
    arrowKeys = true,
    homeEnd = true,
    wrap = true,
    orientation = 'vertical',
    onSelect,
  } = options;

  const useTypeahead =
    options.typeahead !== undefined ? options.typeahead : role === 'menu' || role === 'listbox';

  let currentIndex = -1;
  let typeaheadBuffer = '';
  let typeaheadTimer: ReturnType<typeof setTimeout> | null = null;

  function getItems(): HTMLElement[] {
    if (typeof options.items === 'function') {
      return options.items();
    }
    return Array.from(container.querySelectorAll<HTMLElement>(options.items));
  }

  function focusItem(index: number): void {
    const items = getItems();
    if (items.length === 0) return;

    let target = index;
    if (wrap) {
      target = ((index % items.length) + items.length) % items.length;
    } else {
      target = Math.max(0, Math.min(index, items.length - 1));
    }

    currentIndex = target;
    const item = items[target];
    if (!item) return;

    // For listbox/menu: use aria-activedescendant on container
    if (role === 'listbox' || role === 'menu') {
      if (!item.id) item.id = `a11yguard-item-${Math.random().toString(36).slice(2, 8)}`;
      container.setAttribute('aria-activedescendant', item.id);
      // Scroll item into view if needed
      item.scrollIntoView?.({ block: 'nearest' });
    }

    item.focus();
  }

  function handleTypeahead(char: string): void {
    if (typeaheadTimer) clearTimeout(typeaheadTimer);
    typeaheadBuffer += char.toLowerCase();

    const items = getItems();
    const startIdx = currentIndex + 1;

    // Search from current+1 wrapping around
    for (let i = 0; i < items.length; i++) {
      const idx = (startIdx + i) % items.length;
      const text = (items[idx]?.textContent ?? '').trim().toLowerCase();
      if (text.startsWith(typeaheadBuffer)) {
        focusItem(idx);
        break;
      }
    }

    typeaheadTimer = setTimeout(() => {
      typeaheadBuffer = '';
    }, 500);
  }

  function handleKeyDown(e: KeyboardEvent): void {
    const items = getItems();
    if (items.length === 0) return;

    const isVertical = orientation === 'vertical' || orientation === 'both';
    const isHorizontal = orientation === 'horizontal' || orientation === 'both';

    // Grid mode: calculate row/column counts for 2D navigation
    const isGrid = role === 'grid';

    switch (e.key) {
      case 'ArrowDown':
        if (!arrowKeys || !isVertical) break;
        e.preventDefault();
        if (isGrid) {
          const cols = getGridCols(container);
          focusItem(currentIndex + cols);
        } else {
          focusItem(currentIndex + 1);
        }
        break;

      case 'ArrowUp':
        if (!arrowKeys || !isVertical) break;
        e.preventDefault();
        if (isGrid) {
          const cols = getGridCols(container);
          focusItem(currentIndex - cols);
        } else {
          focusItem(currentIndex - 1);
        }
        break;

      case 'ArrowRight':
        if (!arrowKeys || !isHorizontal) break;
        e.preventDefault();
        focusItem(currentIndex + 1);
        break;

      case 'ArrowLeft':
        if (!arrowKeys || !isHorizontal) break;
        e.preventDefault();
        focusItem(currentIndex - 1);
        break;

      case 'Home':
        if (!homeEnd) break;
        e.preventDefault();
        focusItem(0);
        break;

      case 'End':
        if (!homeEnd) break;
        e.preventDefault();
        focusItem(items.length - 1);
        break;

      case 'Enter':
      case ' ': {
        const item = items[currentIndex];
        if (item && (role === 'menu' || role === 'listbox')) {
          e.preventDefault();
          onSelect?.(item, currentIndex);
        }
        break;
      }

      default:
        if (useTypeahead && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          handleTypeahead(e.key);
        }
    }
  }

  function handleFocus(e: FocusEvent): void {
    const items = getItems();
    const target = e.target as HTMLElement;
    const idx = items.indexOf(target);
    if (idx !== -1) currentIndex = idx;
  }

  container.addEventListener('keydown', handleKeyDown);
  container.addEventListener('focusin', handleFocus);

  const instance: KeyboardNav = {
    focusItem(index: number): void {
      focusItem(index);
    },

    get currentIndex(): number {
      return currentIndex;
    },

    destroy(): void {
      container.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('focusin', handleFocus);
      if (typeaheadTimer) clearTimeout(typeaheadTimer);
    },
  };

  return instance;
}

function getGridCols(container: HTMLElement): number {
  const style = window.getComputedStyle(container);
  const cols = style.getPropertyValue('grid-template-columns');
  if (cols && cols !== 'none') {
    return cols.trim().split(/\s+/).length;
  }
  // Fallback: count items in the first row by comparing offsetTop
  const children = Array.from(container.children) as HTMLElement[];
  if (children.length === 0) return 1;
  const firstTop = children[0]?.offsetTop ?? 0;
  let cols2 = 0;
  for (const child of children) {
    if (child.offsetTop === firstTop) cols2++;
    else break;
  }
  return cols2 || 1;
}
