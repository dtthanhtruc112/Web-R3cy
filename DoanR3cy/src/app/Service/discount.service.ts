import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Discount } from '../Interface/Discount';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  private _url: string = "http://localhost:3000";

  constructor(private _http: HttpClient) { }

  // getDiscountByCode(code: string): Observable<any> {
  //   const url = `${this._url}/discount/${code}`;
  //   return this._http.get(url);
  // }

  getDiscountByCode(code: string): Observable<Discount[]> {
    return this._http.get<Discount[]>(`${this._url}/discount/${code}`).pipe(
      retry(3),
      catchError(this.handleErr)
    );}

    updateDiscountUserIds(code: string, userId: number): Observable<Discount> {
      const url = `${this._url}/discount/${code}`;
      const body = { userid: userId };
  
      return this._http.patch<Discount>(url, body).pipe(
        catchError(this.handleErr)
      );
    }

    handleErr(err: HttpErrorResponse) {
      return throwError(() => new Error(err.message));
    }

}
