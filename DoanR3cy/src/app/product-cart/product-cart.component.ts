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


  constructor(private cartService: CartService, private _route: ActivatedRoute) { }

  ngOnInit() {
    // Đăng ký để theo dõi sự thay đổi của giỏ hàng
    this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
      
    });
    // this.cartService.selectedOption$.subscribe(option => {
    //   this.selectedOption = option;
    // });
    

    // this._route.queryParams.subscribe(params => {
    //   this.quantity = +params['quantity'] || 1; // Gán giá trị mặc định là 1 nếu không có tham số
    // });
  }
  
  calculateSubtotal(item: any): number {
    const price = Number(item.price); // Chuyển đổi giá trị giá từ string sang number

    // Tính tổng sản phẩm
    const subtotal = this.quantity * price;
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