import { Injectable } from '@angular/core';
import { API_ROUTES } from '../../../api-enpoints';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
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
  ) {}
  addHoliday(body: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ApiEnvelope<any>>(this.api_routes.holiday.add, body).pipe(
      map((res) => res.data),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }

  getHolidayList() {
    return this.http
      .get<ApiEnvelope<any>>(this.api_routes.holiday.get_list)
     
  }
}
