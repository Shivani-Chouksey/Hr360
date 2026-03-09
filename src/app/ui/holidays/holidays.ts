import { Component } from '@angular/core';
import { year2026 } from "../../../data/holiday.json"
import { ModalComponent } from "../../common/modal/modal";
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { validate } from '@angular/forms/signals';
@Component({
  selector: 'app-holidays',
  imports: [ModalComponent, ɵInternalFormsSharedModule,ReactiveFormsModule],
  templateUrl: './holidays.html',
  styleUrl: './holidays.css',
})
export class Holidays {
  holidayList = year2026
  confirmOpen = false;

  openConfirm() { this.confirmOpen = true; }
  onClosed() { this.confirmOpen = false; }

  deleteUser() {
    // your delete logic...
    console.log('User deleted');
    this.confirmOpen = false;
  }

  holidayForm = new FormGroup({
    holiDayDate: new FormControl<string | null>(''),
    label: new FormControl<string | null>('')
  })

  addHoliday(){
    console.log(this.holidayForm.value);
    
  }

}
