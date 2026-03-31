import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from '../../../service/employee';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-list',
  imports: [NgForOf],
  templateUrl: './list.html',
  styleUrl: './list.css',
  // changeDetection:ChangeDetectionStrategy.OnPush
})
export class List implements OnInit {
  employeeListData: any[] = [];
  isLoading = true;

  constructor(
    private router: Router,
    private employee_service: Employee,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.employee_service.GetEmployeeList().subscribe({
      next: (EMP_list: any) => {
        this.employeeListData = EMP_list;
        this.cdr.markForCheck()
        this.isLoading = false;
      },
      error: (err: any) => {
        console.log('Error While ', err);
        this.isLoading = false;
      },
    });
  }

  gotoProfile(id: string) {
    this.router.navigate(['employee/profile', id]);
  }

  editProfile(name: string) {
    this.router.navigate(['employee/profile/edit', name]);
  }

  GotoAddNew() {
    this.router.navigate(['/employee/add']);
  }
}
