import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-details',
  imports: [NgIf],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css',
})
export class EmployeeDetails  implements OnInit {
@Input() userDetails :any |null=null
LoggedInUserdetails:any
ngOnInit(): void {
  console.log("inside employeedetail",this.userDetails);
  this.LoggedInUserdetails=this.userDetails
}

}
