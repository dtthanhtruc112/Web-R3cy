import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../Service/product.service';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { product } from '../Interface/product';
// import { NavigationExtras } from '@angular/router'
import { Subject, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-sanphamchitiet',
  templateUrl: './admin-sanphamchitiet.component.html',
  styleUrl: './admin-sanphamchitiet.component.css'
})
export class AdminSanphamchitietComponent {

  selectedCode!: string;
  product: product[] = [];
  // pro: product | product[] = [];
  pro: product[] = []; 
  proo: product[] = []; 
  productt: any;
  item: any;
  endSubs$: Subject<any> = new Subject();
  quantity = 1 ;

  constructor(private productService: ProductService, private router: Router, private _router: ActivatedRoute) { }

  ngOnInit(): void {
    this._router.paramMap.pipe(
      map((params: { get: (arg0: string) => any; }) => this.selectedCode = String(params.get('id'))),
      switchMap((id: any) => this.productService.getProductById(id).pipe(
        switchMap((pro: any) => this.productService.getData().pipe(
        ))
        // ))
      )))

      .subscribe((data: product[]) => {
        this.pro = data;
        console.log(this.pro);
        this.productt = this.pro.find(product => product._id === this.selectedCode);
        console.log('this.productt', this.productt);
      })
  }
    

    updateProduct() {
      const updatedProduct = {
        id: this.productt._id, // Đảm bảo rằng bạn có trường id để xác định sản phẩm cần cập nhật
        name: this.productt.name,
        price: this.productt.price,
        oldprice: this.productt.oldprice,
        category1: this.productt.category1,
        category2: this.productt.category2,
        opt1: this.productt.opt1,
        opt2: this.productt.opt2,
        description: this.productt.description,
      };
  
      // Gửi dữ liệu cập nhật lên server
      this.productService.updateProduct(updatedProduct)
        .subscribe((response: any) => {
          console.log(response); // In kết quả từ server sau khi cập nhật
        });
        alert("Đã sửa thông tin sản phẩm thành công!")
    }

    deleteProduct(productId: string): void {
      this.productService.deleteProduct(productId)
        .subscribe(
          (          response: any) => {
            console.log('Product deleted successfully:', response);
            // Thực hiện các hành động cần thiết sau khi xóa sản phẩm
          },
          (          error: any) => {
            console.error('Error deleting product:', error);
            // Xử lý lỗi nếu cần thiết
          }
        );
        alert("Xóa sản phẩm thành công!")
    }
}
