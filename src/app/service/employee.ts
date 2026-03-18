import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, map, throwError } from 'rxjs';
import { API_ROUTES } from '../../../api-enpoints'


interface ApiEnvelope<T> {
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Employee {

  constructor(private http: HttpClient, private route: API_ROUTES) { }
  AddEmployee(data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("AddEmployee ---------->", data);
    console.log('API_Route', this.route.employee.create);
    return this.http.post<ApiEnvelope<any>>(this.route.employee.create, { ...data })
      .pipe(
        map(res => res.data),          // If your backend returns plain Employee, remove this map
        catchError((err) => {
          // Normalize & rethrow so component can show a clean message
          const normalized = this.adaptHttpError(err);
          return throwError(() => normalized);
        })
      );

  }

  private adaptHttpError(error: any) {
    // Minimal normalization—customize to your API
    const status = error?.status ?? 0;
    const body = error?.error ?? {};
    const message =
      body.message || body.error || error?.message || 'Unexpected error occurred';
    return { status, message, details: body };
  }

  GetEmployeeList(){
    return this.http.get<ApiEnvelope<any>>(this.route.employee.get_list).pipe(map(res=>res.data),catchError((err)=>{
      return throwError(()=>err)
    }))
  }
  GetEmployeeById(id:string|null){
    console.log("Inside Service",id,this.route.employee.getById(id));
    
    return this.http.get<ApiEnvelope<any>>(this.route.employee.getById(id)).pipe(map(res=>res.data),catchError((err)=>{
      return throwError(()=>err)
    }))
  }

}
