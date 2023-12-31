import { Component, OnInit } from '@angular/core';
import { DiscountService } from '../Service/discount.service';
import { Discount } from '../Interface/discount';

@Component({
  selector: 'app-admin-magiamgia',
  templateUrl: './admin-magiamgia.component.html',
  styleUrl: './admin-magiamgia.component.css'
})
export class AdminMagiamgiaComponent implements OnInit{

  Discount: any;
  DiscountDangapdung: any;
  DiscountDalenlich: any;
  DiscountDahethan: any;

  constructor(private discountService: DiscountService) {}

  ngOnInit() {
    this.discountService.getData().subscribe((data: Discount[]) => {
      this.Discount = data;
    });

    this.discountService.getDataDangapdung().subscribe((data: Discount[]) => {
      this.DiscountDangapdung = data;
    });

    this.discountService.getDataDalenlich().subscribe((data: Discount[]) => {
      this.DiscountDalenlich = data;
    });

    this.discountService.getDataDahethan().subscribe((data: Discount[]) => {
      this.DiscountDahethan = data;
    });
    

    
  }

  selectedbar: String = 'trang-thai-don-hang';

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
 
