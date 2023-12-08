// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-forgot-pass',
//   templateUrl: './forgot-pass.component.html',
//   styleUrls: ['./forgot-pass.component.css']
// })
// // export class ForgotPassComponent {
// //   constructor(private router: Router) {}

// //   redirectToOtpPage(): void {
// //     // Thực hiện các logic xử lý trước khi chuyển trang (nếu cần)
// //     this.router.navigate(['/otp-code']);
// //   }
// // }
// export class ForgotPassComponent {
//   forgotPassForm: FormGroup;

//   constructor(private formBuilder: FormBuilder, private router: Router) {
//     this.forgotPassForm = this.formBuilder.group({
//       textEp: ['', [Validators.email]]
//     });
//   }

//   redirectToOtpPage(): void {
//     if (this.forgotPassForm.valid) {
//       // Form hợp lệ, chuyển đến trang otp-code
//       this.router.navigate(['/otp-code']);
//     } else {
//       // Hiển thị thông báo hoặc xử lý khi form không hợp lệ
//       alert('Vui lòng điền đầy đủ thông tin');
//     }
//   }
// }

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.css']
})
export class ForgotPassComponent {
  forgotPassForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.forgotPassForm = this.formBuilder.group({
      textEp: ['', [this.customValidator]]
    });
  }

  customValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;

    // Kiểm tra xem giá trị có chứa ký tự @ (đối với địa chỉ email)
    const isEmail = value.endsWith('@gmail.com');

    // Kiểm tra xem giá trị có phải là một số điện thoại có độ dài từ 10 đến 11 số
    const isPhoneNumber = /^\d{10,11}$/.test(value);

    // Trả về null nếu giá trị hợp lệ (là địa chỉ email hoặc số điện thoại), hoặc một object có key là 'customValidator' nếu không hợp lệ
    return (isEmail || isPhoneNumber) ? null : { customValidator: true };
  }

  // redirectToOtpPage(): void {
  //   if (this.forgotPassForm.valid) {
  //     // Form hợp lệ, chuyển đến trang otp-code
  //     this.router.navigate(['/otp-code']);
  //   } else {
  //     // Hiển thị thông báo hoặc xử lý khi form không hợp lệ
  //     alert('Vui lòng nhập thông tin hợp lệ');
  //   }
  // }

  redirectToOtpPage(): void  {
    // Kiểm tra xem tất cả các trường đã được tương tác (chạm) chưa
    if (this.forgotPassForm.touched) {
      // Kiểm tra xem tất cả các trường đã được điền và làm mới trang nếu hợp lệ
      if (this.forgotPassForm.valid) {
        this.router.navigate(['/otp-code']);
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

