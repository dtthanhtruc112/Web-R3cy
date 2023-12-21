import { Component } from '@angular/core';
import { CartService } from '../Service/cart.service';

@Component({
  selector: 'app-cart-icon',
  templateUrl: './cart-icon.component.html',
  styleUrl: './cart-icon.component.css'
})
export class CartIconComponent {
  cartCount: number | undefined;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartCount = this.cartService.getCart().items?.length
  }

}
