import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { Leave } from '../../../service/leave';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface LeaveDialogData {
  // title: string;
  leaveBalances: {
    annual: {
      total: number;
      used: number;
      remaining: number;
      usageRatio: number;
    };
    sick: {
      total: number;
      used: number;
      remaining: number;
      usageRatio: number;
    };
    casual: {
      total: number;
      used: number;
      remaining: number;
      usageRatio: number;
    };
    compOff: {
      total: number;
      used: number;
      remaining: number;
      usageRatio: number;
    };

    // [key: string]: number;
  };
  minDate?: Date;
  maxDate?: Date;
}

export interface LeaveDialogResult {
  leaveType: string;
  startDate: Date; // ISO
  endDate: Date;   // ISO
  dayType: string;
  reason: string;
  attachment?: File | null; // optional, demo placeholder
  totalDays: number;        // computed
}
@Component({
  selector: 'app-leave-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatButtonModule,
    MatRadioButton,
    MatRadioGroup
  ],
  templateUrl: './leave-dialog.html',
  styleUrls: ['./leave-dialog.css'],
  providers: [provideNativeDateAdapter()],
})
export class LeaveDialog {
  constructor(private LeaveService: Leave) { }
  leaveTypesJson = [
    { value: 'annual', label: 'Annual Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'casual', label: 'Casual Leave' },
    { value: 'compOff', label: 'Comp Off' },
  ];

dayeTypesJson=[
   { value: 'full-day', label: 'full-day' },
   { value: 'first-half', label: 'first-half' },
   { value: 'second-half', label: 'second-half' },
]

  dialogRef = inject(MatDialogRef<LeaveDialog>);
  data = inject<LeaveDialogData>(MAT_DIALOG_DATA);
  totalDays = 12

  leaveForm = new FormGroup({
    leaveType: new FormControl('', { nonNullable: true }),
    startDate: new FormControl('', { nonNullable: true }),
    endDate: new FormControl('', { nonNullable: true }),
    dayType: new FormControl('', { nonNullable: true }),
    reason: new FormControl('', { nonNullable: true }),
    attachment: new FormControl('', { nonNullable: true }),
    applyTo: new FormControl('', { nonNullable: true }),
  })



  minDate = this.data?.minDate ?? undefined;
  maxDate = this.data?.maxDate ?? undefined;

  private _snackBar = inject(MatSnackBar);
  submit() {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }
    const v = this.leaveForm.value;
    const result: any = {
      leaveType: v.leaveType,
      fromDate: v.startDate,
      toDate: v.endDate,
      dayType: v.dayType,
      reason: v.reason,
    };
    console.log(result);
    this.LeaveService.applyLeave(result).subscribe({
      next: (res) => {
        console.log(res);
        this._snackBar.open(res?.message, 'ok',{
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',

        })
      },
      error: (err) => {
        console.log(err);

        this._snackBar.open(err.error.message, 'close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',

        });
      }
    })
    this.dialogRef.close(result);
  }

  cancel() {
    this.dialogRef.close();
  }
}