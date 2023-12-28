import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from '../Interface/users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Users[]> {
    return this.http.get<Users[]>(`${this.apiUrl}/customers`);
  }
}