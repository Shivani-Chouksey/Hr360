import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { LeaveDialog, LeaveDialogData, LeaveDialogResult } from '../leave-dialog/leave-dialog';
import { ModalComponent } from "../../../common/modal/modal";
import { MatRadioGroup, MatRadioButton } from "@angular/material/radio";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";

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
    MatInput
],
  templateUrl: './apply.html',
  styleUrls: ['./apply.css'],
})
export class Apply {
  private dialog = inject(MatDialog);
  private _liveAnnouncer = inject(LiveAnnouncer);

  // Balance tiles
  leaveBalances = {
    annual: 10,
    sick: 7,
    casual: 5,
    compOff: 2,
  };

  // --- Dialog open ---
  open() {
    const data: LeaveDialogData = {
      title: 'Apply Leave',
      leaveBalances: this.leaveBalances,
      minDate: new Date(),
      maxDate: new Date(new Date().getFullYear(), 11, 31),
    };

    // NOTE: remove HTML entities; use real generics <>
    this.dialog
      .open<LeaveDialog, LeaveDialogData, LeaveDialogResult>(LeaveDialog, {
        width: '620px',
        maxWidth: '95vw',
        disableClose: true,
        autoFocus: true,
        data,
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) {
          console.log('Dialog cancelled');
          return;
        }
        console.log('Leave form submitted:', result);
        // TODO: call API then refresh the table below.
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

  private readonly LEAVE_DATA: LeaveRow[] = [
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
    {
      appliedOn: new Date(2026, 0, 25),
      from: new Date(2026, 0, 28),
      to: new Date(2026, 0, 28),
      type: 'Sick',
      totalDays: 1,
      status: 'Approved',
      approver: 'HR',
      comment: ''
    },
    {
      appliedOn: new Date(2025, 11, 20),
      from: new Date(2025, 11, 24),
      to: new Date(2025, 11, 27),
      type: 'Casual',
      totalDays: 4,
      status: 'Rejected',
      approver: 'Manager',
      comment: ''
    },
    {
      appliedOn: new Date(2025, 10, 5),
      from: new Date(2025, 10, 10),
      to: new Date(2025, 10, 10),
      type: 'Comp Off',
      totalDays: 1,
      status: 'Approved',
      approver: 'Team Lead',
      comment: ''
    },
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
  userType=false
   confirmOpen = false;

  openConfirm() { this.confirmOpen = true; }
  onClosed() { this.confirmOpen = false; }

}