import { Component } from '@angular/core';
import { DiscountService } from '../Service/discount.service';

@Component({
  selector: 'app-admin-create-mgg',
  templateUrl: './admin-create-mgg.component.html',
  styleUrl: './admin-create-mgg.component.css'
})
export class AdminCreateMggComponent {

  discount: any = {
    // Các thuộc tính đã nhập từ giao diện HTML
    code: "",
    title: "",
    description: "",
    status: "",
    activate_date: "",
    expired_date: "",
    valuecode: 0,
    __v: 0
  };

  constructor(private discountService: DiscountService) { }

  saveDiscount(): void {
    // Gọi service để thêm sản phẩm mới
    this.discountService.addDiscount(this.discount).subscribe(
      (response: any) => {
        console.log('Discount saved successfully:', response);
        // Thực hiện các hành động khác sau khi lưu thành công (nếu cần).
      },
      (error: any) => {
        console.error('Error saving discount:', error);
        // Xử lý lỗi nếu cần thiết.
      }
    );
    alert("Thêm sản phẩm thành công!")
  }
}
