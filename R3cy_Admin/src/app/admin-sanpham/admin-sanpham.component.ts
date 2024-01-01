import { Component, OnInit } from '@angular/core';
import { ProductService } from '../Service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { product } from '../Interface/product';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

@Component({
  selector: 'app-admin-sanpham',
  templateUrl: './admin-sanpham.component.html',
  styleUrl: './admin-sanpham.component.css'
})
export class AdminSanphamComponent implements OnInit{
  selectedbar: string = 'tat-ca-san-pham';
  product: any;
  quantityInitial!: number ;
  quantitySold!: number;
  quantityRemaining!: number;
  _url: string = "http://localhost:3000/product";

  constructor(private productService: ProductService, private _router: Router, private _activatedRoute: ActivatedRoute, private _http: HttpClient) {}

  // ngOnInit(): void {
  //   this.productService.getData().subscribe(
  //     {next: (dat) => this.product = dat, 
  //       error: (err) => this.errMsg = err.message
      
  //     } );
  // }

  calculateQuantityRemaining(data: any): number {
    // Tính toán và trả về giá trị quantityRemaining
    return data.quantity - data.sold_quantity;
  }

  updateQuantity(p: any){
    const updatedProduct = {
      id: p._id, // Đảm bảo rằng bạn có trường id để xác định sản phẩm cần cập nhật
      quantity: p.quantity,
      sold_quantity: p.sold_quantity
    };

    // Gửi dữ liệu cập nhật lên server
    this.productService.updateProduct(updatedProduct)
      .subscribe((response: any) => {
        console.log(response); // In kết quả từ server sau khi cập nhật
      });
      alert("Đã sửa thông tin về số lượng sản phẩm thành công!")
  }

  getProductById(id: any): Observable<product | undefined> {
    return this._http.get<product[]>(this._url).pipe(
      map((products: any[]) => {
        const productt = products.find((productt: product) => productt._id === id);
        console.log('Product:', productt);
        return productt ?? undefined;
      }),
      tap((productt: product | undefined) => {
        if (productt) {
          console.log(productt);
        } else {
          console.log("Undefined");
        }
      })
    );
  }

  ngOnInit() {
    this.productService.getData().subscribe((data: product[]) => {
      this.product = data;
    });

    

    
  }

  showContent(contentId: string): void {
    this.selectedbar = contentId;
  }

   // Hiện popup
   showOverlay: boolean = false;
   showSuccessPopup: boolean = false;
 
   closePopup(): void {
     console.log('Closing popup...');
     this.showOverlay = false;
     this.showSuccessPopup = false;
     this.reasonPopup = false;
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
     }, 3000);
   }

   // lý do
  reasonPopup: boolean = false;
  openPopup(): void {
    this.showOverlay = true;
    this.reasonPopup = true;
  }

  reason: string = '';
  addReason(): void {
    // Thêm logic để xử lý và lưu lý do mới vào cơ sở dữ liệu hoặc nơi cần thiết
    console.log('Đã thêm lý do:', this.reason);

    // Sau khi xử lý, bạn có thể đóng popup nếu cần
    this.closePopup();
  }
 
}
