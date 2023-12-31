import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../Service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { product } from '../Interface/product';
import { CartService } from '../Service/cart.service';
import { NavigationExtras } from '@angular/router'
import { CartItem } from '../models/cart';
import { Subject, Observable } from 'rxjs';
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  selectedCode: number | undefined;
  product: product[] = [];
  // pro: product | product[] = [];
  pro: product[] = []; 
  productt: any;
  item: any;
  endSubs$: Subject<any> = new Subject();

  quantity: number = 1;
  divide_answer: any;
  currentImage: any;
  img: any;

  constructor(private productService: ProductService, private router: Router, private _router: ActivatedRoute, private cartService: CartService,  private authService: AuthService,) { }

  ngOnInit(): void {

    

    this._router.paramMap.pipe(
      map(params => this.selectedCode = Number(params.get('id'))),
      switchMap(id => this.productService.getProductById(id).pipe(
        switchMap(pro => this.productService.getData().pipe(
        ))
        // ))
      )))

      .subscribe(data => {
        this.pro = data;
        console.log(this.pro);
        this.productt = this.pro[(this.selectedCode as number - 1)];
        console.log('this.productt', this.productt);
        this.currentImage = this.productt.img1;
      })
    console.log('this.selectedCode', this.selectedCode);}
  
  showDiv: boolean = false; // Bước 1

  updateQna(p: any){
    const updatedProduct = {
      id: p._id, // Đảm bảo rằng bạn có trường id để xác định sản phẩm cần cập nhật
      input_ask: p.input_ask,
      input_name: p.input_name
    };

    // Gửi dữ liệu cập nhật lên server
    this.productService.updateProduct(updatedProduct)
      .subscribe(response => {
        console.log(response); // In kết quả từ server sau khi cập nhật
      });
      this.showDiv = true;
      alert("Thêm câu hỏi thành công!")
  }

    onClick(img: any) {
        this.currentImage = img;
    }

    // checkUpdateQna() {
    //   if (this.updateQna(this.productt)!) {
    //     this.divide_answer.display = "block";
    //     console.log("Change success!")
    //   } else {
    //     this.divide_answer.display = "none";
    //   }
    // }

  addToCart() {
    // Kiểm tra đăng nhập
    if (!this.authService.isLoggedIn()) {
      // Chưa đăng nhập, chuyển hướng đến trang đăng nhập
      this.router.navigate(['/login']);
      return;
    }
  
    // Đã đăng nhập, lấy userID
    const userId: string | null = this.authService.getUserId();
    const productId = this.productt.id
    if (userId !== null) {
      // Gọi hàm addToCart chỉ khi userId không phải là null
      console.log('productId:', productId);
      console.log('quantity:', this.quantity);
  
      if (!productId || !Number.isInteger(productId) || productId <= 0 || !Number.isInteger(this.quantity) || this.quantity <= 0) {
        console.error('Invalid productId or quantity');
        console.log('productId:', productId);
        console.log('quantity:', this.quantity);
        // Xử lý trường hợp productId hoặc quantity không hợp lệ
        return;
      }
  
      this.cartService.addToCart(Number(userId), productId!, this.quantity).subscribe(
        (response) => {
          console.log('Response', response);
          alert('Đã thêm thành công vào giỏ hàng')
        },
        (error) => {
          console.error('Error adding to cart:', error);
          alert("Đã xảy ra lỗi")
          // Xử lý lỗi nếu có
        }
      );
    } else {
      console.error('User is not logged in.');
      // Xử lý trường hợp người dùng chưa đăng nhập
    }
  }
  
    
    // addProductToCart(productId: number, quantity: number): void {
    //   const userId = this.authService.getUserId(); // Lấy userId từ AuthService của bạn
    //   console.log('userid', userId);
    
    //   if (userId) {
    //     // Đã đăng nhập
    //     this.cartService.getCartByUserId(userId).subscribe(
    //       (cart) => {
    //         if (cart && cart.cartItems) {
    //           if (cart.cartItems.length > 0) {
    //             // Nếu đã có giỏ hàng, thêm sản phẩm vào giỏ hàng hiện có
    //             this.cartService.addToCart(userId, productId, quantity).subscribe(
    //               (response) => {
    //                 console.log('Product added to existing cart:', response);
    //                 // Xử lý khi sản phẩm được thêm vào giỏ hàng hiện có thành công
    //               },
    //               (error) => {
    //                 console.error('Error adding product to existing cart:', error);
    //                 // Xử lý khi có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng hiện có
    //               }
    //             );
    //           } else {
    //             // Nếu chưa có giỏ hàng, tạo giỏ hàng mới và thêm sản phẩm vào
    //             const newCart = {
    //               userid: userId,
    //               cartItems: [{
    //                 id: productId,
    //                 quantity: quantity,
    //                 // Thêm thông tin sản phẩm vào đây nếu cần
    //               }]
    //             };
    
    //             this.cartService.createCart(newCart).subscribe(
    //               (response) => {
    //                 console.log('New cart created and product added:', response);
    //                 // Xử lý khi giỏ hàng mới được tạo và sản phẩm được thêm vào thành công
    //               },
    //               (error) => {
    //                 console.error('Error creating cart and adding product:', error);
    //                 // Xử lý khi có lỗi xảy ra khi tạo giỏ hàng mới hoặc thêm sản phẩm vào giỏ hàng mới
    //               }
    //             );
    //           }
    //         }
    //       },
    //       (error) => {
    //         console.error('Error fetching cart:', error);
    //         // Xử lý khi có lỗi xảy ra khi lấy thông tin giỏ hàng
    //         // Ví dụ: Hiển thị thông báo lỗi cho người dùng
    //       }
    //     );
    //   } else {
    //     // Chưa đăng nhập, chuyển hướng người dùng đến trang đăng nhập
    //     this.router.navigate(['/login']);
    //   }
    // }
    

}


 