import { Directive, ElementRef, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { createKeyboardNav } from '../core/keyboard-nav.js';
import type { KeyboardNav, KeyboardNavOptions, KeyboardNavRole } from '../core/types.js';

/**
 * Angular directive that adds keyboard navigation to a composite widget.
 *
 * @example
 * <ul a11yKeyboardNav navRole="menu" navItems="[role='menuitem']">
 *   <li role="menuitem" tabindex="0">Item 1</li>
 *   <li role="menuitem" tabindex="-1">Item 2</li>
 * </ul>
 */
@Directive({
  selector: '[a11yKeyboardNav]',
  standalone: true,
})
export class KeyboardNavDirective implements OnInit, OnDestroy, OnChanges {
  /** ARIA widget role. Required. */
  @Input({ required: true }) navRole!: KeyboardNavRole;

  /** CSS selector or items getter. Default: '[tabindex]'. */
  @Input() navItems: string = '[tabindex]';

  /** Enable arrow key navigation. Default: true. */
  @Input() arrowKeys = true;

  /** Enable Home/End keys. Default: true. */
  @Input() homeEnd = true;

  /** Wrap from last to first. Default: true. */
  @Input() wrap = true;

  private nav: KeyboardNav | null = null;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.nav = createKeyboardNav(this.el.nativeElement, this.getOptions());
  }

  ngOnChanges(): void {
    if (this.nav) {
      this.nav.destroy();
      this.nav = createKeyboardNav(this.el.nativeElement, this.getOptions());
    }
  }

  ngOnDestroy(): void {
    this.nav?.destroy();
    this.nav = null;
  }

  private getOptions(): KeyboardNavOptions {
    return {
      role: this.navRole,
      items: this.navItems,
      arrowKeys: this.arrowKeys,
      homeEnd: this.homeEnd,
      wrap: this.wrap,
    };
  }
}
