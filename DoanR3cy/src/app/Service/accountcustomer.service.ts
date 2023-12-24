import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { AccountCustomer } from '../Interface/AccountCustomer';

@Injectable({
  providedIn: 'root'
})
export class AccountcustomerService {
  private apiUrl = 'http://localhost:3000';

  constructor(private _http: HttpClient) { }

  checkMailExist(Mail: string): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain;charset=utf8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this._http.get<any>("/accounts/" + Mail, requestOptions).pipe(
      map(res => JSON.parse(res) as Array<AccountCustomer>),
      retry(3),
      catchError(this.handleError)
    );
  }

  

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }

  // Post 1 account vào database
  postAccount(aAccount: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this._http.post<any>("/accounts", JSON.stringify(aAccount), requestOptions).pipe(
      map(res => JSON.parse(res) as AccountCustomer),
      retry(3),
      catchError(this.handleError)
    );
  }

}
