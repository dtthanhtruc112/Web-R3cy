import { Component, OnInit } from '@angular/core';
import { product } from '../Interface/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../Service/product.service';
import { map, switchMap } from 'rxjs';
import { CartService } from '../Service/cart.service';


@Component({
  selector: 'app-product-cart',
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.css'
})
export class ProductCartComponent {
<<<<<<< HEAD
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
=======
>>>>>>> 8c621489bf2ab50e645d7fbad9e0e88ae93e9df6


  cartItems: product[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit() {
    // Đăng ký để theo dõi sự thay đổi của giỏ hàng
    this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
    });

    this._route.queryParams.subscribe(params => {
      this.quantity = +params['quantity'] || 1; // Gán giá trị mặc định là 1 nếu không có tham số
    });
  }
  calculateSubtotal(item: any): number {
    const quantity = 1; // Thay đổi giá trị này bằng số lượng thích hợp
    const price = Number(item.price); // Chuyển đổi giá trị giá từ string sang number

    // Tính tổng sản phẩm
    const subtotal = quantity * price;

    return subtotal;
  }
  
  //Xóa sản phẩm
  removeItem(item: product): void {
    const index = this.cartItems.indexOf(item);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
    }
  }

}