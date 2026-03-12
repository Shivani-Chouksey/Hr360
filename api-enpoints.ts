import { Injectable } from "@angular/core"

@Injectable({ providedIn: 'root' })
export class API_ROUTES {
    BASE_URL = 'http://localhost:3000/api/v1'
    employee = {
        create: `${this.BASE_URL}/add`,
        get_list: `${this.BASE_URL}/list`,
        getById: (id: string | number) => `employee/${id}`,
        update: (id: string | number) => `employee/${id}`
    }
    holiday={
        
    }
    leave={

    }
}