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
  // product: product[] = [];



  constructor(
    private cartService: CartService,
    private _route: ActivatedRoute,
    private productService: ProductService,
    private orderService: OrderService
  ) {

  }

  ngOnInit() {
    this._getCartDetails();
    // this._getOrderSummary();


  }

  ngOnDestroy() {
    this.endSubs$.next(null);
    this.endSubs$.complete();

  }




//  hiện sản phẩm trong cart
  private _getCartDetails() {
    this.cartService.cart$.pipe().subscribe((respCart) => {
      respCart.items?.forEach((cartItem) => {
        if (cartItem?.id) {
        this.productService.getProduct(cartItem.id).subscribe((respproductt: product) => { 
          this.cartItemsDetailed.push({
            productt: respproductt,
            quantity: cartItem.quantity


          })
        })
      }})
    })
  } 
   




  // tính tổng sản phẩm theo số lượng
  calculateSubtotal(cartItem: any): number {
    const price = cartItem.product.price;
    const quantity = cartItem.quantity;
    const subtotal = price * quantity;

    return subtotal;
  }

  // xóa item
  deleteCartItem(cartItem: CartItemDetailed) {
    this.cartService.deleteCartItem(cartItem.productt.id)
  }

// cập nhật số lượng
  updateCartItemQuantity(event: { value: any; }, cartItem: CartItemDetailed) {

    this.cartService.setCartItem({
      id: cartItem.productt.id,
      quantity: event.value
    }, true)
  }

  // phần tổng đơn hàng: giá sp + phí vận chuyển + voucher, chưa làm
  getOrderSummary() {} 

}





