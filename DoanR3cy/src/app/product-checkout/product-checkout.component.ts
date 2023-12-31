// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router, Params } from '@angular/router';
// import { OrderService } from '../Service/order.service';
// import { AuthService } from '../Service/auth.service';
// import { ActivatedRoute } from '@angular/router';
// import { CartService } from '../Service/cart.service';
// import { Order } from '../Interface/Order';

// @Component({
//   selector: 'app-product-checkout',
//   templateUrl: './product-checkout.component.html',
//   styleUrls: ['./product-checkout.component.css']
// })
// export class ProductCheckoutComponent implements OnInit {

//   constructor(
//     private formBuilder: FormBuilder,
//     private router: Router,
//     private activatedRoute: ActivatedRoute,
//     private cartService: CartService,
//     private orderService: OrderService,
//     private authService: AuthService,
//   ) {
//     this.checkoutFormGroup = this.formBuilder.group({});
//   }

//   checkoutFormGroup: FormGroup | undefined;
//   isSubmitted = false;

//   cartItems: any[] = [];
//   orderTotal: number = 0;
//   shippingFee: number = 0;
//   discount: number = 0;
//   totalAmount: number = 0;

//   userId: any;
//   showOverlay: boolean = false;
//   showSuccessPopup: boolean = false;

//   ngOnInit(): void {
//     this._initCheckoutForm();
//     this.activatedRoute.queryParams.subscribe((params: Params) => {
//       if (params['cartItems']) {
//         this.cartItems = JSON.parse(params['cartItems']);
//         this.orderTotal = parseFloat(params['orderTotal']);
//         this.shippingFee = parseFloat(params['shippingFee']);
//         this.discount = parseFloat(params['discount']);
//         this.totalAmount = parseFloat(params['totalAmount']);

//         console.log('Cart Items:', this.cartItems);
//         console.log('Order Total:', this.orderTotal);
//         console.log('Shipping Fee:', this.shippingFee);
//         console.log('Discount:', this.discount);
//         console.log('Total Amount:', this.totalAmount);
//       }
//     });
//   }

//   backtoCart() {
//     this.router.navigate(['/cart']);
//   }

//   private _initCheckoutForm() {
//     this.checkoutFormGroup = this.formBuilder.group({
//       name: ['', Validators.required],
//       email: ['', [Validators.email, Validators.required]],
//       phone: [''],
//       city: ['', Validators.required],
//       country: ['', Validators.required],
//       zip: ['', Validators.required],
//       district: ['', Validators.required],
//       street: ['', Validators.required],
//       orderNotes: ['']
//     });
//   }

//   placeOrder() {
//     this.isSubmitted = true;
//     if (!this.checkoutFormGroup || this.checkoutFormGroup.invalid) {
//       return;
//     }
  
  

//   }
  
//   closePopup(): void {
//     this.showOverlay = false;
//     this.showSuccessPopup = false;
//   }

//   get checkoutForm() {
//     return this.checkoutFormGroup?.controls;
//   }
// }

  



import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,Params } from '@angular/router';
import { Order } from '../Interface/Order';
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
    private authService: AuthService,
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
   
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params['cartItems']) {
        // Chuyển đổi chuỗi JSON thành đối tượng JavaScript
        this.cartItems = JSON.parse(params['cartItems']);
        this.orderTotal = parseFloat(params['orderTotal']);
        this.shippingFee = parseFloat(params['shippingFee']);
        this.discount = parseFloat(params['discount']);
        this.totalAmount = parseFloat(params['totalAmount']);
    
        // Bây giờ bạn có thể sử dụng các giá trị này trong component của bạn
        console.log('Cart Items:', this.cartItems);
        console.log('Order Total:', this.orderTotal);
        console.log('Shipping Fee:', this.shippingFee);
        console.log('Discount:', this.discount);
        console.log('Total Amount:', this.totalAmount);
      }
    });
  }
  
  backtoCart() {
    this.router.navigate(['/cart']);
  }

 

 
}
