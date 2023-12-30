import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../Service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { product } from '../Interface/product';
import { NavigationExtras } from '@angular/router'
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-admin-sanphamchitiet',
  templateUrl: './admin-sanphamchitiet.component.html',
  styleUrl: './admin-sanphamchitiet.component.css'
})
export class AdminSanphamchitietComponent {

  selectedCode: number | undefined;
  product: product[] = [];
  // pro: product | product[] = [];
  pro: product[] = []; 
  productt: any;
  item: any;
  endSubs$: Subject<any> = new Subject();
  quantity = 1 ;

  constructor(private productService: ProductService, private router: Router, private _router: ActivatedRoute) { }

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
        .subscribe(response => {
          console.log(response); // In kết quả từ server sau khi cập nhật
        });
        alert("Đã sửa thông tin sản phẩm thành công!")
    }
}
