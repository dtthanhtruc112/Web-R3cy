import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {  OrderItem, Orders } from '../Interface/Order';
import { CartService } from '../Service/cart.service';
import { Cart } from '../models/cart';
import { OrderService } from '../Service/order.service';



@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrl: './product-checkout.component.css'
})
export class ProductCheckoutComponent {
  constructor( private formBuilder: FormBuilder, 
    private router: Router, 
    private cartService: CartService, 
    private orderService: OrderService )  {
      this.checkoutFormGroup = this.formBuilder.group({});
    }

  checkoutFormGroup: FormGroup;
  isSubmitted = false;
  orderItems: OrderItem[] = [];
  

  // Hiện popup
  showOverlay: boolean = false;
  showSuccessPopup: boolean = false;
  showCancelPopup: boolean = false;
  cdr: any;

  closePopup(): void {
    console.log('Closing popup...');
    this.showOverlay = false;
    this.showSuccessPopup = false;
    //  this.addressPopup = false;
    this.showCancelPopup = false
  }
  saveData(): void {
    // alert('Đã lưu thông tin');
    // Hiển thị overlay
    this.showOverlay = true;

    // Hiển thị popup
    this.showSuccessPopup = true;

    // Ẩn popup sau 3 giây (3000 milliseconds)
    setTimeout(() => {
      this.closePopup();
      this.cdr.detectChanges(); // Manually trigger change detection
    }, 3000);
  }



  ngOnInit(): void{
    this._initCheckoutForm();
    this._getCartItems();
  }


  backtoCart() {
    this.router.navigate(['/cart'])
  }

  private _initCheckoutForm() {
    this.checkoutFormGroup = this.formBuilder.group({
      name:['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      phone: [''],
      city: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required],
      district: ['', Validators.required],
      street: ['', Validators.required]
    });

    // this.orderService.createOrder(orders).subscribe(()=> {
    //   // đặt hàng thành công pop up
    // })
  }



  private _getCartItems() {
    const cart: Cart = this.cartService.getCart();
    this.orderItems = cart.items?.map(item => {
      return {
        product: item.id,
        quantity: item.quantity
      }
    }) ?? []
  }

  // đặt hàng
  placeOrder() {
    this.isSubmitted = true;
    if(this.checkoutFormGroup.invalid) {
      return;
    }

    const orders: Orders = {
      orderItems: this.orderItems,
      street: this.checkoutForm['street'].value,
      city: this.checkoutForm['city'].value,
      zip: this.checkoutForm['zip'].value,
      country: this.checkoutForm['country'].value,
      phone: this.checkoutForm['phone'].value,
      ordereddate: `${Date.now()}`
    };

    // this.orderService.createOrder(order).subscribe(()=>{
    //   // redirect to popup
    // })

  }

  get checkoutForm() {
    return this.checkoutFormGroup.controls;
  }
}
