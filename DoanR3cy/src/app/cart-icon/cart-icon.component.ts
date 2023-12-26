import { Component } from '@angular/core';
import { CartService } from '../Service/cart.service';

@Component({
  selector: 'app-cart-icon',
  templateUrl: './cart-icon.component.html',
  styleUrl: './cart-icon.component.css'
})
export class CartIconComponent {
  // cartCount: number | undefined;
  cartCount= 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    // this.cartService.cart$.subscribe(cart => {
    //   this.cartCount = cart?.items?.length ?? 0;
    // })

    this.cartCount = this.cartService.getCart().items?.length ?? 0;
    

  }

}
