import { AsyncPipe, NgClass, NgIf, TitleCasePipe, NgForOf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasicTable, TableHeader } from '../../../common/basic-table/basic-table';
import { EmployeeDetails } from '../../../components/employee-details/employee-details';
import { Employee } from '../../../service/employee';
import { Leave } from '../../../service/leave';
import { Observable, switchMap, tap } from 'rxjs';
import { MatIcon } from "@angular/material/icon";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatOption } from "@angular/material/select";
import { EmployeeForm } from "../../../components/employee-form/employee-form";

@Component({
  selector: 'app-profile',
  imports: [NgClass, BasicTable, NgIf, EmployeeDetails, AsyncPipe, TitleCasePipe, NgForOf, MatIcon, ReactiveFormsModule, MatFormField, MatLabel, MatOption, EmployeeForm],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private Employee_Service: Employee,
    private LeaveService: Leave,
  ) { }
  LoggedInUserdetails: any;
  isLoading = false;
  activeTab: 'personal' | 'professional' | 'documents' | 'account' | 'company' = 'personal';
  activeModule: 'profile' | 'attendance' | 'projects' | 'leave' = 'profile';
  headers: TableHeader[] = [
    { key: 'name', label: 'Name', width: '30%' },
    { key: 'date', label: 'Date', width: '30%' },
    { key: 'status', label: 'Status', align: 'center' },
  ];

  rows = [
    { id: 1, name: 'Asha', date: '2026-02-19', status: 'Present' },
    { id: 2, name: 'Rahul', date: '2026-02-19', status: 'Absent' },
  ];
  employee_ID!: string;
  EmployeeDetail: any;
  IsEmployeeDetailsEditable: boolean = false;
  MyleaveHistory: any
  employeeDetail$!: Observable<any>;

  ngOnInit() {
    console.log('NgOnInIt work-------------');
    this.isLoading = true;
    this.IsEmployeeDetailsEditable = this.activatedRoute.snapshot.url[1].path == 'edit' ? true : false;
    this.employeeDetail$ = this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id')!;
        this.employee_ID = id
        return this.Employee_Service.GetEmployeeById(id);
      }),
      tap((employee: any) => {
        // this.mapEmployeeToForm(employee);
        this.isLoading = false;
      })
    );

    ;
    this.LeaveService.getMyLeaves().subscribe({
      next: (res) => {
        this.MyleaveHistory = res.data
        console.log("MY Leave History", this.MyleaveHistory);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }


  setActiveTabFun(val: 'personal' | 'professional' | 'documents' | 'account' | 'company') {
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

  @ViewChild(EmployeeForm)
  employeeFormComponent!: EmployeeForm;

  updateEmployee(changedPayload: any): void {
    this.Employee_Service
      .UpdateEmployeeDetails(this.employee_ID, changedPayload)
      .subscribe(() => {
        console.log('Employee updated');
        this.IsEmployeeDetailsEditable = false
      });
  }

  onSaveClick() {
    this.employeeFormComponent.UpdateEmployeeDetails();
  }
}
