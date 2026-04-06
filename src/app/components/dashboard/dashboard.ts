import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../service/localstorage';
import { Employee } from '../../service/employee';
import { forkJoin } from 'rxjs';
import { HolidayService } from '../../service/holiday-service';
import { DatePipe, NgForOf } from '@angular/common';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-dashboard',
  imports: [NgForOf, DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class Dashboard implements OnInit {
  constructor(private localStorageService: LocalStorageService, private emplyeeService: Employee, private cd: ChangeDetectorRef, private holidayService: HolidayService) { }
  loggedInUser: any;
  teamMembersList: any[] = []
  totalMembersList: any[] = []
  holidayList: any[] = []
  upComingHolidayList: any[] = []

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.get('loggedIn_user');
    this.loadInitailData()
  }
  loadInitailData() {
    const LoggedInUser: any = this.localStorageService.get('loggedIn_user');
    const role = LoggedInUser?.role;


    const apiCalls: any = {
      holidayList: this.holidayService.getHolidayList()
    };


    if (role === 'admin') {
      apiCalls.totalMember = this.emplyeeService.GetEmployeeList();
    }

    if (role === 'manager') {
      apiCalls.teamMembers = this.emplyeeService.GetTeamMembersList();
    }


    forkJoin(apiCalls).subscribe((res: any) => {

      // ✅ Handle Admin response
      if (res.totalMember) {
        this.totalMembersList = res.totalMember.data;
      }

      // ✅ Handle Manager response
      if (res.teamMembers) {
        this.teamMembersList = res.teamMembers.data;
      }

      // ✅ Holidays for all roles
      this.holidayList = res.holidayList.data;

      // ✅ Upcoming holidays logic
      const today = new Date();
      this.upComingHolidayList = this.holidayList.filter(
        h => new Date(h.date) >= today
      );


      this.holidayList = res.holidayList.data;
      this.upComingHolidayList = this.holidayList.filter(h => new Date(h.date) >= new Date())
      console.log('Upcoming Holidays:', this.upComingHolidayList);

      this.cd.markForCheck();
    },

    );
  }

}
