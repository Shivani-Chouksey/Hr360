import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-details',
  imports: [NgIf, NgFor, NgClass, DatePipe],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css',
})
export class EmployeeDetails implements OnInit {
  @Input() userDetails: any;
  LoggedInUserdetails: any;
  ngOnInit(): void {
    console.log('inside employeedetail', this.userDetails);
    this.LoggedInUserdetails = this.userDetails;
  }
}
