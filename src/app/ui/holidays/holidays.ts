import { Component } from '@angular/core';
import { year2026 } from "../../../data/holiday.json"
import { ModalComponent } from "../../common/modal/modal";
@Component({
  selector: 'app-holidays',
  imports: [ModalComponent],
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

}
