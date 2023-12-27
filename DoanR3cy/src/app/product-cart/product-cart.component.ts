import { Component, OnDestroy, OnInit } from '@angular/core';
import { product } from '../Interface/product';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, catchError, map, switchMap, take, takeUntil } from 'rxjs';
import { CartService } from '../Service/cart.service';
import { OrderService } from '../Service/order.service';
import { CartItemDetailed, CartItem, Cart } from '../models/cart';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProductService } from '../Service/product.service';



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
  product: product[] = [];



  constructor(private cartService: CartService, private _route: ActivatedRoute, private productService: ProductService) { 
    // this.router.url.includes('product-cart') ? this.isCheckout =true : this.isCheckout=false;

  }

  ngOnInit() {
    this._getCartDetails();
    // this._getOrderSummary();

    
  }

  ngOnDestroy() {
    this.endSubs$.next(null);
    this.endSubs$.complete();

  }

  private _getCartDetails() {
   

    // this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe(respCart => {
    //   this.cartItemsDetailed = respCart?.items ?? [];  // Gán sản phẩm vào cartItemsDetailed
    //   this.cartCount = this.cartItemsDetailed.length;
    // });

    // this.cartService.cart$.pipe().subscribe((respCart) => {
    //   respCart.items?.forEach((cartItem) => {
    //     this.productService.getProduct(cartItem.id).subscribe(product => {})
    //   })
    // })
  }

    

// tính tổng sản phẩm
  calculateSubtotal(cartItem: any): number {
    const price = cartItem.product.price;
    const quantity = cartItem.quantity;
    const subtotal = price * quantity;

    return subtotal;
  }

  // xóa item
  deleteCartItem(cartItem: CartItemDetailed) {
    this.cartService.deleteCartItem(cartItem.product.id)
  }
 

  updateCartItemQuantity(event: { value: any; }, cartItem: CartItemDetailed) {

    this.cartService.setCartItem({
      id: cartItem.product.id,
      quantity: event.value
    }, true)
  }


}





