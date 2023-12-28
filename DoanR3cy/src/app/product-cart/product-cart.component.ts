import { Component, OnDestroy, OnInit } from '@angular/core';
import { product } from '../Interface/product';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, catchError, map, of, switchMap, take, takeUntil } from 'rxjs';
import { CartService } from '../Service/cart.service';
import { OrderService } from '../Service/order.service';
import { CartItemDetailed, CartItem, Cart } from '../models/cart';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProductService } from '../Service/product.service';
import { Order } from '../Interface/Order';



@Component({
  selector: 'app-product-cart',
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.css'
})
export class ProductCartComponent implements OnInit, OnDestroy {



  cartItems: product[] = [];
  quantity: number = 1;
  selectedOption: string = '';
  cartItemsDetailed: CartItemDetailed[] = [];
  cartCount = 0;
  endSubs$: Subject<any> = new Subject();
  totalPrice: number = 0;



  constructor(
    private cartService: CartService,
    private _route: ActivatedRoute,
    private productService: ProductService,
    private orderService: OrderService
  ) {

  }

  ngOnInit() {
    this.getCartDetails();
    // this._getOrderSummary();


  }

  ngOnDestroy() {
    this.endSubs$.next(null);
    this.endSubs$.complete();

  }




  getCartDetails() {
    this.cartService.getCart().subscribe((cartData) => {
      const cartItems = cartData.cart || [];
      this.cartItemsDetailed = [];
  
      cartItems.forEach((cartItem: CartItem) => {
        if (cartItem.id) {  // Đổi từ cartItem.productId thành cartItem.id
          this.productService.getProduct(cartItem.id).subscribe((respproductt: product) => {
            this.cartItemsDetailed.push({
              productt: respproductt,
              quantity: cartItem.quantity
            });
            this.calculateTotalPrice();
          });
        }
      });
    });
  }
  



  calculateSubtotal(cartItem: any): number {
    const price = cartItem.productt?.price || 0;
    const quantity = cartItem.quantity || 0;
    const subtotal = price * quantity;
    return subtotal;
}

  calculateTotalPrice() {
    this.totalPrice = this.cartItemsDetailed.reduce((total, cartItem) => {
      return total + this.calculateSubtotal(cartItem);
    }, 0);
  }

  deleteCartItem(cartItem: CartItemDetailed) {
    this.cartService.removeFromCart(cartItem.productt.id).subscribe(() => {
      this.getCartDetails();
    });
  }

  updateCartItemQuantity(event: { value: any; }, cartItem: CartItemDetailed) {
    this.cartService.updateCart(cartItem.productt.id, event.value).subscribe(() => {
      this.getCartDetails();
    });
  }

  getOrderSummary() {
    // Gọi các phương thức hoặc service cần thiết để lấy thông tin tổng đơn hàng
  }
}