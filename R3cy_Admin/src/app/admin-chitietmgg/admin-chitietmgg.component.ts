import { Component, OnInit } from '@angular/core';
import { DiscountService } from '../Service/discount.service';
import { map, switchMap } from 'rxjs';
import { Discount } from '../Interface/discount';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-chitietmgg',
  templateUrl: './admin-chitietmgg.component.html',
  styleUrl: './admin-chitietmgg.component.css'
})
export class AdminChitietmggComponent implements OnInit{

  selectedCode!: string;
  pro: any;
  discount: any;

  constructor(private router: Router, private _router: ActivatedRoute, private discountService: DiscountService) { }

  ngOnInit(): void {
    this._router.paramMap.pipe(
      map((params: { get: (arg0: string) => any; }) => this.selectedCode = String(params.get('id'))),
      switchMap((id: any) => this.discountService.getDiscountById(id).pipe(
        switchMap((pro: any) => this.discountService.getData().pipe(
        ))
        // ))
      )))

      .subscribe((data: any) => {
        this.pro = data;
        console.log(this.pro);
        this.discount = this.pro.find((Discount: { _id: string; }) => Discount._id === this.selectedCode);
        console.log('this.discount', this.discount);
      })
  }

  updateDiscount() {
    const updatedDiscount = {
      _id: this.discount._id, // Đảm bảo rằng bạn có trường id để xác định sản phẩm cần cập nhật
      code: this.discount.code,
      title: this.discount.title,
      description: this.discount.description,
      status: this.discount.status,
      activate_date: this.discount.activate_date,
      expired_date: this.discount.expired_date,
      valuecode: this.discount.valuecode
    };

    // Gửi dữ liệu cập nhật lên server
    this.discountService.updateDiscount(updatedDiscount)
      .subscribe((response: any) => {
        console.log(response); // In kết quả từ server sau khi cập nhật
      });
      alert("Đã sửa thông tin sản phẩm thành công!")
  }

  deleteDiscount(discountId: string): void {
    this.discountService.deleteDiscount(discountId)
      .subscribe(
        (          response: any) => {
          console.log('Discount deleted successfully:', response);
          // Thực hiện các hành động cần thiết sau khi xóa sản phẩm
        },
        (          error: any) => {
          console.error('Error deleting discount:', error);
          // Xử lý lỗi nếu cần thiết
        }
      );
      alert("Xóa mã giảm giá thành công!")
  }

}
