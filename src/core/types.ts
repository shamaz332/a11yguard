// ─── Focus Trap ───────────────────────────────────────────────────────────────

export interface FocusTrapOptions {
  /**
   * Element to focus when the trap activates.
   * Pass `false` to suppress initial focus.
   * Default: first tabbable element inside the container.
   */
  initialFocus?: HTMLElement | (() => HTMLElement) | false;

  /**
   * Element to return focus to when the trap deactivates.
   * Default: the element that was focused before activation.
   */
  returnFocusTo?: HTMLElement | (() => HTMLElement);

  /**
   * Deactivate the trap when the user clicks outside the container.
   * Default: false.
   */
  clickOutsideDeactivates?: boolean;

  /**
   * Deactivate the trap when the user presses Escape.
   * Default: true.
   */
  escapeDeactivates?: boolean;

  /**
   * Set `inert` on all sibling subtrees while the trap is active,
   * hiding outside content from both keyboard and screen readers.
   * Default: true.
   */
  isolate?: boolean;

  /**
   * Called just before the trap deactivates.
   * Return `false` to cancel deactivation.
   */
  onDeactivate?: () => boolean | void;

  /**
   * Called just after the trap activates.
   */
  onActivate?: () => void;
}

export interface FocusTrap {
  /** Activate the focus trap. */
  activate(): void;
  /** Deactivate the focus trap and restore prior focus. */
  deactivate(): void;
  /** Temporarily pause the trap (focus can leave freely). */
  pause(): void;
  /** Resume a paused trap. */
  unpause(): void;
  /** Whether the trap is currently active (not paused). */
  readonly active: boolean;
  /** Destroy the trap instance and clean up all listeners. */
  destroy(): void;
}

// ─── Announcer ────────────────────────────────────────────────────────────────

/** 'polite' waits for the user to finish; 'assertive' interrupts immediately. */
export type AnnouncePriority = 'polite' | 'assertive';

export interface Announcer {
  announce(message: string, priority?: AnnouncePriority): void;
  destroy(): void;
}

// ─── Color Contrast ───────────────────────────────────────────────────────────

export type ColorInput = string;

export interface ContrastOptions {
  /**
   * Which algorithm(s) to run.
   * Default: 'wcag'.
   */
  algorithm?: 'wcag' | 'apca' | 'both';
  /**
   * WCAG conformance level to test against.
   * Default: 'AA'.
   */
  level?: 'AA' | 'AAA';
  /**
   * Whether the text is "large" per WCAG definition
   * (≥18pt normal weight or ≥14pt bold).
   * Affects the required ratio for AA/AAA.
   * Default: false.
   */
  largeText?: boolean;
  /**
   * Font size in CSS px — used by APCA to determine required Lc.
   * Default: 16.
   */
  fontSize?: number;
  /**
   * Font weight — used by APCA.
   * Default: 400.
   */
  fontWeight?: number;
}

export interface WcagContrastResult {
  /** Contrast ratio, e.g. 4.58. */
  ratio: number;
  passes: boolean;
  level: 'AA' | 'AAA' | 'fail';
}

export interface ApcaContrastResult {
  /** Lightness contrast (Lc), range roughly −108 to +106. */
  lc: number;
  passes: boolean;
  /** Minimum Lc required for this font size + weight. */
  minRequired: number;
}

export interface ContrastResult {
  wcag?: WcagContrastResult;
  apca?: ApcaContrastResult;
}

// ─── Keyboard Navigation ─────────────────────────────────────────────────────

export type KeyboardNavRole = 'menu' | 'grid' | 'listbox' | 'tablist';

export interface KeyboardNavOptions {
  /** ARIA widget role — determines keyboard interaction pattern. */
  role: KeyboardNavRole;
  /** CSS selector or function returning the navigable items. */
  items: string | (() => HTMLElement[]);
  /** Enable arrow key navigation. Default: true. */
  arrowKeys?: boolean;
  /** Enable Home/End keys. Default: true. */
  homeEnd?: boolean;
  /** Enable typeahead (jump to item by typing text). Default: true for menu/listbox. */
  typeahead?: boolean;
  /** Wrap from last item back to first (and vice-versa). Default: true. */
  wrap?: boolean;
  /**
   * Navigation axis.
   * 'vertical' (default) = up/down. 'horizontal' = left/right. 'both' = all four arrows.
   */
  orientation?: 'horizontal' | 'vertical' | 'both';
  /** Called when an item is selected (Enter/Space on menu/listbox, click). */
  onSelect?: (item: HTMLElement, index: number) => void;
}

export interface KeyboardNav {
  /** Programmatically focus an item by index. */
  focusItem(index: number): void;
  /** Index of the currently focused item. */
  readonly currentIndex: number;
  /** Remove all event listeners. */
  destroy(): void;
}

// ─── Skip Link ────────────────────────────────────────────────────────────────

export interface SkipLinkOptions {
  /** Target element selector. Default: '#main'. */
  target?: string;
  /** Visible label. Default: 'Skip to main content'. */
  label?: string;
}

// ─── Route Announcer ──────────────────────────────────────────────────────────

export interface RouteChangeOptions {
  /** Page title to announce. Default: `document.title`. */
  title?: string;
  /**
   * Builds the announced message from the title.
   * Default: `(title) => \`Navigated to ${title}\``.
   */
  message?: (title: string) => string;
  /**
   * Where to move focus after navigation. A CSS selector, an element, or `false`
   * to leave focus alone. Default: `'h1'`, falling back to `main`, then `body`.
   */
  focus?: string | HTMLElement | false;
  /** Clear the focus stack, since saved elements belong to the old page. Default: true. */
  clearFocusStack?: boolean;
}

// ─── Field Description ───────────────────────────────────────────────────────

export interface DescribeFieldOptions {
  /** Visible label. A `<label>` gets `for`; any other element is linked via `aria-labelledby`. */
  label?: HTMLElement | null;
  /** Hint / help text, linked via `aria-describedby`. */
  hint?: HTMLElement | null;
  /** Element that shows the error message. Hidden while there is no error. */
  error?: HTMLElement | null;
  /** How to announce new errors. Default: 'polite'. `false` disables announcements. */
  announce?: AnnouncePriority | false;
}

export interface FieldDescription {
  /** Show an error message (marks the field invalid) or pass `null` to clear it. */
  setError(message: string | null): void;
  /** Restore the field's original ARIA attributes. */
  destroy(): void;
}

// ─── Preferences ─────────────────────────────────────────────────────────────

export type ColorScheme = 'light' | 'dark' | 'no-preference';

/** Value of the `prefers-contrast` media feature. */
export type ContrastPreference = 'more' | 'less' | 'custom' | 'no-preference';

/** How the user last interacted with the page. */
export type InputModality = 'keyboard' | 'pointer';
