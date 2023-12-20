// import { Injectable } from "@angular/core";

// export const CART_KEY = "cart";

// @Injectable({
//     providedIn: 'root'
// })
// export class CartService {
//     cartItems: any[] = [];

//     constructor() {}

//     getCartItems(): any[] {
//         return this.cartItems;
//     }

//     addItemToCart(item: any): void {
//         this.cartItems.push(item);
//     }

//     // xoa san pham


// }

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { Product } from '../Interface/Order';
import { product } from '../Interface/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: product[] = [];
  private cartSubject = new BehaviorSubject<product[]>([]);

  cart$ = this.cartSubject.asObservable();

  addToCart(item: product) {
    this.cartItems.push(item);
    console.log(this.cartItems);
    this.cartSubject.next(this.cartItems);
  }

  getCartItems() {
    return this.cartItems;
  }
  private selectedOptionSource = new BehaviorSubject<string>('');
  selectedOption$ = this.selectedOptionSource.asObservable();

  setSelectedOption(option: string) {
    this.selectedOptionSource.next(option);
  }


}