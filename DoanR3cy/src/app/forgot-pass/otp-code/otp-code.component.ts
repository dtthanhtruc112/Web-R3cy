// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-otp-code',
//   templateUrl: '../otp-code/otp-code.component.html',
//   styleUrl: '../otp-code/otp-code.component.css'
// })
// export class OtpCodeComponent {

// }

// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-otp-code',
//   // templateUrl: './otp-code.component.html',  
//   styleUrls: ['./otp-code.component.css'],
//   templateUrl: './otp-code.component.html'   
// })
// export class OtpCodeComponent {

// }

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-code',
  templateUrl: './otp-code.component.html',
  styleUrls: ['./otp-code.component.css']
})
export class OtpCodeComponent {
  otpForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.otpForm = this.formBuilder.group({
      otp1: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      otp2: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      otp3: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      otp4: ['', [Validators.required, Validators.pattern('^[0-9]$')]],
      otp5: ['', [Validators.required, Validators.pattern('^[0-9]$')]]
    });
  }

  // submitForm(): void {
  //   if (this.otpForm.valid) {
  //     // Lấy giá trị thực từ form
  //     const otpValues: string[] = Object.values(this.otpForm.value);

  //     // Kiểm tra xem tất cả các ô OTP đều chứa số từ 0 đến 9
  //     const isAllNumeric = otpValues.every(value => /^[0-9]+$/.test(value));

  //     if (isAllNumeric) {
  //       // Chuyển đến trang new-pass nếu tất cả đều là số
  //       this.router.navigate(['/new-pass']);
  //     } else {
  //       // Hiển thị thông báo hoặc xử lý khi form không hợp lệ
  //       alert('Vui lòng nhập chữ số từ 0 đến 9 cho tất cả các ô mã xác thực.');
  //     }
  //   } else {
  //     // Hiển thị thông báo hoặc xử lý khi form không hợp lệ
  //     alert('Vui lòng nhập chữ số từ 0 đến 9 cho tất cả các ô mã xác thực.');
  //   }
  // }

  submitForm(): void {
    // Kiểm tra xem tất cả các trường đã được tương tác (chạm) chưa
    if (this.otpForm.touched) {
      // Kiểm tra xem tất cả các trường đã được điền và làm mới trang nếu hợp lệ
      if (this.otpForm.valid) {
        // Lấy giá trị thực từ form
        const otpValues: string[] = Object.values(this.otpForm.value);
  
        // Kiểm tra xem tất cả các ô OTP đều chứa số từ 0 đến 9
        const isAllNumeric = otpValues.every(value => /^[0-9]+$/.test(value));
  
        if (isAllNumeric) {
          // Chuyển đến trang new-pass nếu tất cả đều là số
          this.router.navigate(['/new-pass']);
        } else {
          // Hiển thị thông báo hoặc xử lý khi form không hợp lệ
          alert('Vui lòng nhập chữ số từ 0 đến 9 cho tất cả các ô mã xác thực.');
        }
      } else {
        // Hiển thị thông báo hoặc xử lý khi form không hợp lệ
        alert('Vui lòng nhập chữ số từ 0 đến 9 cho tất cả các ô mã xác thực.');
      }
    } else {
      // Hiển thị cảnh báo khi người dùng chưa tương tác với các trường
      alert('Vui lòng nhập đầy đủ thông tin.');
    }
  }

  redirectToNewPassPage(): void {
    // Kiểm tra hợp lệ khi người dùng muốn chuyển trang
    this.submitForm();
  }

  redirectToForgotPassPage(): void {
    // Thực hiện các logic xử lý trước khi chuyển trang (nếu cần)
    this.router.navigate(['/forgot-pass']);
  }
}





