import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private authService: AuthService) { }
  hasOtp = true
  LoginWithOtp = false

  loginHandler(form: NgForm) {
    this.authService.loginService(form.value)
  }

}
