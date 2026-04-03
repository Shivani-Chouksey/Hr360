import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../auth';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, Routes } from '@angular/router';
import { LocalStorageService } from '../../service/localstorage';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})



export class Login {
  constructor(private authService: AuthService, private route: Router, private localStorageService: LocalStorageService) { }
  hasOtp = true
  LoginWithOtp = false
  private _snackBar = inject(MatSnackBar);
  loginHandler(form: NgForm) {
    this.authService.loginService(form.value).subscribe({
      next: (res) => {
        console.log("Login Res", res);
        this._snackBar.open(res.message, 'OK', {
          duration: 3000,
        });
        this.localStorageService.set("accessToken", res.data.accessToken, res.data.expiresIn);
        this.localStorageService.set("loggedIn_user", res.data.employee, res.data.expiresIn);
        this.route.navigate(['/dashboard']);
      },
      error: (err) => {
        console.log(err);
        this._snackBar.open(err.message, 'OK', {
          duration: 3000,
        });
      }
    })
  }
  passwordMode = true;

  otpSent = false;
  otpVerified = false;
  sendingOtp = false;
  verifyingOtp = false;

  maskedEmail: string | null = null;
  email: string | null = null;
  resendCooldown = 0;
  private resendTimer?: any;

  switchMode(mode: 'password' | 'otp') {
    this.passwordMode = mode === 'password';
    if (!this.passwordMode) {
      // reset password form state if needed
    }
  }

  sendOtpHandler(form: any) {
    if (form.invalid) return;
    this.sendingOtp = true;
    const email: string = form.value.email;
    this.email = email
    this.maskedEmail = this.maskEmail(email);
    this.authService.SendOtp({ email }).subscribe({
      next: (res) => {
        console.log("Login Res", res);
        this._snackBar.open(res.message, 'OK', {
          duration: 3000,
        });
        this.sendingOtp = false
        this.otpSent = true
        console.log(this.sendingOtp, this.otpSent);
      },
      error: (err) => {
        console.log(err);
        this._snackBar.open(err.message, 'OK', {
          duration: 3000,
        });
      }
    })
   
  }

  verifyOtpHandler(form: any) {
    if (form.invalid) return;
    this.verifyingOtp = true;
    this.authService.VerifyOtp({ email: this.email, otp: form.value.otp }).subscribe({
      next: (res) => {
        console.log("VerifyOtp Res", res);
        this._snackBar.open(res.message, 'OK', {
          duration: 3000,
        });
        this.sendingOtp = false
        this.otpSent = true
        console.log(this.sendingOtp, this.otpSent);
        this.localStorageService.set("accessToken", res.data.accessToken, res.data.expiresIn);
        this.localStorageService.set("loggedIn_user", res.data.employee, res.data.expiresIn);
        this.route.navigate(['/dashboard']);
      },
      error: (err) => {
        console.log(err);
        this._snackBar.open(err.message, 'OK', {
          duration: 3000,
        });
      }
    })
    // TODO: call your API to verify OTP
    // this.auth.verifyOtp({ email, otp: form.value.otp })...
    // setTimeout(() => {
    //   this.otpVerified = true;
    //   this.verifyingOtp = false;
    //   // Navigate or continue session
    // }, 800);
  }

resendOtp() {
  if (this.resendCooldown > 0) return;

  queueMicrotask(() => {
    this.startResendCooldown(30);
  });
}

  resetOtpFlow() {
    this.otpSent = false;
    this.otpVerified = false;
    this.maskedEmail = null;
    this.clearResendTimer();
    this.resendCooldown = 0;
  }

  // private startResendCooldown(seconds: number) {
  //   this.resendCooldown = seconds;
  //   this.clearResendTimer();
  //   this.resendTimer = setInterval(() => {
  //     this.resendCooldown--;
  //     if (this.resendCooldown <= 0) this.clearResendTimer();
  //   }, 1000);
  // }

private startResendCooldown(seconds: number) {
  this.resendCooldown = seconds;
  this.clearResendTimer();

  this.resendTimer = setInterval(() => {
    if (this.resendCooldown > 0) {
      this.resendCooldown--;
    }

    if (this.resendCooldown === 0) {
      this.clearResendTimer();
    }
  }, 1000);
}
  // private clearResendTimer() {
  //   if (this.resendTimer) {
  //     clearInterval(this.resendTimer);
  //     this.resendTimer = undefined;
  //   }
  // }
private clearResendTimer() {
  if (this.resendTimer) {
    clearInterval(this.resendTimer);
    this.resendTimer = undefined;
  }
}
  maskEmail(email: string): string {
    const [name, domain] = email.split('@');
    const maskedName = name.length <= 2 ? name[0] + '*' : name[0] + '*'.repeat(name.length - 2) + name.slice(-1);
    return `${maskedName}@${domain}`;
  }

}

const routes: Routes = [
  { path: '', component: Login }
]