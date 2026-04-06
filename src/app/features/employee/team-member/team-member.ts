import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,} from '@angular/core';
import { CommonModule, DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Employee } from '../services/employee';
import {Router } from '@angular/router';
import { LocalStorageService } from '../../../core/services/localstorage';

@Component({
  selector: 'app-team-member',
  standalone: true,
  templateUrl: './team-member.html',
  styleUrls: ['./team-member.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NgClass,
    TitleCasePipe,
    DatePipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
})
export class TeamMember implements OnInit {
  constructor(
    private employeeService: Employee,
    private localStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  loggedInUserDetails!: any;
  isLoading = false;
  metaInfo: { total: number, page: number, limit: number, totalPages: number } = { total: 0, page: 0, limit: 0, totalPages: 0 }
  dataSource = new MatTableDataSource<any>([]);

  displayedColumns: string[] = [
    '#',
    'employeeId',
    'name',
    'email',
    'department',
    'designation',
    'location',
    'role',
    'status',
    'dateOfJoining',
    'actions',
  ];
  filterValues = {
    search: '',
    department: '',
    role: '',
    status: ''
  };

  ngOnInit(): void {
    this.loggedInUserDetails = this.localStorageService.get('loggedIn_user');
    if (this.loggedInUserDetails?.role === 'manager') {
      this.fetchTeamMembers();
    }

  this.dataSource.filterPredicate = (
    data: any,
    filter: string
  ): boolean => {
    const searchTerm = JSON.parse(filter).search;

    if (!searchTerm) return true;

    return (
      data.personal?.firstName?.toLowerCase().includes(searchTerm) ||
      data.personal?.lastName?.toLowerCase().includes(searchTerm) ||
      data.company?.employeeId?.toLowerCase().includes(searchTerm) ||
      data.company?.companyEmail?.toLowerCase().includes(searchTerm) ||
      data._id?.toString().includes(searchTerm)
    );
  };
  }


  /** ✅ Fetch team members safely with OnPush */
  private fetchTeamMembers(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.employeeService.GetTeamMembersList().subscribe({
      next: (res: any) => {
        this.dataSource.data = res?.data ?? [];
        this.isLoading = false;
        this.metaInfo = res.meta
        // ✅ notify Angular explicitly (OnPush-safe)
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.error('Error while fetching team members', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }


  applySearch(value: string) {
    console.log("value inside applySearch", value);
    this.filterValues.search = value.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  viewEmployee(id: string) {
    this.router.navigate(['employee/profile', id])
  }

}