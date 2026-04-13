import { NgFor, NgIf } from '@angular/common';
import { Component, computed, Input, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-form-input',
  imports: [ReactiveFormsModule, NgIf, NgFor, MatLabel, MatIconModule, MatError],
  templateUrl: './form-input.html',
  styleUrl: './form-input.css',
})
export class FormInput implements OnInit {
  @Input({ required: true }) control!: FormControl;
  @Input() placeHolder: string = '';
  @Input() maxLength: number = 10;
  @Input({ required: true }) label = '';
  @Input({ required: true }) type: 'text' | 'email' | 'number' | 'password' | 'date' | 'select' | 'checkbox' | 'textarea' = 'text';
  @Input() options: { label: string, value: any }[] = []
  @Input() errorMessages: Record<string, string> = {
    required: 'This field is required',
    email: 'Invalid email address',
    pattern: 'Invalid format',
    minlength: 'Too short',
    maxlength: 'Too long'
  };
  readonly inputClass = 'w-full px-3 py-2 rounded-md bg-gray-50 border border-gray-300 ' + 'focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-60';
  isTyping = signal(false);
  showPassword = signal(true);

  showError = computed(() => {
    console.log('showError', this.control.invalid, this.isTyping);
    console.log("this.control ---------->", this.control.errors);
    return (this.control.invalid);
  });

  errorMessage = computed(() => {
    console.log("Inside  Form-input--------->", this.control.errors);
    if (!this.control?.errors) return null;
    const firstKey = Object.keys(this.control.errors)[0];
    return this.errorMessages[firstKey] ?? 'Invalid value';
  });

  inputType = computed(() => {
    return this.showPassword() ? 'text' : 'password';
  });

  ngOnInit(): void {
    console.log("options", this.options);

  }

  onInput(): void {
    this.isTyping.set(true)
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }
  /* Dynamically resolve input type */
  readonly resolvedInputType = computed(() => {
    if (this.type !== 'password') return this.type;
    return this.showPassword() ? 'text' : 'password';
  });




}
