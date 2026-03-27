import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class API_ROUTES {
  BASE_URL = 'http://localhost:3000/api/v1';
  Login=`${this.BASE_URL}/auth/login`
  employee = {
    create: `${this.BASE_URL}/employees`,
    get_list: `${this.BASE_URL}/employees`,
    getById: (id: string | number | null) => `${this.BASE_URL}/employees/${id}`,
    update: (id: string | number) => `${this.BASE_URL}/employee/${id}`,
  };
  holiday = {
    add: `${this.BASE_URL}/holidays`,
    get_list: `${this.BASE_URL}/holidays`,
    Delete_holiday:(id:string|number)=>`${this.BASE_URL}/holidays/${id}`
  };
  leave = {
    apply:`${this.BASE_URL}/leaves/apply`,
    history:`${this.BASE_URL}/leaves/`,
    leaveBalance:`${this.BASE_URL}/leaves/balance`,
    myLeaves:`${this.BASE_URL}/leaves/my-leaves`,
    approvalReq:`${this.BASE_URL}/leaves/approval-req`,
    acceptRejectReq:(id:string|number)=>`${this.BASE_URL}/leaves/${id}/status`,
    withDrowReq:(id:string|number)=>`${this.BASE_URL}/leaves/${id}/withdraw`,
  };
}
