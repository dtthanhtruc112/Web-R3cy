// custom-product.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './custom-product.component.html',
  styleUrls: ['./custom-product.component.css']
})
export class CustomProductComponent {
  customProduct: FormGroup;
  showAlert = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.customProduct = this.fb.group({
      textName: ['', Validators.required],
      textEmail: ['', Validators.required],
      textPhone: ['', Validators.required],
      textPname: ['', Validators.required],
      textPdes: ['', Validators.required],
    });
  }

  isValidEmailOrPhone(): boolean {
    // Kiểm tra định dạng email hoặc số điện thoại
    const emailPattern = /\b[A-Za-z0-9._%+-]+@gmail.com\b/;
    const phonePattern = /^\d{10,11}$/;

    const textEmailValue = this.customProduct.controls['textEmail'].value;
    const textPhoneValue = this.customProduct.controls['textPhone'].value;

    if (emailPattern.test(textEmailValue) || phonePattern.test(textPhoneValue)) {
      return true;
    } else {
      return false;
    }
  }

  submitForm(): void {
    // Kiểm tra xem tất cả các trường đã được tương tác (chạm) chưa
    if (this.customProduct.touched) {
      // Kiểm tra xem tất cả các trường đã được điền và làm mới trang nếu hợp lệ
      if (this.customProduct.valid && this.isValidEmailOrPhone()) {
        alert('Bạn đã yêu cầu custom thành công');
        setTimeout(() => {
          this.router.navigate(['/custom-product']);
          setTimeout(() => {
            window.location.reload();
          }, 200);
        }, 200);
      } else {
        // Hiển thị cảnh báo khi form không hợp lệ
        alert('Email/ Số điện thoại không hợp lệ.');
      }
    } else {
      // Hiển thị cảnh báo khi người dùng chưa tương tác với các trường
      alert('Vui lòng nhập đầy đủ thông tin.');
    }
  }
}
