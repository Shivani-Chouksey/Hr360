import { Component, HostListener } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref, RouterOutlet } from "@angular/router";
import { navJsonObject } from '../../config/nav-data'
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.html',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive,CommonModule],
})
export class MainLayout {
  mobileSidebarOpen = false;
  userMenuOpen = false;
  isDesktop = false;
  navJsonObject = navJsonObject
  pageTitle = 'Dashboard';
  currentUser = { name: 'John Doe' };


  private openGroups = new Set<string>();
  private openItems = new Set<string>();

  ngOnInit() {
    console.log("navJsonObject",navJsonObject);
    this.onResize();
  }

  @HostListener('window:resize')
  onResize() {
    this.isDesktop = window.innerWidth >= 1024;
    if (this.isDesktop) this.mobileSidebarOpen = true;
  }

  trackGroup = (_: number, g: any) => g.group;
  trackItem = (_: number, i: any) => i._id || i.link || i.label;
  trackLeaf = (_: number, c: any) => c._id || c.link || c.label;
loggedInUserId='Employ12'
  toggleGroup(key: string) {
    if (this.openGroups.has(key)) this.openGroups.delete(key);
    else this.openGroups.add(key);
  }
  isGroupOpen(key: string) {
    return this.openGroups.has(key);
  }

  toggleItem(key: string) {
    if (this.openItems.has(key)) this.openItems.delete(key);
    else this.openItems.add(key);
  }
  isItemOpen(key: string) {
    return this.openItems.has(key);
  }

  onSearch(q: string) {
    // Hook into a search service / route
    // this.router.navigate(['/search'], { queryParams: { q } });
    console.log('Search:', q);
  }

  onLogout() {
    // Call your auth service
    // this.auth.logout();
    console.log('Logout');
  }
}
``