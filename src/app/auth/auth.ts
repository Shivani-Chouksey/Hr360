import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { API_ROUTES } from '../../../api-enpoints';
interface ApiEnvelope<T> {
  data: T;
  message: string;
  statusCode:number;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private route: Router , private http:HttpClient , private api_routes:API_ROUTES) { }
  loginService(data: FormData) {
    console.log("authService", data);
  return  this.http.post<ApiEnvelope<any>>(this.api_routes.Login,data)
  
  }

SendOtp(data:any){
  return this.http.post<ApiEnvelope<any>>(this.api_routes.send_otp,data)
}

VerifyOtp(data:any){
  return this.http.post<ApiEnvelope<any>>(this.api_routes.verify_otp,data)
}
}
