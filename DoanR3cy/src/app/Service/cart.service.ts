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
import { BehaviorSubject, Subject } from 'rxjs';
import { product } from '../Interface/product';
import { Cart, CartItem } from '../models/cart';

export const CART_KEY = "cart";

@Injectable({
  providedIn: 'root',
})



export class CartService {
  // private cartItems: product[] = [];
  // private cartSubject = new BehaviorSubject<product[]>([]);

  // cart$ = this.cartSubject.asObservable();

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
  cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());
  constructor() { }


  initCartLocalStorage() {
    const cart: Cart = this.getCart();
    if (!cart) {
      const intialCart = {
        items: []
      }
      const intialCartJson = JSON.stringify(intialCart);
      localStorage.setItem(CART_KEY, intialCartJson);
    }

  }



  getCart(): Cart {
  //   const cartJsonString: string = localStorage.getItem(CART_KEY) ?? '';
  //   const cart: Cart = JSON.parse(cartJsonString);
  //   return cart
    
  // }
  // catch (error: any) {
  //   console.error('Lỗi khi parse JSON:', error);
  //   return null;

  // try {
  //   const cartJsonString: string = localStorage.getItem(CART_KEY) ?? '';
  //   if (!cartJsonString) {
  //     return null;
  //   }

  //   const cart: Cart = JSON.parse(cartJsonString);
  //   if (!cart || !cart.items) {
  //     return null;
  //   }

  //   return cart
  // } catch (error) {
  //   console.error('Lỗi khi parse JSON:', error);
  //   return null;
  // }

  // try {
  //   const cartJsonString: string = localStorage.getItem(CART_KEY) ?? '';
  //   if (!cartJsonString) {
  //     return this.cart; // Trả về giá trị mặc định nếu cart không hợp lệ
  //   }

  //   const cart: Cart = JSON.parse(cartJsonString);
  //   if (!cart || !cart.items) {
  //     return this.cart; // Trả về giá trị mặc định nếu cart không hợp lệ
  //   }

  //   return cart;
  // } catch (error) {
  //   console.error('Lỗi khi parse JSON:', error);
  //   return cart; // Trả về giá trị mặc định nếu lỗi xảy ra
  // }

  let cart: Cart;
  try {
    const cartJsonString: string = localStorage.getItem(CART_KEY) || '';
    if (!cartJsonString) {
      cart = {
        items: []
      };
    } else {
      cart = JSON.parse(cartJsonString);
      if (!cart || !cart.items) {
        cart = {
          items: []
        };
      }
    }
  } catch (error) {
    console.error('Lỗi khi parse JSON:', error);
    cart = {
      items: []
    };
  }
  return cart;
  }


  setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart {

    const cart = this.getCart();

    const cartItemExist = cart.items?.find((item) => item.id === cartItem.id);
    if (cartItemExist) {
      cart.items?.map((item) => {
        if (item.id === cartItem.id) {
          if (updateCartItem) {
            item.quantity = cartItem.quantity;
          } else {
            item.quantity = cartItem.quantity ?? 0;
          }
          return item;
        }
        return item;
      })


    } else {
      cart.items?.push(cartItem);
    }
    const cartJson = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJson);
    this.cart$.next(cart);

    return cart;


  }

  deleteCartItem(id: string) {
    const cart = this.getCart();
    const newCart = cart.items?.filter(item => item.id !== id)

    cart.items = newCart;

    const cartJsonString = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJsonString);

    this.cart$.next(cart);

  }

}