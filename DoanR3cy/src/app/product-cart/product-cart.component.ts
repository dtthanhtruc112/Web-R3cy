import { Component, OnInit } from '@angular/core';
import { product } from '../Interface/product';
import { ActivatedRoute, Router } from '@angular/router';
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
    private discountService: DiscountService
  ) {}

  ngOnInit(): void {
    // Lấy userID từ AuthService
    this.userId = Number(this.authService.getUserId());
    console.log('userId', this.userId);

    // Gọi API để lấy giỏ hàng dựa trên userID
    if (this.userId !== null) {
      // Chuyển đổi userId thành chuỗi khi gọi API
      this.cartService.getCart(this.userId).subscribe(
        (data: any) => {
          console.log('API Response:', data);
      
          // Sử dụng data.cart thay vì data.cartItems
          this.cartItems = data.cart || [];
          // Tính tổng giá trị của từng sản phẩm
          // this.calculateSubtotal();
        },
        (error) => {
          console.error('Error getting cart:', error);
        }
      );

      this.productService.getData().subscribe(
        (productData: product[]) => {
          this.products = productData;
          // Tiếp tục xử lý và tính toán sau khi có dữ liệu sản phẩm
          this.calculateSubtotal();
        },
        (error) => {
          console.error('Error getting product data:', error);
        }
      );
      
  }
  

  
}
  calculateSubtotal(): void {
    // Đặt giá trị cho thuộc tính subtotal trong từng sản phẩm
    this.cartItems.forEach(item => {
      item.subtotal = item.price * item.quantity;
    });
    // Sau khi cập nhật, cập nhật lại danh sách sản phẩm trong giỏ hàng và chuyển hướng lại
    this.refreshCartItems();
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
        this.cartItems = data.cart || []; // Sửa lại dòng này
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
    console.log('item.quantity', item.quantity); // Xác nhận giá trị khi thay đổi
    // Gửi request API để cập nhật số lượng trong cơ sở dữ liệu
    this.cartService.updateCartItemQuantity(this.userId, item.id, item.quantity).subscribe(
      (data: any) => {
        console.log('Cart item quantity updated successfully:', data);
        // Nếu bạn cần thực hiện các hành động khác sau khi cập nhật, thì thêm vào đây
        // Sau khi cập nhật, cập nhật lại danh sách sản phẩm trong giỏ hàng và chuyển hướng lại
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
      return product.img1; // Thay thế "imageUrl" bằng thuộc tính hình ảnh thực tế của bạn trong đối tượng sản phẩm
    } else {
      return 'default-image-url.jpg'; // Thay thế "default-image-url.jpg" bằng URL hình ảnh mặc định của bạn
    }
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
        // Handle API error
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




}