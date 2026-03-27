import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ROUTES } from '../../../api-enpoints';
import { LocalStorageService } from './localstorage';




interface ApiEnvelope<T> {
  data: T;
  message: string;
  statusCode:number
}
@Injectable({
  providedIn: 'root',
})
export class Leave {
  constructor(private http: HttpClient, private api_routes: API_ROUTES, private localStorageService: LocalStorageService) { }

  applyLeave(data: any) {
    return this.http.post<ApiEnvelope<any>>(this.api_routes.leave.apply, data)
  }


  getLeaveHistroy(){
    return this.http.get<ApiEnvelope<any>>(this.api_routes.leave.history)
  }

  getMyLeavesBalance(){
     return this.http.get<ApiEnvelope<any>>(this.api_routes.leave.leaveBalance)
  }

  getMyLeaves(){
     return this.http.get<ApiEnvelope<any>>(this.api_routes.leave.myLeaves)
  }
  getMyApprovalReq(){
     return this.http.get<ApiEnvelope<any>>(this.api_routes.leave.approvalReq)
  }
  acceptRejectReq(id:string,data:any){
     return this.http.patch<ApiEnvelope<any>>(this.api_routes.leave.acceptRejectReq(id),data)
  }
  withDrowReq(id:string,data:any){
     return this.http.patch<ApiEnvelope<any>>(this.api_routes.leave.withDrowReq(id),data)
  }
}
