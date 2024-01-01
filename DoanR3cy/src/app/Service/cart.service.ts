

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { product } from '../Interface/product';
import { Cart, CartItem } from '../models/cart';
import { HttpClient } from '@angular/common/http';
import { Observable,  throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, map } from 'rxjs/operators';
import { AccountCustomer } from '../Interface/AccountCustomer';
export const CART_KEY = "cart";

@Injectable({
  providedIn: 'root',
})



export class CartService {
 
  private apiUrl = "http://localhost:3000";
  
  
  constructor(private http: HttpClient,  private authService: AuthService) { }

  getCart(userid: string): Observable<Cart> {
    const url = `${this.apiUrl}/cart/${userid}`;
    return this.http.get<Cart>(url);
  }

  // Update số lượng sản phẩm trong giỏ hàng
  updateCartItemQuantity(userId: number, itemId: number, quantity: number): Observable<any> {
    const url = `${this.apiUrl}/cart/update-quantity/${userId}/${itemId}`;
    const payload = { quantity: quantity };

    return this.http.put(url, payload);
  }


  // Phương thức để xóa sản phẩm khỏi giỏ hàng
  removeCartItem(userId: number, itemId: number): Observable<any> {
    const url = `${this.apiUrl}/cart/remove/${userId}/${itemId}`;
    return this.http.delete(url);
  }

// Hàm thêm sản phẩm vào giỏ hàng
addToCart(userId: number, productId: number, quantity: number): Observable<any> {
  const url = `${this.apiUrl}/cart/add`;

  const payload = {
    userid: userId,
    productId: productId,
    quantity: quantity,
  };

  return this.http.post(url, payload);
}
  



}
  