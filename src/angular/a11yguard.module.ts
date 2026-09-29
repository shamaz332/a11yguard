import { NgModule } from '@angular/core';
import { FocusTrapDirective } from './focus-trap.directive.js';
import { KeyboardNavDirective } from './keyboard-nav.directive.js';
import { SkipLinkDirective } from './skip-link.directive.js';

/**
 * NgModule that exports all a11yguard directives.
 * Import this in your AppModule or feature module.
 *
 * @example
 * // app.module.ts
 * import { A11yGuardModule } from '@shamaz332/a11yguard/angular';
 *
 * @NgModule({ imports: [A11yGuardModule] })
 * export class AppModule {}
 */
@NgModule({
  imports: [FocusTrapDirective, KeyboardNavDirective, SkipLinkDirective],
  exports: [FocusTrapDirective, KeyboardNavDirective, SkipLinkDirective],
})
export class A11yGuardModule {}
