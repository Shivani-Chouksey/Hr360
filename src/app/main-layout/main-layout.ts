import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLinkActive, RouterLinkWithHref, RouterOutlet } from "@angular/router";
import { navJsonObject } from '../../config/nav-data'
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../service/localstorage';
import { filter } from 'rxjs';
import { Dashboard } from "../components/dashboard/dashboard";
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.html',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive, CommonModule, Dashboard],
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
  LoggedInUserDetail: any
  constructor(private localStorageService: LocalStorageService, private router: Router, private activatedRoute: ActivatedRoute) { }
  ngOnInit() {
    const LoggedInUser: any = this.localStorageService.get('loggedIn_user');
    this.LoggedInUserDetail = LoggedInUser
    console.log("LoggedInUser", LoggedInUser);
    this.onResize();

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const route = this.getDeepestRoute(this.activatedRoute);
        console.log(" route.snapshot.data", route.snapshot.data);

        this.pageTitle = route.snapshot.data['title'] ?? 'Dashboard';
      });
  }

  private getDeepestRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  @HostListener('window:resize')
  onResize() {
    this.isDesktop = window.innerWidth >= 1024;
    if (this.isDesktop) this.mobileSidebarOpen = true;
  }

  trackGroup = (_: number, g: any) => g.group;
  trackItem = (_: number, i: any) => i._id || i.link || i.label;
  trackLeaf = (_: number, c: any) => c._id || c.link || c.label;

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
  
  openUserMenu(event: MouseEvent): void {
    event.stopPropagation(); // ✅ keep menu open
    this.userMenuOpen = true;
  }

  /** ✅ Optimistic global close */
  @HostListener('document:click')
  closeMenu(): void {
    this.userMenuOpen = false;
  }

  gotoProfile(id: string) {
    this.userMenuOpen = false
    this.router.navigate(['employee/profile', id]);
  }
  onSearch(q: string) {
    // Hook into a search service / route
    // this.router.navigate(['/search'], { queryParams: { q } });
    console.log('Search:', q);
  }

  onLogout() {
    console.log('Logout');
    this.localStorageService.clear();
    this.router.navigateByUrl('/login')
  }



  
 hasActiveRoute = false;

  onRouteActivate(): void {
    this.hasActiveRoute = true;
  }

  onRouteDeactivate(): void {
    this.hasActiveRoute = false;
  }

}
