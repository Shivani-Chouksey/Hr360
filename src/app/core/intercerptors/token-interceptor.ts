import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '../services/localstorage';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
const localStorageService = inject(LocalStorageService);

  const token = localStorageService.get('accessToken');
  const newReq=req.clone({
    setHeaders:{
      Authorization:`Bearer ${token}`
    }
  })
  return next(newReq);
};
