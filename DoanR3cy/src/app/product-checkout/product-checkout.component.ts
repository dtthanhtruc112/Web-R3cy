import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,Params } from '@angular/router';
import { CartService } from '../Service/cart.service';
import { OrderService } from '../Service/order.service';
import { product } from '../Interface/product';
import { AuthService } from '../Service/auth.service';
import { Cart } from '../models/cart';
import { CartItem } from '../models/cart';
import { ActivatedRoute } from '@angular/router';
import { Order, ClientInfo, Address } from '../Interface/Order';
import { DiscountService } from '../Service/discount.service';


@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.css']
})
export class ProductCheckoutComponent implements OnInit {

  queryParamsData: any;
  checkoutFormGroup: FormGroup;
  isSubmitted = false;
  cartItems: any[] = [];
  orderTotal = 0;
  shippingFee = 0;
  discount = 0;
  totalAmount = 0;
  userId = 0;
  selectedPaymentMethod: string = '';
  voucherCode: string = '';

  selectPayment(method: string) {
    this.selectedPaymentMethod = method;
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private discountService: DiscountService,
  ) {
    this.checkoutFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      country: ['Việt Nam'],
      zip: [''],
      district: ['', Validators.required],
      street: ['', Validators.required],
      orderNotes: ['']
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params['cartItems']) {
        this.cartItems = JSON.parse(params['cartItems']);
        
        this.orderTotal = parseFloat(params['orderTotal']);
        this.shippingFee = parseFloat(params['shippingFee']);
        this.discount = parseFloat(params['discount']);
        this.totalAmount = parseFloat(params['totalAmount']);
        this.userId = parseFloat(params['userId']);
        this.voucherCode = params['voucherCode']


        console.log('cartItems', this.cartItems)
        console.log('orderTotal', this.orderTotal)
        console.log('shippingFee', this.shippingFee)
        console.log('totalAmount', this.totalAmount)
        console.log('userId', this.userId)
        console.log('voucherCode', this.voucherCode)
        
      }
    });
    
  }

  backtoCart(): void {
    this.router.navigate(['/cart']);
  }

  placeOrder(): void {
    console.log('Request body:', this.checkoutFormGroup.getRawValue());

    this.isSubmitted = true;
    if (this.checkoutFormGroup.invalid) {
      return;
    }

    console.log('Place Order button clicked');

    const clientInfo: ClientInfo = {
      clientname: this.checkoutForm['name'].value,
      clientphone: this.checkoutForm['phone'].value,
      clientemail: this.checkoutForm['email'].value,
    };

    const address: Address = {
      country: this.checkoutForm['country'].value,
      postcodeZip: this.checkoutForm['zip'].value,
      province: this.checkoutForm['city'].value,
      district: this.checkoutForm['district'].value,
      addressDetail: this.checkoutForm['street'].value,
    };

    console.log('Client Info:', clientInfo);
    console.log('Address:', address);

    const order: Order = {
      userid: this.userId, // Điền dữ liệu user ID tương ứng
      channel: 'Website',
      ordernumber: Number(), // Điền số đơn hàng tương ứng
      products: this.cartItems,
      order_status: 'Chờ xử lí', // Trạng thái đơn hàng mặc định
      ordereddate: new Date(),
      paymentmethod: this.selectedPaymentMethod,
      paymentstatus: false, 
      totalOrderValue: this.orderTotal,
      shippingfee: this.shippingFee,
      discount: this.discount,
      totalAmount: this.totalAmount,
      adress: address,
      clientInfo: clientInfo,
      orderNote: 'Không có ghi chú', // 
      id: String(), // Trường này cần phải điền dữ liệu đơn hàng tương ứng
      rejectreason: '' // Lí do từ chối đơn hàng
    };
    console.log('Order:', order);
    console.log('products: this.cartItems', order.products)
        console.log('totalOrderValue: this.orderTotal', order.totalOrderValue)
        console.log('discount: this.discount,', this.discount)
        console.log('totalAmount: this.totalAmount,',  this.totalAmount)

   // Gọi phương thức createOrder từ OrderService
   this.orderService.createOrder(this.userId, order).subscribe(
    (createdOrder) => {
      console.log('Đơn hàng đã được tạo:', createdOrder);
      // Update userid in Discount collection
      this.discountService.updateDiscountUserIds(this.voucherCode, this.userId).subscribe(
        (updatedDiscount) => {
          console.log('Discount updated:', updatedDiscount);
        },
        (error) => {
          console.error('Lỗi khi cập nhật Discount:', error);
          // Handle error when updating Discount
        }
      );

      // Thêm xử lý khi đơn hàng đã được tạo
      alert()
      this.router.navigate(['/main-page']);
    },
    (error) => {
      console.error('Lỗi khi tạo đơn hàng:', error);
      // Thêm xử lý khi có lỗi
    }
  );
  }

  get checkoutForm() {
    return this.checkoutFormGroup.controls;
  }
}