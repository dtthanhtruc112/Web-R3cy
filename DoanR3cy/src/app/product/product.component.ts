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

  constructor(private productService: ProductService, private router: Router, private _router: ActivatedRoute, private cartService: CartService) { }

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
  
  // addToCart(item: product) {
  //   // Gọi phương thức addToCart của CartService để thêm sản phẩm vào giỏ hàng
  //   if (this.selectOption){
  //     const NavigationExtras: NavigationExtras = {
  //       queryParams: {
  //         option: this.selectOption
  //       }
  //     };
  //     this.router.navigate(['/cart'], NavigationExtras);
      
  //   }else {

  //   }
    
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

  addProductToCart() {
    console.log('productt:', this.productt);
    console.log('quantity:', this.quantity);
    if (this.productt) {
      const cartItem: CartItem = {
        id: this.productt.id,
        quantity: this.quantity
      };
      this.cartService.setCartItem(cartItem);
    } else {
      // Xử lý trường hợp sản phẩm chưa được tải
      console.error('Sản phẩm chưa được tải');
      // Hiển thị thông báo lỗi
      alert('Sản phẩm chưa được tải');
    }
  }

  

}


 