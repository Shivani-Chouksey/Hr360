import { Component } from '@angular/core';
import { year2026 } from '../../../data/holiday.json';
import { ModalComponent } from '../../common/modal/modal';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { validate } from '@angular/forms/signals';
import { HolidayService } from '../../service/holiday-service';
@Component({
  selector: 'app-holidays',
  imports: [ModalComponent, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './holidays.html',
  styleUrl: './holidays.css',
})
export class Holidays {
  constructor(private holiday_service: HolidayService) {}
  holidayList = year2026;
  confirmOpen = false;

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
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
