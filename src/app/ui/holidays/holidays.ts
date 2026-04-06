import { ChangeDetectorRef, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { year2026 } from '../../../data/holiday.json';
import { ModalComponent } from '../../common/modal/modal';
import { MatIconModule } from '@angular/material/icon';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { validate } from '@angular/forms/signals';
import { HolidayService } from '../../service/holiday-service';
import { MatFormField, MatLabel, MatHint } from "@angular/material/form-field";
import { MatSelect, MatOption } from "@angular/material/select";
import { DatePipe, NgClass, NgIf, TitleCasePipe, } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from '../../service/localstorage';

type HOLIDAY = {
  _id: string | number;
  title: string;
  date: Date;
  year: number;
  month: number;
  type: 'national' | 'regional' | 'optional' | 'company';
  description: string;
  applicableLocations: string[];
  isActive: boolean;
  createdBy: string;
}
@Component({
  selector: 'app-holidays',
  imports: [MatIconModule, FormsModule, ModalComponent, ɵInternalFormsSharedModule, ReactiveFormsModule, MatFormField, MatSelect, MatLabel, MatOption, DatePipe, NgIf, NgClass,TitleCasePipe],
  templateUrl: './holidays.html',
  styleUrl: './holidays.css',
})
export class Holidays implements OnInit, OnChanges {
  constructor(private holiday_service: HolidayService, private cdr: ChangeDetectorRef, private localStorageService: LocalStorageService) { }
  holidayList: HOLIDAY[] = [];
  allHolidays: HOLIDAY[] = [];
  IsLoading: boolean = false;
  IsDeleting: string | null | number = null;
  confirmOpen = false;
  locationList = ['Mumbai', 'Pune', 'Indore', 'Bhopal', 'remote']
  isDarkTheme = true
  loggedInUserDetails: any;
  selectedFilter: 'upcoming' | 'past' | 'all' = 'all';

  holidayForm = new FormGroup({
    title: new FormControl<string | null>(''),
    date: new FormControl<string | null>(''),
    type: new FormControl<string | null>(''),
    description: new FormControl<string | null>(''),
    applicableLocations: new FormControl<string | null>(''),

  });
  private _snackBar = inject(MatSnackBar);

  ngOnChanges(changes: SimpleChanges): void {
   console.log("onchange runing",this.loggedInUserDetails);
  }
  openConfirm() {
    this.confirmOpen = true;
  }
  onClosed() {
    this.confirmOpen = false;
  }

  deleteUser() {
    console.log('User deleted');
    this.confirmOpen = false;
  }


  addHoliday() {
    console.log(this.holidayForm.value);
    this.holiday_service.addHoliday(this.holidayForm.value).subscribe({
      next: (res) => {
        this.confirmOpen = false;
        this._snackBar.open('Holiday Added Successfully ', 'OK', {
          duration: 3000,
        });
        this.getHolidayList()

      },
      error: (err) => {

        this._snackBar.open(err.error.message, 'close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',

        });


        console.log('Add Holiday Error', err);
      },
    });
  }

  getHolidayList() {
    this.IsLoading = true
    this.holiday_service.getHolidayList().subscribe({
      next: (res) => {
        console.log(res);
        this.holidayList = res.data;
        this.allHolidays = res.data;
        this.cdr.detectChanges()
        this.IsLoading = false
      },
      error: (err) => {
        console.error(err);
        this.IsLoading = false
      },
    });
  }

  ngOnInit(): void {
    const LoggedInUser: any = this.localStorageService.get('loggedIn_user');
    console.log("LoggedInUser",LoggedInUser);
    
    this.loggedInUserDetails = LoggedInUser
    this.getHolidayList()

  }

  getDayName(date: string): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(date).getDay()];
  }

  onFilterChange() {
    console.log("selectedFilter", this.selectedFilter)
    const today = new Date();


    if (this.selectedFilter === 'upcoming') {
      this.holidayList = this.allHolidays.filter(
        h => new Date(h.date) >= today
      );
    }

    if (this.selectedFilter === 'past') {
      this.holidayList = this.allHolidays.filter(
        h => new Date(h.date) < today
      );
    }

    if (this.selectedFilter === 'all') {
      this.holidayList = [...this.allHolidays];
    }


  }
  removeHoliday(id: number | string) {
    console.log("id isndie ts", id);
    this.IsDeleting = id;

    this.holiday_service.deleteHoliday(id).subscribe({
      next: (res) => {
        this.IsDeleting = null;
        this.holidayList = this.allHolidays.filter(h => h._id != id);
        this.getHolidayList()
      },
      error: (err) => {
        this.IsDeleting = null;
        console.log("While Deleting Holiday", err);

      }
    })
    // call API for remove holiday
  }
}
