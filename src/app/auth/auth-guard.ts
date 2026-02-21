import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  console.log('authGuard', route);

  const router = inject(Router)
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  console.log("isLoggedIn", isLoggedIn);

  if (!isLoggedIn) {
    router.navigate(['/login'])
  }
  return true;
};


export const noAuthGuard: CanMatchFn = (route, state) => {
  console.log(" noAuthGuard route", route);

  const router = inject(Router);
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn) {
    router.navigate(['']);
    return false;
  }
  return true;
};
