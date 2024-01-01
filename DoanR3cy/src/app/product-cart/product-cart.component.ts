import { Component, OnInit } from '@angular/core';
import { product } from '../Interface/product';
import { ActivatedRoute, Router,  Params } from '@angular/router';
import { Subject, catchError, map, of, switchMap, take, takeUntil } from 'rxjs';
import { CartService } from '../Service/cart.service';
import { OrderService } from '../Service/order.service';
import { Cart, CartItem } from '../models/cart';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProductService } from '../Service/product.service';
import { Order } from '../Interface/Order';
import { AuthService } from '../Service/auth.service';
import { DiscountService } from '../Service/discount.service';
import { Discount } from '../Interface/Discount';


@Component({
  selector: 'app-product-cart',
  templateUrl: './product-cart.component.html',
  styleUrls: ['./product-cart.component.css']
})
export class ProductCartComponent implements OnInit {
  userId: any;
  cartItems: CartItem[] = [];
  cartLength: any;
  products: product[] = [];

  constructor(
    private cartService: CartService,
    private _route: ActivatedRoute,
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService,
    private discountService: DiscountService,
    private router: Router

  ) {}

  ngOnInit(): void {
    // Lấy userID từ AuthService
    this.userId = Number(this.authService.getUserId());
    console.log('userId', this.userId);

    // Gọi API để lấy giỏ hàng dựa trên userID
    if (this.userId !== null) {
      this.cartService.getCart(this.userId).subscribe(
        (data: any) => {
          console.log('API Response:', data);
          this.cartItems = data.cart || [];
        },
        (error) => {
          console.error('Error getting cart:', error);
        });
      this.productService.getData().subscribe(
        (productData: product[]) => {
          this.products = productData;
        },
        (error) => {
          console.error('Error getting product data:', error);
        }
      );
  }
}

  calculateOrderTotal(): number {
    let orderTotal = 0;
  
    // Tính tổng các subtotal của từng sản phẩm trong giỏ hàng
    this.cartItems.forEach(item => {
      // Kiểm tra xem subtotal có được đặt giá trị hay không
      if (item.subtotal !== undefined) {
        orderTotal += item.subtotal;
      }
    });
  
    return orderTotal;
    
  }
  
  // Phương thức để xóa sản phẩm khỏi giỏ hàng
  removeItemFromCart(userId: number, itemId: number): void {
    this.cartService.removeCartItem(userId, itemId).subscribe(
      (data: any) => {
        console.log('Item removed successfully:', data);
        // Sau khi xóa thành công, cập nhật lại danh sách sản phẩm trong giỏ hàng
        this.refreshCartItems();
      },
      (error) => {
        console.error('Error removing item:', error);
      }
    );
  }

 // Cập nhật danh sách sản phẩm trong giỏ hàng sau khi xóa
private refreshCartItems(): void {
  // Gọi API để lấy giỏ hàng dựa trên userID
  if (this.userId !== null) {
    this.cartService.getCart(this.userId).subscribe(
      (data: any) => {
        this.cartItems = data.cart || []; 
      },
      (error) => {
        console.error('Error getting cart:', error);
      }
    );
  }
}


  updateCartItemQuantity(event: any, item: CartItem): void {
    // Cập nhật số lượng trong giỏ hàng
    item.quantity = event.value;
    console.log('item.quantity', item.quantity);
    this.cartService.updateCartItemQuantity(this.userId, item.id, item.quantity).subscribe(
      (data: any) => {
        console.log('Cart item quantity updated successfully:', data);
      this.refreshCartItems();
      },
      (error) => {
        console.error('Error updating cart item quantity:', error);
      }
    );
  }
  
  getProductImage(productId: number): string {
    const product = this.products.find(p => p.id === productId);
  
    if (product) {
      return product.img1; 
    } else {
      return 'Không tìm thấy hình ảnh'; // 
    }
  }
  getProduct_id(productId: number): string {
    const product = this.products.find(p => p.id === productId);
  
    if (product) {
      return product._id; 
    } else {
      return 'Không tìm thấy'; // 
    }
  }
  getProductRouterLink(productId: number): string[] {
    return ['/product', this.getProduct_id(productId)];
  }
  

  
  // Apply voucher
  voucherCode: string = '';
  discountInfo: Discount | null = null; // Allow null

  applyVoucher() {
    this.discountService.getDiscountByCode(this.voucherCode).subscribe(
      (discountOrArray: Discount | Discount[]) => {
        // Check if it's an array of discounts
        const discount = Array.isArray(discountOrArray) ? discountOrArray[0] : discountOrArray;
  
        if (!this.isUserEligible(discount.userids)) {
          // User is eligible, apply the discount
          this.discountInfo = discount;
          // Show success alert
          alert('Áp dụng mã thành công!');
        } else {
          // User is not eligible, show alert about usage limit
          alert('Bạn đã hết lượt sử dụng!');
        }
      },
      (error) => {
        console.error('Error applying voucher:', error);
        this.discountInfo = null; // Reset discountInfo on error
      }
    );
  }

  // Kiểm tra userid đã sử dụng voucher
  isUserEligible(userids: any[]): boolean {
    const userid = this.authService.getUserId();

    if (userid !== null) {
      const userId = parseInt(userid, 10);
      return userids.some(id => id.userid === userId);
    }

    return false;
  }

  goToCheckout(): void {
    const orderTotal = this.calculateOrderTotal();
    const shippingFee = this.voucherCode === 'MIENPHIVANCHUYEN' ? 0 : 25;
    // Lấy giá trị giảm giá từ discountInfo nếu có
    const discount = this.discountInfo ? (orderTotal * (+this.discountInfo.valuecode / 100)) : 0;
    const totalAmount = orderTotal + shippingFee - discount;
    // Chuyển hướng và truyền dữ liệu qua queryParams
    const queryParams: Params = {
      userId: this.userId.toString(),
      cartItems: JSON.stringify(this.cartItems),
      orderTotal: orderTotal.toString(),
      shippingFee: shippingFee.toString(),  // Phí vận chuyển mặc định, chuyển đổi sang chuỗi
      discount:  discount.toString(),         // Giảm giá từ voucher (nếu có), chuyển đổi sang chuỗi
      totalAmount: (orderTotal + shippingFee -  discount).toString(),  // Tổng toàn bộ đơn hàng, chuyển đổi sang chuỗi      
      voucherCode: this.voucherCode
    }; 
    this.router.navigate(['/checkout'], { queryParams });
  }
}
