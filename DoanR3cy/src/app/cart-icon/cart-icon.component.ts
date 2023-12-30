import { Component } from '@angular/core';
import { CartService } from '../Service/cart.service';
import { Cart, CartItem } from '../models/cart';
import { AuthService } from '../Service/auth.service';
@Component({
  selector: 'app-cart-icon',
  templateUrl: './cart-icon.component.html',
  styleUrl: './cart-icon.component.css'
})
export class CartIconComponent {
  cartCount : any;
  userId: any;
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService, private authService: AuthService) { }

  ngOnInit(): void {
     this.userId = Number(this.authService.getUserId());
 
     // Gọi API để lấy giỏ hàng dựa trên userID
     if (this.userId !== null) {
       // Chuyển đổi userId thành chuỗi khi gọi API
       this.cartService.getCart(this.userId).subscribe(
         (data: any) => {
           this.cartItems = data.cart || [];
          //  const  cartCount = data.cart.length;
          this.cartCount = this.cartItems.length;
     
         },
         (error) => {
           console.error('Error getting cart:', error);
         }
       );
   }
 


  }

}
