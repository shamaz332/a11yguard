import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { injectSkipLink } from '../core/skip-link.js';
import { ensureId } from '../core/id.js';

/**
 * Angular directive that marks the main content and injects a skip link to it.
 * The host gets an id if it has none.
 *
 * @example
 * <main a11ySkipLink>...</main>
 * <main a11ySkipLink="Skip to content">...</main>
 */
@Directive({
  selector: '[a11ySkipLink]',
  standalone: true,
})
export class SkipLinkDirective implements OnInit, OnDestroy {
  /** Link text. Default: 'Skip to main content'. */
  @Input('a11ySkipLink') label = '';

  private cleanup: (() => void) | null = null;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const target = `#${ensureId(this.el.nativeElement, 'main')}`;
    this.cleanup = injectSkipLink(this.label ? { target, label: this.label } : { target });
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}
