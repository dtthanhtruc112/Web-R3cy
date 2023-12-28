

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { product } from '../Interface/product';
import { Cart, CartItem } from '../models/cart';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export const CART_KEY = "cart";

@Injectable({
  providedIn: 'root',
})



export class CartService {
 
  private apiUrl = "http://localhost:3000";
  
  constructor(private http: HttpClient) { }

  getCart(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cart`);
  }

  addToCart(productId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/add`, { productId, quantity });
  }

  removeFromCart(productId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/remove`, { productId });
  }

  checkout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, {});
  }

  updateCart(productId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/update`, { productId, quantity });
  }
}
  