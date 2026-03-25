import { Injectable } from '@angular/core';
import { API_ROUTES } from '../../../api-enpoints';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { LocalStorageService } from './localstorage';
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
    const token = this.localStorageService.get('accessToken');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', }).set('Authorization', 'Bearer ' + token);
    return this.http.post<ApiEnvelope<any>>(this.api_routes.holiday.add, body, { headers }).pipe(
      map((res) => res.data),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }

  getHolidayList() {
    const token = this.localStorageService.get('accessToken');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', }).set('Authorization', 'Bearer ' + token);
    return this.http.get<ApiEnvelope<any>>(this.api_routes.holiday.get_list, { headers })

  }

  deleteHoliday(id: string | number) {
    console.log("Id Inside Service", id);
    const token = this.localStorageService.get('accessToken');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', }).set('Authorization', 'Bearer ' + token);
    return this.http.delete<ApiEnvelope<any>>(this.api_routes.holiday.Delete_holiday(id), { headers })
  }
}
