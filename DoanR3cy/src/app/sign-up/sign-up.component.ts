import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signUpForm: FormGroup;
  showAlert = false;
  

  constructor(private fb: FormBuilder, private router: Router) {
    this.signUpForm = this.fb.group({
      textName: ['', Validators.required],
      textEp: ['', Validators.required],
      textPass: ['', Validators.required]
    });
  }

  submitForm() {
    if (this.signUpForm.valid && this.isValidEmailOrPhone()) {
      // Chuyển từ sign-up sang main-page
      // Thực hiện các bước cần thiết ở đây
      alert('Đăng ký thành công!');
      setTimeout(() => {
        this.router.navigate(['/main-page']);
      }, 200);
    } else {
      // Hiển thị cảnh báo khi form không hợp lệ
      alert('Email/ Số điện thoại không hợp lệ.');
    }
  }

  isValidEmailOrPhone(): boolean {
    // Kiểm tra định dạng email hoặc số điện thoại
    const emailPattern = /\b[A-Za-z0-9._%+-]+@gmail.com\b/;
    const phonePattern = /^\d{10,11}$/;

    const textEpValue = this.signUpForm.controls['textEp'].value;

    if (emailPattern.test(textEpValue)) {
      return true;
    } else if (phonePattern.test(textEpValue)) {
      return true;
    } else {
      return false;
    }
  }

  navigateToLogin(): void {
    // Thực hiện chuyển trang đến trang đăng nhập
    this.router.navigate(['/login']);
  }
}
