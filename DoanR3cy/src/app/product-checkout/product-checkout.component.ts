import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderItem, Orders } from '../Interface/Order';
import { CartService } from '../Service/cart.service';
import { OrderService } from '../Service/order.service';
import { product } from '../Interface/product';
import { AuthService } from '../Service/auth.service';
import { Cart } from '../models/cart';
import { CartItem } from '../models/cart';


@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.css']
})
export class ProductCheckoutComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService
  ) {
    this.checkoutFormGroup = this.formBuilder.group({});
  }

  checkoutFormGroup: FormGroup;
  isSubmitted = false;
  cartItems: OrderItem[] = []; // Sửa từ orderItems thành cartItems
  userId: any;
  products: product[] = [];

  showOverlay: boolean = false;
  showSuccessPopup: boolean = false;

  ngOnInit(): void {
    this._initCheckoutForm();
    this._getCartItems();
  }

  backtoCart() {
    this.router.navigate(['/cart']);
  }

  private _initCheckoutForm() {
    this.checkoutFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      phone: [''],
      city: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required],
      district: ['', Validators.required],
      street: ['', Validators.required]
    });
  }

  private _getCartItems() {
    this.userId = Number(this.authService.getUserId());
  
    // Gọi API để lấy giỏ hàng dựa trên userID
    if (this.userId !== null) {
      this.cartService.getCart(this.userId).subscribe(
        (cart: Cart) => {
          this.cartItems = cart.cartItems || []; // Sử dụng cart.cartItems thay vì cart.items
          this.calculateSubtotal();
        },
        (error) => {
          console.error('Error getting cart:', error);
        }
      );
    }
  }
  
  
  placeOrder() {
    this.isSubmitted = true;
    if (this.checkoutFormGroup.invalid) {
      return;
    }

    const order: Orders = {
      orderItems: this.cartItems, // Sửa từ orderItems thành cartItems
      street: this.checkoutForm['street'].value,
      city: this.checkoutForm['city'].value,
      zip: this.checkoutForm['zip'].value,
      country: this.checkoutForm['country'].value,
      phone: this.checkoutForm['phone'].value,
      ordereddate: `${Date.now()}`
    };

    this.orderService.createOrder(order).subscribe(() => {
      this.showOverlay = true;
      this.showSuccessPopup = true;

      setTimeout(() => {
        this.closePopup();
      }, 3000);
    });
  }

  closePopup(): void {
    this.showOverlay = false;
    this.showSuccessPopup = false;
  }

  get checkoutForm() {
    return this.checkoutFormGroup.controls;
  }

  calculateSubtotal(): void {
    // this.cartItems.forEach(item => {
    //   item.subtotal = item.price * item.quantity;
    // });
  }
}
