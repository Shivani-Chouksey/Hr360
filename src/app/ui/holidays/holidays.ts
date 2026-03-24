import { Component } from '@angular/core';
import { year2026 } from '../../../data/holiday.json';
import { ModalComponent } from '../../common/modal/modal';
import {MatIconModule} from '@angular/material/icon';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { validate } from '@angular/forms/signals';
import { HolidayService } from '../../service/holiday-service';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatSelect, MatOption } from "@angular/material/select";
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-holidays',
  imports: [MatIconModule,FormsModule,ModalComponent, ɵInternalFormsSharedModule, ReactiveFormsModule, MatFormField, MatSelect, MatLabel, MatOption,DatePipe],
  templateUrl: './holidays.html',
  styleUrl: './holidays.css',
})
export class Holidays {
  constructor(private holiday_service: HolidayService) {}
  holidayList = year2026;
  allHolidays=year2026;
  confirmOpen = false;
  locationList=['Mumbai','Pune','Indore','Bhopal','remote']

  openConfirm() {
    this.confirmOpen = true;
  }
  onClosed() {
    this.confirmOpen = false;
  }

  deleteUser() {
    // your delete logic...
    console.log('User deleted');
    this.confirmOpen = false;
  }

  holidayForm = new FormGroup({
    title: new FormControl<string | null>(''),
    date: new FormControl<string | null>(''),
    type: new FormControl<string | null>(''),
    description: new FormControl<string | null>(''),
    applicableLocations: new FormControl<string | null>(''),
  });

  addHoliday() {
    console.log(this.holidayForm.value);
    this.holiday_service.addHoliday(this.holidayForm.value).subscribe({
      next: (res) => {
        console.log('Add Holiday Res', res);
      },
      error: (err) => {
        console.log('Add Holiday Error', err);
      },
    });
  }

  getHolidayList() {
    this.holiday_service.getHolidayList().subscribe({
      next: (res) => {
        console.log(res);
        this.holidayList = res.data;
        this.allHolidays=res.data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  
getDayName(date: string): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(date).getDay()];
}

selectedFilter:'upcoming' | 'past' | 'all' = 'all';
onFilterChange(){
console.log("selectedFilter",this.selectedFilter)
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
removeHoliday(id:number|string){
this.holidayList=this.allHolidays.filter(h=>h.id!=id);

// call API for remove holiday
}
}
