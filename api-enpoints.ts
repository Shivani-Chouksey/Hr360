import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class API_ROUTES {
  BASE_URL = 'http://localhost:3000/api/v1';
  employee = {
    create: `${this.BASE_URL}/employees`,
    get_list: `${this.BASE_URL}/employees`,
    getById: (id: string | number | null) => `${this.BASE_URL}/employees/${id}`,
    update: (id: string | number) => `${this.BASE_URL}/employee/${id}`,
  };
  holiday = {
    add: `${this.BASE_URL}/holidays`,
    get_list: `${this.BASE_URL}/holidays`,
  };
  leave = {};
}
