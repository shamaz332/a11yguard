import { Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { createFocusTrap } from '../core/focus-trap.js';
import type { FocusTrap, FocusTrapOptions } from '../core/types.js';

/**
 * Angular directive that creates a focus trap on the host element.
 * Supports standalone usage (Angular 16+) and NgModule usage.
 *
 * @example
 * <!-- NgModule or standalone -->
 * <div a11yFocusTrap [active]="isModalOpen" [escapeDeactivates]="true" role="dialog">
 *   <button>First focusable</button>
 * </div>
 */
@Directive({
  selector: '[a11yFocusTrap]',
  standalone: true,
})
export class FocusTrapDirective implements OnChanges, OnDestroy {
  /** Whether the focus trap is active. */
  @Input() active = true;

  /** Deactivate on Escape key. Default: true. */
  @Input() escapeDeactivates = true;

  /** Click outside deactivates the trap. Default: false. */
  @Input() clickOutsideDeactivates = false;

  /** Isolate outside content with inert. Default: true. */
  @Input() isolate = true;

  private trap: FocusTrap | null = null;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.trap) {
      this.trap = createFocusTrap(this.el.nativeElement, this.getOptions());
    }

    if ('active' in changes) {
      if (this.active && !this.trap.active) {
        this.trap.activate();
      } else if (!this.active && this.trap.active) {
        this.trap.deactivate();
      }
    }
  }

  ngOnDestroy(): void {
    this.trap?.destroy();
    this.trap = null;
  }

  private getOptions(): FocusTrapOptions {
    return {
      escapeDeactivates: this.escapeDeactivates,
      clickOutsideDeactivates: this.clickOutsideDeactivates,
      isolate: this.isolate,
    };
  }
}
