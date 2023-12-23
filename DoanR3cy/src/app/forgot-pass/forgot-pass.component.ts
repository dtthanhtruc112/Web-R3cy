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

import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountcustomerService } from '../Service/accountcustomer.service';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.css']
})
export class ForgotPassComponent implements OnInit {

  Mail: string ="";
  Mails: any;
  isMailValid: boolean = true;
  MailExist = true;
  MailData: string="";
  errorMessage: string="";

  constructor(
    private router: Router,
    private http: HttpClient,
    private accountService: AccountcustomerService
  ){}

  ngOnInit() {

  }

  sendCode(){
    if (!this.isMailValid) {
      alert('Vui lòng nhập đúng Email!');
    }
    else if(this.Mail.trim().length === 0){
      alert('Vui lòng Email!');     
    }
    else {
      this.accountService.checkMailExist(this.Mail).subscribe({
        next: (data) => {
          this.Mails = data;
          if (this.Mails.Mail == this.Mail) {
            alert('Gửi mã thành công!')
          }
        },
        error: (err) => {
          this.errorMessage = err;
          alert('Email không tồn tại!');
        }
      });
    }
    
}
  resend(){
    if (!this.isMailValid) {
      alert('Vui lòng nhập đúng Email!');
    }
    else if(this.Mail.trim().length === 0){
      alert('Vui lòng nhập Mail!');     
    }
    else {
      this.accountService.checkMailExist(this.Mail).subscribe({
        next: (data) => {
          this.Mails = data;
          if (this.Mails.Mail == this.Mail) {
            alert('Đã gửi lại mã xác nhận!')
          }
        },
        error: (err) => {
          this.errorMessage = err;
          alert('Email không tồn tại!');
        }
      });
    }
  }

  //-----FE
  checkMail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (this.Mail.trim().length === 0) {
      // Trường email trống, xem như là hợp lệ
      this.isMailValid = true;
    } else {
      // Kiểm tra định dạng của địa chỉ email
      this.isMailValid = emailRegex.test(this.Mail);
    }
  }  
  

  //kiểm tra mã xác nhận
  verificationCode: string = '';
  isVerificationCodeValid: boolean = true;

  checkVerificationCode() {
    if (this.verificationCode.trim().length === 0) {
      this.isVerificationCodeValid = true;
    } else
    if (this.verificationCode === '666666') {
      this.isVerificationCodeValid = true;
    } else {
      this.isVerificationCodeValid = false;
    }
  }

  onComplete() {
      // Kiểm tra mail hợp lệ và mã xác nhận đúng
      if (!this.isMailValid) {
        alert('Vui lòng nhập đúng số điện thoại!');
        return false
      }
      else if(this.Mail.trim().length === 0){
        alert('Vui lòng nhập số điện thoại!');
        return false     
      }
    else if(this.isVerificationCodeValid===false){
      alert('Vui lòng nhập đúng mã xác nhận!');
      return false;
      }
    else if(this.verificationCode.trim().length === 0){
      alert('Vui lòng nhập mã xác nhận!');
      return false;
    }
    else if(!this.isMailValid || !this.isVerificationCodeValid) {
      alert('Vui lòng nhập đúng Email và mã xác nhận!');
      return false;
    }
    else {
      this.accountService.checkMailExist(this.Mail).subscribe({
    next: (data) => {
    this.Mails = data;
    // console.log('Data from service:', this.phoneNumbers); // Log để kiểm tra dữ liệu

    // Kiểm tra dữ liệu trả về theo cách thích hợp
    if (this.Mails && this.Mails.Mail === this.Mail) {
      // alert('Mã xác nhận hợp lê!');
      this.router.navigate(['/new-pass']);
    } else {
      alert('Số điện thoại không tồn tại!');
    }
  },
  error: (err) => {
    this.errorMessage = err;
    alert('Số điện thoại không tồn tại!');
  },
});
      return
    }
  }
}

