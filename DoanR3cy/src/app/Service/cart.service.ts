import { Injectable } from "@angular/core";

export const CART_KEY = "cart";

@Injectable({
    providedIn: 'root'
})
export class CartService {
    cartItems: any[] = [];

    constructor() {}

    getCartItems(): any[] {
        return this.cartItems;
    }

    addItemToCart(item: any): void {
        this.cartItems.push(item);
    }

    // xoa san pham


}