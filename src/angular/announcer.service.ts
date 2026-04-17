import { Injectable } from '@angular/core';
import { announce as coreAnnounce } from '../core/announce.js';
import type { AnnouncePriority } from '../core/types.js';

/**
 * Angular service for screen reader announcements.
 * Backed by the core singleton live region — lazily created on first call.
 *
 * @example
 * // In a component:
 * constructor(private announcer: AnnouncerService) {}
 * save() {
 *   this.announcer.announce('Changes saved', 'polite');
 * }
 */
@Injectable({ providedIn: 'root' })
export class AnnouncerService {
  announce(message: string, priority: AnnouncePriority = 'polite'): void {
    coreAnnounce(message, priority);
  }
}
