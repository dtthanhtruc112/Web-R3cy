// login.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.formBuilder.group({
      textEp: ['', [Validators.required, this.customValidator()]],
      textPass: ['', [Validators.required]]
    });
  }

  customValidator() {
    return (control: AbstractControl) => {
      const value = control.value as string; // Ép kiểu control.value thành string

      if (this.isValidEmail(value) || this.isValidPhoneNumber(value)) {
        return null; // Giá trị hợp lệ
      } else {
        return { customValidator: true }; // Giá trị không hợp lệ
      }
    };
  }

  private isValidEmail(value: string): boolean {
    // Kiểm tra xem giá trị có phải là email không
    return /\b[A-Za-z0-9._%+-]+@gmail.com\b/.test(value);
  }

  private isValidPhoneNumber(value: string): boolean {
    // Kiểm tra xem giá trị có phải là số điện thoại không
    return /^\d{10,11}$/.test(value);
  }

  submitForm(): void {
    // Kiểm tra xem tất cả các trường đã được tương tác (chạm) chưa
    if (this.loginForm.touched) {
      // Kiểm tra xem tất cả các trường đã được điền và làm mới trang nếu hợp lệ
      if (this.loginForm.valid) {
        alert('Bạn đã đăng nhập thành công');
        setTimeout(() => {
          this.router.navigate(['/main-page']);
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

  navigateToForgotPass(): void {
    // Chuyển hướng đến trang forgot-pass khi người dùng bấm "Quên mật khẩu?"
    this.router.navigate(['/forgot-pass']);
  }
}
