import { Component, OnInit } from '@angular/core';
import { Product } from '../Interface/Order';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../Service/product.service';
// import { map, switchMap } from 'rxjs';
import { CartService } from '../Service/cart.service';


@Component({
  selector: 'app-product-cart',
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.css'
})
export class ProductCartComponent {
  // cartItems: any[] = [];

  // constructor(private cartService: CartService) {}

  // ngOnInit(): void {
  //   this.cartItems = this.cartService.getCartItems();
  // }

  // addProductToCart(productt: any): void {
  //   this.cartService.addItemToCart(productt);
  // }

  cartItems: Product[] | undefined;
  quantity: number = 1;

  constructor(private cartService: CartService, private _route: ActivatedRoute) {}


  // ngOnInit(): void {
  //   this.cartItems = this.cartService.getCartItems();
  // }

  // addProductToCart(productt: any): void {
  //   this.cartService.addItemToCart(productt);
  // }




  ngOnInit() {
    // Đăng ký để theo dõi sự thay đổi của giỏ hàng
    this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
    });

    this._route.queryParams.subscribe(params => {
      this.quantity = +params['quantity'] || 1; // Gán giá trị mặc định là 1 nếu không có tham số
    });
  }


}