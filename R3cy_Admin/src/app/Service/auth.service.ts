import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { AccountCustomer } from '../Interface/AccountCustomer';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  login(Mail: string, password: string): Observable<AccountCustomer> {
    const url = 'http://localhost:3000/login';
    const data = { Mail, password };
    return this.http.post<AccountCustomer>(url, data).pipe(
      
    );
  }

  logout() {
    sessionStorage.removeItem('CurrentUser');
  }

  setCurrentUser(user: any) {
    if (user) {
      sessionStorage.setItem('CurrentUser', JSON.stringify(user));
    } else {
      console.error('Trying to set null user.');
    }
  }
  
  getCurrentUser() {
    const userString = sessionStorage.getItem('CurrentUser');
    if (userString) {
      return JSON.parse(userString);
    } else {
      console.error('No user found in sessionStorage.');
      return null; // or handle the absence of user in a way that makes sense for your application
    }
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  public setCookie(name: string, value: string, expireDays: number): void {
    const date = new Date();
    date.setTime(date.getTime() + (expireDays * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
  }

  public getCookie(name: string): string {
    const cookieName = name + '=';
    const cookies = document.cookie.split(';');
    for(let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return "";
  }

  public deleteCookie(name: string): void {
    this.setCookie(name, '', -1);
  }
}
