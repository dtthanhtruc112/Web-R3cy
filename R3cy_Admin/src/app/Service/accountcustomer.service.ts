import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { AccountCustomer } from '../Interface/AccountCustomer';
import { tap } from 'rxjs/operators';

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
    return this._http.get<any>(`${this.apiUrl}/accounts/${Mail}`, requestOptions).pipe(
      map(res => JSON.parse(res) as Array<AccountCustomer>),
      retry(3),
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }

  postAccount(aAccount: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this._http.post<any>(`${this.apiUrl}/addadmin`, JSON.stringify(aAccount), requestOptions).pipe(
      map(res => JSON.parse(res) as AccountCustomer),
      retry(3),
      catchError(this.handleError)
    );
  }

  getAdminAccounts(): Observable<AccountCustomer[]> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
    };
    return this._http.get<AccountCustomer[]>(`${this.apiUrl}/adminaccs`, requestOptions).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  
  getCustomers(): Observable<AccountCustomer[]> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
    };
    return this._http.get<AccountCustomer[]>(`${this.apiUrl}/customers`, requestOptions).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  updateAdminAccount(id: string, updatedData: any): Observable<AccountCustomer> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'json',
    };
    return this._http.put<AccountCustomer>(`${this.apiUrl}/updateadmin/${id}`, updatedData, requestOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteAdminAccount(id: string): Observable<void> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };

    return this._http.delete<void>(`${this.apiUrl}/deleteadmin/${id}`, requestOptions).pipe(
      tap(() => console.log(`Account with id ${id} deleted successfully`)),
      catchError(this.handleError)
    );
  }
} 
