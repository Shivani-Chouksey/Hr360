import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
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
passwordMode = true;

otpSent = false;
otpVerified = false;
sendingOtp = false;
verifyingOtp = false;

maskedEmail: string | null = null;
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
  this.maskedEmail = this.maskEmail(email);

  // TODO: call your API to send OTP
  // this.auth.sendOtp(email).subscribe( ... )
  setTimeout(() => {
    this.otpSent = true;
    this.sendingOtp = false;
    this.startResendCooldown(30); // seconds
  }, 800);
}

verifyOtpHandler(form: any) {
  if (form.invalid) return;
  this.verifyingOtp = true;

  // TODO: call your API to verify OTP
  // this.auth.verifyOtp({ email, otp: form.value.otp })...
  setTimeout(() => {
    this.otpVerified = true;
    this.verifyingOtp = false;
    // Navigate or continue session
  }, 800);
}

resendOtp() {
  if (this.resendCooldown > 0) return;
  this.startResendCooldown(30);

  // TODO: call API to resend
  // this.auth.resendOtp(...)
}

resetOtpFlow() {
  this.otpSent = false;
  this.otpVerified = false;
  this.maskedEmail = null;
  this.clearResendTimer();
  this.resendCooldown = 0;
}

private startResendCooldown(seconds: number) {
  this.resendCooldown = seconds;
  this.clearResendTimer();
  this.resendTimer = setInterval(() => {
    this.resendCooldown--;
    if (this.resendCooldown <= 0) this.clearResendTimer();
  }, 1000);
}

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
