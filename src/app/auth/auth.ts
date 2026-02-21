import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private route: Router) { }
  loginService(data: FormData) {
    console.log("authService", data);
    localStorage.setItem("isLoggedIn", "true");
    this.route.navigate(['/dashboard']);
  }
}
