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

  getAccount(userId: number): Observable<AccountCustomer> {
    const url = `${this.apiUrl}/account/${userId}`;
    return this._http.get<AccountCustomer>(url);
  }

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

  // Lấy thông tin của một accountcustomer dựa trên _id
  getAccountInfo(accountId: string): Observable<any> {
    const requestOptions: Object = {
      responseType: 'json',
    };

    return this._http.get<any>(`${this.apiUrl}/my-account/${accountId}`, requestOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Cập nhật thông tin của một accountcustomer dựa trên _id
  updateAccountInfo(accountId: string, updatedInfo: any): Observable<any> {
    const requestOptions: Object = {
      responseType: 'json',
    };

    return this._http.put<any>(`${this.apiUrl}/my-account/${accountId}`, updatedInfo, requestOptions).pipe(
      catchError(this.handleError)
    );
  }
}
