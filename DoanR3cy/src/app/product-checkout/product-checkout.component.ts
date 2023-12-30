import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,Params } from '@angular/router';
import { OrderItem, Orders } from '../Interface/Order';
import { CartService } from '../Service/cart.service';
import { OrderService } from '../Service/order.service';
import { product } from '../Interface/product';
import { AuthService } from '../Service/auth.service';
import { Cart } from '../models/cart';
import { CartItem } from '../models/cart';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.css']
})
export class ProductCheckoutComponent implements OnInit {

  queryParamsData: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService
  ) {
    this.checkoutFormGroup = this.formBuilder.group({});
  }

  checkoutFormGroup: FormGroup;
  isSubmitted = false;

  // cartItems: CartItem[] = [];
  cartItems: any[] = [];
  orderTotal: number = 0;
  shippingFee: number = 0;
  discount: number = 0;
  totalAmount: number = 0;


  userId: any;
  products: product[] = [];

  showOverlay: boolean = false;
  showSuccessPopup: boolean = false;

  ngOnInit(): void {
    this._initCheckoutForm();
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params['cartItems']) {
        // Chuyển đổi chuỗi JSON thành đối tượng JavaScript
        const cartItems = JSON.parse(params['cartItems']);
        const orderTotal = parseFloat(params['orderTotal']);
        const shippingFee = parseFloat(params['shippingFee']);
        const discount = parseFloat(params['discount']);
        const totalAmount = parseFloat(params['totalAmount']);
    
        // Bây giờ bạn có thể sử dụng các giá trị này trong component của bạn
        console.log('Cart Items:', cartItems);
        console.log('Order Total:', orderTotal);
        console.log('Shipping Fee:', shippingFee);
        console.log('Discount:', discount);
        console.log('Total Amount:', totalAmount);
      }
    });
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

 
}
