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
import { product } from '../Interface/product';
import { Cart, CartItem } from '../models/cart';

export const CART_KEY = "cart";

@Injectable({
  providedIn: 'root',
})



export class CartService {
  private cartItems: product[] = [];
  private cartSubject = new BehaviorSubject<product[]>([]);

  cart$ = this.cartSubject.asObservable();

  // addToCart(item: product) {
  //   this.cartItems.push(item);
  //   console.log(this.cartItems);
  //   this.cartSubject.next(this.cartItems);
  // }

  // getCartItems() {
  //   return this.cartItems;
  // }
  // private selectedOptionSource = new BehaviorSubject<string>('');
  // selectedOption$ = this.selectedOptionSource.asObservable();

  // setSelectedOption(option: string) {
  //   this.selectedOptionSource.next(option);
  // }

  constructor() { }


  initCartLocalStorage() {
    const cart: Cart = this.getCart();
    if (!cart) {
      const intialCart = {
        items: []
      }
      const intialCartJson = JSON.stringify(intialCart);
      localStorage.setItem(CART_KEY, intialCartJson);
    } else {

    }

  }



  getCart(): Cart {
    const cartJsonString: string = localStorage.getItem(CART_KEY) ?? '';
    const cart: Cart = JSON.parse(cartJsonString);
    return cart


  }

  setCartItem(cartItem: CartItem): Cart {

    const cart = this.getCart();

    const cartItemExist = cart.items?.find((item) => item.id === cartItem.id);
    if (cartItemExist) {
      cart.items?.map((item) => {
        if(item.id === cartItem.id) {
          item.quantity = item.quantity? + cartItem.quantity! :0 ;
          return item;
        }
        return item;
      })
     

    } else {
      cart.items?.push(cartItem);
    }
    cart.items?.push(cartItem);
    const cartJson = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJson);

    return cart;


  }

}