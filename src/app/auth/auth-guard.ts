import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { LocalStorageService } from '../service/localstorage';

export const authGuard: CanActivateFn = (route, state) => {
  console.log('authGuard', route);
  const localStorageService = inject(LocalStorageService)
  const router = inject(Router)
  const token=localStorageService.get<string>('accessToken')
  // const isLoggedIn = localStorage.getItem('isLoggedIn');
  console.log("token", token);

  if (!token) {
    router.navigate(['/login'])
  }
  return true;
};


export const noAuthGuard: CanMatchFn = (route, state) => {
  console.log(" noAuthGuard route", route);
  const localStorageService = inject(LocalStorageService)
  const router = inject(Router);
   const token=localStorageService.get<string>('accessToken')
  if (token) {
    router.navigate(['']);
    return false;
  }
  return true;
};
