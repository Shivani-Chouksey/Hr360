import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { LeaveDialog, LeaveDialogData } from './leave-dialog/leave-dialog';
import { ModalComponent } from "../../shared/components/modal/modal";
import { MatRadioGroup, MatRadioButton } from "@angular/material/radio";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { Cards } from "../../shared/components/leave/cards/cards";
import { Leave } from '../leave/services/leave';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Employee } from './../employee/services/employee';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { MatPaginator } from "@angular/material/paginator";
import { MatSelect, MatOption } from "@angular/material/select";
import { LocalStorageService } from '../../core/services/localstorage';

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
  selector: 'app-leave',
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
    FormsModule,
    MatBadgeModule,
    MatPaginator
  ],
  templateUrl: './leave.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./leave.css'],
})
export class LeaveComponent implements OnInit {
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
    'status',
    'leaveReason',
    'appliedOn',
    'from',
    'to',
    'type',
    'totalDays',
    'dayType',
    'action',

  ];

  statusTypes: string[] = [
    'pending',
    'approved',
    'rejected',
    'cancelled',
    'withdrawn'
  ];

  dataSource = new MatTableDataSource<LeaveRow>([]);
  approvalDataSource = new MatTableDataSource<any>([]);
  leaveHistory!: LeaveRow
  MyleaveHistory: LeaveRow[] = []
  MyApprovalReq: LeaveRow[] = []
  loggerInUserDetails!: any
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private LeaveService: Leave, private EmoloyeeService: Employee, private localStorageService: LocalStorageService, private cd: ChangeDetectorRef) { }


  ngOnInit(): void {
    this.approvalDataSource.filterPredicate = (
      data: any,
      filter: string
    ): boolean => {
      const searchTerm = JSON.parse(filter).search;
      if (!searchTerm) return true;

      return (
        data.employeeName?.toLowerCase().includes(searchTerm) ||
        data.status?.toLowerCase().includes(searchTerm)
      );
    };

    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const filters = JSON.parse(filter);
      if (!filters) return true;
      // console.log("filter for leave Req",filters,data);
      console.log(data.status.toLowerCase().includes(filters.status));
      return data.status.toLowerCase().includes(filters.status);
    };
    this.loadInitailData();
  }
  approvalReqMetaInfo: { total: number, page: number, limit: number, totalPages: number } = { total: 0, page: 0, limit: 0, totalPages: 0 }
  leaveReqMetaInfo: { total: number, page: number, limit: number, totalPages: number } = { total: 0, page: 0, limit: 0, totalPages: 0 }


  loadInitailData() {
    const LoggedInUser: any = this.localStorageService.get('loggedIn_user');
    forkJoin({
      balance: this.LeaveService.getMyLeavesBalance(),
      leaves: this.LeaveService.getMyLeaves(),
      approvals: this.LeaveService.getMyApprovalReq(),
      history: this.LeaveService.getLeaveHistroy(),
      user: this.EmoloyeeService.GetEmployeeById(LoggedInUser.id)
    }).subscribe(res => {
      this.leaveBalancesdata = res.balance.data;
      this.dataSource.data = res.leaves.data;
      this.leaveReqMetaInfo = res.leaves.pagination;
      this.approvalDataSource.data = res.approvals.data;
      this.approvalReqMetaInfo = res.approvals?.pagination
      this.leaveHistory = res.history.data;
      this.loggerInUserDetails = res.user;

      this.cd.markForCheck();
    });
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
  approverModalType: 'approved' | 'rejected' | '' = ''
  private editModeSubject = new BehaviorSubject<boolean>(false);
  IsApproverModalOpen$ = this.editModeSubject.asObservable();
  // IsApproverModalOpen: boolean = false
  approverRemark: string = ''
  selectedReqId: string = ''
  openApproverModal(action: 'approved' | 'rejected', reqID: string) {
    this.approverModalType = action
    this.editModeSubject.next(true)
    // this.IsApproverModalOpen = true
    this.selectedReqId = reqID
  }
  closeApproverModal() {
    this.approverModalType = ''
    // this.IsApproverModalOpen = false
    this.editModeSubject.next(false)
  }
  submitApproverAction() {
    console.log("approverRemark", this.approverRemark);
    this.LeaveService.acceptRejectReq(this.selectedReqId, { status: this.approverModalType, remarks: this.approverRemark }).subscribe({
      next: (res) => {
        console.log("submitApproverAction response : ", res);
        this.updateApprovalRow(this.approverModalType, this.approverRemark);
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
  private updateApprovalRow(
    status: 'approved' | 'rejected' | '',
    remarks: string
  ) {
    const updatedData = this.approvalDataSource.data.map(row => {
      if (row._id === this.selectedReqId) {
        return {
          ...row,
          status,
          approverInfo: {
            ...row.approverInfo,
            remarks,
            actionAt: new Date()
          }
        };
      }
      return row;
    });

    this.approvalDataSource.data = updatedData;
  }


  filterValues = {
    search: '',
    status: ''
  };

  applySearch(value: string) {
    console.log("value inside applySearch", value);

    this.filterValues.search = value.trim().toLowerCase();
    this.approvalDataSource.filter = JSON.stringify(this.filterValues);


    // ✅ Pagination reset (important)
    if (this.approvalDataSource.paginator) {
      this.approvalDataSource.paginator.firstPage();
    }

  }

  applyStatusFilter(value: string) {
    console.log("applyStatusFilter", value);

    this.filterValues.status = value ?? ' ';
    this.dataSource.filter = JSON.stringify({ status: value });

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

  selectedStatus = '';

  onStatusChange(value: string) {
    console.log('Selected:', value);
  }
}