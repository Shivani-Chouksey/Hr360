import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Employee {
  apiUrl = 'http://localhost:4200/api/amployee'
  constructor(private http: HttpClient) { }
  AddEmployee(data: any) {
    console.log("AddEmployee ---------->", data);

    return this.http.post(this.apiUrl, { body: data }, {

      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).subscribe((config) => {
      console.log('Add Employee Req', config);

    })
  }
}
