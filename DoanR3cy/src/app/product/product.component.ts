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

  selectedCode!: string;
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
  productsHighlight: product[] = [];
  productsSuggestion: product[] = [];

  constructor(private productService: ProductService, private router: Router, private _router: ActivatedRoute, private cartService: CartService,  private authService: AuthService,) { }

  ngOnInit(): void {

    this.productService.getData().subscribe((data: product[]) => {
      // Lấy tất cả sản phẩm từ DB
      const allProducts = data;
  
      // Kiểm tra xem có ít nhất 8 sản phẩm (4 sản phẩm nổi bật và 4 sản phẩm gợi ý) trong DB không
      if (allProducts.length >= 8) {
        // Lấy 4 sản phẩm đầu tiên làm sản phẩm nổi bật
        this.productsHighlight = this.getFirstNProducts(allProducts, 4);
  
        // Lấy 4 sản phẩm cuối cùng làm sản phẩm gợi ý
        this.productsSuggestion = this.getLastNProducts(allProducts, 4);
        console.log(this.productsSuggestion)
      } else {
        console.error('Không đủ sản phẩm trong cơ sở dữ liệu.');
      }
    });

    this._router.paramMap.pipe(
      map(params => this.selectedCode = String(params.get('id'))),
      switchMap(id => this.productService.getProductById(id).pipe(
        switchMap(pro => this.productService.getData().pipe(
        ))
        // ))
      )))

      .subscribe(data => {
        this.pro = data;
        console.log(this.pro);
        this.productt = this.pro.find(product => product._id === this.selectedCode);
        console.log('this.productt', this.productt);
        this.currentImage = this.productt.img1
      })
    console.log('this.selectedCode', this.selectedCode);}
  
  showDiv: boolean = false;

  updateQna(p: any){
    const updatedProduct = {
      id: p._id, 
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

  private getFirstNProducts(products: product[], n: number): product[] {
    return products.slice(0, n);
  }

  // Hàm lấy n sản phẩm cuối cùng từ mảng sản phẩm
  private getLastNProducts(products: product[], n: number): product[] {
    return products.slice(-n);
  }

    onClick(img: any) {
        this.currentImage = img;
    }

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
  
  

}


 