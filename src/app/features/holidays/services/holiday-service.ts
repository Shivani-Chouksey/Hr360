import { Injectable } from '@angular/core';
import { API_ROUTES } from '../../../../../api-enpoints';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { LocalStorageService } from '../../../core/services/localstorage';

interface ApiEnvelope<T> {
  data: T;
  message?: string;
}
@Injectable({
  providedIn: 'root',
})
export class HolidayService {
  constructor(
    private api_routes: API_ROUTES,
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) { }
  addHoliday(body: any) {
   
    return this.http.post<ApiEnvelope<any>>(this.api_routes.holiday.add, body).pipe(
      map((res) => res.data),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }

  getHolidayList() {
    return this.http.get<ApiEnvelope<any>>(this.api_routes.holiday.get_list)

  }

  deleteHoliday(id: string | number) {
    return this.http.delete<ApiEnvelope<any>>(this.api_routes.holiday.Delete_holiday(id))
  }
}
