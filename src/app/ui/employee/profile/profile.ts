import { AsyncPipe, NgClass, NgIf, TitleCasePipe, NgForOf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BasicTable, TableHeader } from '../../../common/basic-table/basic-table';
import { EmployeeDetails } from '../../../components/employee-details/employee-details';
import { Employee } from '../../../service/employee';
import { Leave } from '../../../service/leave';
import { map, Observable, switchMap } from 'rxjs';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-profile',
  imports: [NgClass, BasicTable, NgIf, EmployeeDetails, AsyncPipe, TitleCasePipe, NgForOf, MatIcon],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private Employee_Service: Employee,
    private LeaveService:Leave,
    private cdr: ChangeDetectorRef 
  ) {}
  LoggedInUserdetails: any;
  isLoading = false;

  headers: TableHeader[] = [
    { key: 'name', label: 'Name', width: '30%' },
    { key: 'date', label: 'Date', width: '30%' },
    { key: 'status', label: 'Status', align: 'center' },
  ];

  rows = [
    { id: 1, name: 'Asha', date: '2026-02-19', status: 'Present' },
    { id: 2, name: 'Rahul', date: '2026-02-19', status: 'Absent' },
  ];
  employee_ID: string | null = null;
  EmployeeDetail: any;
  IsEmployeeDetailsEditable: boolean = false;
  MyleaveHistory:any
employeeDetail$!: Observable<any>;

  ngOnInit() {
    console.log('NgOnInIt work-------------');
    this.isLoading = true;
    this.IsEmployeeDetailsEditable =
      this.activatedRoute.snapshot.url[1].path == 'edit' ? true : false;
    // this.employee_ID = this.activatedRoute.snapshot.paramMap.get('id');
    // console.log('Employee Id ', this.employee_ID);
    // if (this.employee_ID) {
    //   this.Employee_Service.GetEmployeeById(this.employee_ID).subscribe({
    //     next: (res) => {
    //       console.log('Service Response:', res);
    //       this.EmployeeDetail = {...res};
    //       this.cdr.detectChanges();
    //       this.isLoading = false;
    //     },
    //     error: (err) => {
    //       console.error('Error fetching employee:', err);
    //       this.isLoading = false;
    //     },
    //   });
    // } else {
    //   console.warn('Employee ID not found in route');
    // }


 this.employeeDetail$ = this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id')!;
        return this.Employee_Service.GetEmployeeById(id);
      }),
      map(res => ({ ...res })) // ✅ ensure new reference for OnPush
    );

      this.LeaveService.getMyLeaves().subscribe({
      next: (res) => {
        this.MyleaveHistory = res.data
        console.log("MY Leave History", this.MyleaveHistory);
      },
      error: (err) => {
        console.log(err);
      }
    })
    // this.EmployeeDetail = this.employeeList.find((emp) => emp.professionalDetail.employeeID === this.employee_ID);
  }

  activeTab: 'personal' | 'professional' | 'documents' | 'account' = 'personal';
  activeModule: 'profile' | 'attendance' | 'projects' | 'leave' = 'profile';
  setActiveTabFun(val: 'personal' | 'professional' | 'documents' | 'account') {
    this.activeTab = val;
  }
  
  setActiveModule(val: 'profile' | 'attendance' | 'projects' | 'leave') {
    this.activeModule = val;
  }

  isActive(tab: string) {
    return this.activeTab === tab;
  }
  isActiveModule(module: string) {
    return this.activeModule === module;
  }
  editProfile() {
    this.IsEmployeeDetailsEditable = true;
  }
  CancelEditProfile() {
    this.IsEmployeeDetailsEditable = false;
    this.activeTab = 'personal';
  }


  
}
