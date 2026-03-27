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
import { Leave } from '../../../service/leave';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Employee } from '../../../service/employee';
import { LocalStorageService } from '../../../service/localstorage';
import { FormsModule } from '@angular/forms';

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
    FormsModule

  ],
  templateUrl: './apply.html',

  styleUrls: ['./apply.css'],
})
export class Apply implements OnInit {
  private dialog = inject(MatDialog);
  private _liveAnnouncer = inject(LiveAnnouncer);
  private _snackBar = inject(MatSnackBar)

  private showSnackBar(message: string, action = 'OK'): void {
    this._snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',

    })
  }
  leaveBalancesdata!: LeaveDialogData
  displayedColumns = [
    'createdAt',
    'leaveReason',
    'fromDate',
    'toDate',
    'leaveType',
    'totalDays',
    'status',
    'approver',
    'approverRemark',
    'approvedAt',
    'withDworReq'
  ];

  approvalDisplayedColumns: string[] = [
    'EmployeeName',
    'leaveReason',
    'appliedOn',
    'from',
    'to',
    'type',
    'totalDays',
    'dayType',
    'status',
    'action',

  ];

  dataSource = new MatTableDataSource<LeaveRow>([]);
  approvalDataSource = new MatTableDataSource<any>([]);
  leaveHistory!: LeaveRow
  MyleaveHistory: LeaveRow[] = []
  MyApprovalReq: LeaveRow[] = []
  loggerInUserDetails!: any
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private LeaveService: Leave, private EmoloyeeService: Employee, private localStorageService: LocalStorageService) { }


  ngOnInit(): void {
    const LoggedInUser: any = this.localStorageService.get('loggedIn_user');

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
    this.LeaveService.getMyApprovalReq().subscribe({
      next: (res) => {
        console.log(res.data);

        this.MyApprovalReq = res.data
        this.approvalDataSource.data = res.data;
        this.showSnackBar(res?.message)
        console.log("getMyApprovalReq", this.MyApprovalReq);

      },
      error: (err) => {
        console.log(err);
        this.showSnackBar(err.error.message)
      }
    })
    this.LeaveService.getMyLeaves().subscribe({
      next: (res) => {
        this.MyleaveHistory = res.data
        this.dataSource.data = res.data;
        this.showSnackBar(res?.message)
        console.log("MY Leave History", this.MyleaveHistory);

      },
      error: (err) => {
        console.log(err);
        this.showSnackBar(err.error.message)
      }
    })
    this.EmoloyeeService.GetEmployeeById(LoggedInUser.id).subscribe({
      next: (res) => {
        console.log(res);
        this.loggerInUserDetails = res
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


  open(): void {
    this.dialog.open(LeaveDialog, {
      width: '720px',
      disableClose: true,
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

  }

  announceSortChange(sortState: Sort): void {
    this._liveAnnouncer.announce(
      sortState.direction ? `Sorted ${sortState.direction}ending` : 'Sorting cleared'
    );
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


  withDrawReq(id: string) {
    console.log("withDraw Req", id);
    this.LeaveService.withDrowReq(id, { id }).subscribe({
      next: (res) => {

        console.log("withDraw Req", res);

      },
      error: (err) => {
        console.log(err);

      }
    })
  }
  approverModalType: string = ''
  IsApproverModalOpen: boolean = false
  approverRemark: string = ''
  selectedReqId: string = ''
  openApproverModal(action: 'approved' | 'rejected', reqID: string) {
    this.approverModalType = action
    this.IsApproverModalOpen = true
    this.selectedReqId = reqID
  }
  closeApproverModal() {
    this.approverModalType = ''
    this.IsApproverModalOpen = false
  }
  submitApproverAction() {
    console.log("approverRemark", this.approverRemark);
    this.LeaveService.acceptRejectReq(this.selectedReqId, { status: this.approverModalType, remarks: this.approverRemark }).subscribe({
      next: (res) => {
        console.log("submitApproverAction response : ", res);
        this.closeApproverModal()
        this.showSnackBar(res.message)
      },
      error: (err) => {
        console.log(err);
        this.closeApproverModal()
        this.showSnackBar(err.error.message)
      }
    })

  }
}