import { NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-list',
  imports: [NgForOf],
  templateUrl: './list.html',
  styleUrl: './list.css',
})

export class List {
  constructor(private router: Router) { }
  employeeList = [
    {
      "personalDetail": {
        "profileImage": {
          "name": "john_avatar.png",
          "type": "image/png",
          "size": 245812
        },
        "firstName": "John",
        "lastName": "Doe",
        "mobileNumber": "9876543210",
        "email": "john.doe@example.com",
        "dob": "1990-04-12",
        "maritalStatus": "single",
        "gender": "male",
        "nationality": "india",
        "address": "123 Baker Street, Mumbai",
        "city": "Mumbai",
        "state": "Maharashtra"
      },
      "professionalDetail": {
        "employeeID": "EMP001",
        "userName": "john.doe",
        "employee_type": "Permanent",
        "email": "john.doe@company.com",
        "department": "Engineering",
        "designation": "Frontend Developer",
        "working_days": "Mon-Fri",
        "joining_date": "2022-02-15",
        "office_location": "Mumbai"
      },
      "documentsDetail": {
        "appointmentLetter": {
          "name": "appointment_letter_john.pdf",
          "type": "application/pdf",
          "size": 520344
        },
        "salarySlip": {
          "name": "salary_slip_jan_2026.pdf",
          "type": "application/pdf",
          "size": 304112
        },
        "relievingLetter": null,
        "experienceLetter": {
          "name": "experience_letter_john.jpeg",
          "type": "image/jpeg",
          "size": 188772
        }
      },
      "accountDetail": {
        "email": "john.doe@company.com",
        "slackId": "@john.doe",
        "skypeId": "john.doe.skype",
        "githubId": "john-doe-dev"
      }
    },
    {
      "personalDetail": {
        "profileImage": {
          "name": "sneha_avatar.jpg",
          "type": "image/jpeg",
          "size": 198221
        },
        "firstName": "Sneha",
        "lastName": "Kapoor",
        "mobileNumber": "9988776655",
        "email": "sneha.kapoor@example.com",
        "dob": "1994-11-05",
        "maritalStatus": "married",
        "gender": "female",
        "nationality": "india",
        "address": "Aundh Road, Pune",
        "city": "Pune",
        "state": "Maharashtra"
      },
      "professionalDetail": {
        "employeeID": "EMP002",
        "userName": "sneha.kapoor",
        "employee_type": "Contract",
        "email": "sneha.kapoor@company.com",
        "department": "HR",
        "designation": "HR Manager",
        "working_days": "Mon-Sat",
        "joining_date": "2023-06-01",
        "office_location": "Pune"
      },
      "documentsDetail": {
        "appointmentLetter": {
          "name": "appointment_letter_sneha.pdf",
          "type": "application/pdf",
          "size": 438900
        },
        "salarySlip": {
          "name": "salary_slip_dec_2025.pdf",
          "type": "application/pdf",
          "size": 298311
        },
        "relievingLetter": {
          "name": "relieving_letter_sneha.png",
          "type": "image/png",
          "size": 220118
        },
        "experienceLetter": {
          "name": "experience_letter_sneha.pdf",
          "type": "application/pdf",
          "size": 412440
        }
      },
      "accountDetail": {
        "email": "sneha.kapoor@company.com",
        "slackId": "@sneha.hr",
        "skypeId": "sneha.kapoor.skype",
        "githubId": "sneha-github"
      }
    }
  ]

  employeeListData = this.employeeList
  gotoProfile(name: string) {
    this.router.navigate(['employee/profile', name])
  }
  editProfile(name:string){
this.router.navigate(['employee/profile/edit', name])
  }
  GotoAddNew(){
    this.router.navigate(['/employee/add'])
  }
}
