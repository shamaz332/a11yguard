import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FocusTrapDirective,
  KeyboardNavDirective,
  AnnouncerService,
  PreferencesService,
} from '@shamaz332/a11yguard/angular';
import { injectSkipLink, checkContrast } from '@shamaz332/a11yguard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FocusTrapDirective, KeyboardNavDirective],
  template: `
    <main id="main">
      <h1>@shamaz332/a11yguard — Angular Demo</h1>

      <div class="prefs">
        <strong>Preferences:</strong>
        Reduced motion: <code>{{ reducedMotion }}</code> |
        Color scheme: <code>{{ colorScheme }}</code>
      </div>

      <section>
        <h2>Focus Trap</h2>
        <button id="open-modal" (click)="openModal()">Open Modal</button>
      </section>

      <!-- Modal -->
      <div *ngIf="isOpen" class="backdrop">
        <div
          a11yFocusTrap
          [active]="isOpen"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          class="modal"
        >
          <h2 id="modal-title">Accessible Modal</h2>
          <p>Focus is trapped. Press Escape or click Cancel to close.</p>
          <div class="modal-footer">
            <button (click)="closeModal()">Cancel</button>
            <button (click)="confirm()">Confirm</button>
          </div>
        </div>
      </div>

      <!-- Keyboard nav menu -->
      <section>
        <h2>Keyboard Navigation Menu</h2>
        <p>Use arrow keys to navigate items below.</p>
        <div
          a11yKeyboardNav
          navRole="menu"
          navItems="[role='menuitem']"
          role="menu"
          aria-label="Demo menu"
          style="border: 1px solid #ccc; border-radius: 4px; max-width: 200px"
        >
          <div role="menuitem" tabindex="0" style="padding: 8px 12px; cursor: pointer">Item 1</div>
          <div role="menuitem" tabindex="-1" style="padding: 8px 12px; cursor: pointer">Item 2</div>
          <div role="menuitem" tabindex="-1" style="padding: 8px 12px; cursor: pointer">Item 3</div>
        </div>
      </section>
    </main>
  `,
})
export class AppComponent implements OnInit {
  isOpen = false;
  reducedMotion = false;
  colorScheme = 'light';

  constructor(
    private announcer: AnnouncerService,
    private prefs: PreferencesService,
  ) {}

  ngOnInit(): void {
    injectSkipLink();
    this.prefs.reducedMotion$.subscribe((v) => (this.reducedMotion = v));
    this.prefs.colorScheme$.subscribe((v) => (this.colorScheme = v));
  }

  openModal(): void {
    this.isOpen = true;
    this.announcer.announce('Modal opened', 'polite');
  }

  closeModal(): void {
    this.isOpen = false;
    this.announcer.announce('Modal closed', 'polite');
  }

  confirm(): void {
    this.announcer.announce('Action confirmed!', 'assertive');
    this.closeModal();
  }
}
