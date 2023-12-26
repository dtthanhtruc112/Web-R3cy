

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { product } from '../Interface/product';
import { Cart, CartItem } from '../models/cart';

export const CART_KEY = "cart";

@Injectable({
  providedIn: 'root',
})



export class CartService {
 
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
    } else{
      
    }

  }




  getCart(): Cart {
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

  setCartItem(cartItem :CartItem, updateCartItemQuantity?: boolean) : Cart {
    const cart = this.getCart();
    cart.items = cart.items ?? [];
    const cartItemExist = cart.items?.find((item)=> item.id === cartItem.id)
    if(cartItemExist) {
      for (const item of cart.items) {
        if (item.id === cartItem.id) {
          if (cartItem.quantity) {
            if (item.quantity) {
            item.quantity += cartItem.quantity;
          }
          break;
        }
      }}

    } else{
      cart.items?.push(cartItem);


    }
  
    const cartJson = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJson);
    return cart;

  }

  

  // setCartItem(cartItem: CartItem, updateCartItem: boolean= false): Cart {
  //   console.log('cartItem:', cartItem);
  //   const cart = this.getCart() 
  //   if (cart.items) {
  //   const existingItemIndex = cart.items?.findIndex((item) => item.id === cartItem.id);
  
  //   if (existingItemIndex !== undefined) {
  //     const existingItem = cart.items[existingItemIndex];
  //     if (existingItem.quantity && cartItem.quantity) { // Kiểm tra cả hai quantity trước khi cộng
  //       existingItem.quantity += cartItem.quantity;
  //     }
  //   } else {
  //     cart.items.push(cartItem);
  //   }
  // } else {
  //   cart.items = [];
  //   cart.items.push(cartItem);
  // }
  
  //   this.saveCart(cart); // Lưu trữ giỏ hàng sau khi cập nhật
  //   this.cart$.next(cart); // Thông báo cho các subscriber
  
  //   return cart;
  // } 

  
  // // Hàm lưu trữ giỏ hàng vào localStorage
  // private saveCart(cart: Cart) {
  //   const cartJson = JSON.stringify(cart);
  //   localStorage.setItem(CART_KEY, cartJson);
  // }


  deleteCartItem(id: string) {
    const cart = this.getCart();
    const newCart = cart.items?.filter(item => item.id !== id)

    cart.items = newCart;

    const cartJsonString = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJsonString);

    this.cart$.next(cart);

  }

}