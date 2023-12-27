// custom-product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomProduct } from '../Interface/CustomProduct'; 

@Injectable({
  providedIn: 'root'
})
export class CustomProductService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getCustomProducts(): Observable<CustomProduct[]> {
    return this.http.get<CustomProduct[]>(`${this.apiUrl}/customProducts`);
  }
}
