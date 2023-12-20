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


  cartItems: product[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit() {
    // Đăng ký để theo dõi sự thay đổi của giỏ hàng
    this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
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