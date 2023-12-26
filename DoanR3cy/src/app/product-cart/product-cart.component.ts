import { Component, OnDestroy, OnInit } from '@angular/core';
import { product } from '../Interface/product';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, catchError, map, switchMap, take, takeUntil } from 'rxjs';
import { CartService } from '../Service/cart.service';
import { OrderService } from '../Service/order.service';
import { CartItemDetailed, CartItem, Cart } from '../models/cart';



@Component({
  selector: 'app-product-cart',
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.css'
})
export class ProductCartComponent implements OnInit, OnDestroy {
  // cartItems: any[] = [];

  // constructor(private cartService: CartService) {}

  // ngOnInit(): void {
  //   this.cartItems = this.cartService.getCartItems();
  // }

  // addProductToCart(productt: any): void {
  //   this.cartService.addItemToCart(productt);
  // }

  // cartItems: Product[] | undefined;
  // quantity: number = 1;

  // constructor(private cartService: CartService, private _route: ActivatedRoute) {}


  // ngOnInit(): void {
  //   this.cartItems = this.cartService.getCartItems();
  // }

  // addProductToCart(productt: any): void {
  //   this.cartService.addItemToCart(productt);
  // }


  cartItems: product[] = [];
  quantity: number = 1;
  selectedOption: string = '';
  cartItemsDetailed: CartItemDetailed[] = [];
  cartCount = 0;
  endSubs$: Subject<any> = new Subject();
  totalPrice: number | undefined;
  // isCheckout = false;


  constructor(private cartService: CartService, private _route: ActivatedRoute, private orderService: OrderService) { 
    // this.router.url.includes('product-cart') ? this.isCheckout =true : this.isCheckout=false;

  }

  ngOnInit() {
    this._getCartDetails();
    this._getOrderSummary();

    // Đăng ký để theo dõi sự thay đổi của giỏ hàng
    // this.cartService.cart$.subscribe((items) => {
    //   this.cartItems = items;

    // });
    // this.cartService.selectedOption$.subscribe(option => {
    //   this.selectedOption = option;
    // });


    // this._route.queryParams.subscribe(params => {
    //   this.quantity = +params['quantity'] || 1; // Gán giá trị mặc định là 1 nếu không có tham số
    // });
  }

  ngOnDestroy() {
    this.endSubs$.next(null);
    this.endSubs$.complete();

  }

  private _getCartDetails() {
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe(respCart => {
      this.cartItemsDetailed = [];
      this.cartCount = respCart?.items?.length ?? 0;

      // respCart.items?.filter((CartItem) => this.cartItems.id)? forEach(cartItem => {
      //   this.orderService.getProduct(cartItem.id).subscribe((respProduct) => {
      //     this.cartItemsDetailed.push({
      //       product: respProduct,
      //       quantity: cartItem.quantity

      //     })
      //   })

      // })
    })
  }

  // calculateSubtotal(cartItem: any): number {
  //   const price = Number(cartItem.price); // Chuyển đổi giá trị giá từ string sang number

  //   // Tính tổng sản phẩm
  //   const subtotal = this.quantity * price;
  //   return subtotal;
  // }



  //Xóa sản phẩm
  // deleteCartItem(item: product): void {
  //   const index = this.cartItems.indexOf(item);
  //   if (index !== -1) {
  //     this.cartItems.splice(index, 1);
  //   }
  // }

  calculateSubtotal(cartItem: any): number {
    const price = cartItem.product.price;
    const quantity = cartItem.quantity;
    const subtotal = price * quantity;

    return subtotal;
  }

  deleteCartItem(cartItem: CartItemDetailed) {
    this.cartService.deleteCartItem(cartItem.product.id)
  }

  _getOrderSummary() {
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe((cart) => {
      this.totalPrice = 0;
      if (cart) {
        cart.items?.map((item) => {
          if (item.id) {
            this.orderService
              .getProduct(item.id)
              .pipe(take(1))
              .subscribe((product) => {
                if (item.quantity) {
                  // this.totalPrice += product.price * item.quantity;
                }
              })
          }
        })
      }
    }
    )
  }

  updateCartItemQuantity(event: { value: any; }, cartItem: CartItemDetailed) {

    this.cartService.setCartItem({
      id: cartItem.product.id,
      quantity: event.value
    }, true)
  }


}

function forEach(arg0: (cartItem: any) => void) {
  throw new Error('Function not implemented.');
}

