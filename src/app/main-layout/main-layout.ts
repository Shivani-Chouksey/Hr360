// main-layout.component.ts
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { navJsonObject, NavGroup, NavItem, NavLeaf } from '../../config/nav-data';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive,RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css'],
})
export class MainLayout {
  navJsonObject: ReadonlyArray<NavGroup> = navJsonObject;

  // Expand/Collapse state
  private openGroups = new Map<string, boolean>();
  private openItems = new Map<string, boolean>();

  // Helpers
  isGroupOpen(groupKey: string) { return this.openGroups.get(groupKey) === true; }
  isItemOpen(itemKey: string) { return this.openItems.get(itemKey) === true; }

  toggleGroup(groupKey: string) {
    this.openGroups.set(groupKey, !this.isGroupOpen(groupKey));
  }
  toggleItem(itemKey: string) {
    this.openItems.set(itemKey, !this.isItemOpen(itemKey));
  }

  trackGroup = (_: number, g: NavGroup) => g.group;
  trackItem = (_: number, i: NavItem) => i.link;
  trackLeaf = (_: number, l: NavLeaf) => l.link;

  constructor(private router: Router) {
    // Auto-expand the group & item that contains the active route
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      const url = this.router.url;
      for (const group of this.navJsonObject) {
        const groupHasActive = group.items.some(i =>
          url.startsWith(i.link) || (i.children ?? []).some(c => url.startsWith(c.link))
        );
        this.openGroups.set(group.group, groupHasActive);

        for (const item of group.items) {
          const itemHasActive = url.startsWith(item.link) || (item.children ?? []).some(c => url.startsWith(c.link));
          this.openItems.set(item.link, itemHasActive);
        }
      }
    });
  }
}