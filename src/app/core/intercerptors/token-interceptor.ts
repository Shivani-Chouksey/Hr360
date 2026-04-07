import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '../services/localstorage';

const AUTH_ROUTES = [
  '/auth/login',
  '/auth/send-otp',
  '/auth/verify-otp',
];


export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
const localStorageService = inject(LocalStorageService);

 // ✅ Skip token for auth endpoints
  if (AUTH_ROUTES.some(route => req.url.includes(route))) {
    return next(req);
  }

  const token = localStorageService.get('accessToken');
  const newReq=req.clone({
    setHeaders:{
      Authorization:`Bearer ${token}`
    }
  })
  return next(newReq);
};
