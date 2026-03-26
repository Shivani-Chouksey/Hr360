import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { LeaveDialog, LeaveDialogData, LeaveDialogResult } from '../leave-dialog/leave-dialog';
import { ModalComponent } from "../../../common/modal/modal";
import { MatRadioGroup, MatRadioButton } from "@angular/material/radio";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatInput, MatInputModule } from "@angular/material/input";
import { Cards } from "../../../components/leave/cards/cards";
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Leave } from '../../../service/leave';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Employee } from '../../../service/employee';
import { LocalStorageService } from '../../../service/localstorage';

export interface LeaveRow {
  appliedOn: Date;
  from: Date;
  to: Date;
  type: 'Annual' | 'Sick' | 'Casual' | 'Comp Off';
  totalDays: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  approver: string;
  comment: string
}

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    ModalComponent,
    MatRadioGroup,
    MatRadioButton,
    MatFormField,
    MatLabel,
    MatInput,
    Cards,

  ],
  templateUrl: './apply.html',

  styleUrls: ['./apply.css'],
})
export class Apply implements OnInit {
  constructor(private LeaveService: Leave, private EmoloyeeService: Employee, private localStorageService: LocalStorageService) { }
  private dialog = inject(MatDialog);
  private _liveAnnouncer = inject(LiveAnnouncer);
   private  LEAVE_DATA: LeaveRow[] = [
    {
      appliedOn: new Date(2026, 1, 10), // 10 Feb 2026
      from: new Date(2026, 1, 15),
      to: new Date(2026, 1, 16),
      type: 'Annual',
      totalDays: 2,
      status: 'Pending',
      approver: 'Team Lead',
      comment: ''
    },
   
  ];
  // Balance tiles – Corporate leave scenario
  leaveBalancesdata: LeaveDialogData = {
    // title: 'My Leave Balance',
    leaveBalances: {
      annual: { total: 0, used: 0, remaining: 0, usageRatio: 0 },
      sick: { total: 0, used: 0, remaining: 0, usageRatio: 0 },
      casual: { total: 0, used: 0, remaining: 0, usageRatio: 0 },
      compOff: { total: 0, used: 0, remaining: 0, usageRatio: 0 }
    }

  };

  leaveHistory: any
  private _snackBar = inject(MatSnackBar)
  loggerInUserDetails: any

  ngOnInit(): void {
    this.LeaveService.getLeaveHistroy().subscribe({
      next: (res) => {
        console.log("Leave History", res);
        this.leaveHistory = res.data;
        this._snackBar.open(res?.message, 'ok', {
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
    this.LeaveService.getMyLeavesBalance().subscribe({
      next: (res) => {
        console.log("My Leave balance", res);
        this.leaveBalancesdata = res.data;
        this._snackBar.open(res?.message, 'ok', {
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
    this.LeaveService.getMyLeaves().subscribe({
      next: (res) => {
        console.log("MY Leave History", res);
        this.LEAVE_DATA = res.data;
        this._snackBar.open(res?.message, 'ok', {
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
    const LoggedInUser: any = this.localStorageService.get('loggedIn_user');
    this.EmoloyeeService.GetEmployeeById(LoggedInUser.id).subscribe({
      next: (res) => {
        console.log(res);
        this.loggerInUserDetails.res.data
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
  }
  // --- Dialog open ---
  // open() {
  //   const data: LeaveDialogData = {
  //     title: 'Apply Leave',
  //     leaveBalances: this.leaveBalancesdata.leaveBalances,
  //     minDate: new Date(),
  //     maxDate: new Date(new Date().getFullYear(), 11, 31),
  //   };

  //   // NOTE: remove HTML entities; use real generics <>
  //   this.dialog
  //     .open<LeaveDialog, LeaveDialogData, LeaveDialogResult>(LeaveDialog, {
  //       width: '620px',
  //       maxWidth: '95vw',
  //       disableClose: true,
  //       autoFocus: true,
  //       data,
  //     })
  //     .afterClosed()
  //     .subscribe((result) => {
  //       if (!result) {
  //         console.log('Dialog cancelled');
  //         return;
  //       }
  //       console.log('Leave form submitted:', result);
  //       // TODO: call API then refresh the table below.
  //     });
  // }

  open() {
    this.dialog.open(LeaveDialog, {
      width: '720px',
      disableClose: true,
    });
  }

  // --- Table (Leave history) ---
  displayedColumns: string[] = [
    'appliedOn',
    'from',
    'to',
    'type',
    'totalDays',
    'status',
    'approver',
    'comment'
  ];

 

  dataSource = new MatTableDataSource<LeaveRow>(this.LEAVE_DATA);

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // Optional: a nice date formatter for the template
  asShort(d: Date | string): string {
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  userType = false
  confirmOpen = false;

  openConfirm() { this.confirmOpen = true; }
  onClosed() { this.confirmOpen = false; }

}