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
  quantity = 1 ;

  constructor(private productService: ProductService, private router: Router, private _router: ActivatedRoute, private cartService: CartService,  private authService: AuthService,) { }

  ngOnInit(): void {
    this._router.paramMap.pipe(
      map(params => this.selectedCode = Number(params.get('id'))),
      switchMap(id => this.productService.getProductById(id).pipe(
        switchMap(pro => this.productService.getData().pipe(
          //   map(products => ({ product, relatedBlogs: product.filter(p => p.id !== id).slice(0, 3) }))
        ))
        // ))
      )))

      .subscribe(data => {
        this.pro = data;
        console.log(this.pro);
        this.productt = this.pro[(this.selectedCode as number - 1)];
        console.log(this.productt);
      })
    console.log(this.selectedCode);}

    // this._router.paramMap.pipe(
    //   map(params => this.selectedCode = Number(params.get('id'))),
    //   switchMap(id => this.productService.getProductById(id))
    // ).subscribe(data => {
    //   if (Array.isArray(data)) {
    //     this.pro = data;
    //     console.log(this.pro);
    //     this.productt = this.pro[(this.selectedCode as number - 1)];
    //     console.log(this.productt);
    //   }
    // })}

  // selectOption(option: string) {
  //   this.selectedOption = option;
  //   this.cartService.setSelectedOption(option);
  // }
  
  addProductToCart(): void {
    if (this.productt) {
      const productId = this.productt.id;
      const quantity = this.quantity;
  
      // Lấy thông tin người dùng hiện tại từ AuthService
      const userId = this.authService.getUserId();
  
      // Kiểm tra xem người dùng đã đăng nhập hay chưa
      if (userId) {
        // Nếu đã đăng nhập, thực hiện hàm thêm vào giỏ hàng với userId
        this.cartService.addToCart(productId, quantity).subscribe(
          response => {
            console.log(response);
            // Handle the response if needed
            alert('Sản phẩm đã được thêm vào giỏ hàng');
          },
          error => {
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
            // Handle the error if needed
            console.log('Alert should be displayed here.'); // Add this line
            alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
          }
        );
      } else {
        // Nếu chưa đăng nhập, chuyển hướng người dùng sang trang đăng nhập
        this.router.navigate(['/login']);
        // Trả về một Observable để không gây lỗi khi subscribe
        // (Bạn cũng có thể không trả về Observable nếu không muốn)
        return;
      }
    } else {
      // Handle the case where the product is not loaded
      console.error('Sản phẩm chưa được tải');
      // Display an error message
      console.log('Alert should be displayed here.'); // Add this line
      alert('Sản phẩm chưa được tải');
    }
  }
    
  //   try{
  //     this.cartService.addToCart(item);
  //     this.router.navigate(['/cart'], { queryParams: { quantity: this.quantity } });
      
  //   }catch(err){
  //     console.log(ErrorEvent)
  //   }
  // }

  // addProductToCart() {
  //   const cartItem: CartItem = {
  //     id: this.productt.id,
  //     quantity: this.quantity
  //   }
  
  //   this.cartService.setCartItem(cartItem);
  // }

  // addProductToCart() {
  //   console.log('productt:', this.productt);
  // console.log('quantity:', this.quantity);
  //   if (this.productt) {
  //     const cartItem: CartItem = {
  //       id: this.productt.id,
  //       quantity: this.quantity
  //     };
  //     this.cartService.setCartItem(cartItem);
  //   } else {
  //     // Xử lý trường hợp sản phẩm chưa được tải
  //     console.error('Sản phẩm chưa được tải');
  //   }
  // }

  // addProductToCart() {
  //   console.log('productt:', this.productt);
  //   console.log('quantity:', this.quantity);
  //   if (this.productt && this.quantity) {
  //     const cartItem: CartItem = {
  //       id: this.productt.id,
  //       quantity: this.quantity
  //     };
  //     this.cartService.setCartItem(cartItem);
  //   } else {
  //     console.error('Sản phẩm hoặc số lượng chưa được tải');
  //   }
  // }

  

}


 