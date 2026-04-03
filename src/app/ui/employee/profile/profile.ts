import { AsyncPipe, NgClass, NgIf, TitleCasePipe, NgForOf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasicTable, TableHeader } from '../../../common/basic-table/basic-table';
import { EmployeeDetails } from '../../../components/employee-details/employee-details';
import { Employee } from '../../../service/employee';
import { Leave } from '../../../service/leave';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { MatIcon } from "@angular/material/icon";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatOption } from "@angular/material/select";
import { EmployeeForm } from "../../../components/employee-form/employee-form";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTabsModule } from '@angular/material/tabs';
import { LocalStorageService } from '../../../service/localstorage';

@Component({
  selector: 'app-profile',
  imports: [NgClass, BasicTable, NgIf, EmployeeDetails, AsyncPipe, TitleCasePipe, NgForOf, MatIcon, ReactiveFormsModule, MatFormField, MatLabel, MatOption, EmployeeForm, MatTabsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private Employee_Service: Employee,
    private LeaveService: Leave,
    private localStorageService: LocalStorageService
  ) { }
  LoggedInUserdetails: any;
  isLoading = false;
  activeTab: 'personal' | 'professional' | 'documents' | 'account' | 'company' = 'personal';
  activeModule: 'profile' | 'attendance' | 'projects' | 'leave' = 'profile';
  employee_ID!: string;
  EmployeeDetail: any;
  private editModeSubject = new BehaviorSubject<boolean>(false);
  IsEmployeeDetailsEditable$ = this.editModeSubject.asObservable();
  private employeeSubject = new BehaviorSubject<any>(null);
  employeeDetail$ = this.employeeSubject.asObservable();
  protected tabs = ['Profile', 'Leave'];
  protected selectedTabIndex = 0;
  MyleaveHistory: any
  IsLoggedInUserMatch: boolean = false;
  // employeeDetail$!: Observable<any>;

  ngOnInit() {
    this.isLoading = true;

    this.LoggedInUserdetails = this.localStorageService.get("loggedIn_user");


    const isEditRoute = this.activatedRoute.snapshot.url.some(seg => seg.path === 'edit');

    this.editModeSubject.next(isEditRoute);
    // this.IsEmployeeDetailsEditable = this.activatedRoute.snapshot.url[1].path == 'edit' ? true : false;
    this.employeeDetail$ = this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id')!;
        console.log("params Id", id);
        this.employee_ID = id
        this.IsLoggedInUserMatch = this.LoggedInUserdetails.id === id
        console.log('NgOnInIt work-------------', this.IsLoggedInUserMatch, this.LoggedInUserdetails.id, this.employee_ID);
        return this.Employee_Service.GetEmployeeById(id);
      }),
      tap((employee: any) => {
        this.isLoading = false;
      })
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
    this.editModeSubject.next(true)
    // this.IsEmployeeDetailsEditable = true;

  }
  CancelEditProfile() {
    this.editModeSubject.next(false)
    // this.IsEmployeeDetailsEditable = false;
    this.activeTab = 'personal';
  }

  @ViewChild(EmployeeForm)
  employeeFormComponent!: EmployeeForm;

  updateEmployee(changedPayload: any): void {
    this.Employee_Service
      .UpdateEmployeeDetails(this.employee_ID, changedPayload)
      .subscribe({
        next: updatedEmployee => {
          console.log("updatedEmployee", updatedEmployee);
          const employee = updatedEmployee.data ?? updatedEmployee;
          // ✅ Update observable so UI refreshes
          this.employeeSubject.next({ ...employee });
          //  this.employeeFormComponent.resetAfterSave(employee);
          // ✅ Reset child form completely
          // this.employeeFormComponent.resetAfterSave(updatedEmployee);

          // ✅ Change UI state
          this.editModeSubject.next(false)
          // this.IsEmployeeDetailsEditable = false;
          this.activeTab = 'personal';
          this.isLoading = false;
        },
        error: err => {
          console.error(err);
          this.isLoading = false;
        }
      });


    // .subscribe(() => {
    //   console.log('Employee updated');
    //   this.IsEmployeeDetailsEditable = false
    // });
  }

  onSaveClick() {
    this.employeeFormComponent.UpdateEmployeeDetails();
  }




  drop(event: any) {
    const prevActive = this.tabs[this.selectedTabIndex];
    moveItemInArray(this.tabs, event.previousIndex, event.currentIndex);
    this.selectedTabIndex = this.tabs.indexOf(prevActive);
  }


}
