import { Component, OnInit } from '@angular/core';
import { ProductService } from '../Service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { product } from '../Interface/product';

@Component({
  selector: 'app-admin-sanpham',
  templateUrl: './admin-sanpham.component.html',
  styleUrl: './admin-sanpham.component.css'
})
export class AdminSanphamComponent implements OnInit{
  selectedbar: string = 'tat-ca-san-pham';
  product: any;

  constructor(private productService: ProductService, private _router: Router, private _activatedRoute: ActivatedRoute) {}

  // ngOnInit(): void {
  //   this.productService.getData().subscribe(
  //     {next: (dat) => this.product = dat, 
  //       error: (err) => this.errMsg = err.message
      
  //     } );
  // }

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
