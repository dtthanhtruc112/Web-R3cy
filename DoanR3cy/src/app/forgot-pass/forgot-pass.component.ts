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
  verificationCode: string = '';
  isVerificationCodeValid: boolean = true;
  generatedOtp: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private accountService: AccountcustomerService
  ){}

  ngOnInit() {

  }

  sendCode() {
    // Kiểm tra định dạng email trước khi gửi mã OTP
    this.checkMail();
  
    if (!this.isMailValid) {
      alert('Vui lòng nhập đúng Email!');
    } else if (this.Mail.trim().length === 0) {
      alert('Vui lòng nhập Email!');
    } else {
      this.accountService.checkMailExist(this.Mail).subscribe({
        next: (data) => {
          this.Mails = data;
          if (this.Mails.Mail == this.Mail) {
            // Email tồn tại, gửi mã OTP
            this.verificationCode = this.generateRandomOtp();
            this.generatedOtp = this.verificationCode;
            alert('Mã OTP đã được gửi đến email của bạn.\nMã OTP: ' + this.generatedOtp);
          }
        },
        error: (err) => {
          this.errorMessage = err;
          alert('Email không tồn tại!');
        }
      });
    }
  }
  
  // resend(){
  //   if (!this.isMailValid) {
  //     alert('Vui lòng nhập đúng Email!');
  //   }
  //   else if(this.Mail.trim().length === 0){
  //     alert('Vui lòng nhập Mail!');     
  //   }
  //   else {
  //     this.accountService.checkMailExist(this.Mail).subscribe({
  //       next: (data) => {
  //         this.Mails = data;
  //         if (this.Mails.Mail == this.Mail) {
  //           alert('Đã gửi lại mã xác nhận!')
  //         }
  //       },
  //       error: (err) => {
  //         this.errorMessage = err;
  //         alert('Email không tồn tại!');
  //       }
  //     });
  //   }
  // }

  resend() {
    if (!this.isMailValid) {
      alert('Vui lòng nhập đúng Email!');
    } else if (this.Mail.trim().length === 0) {
      alert('Vui lòng nhập Email!');
    } else {
      this.verificationCode = this.generateRandomOtp();

  
      // Gửi lại mã xác nhận
      this.accountService.checkMailExist(this.Mail).subscribe({
        next: (data) => {
          this.Mails = data;
          if (this.Mails.Mail == this.Mail) {
            alert('Đã gửi lại mã xác nhận!');
          }
          // Hiển thị mã OTP mới trong cửa sổ thông báo
        alert('Mã OTP mới đã được gửi đến email của bạn.\nMã OTP mới: ' + this.verificationCode);
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

  generateRandomOtp(): string {
    // Tạo mã OTP ngẫu nhiên có 5 chữ số
    return Math.floor(10000 + Math.random() * 90000).toString();
  }
  

  //kiểm tra mã xác nhận

  // checkVerificationCode() {
  //   // if (this.verificationCode.trim().length === 0) {
  //   //   this.isVerificationCodeValid = true;
  //   // } else
  //   // if (this.verificationCode === '666666') {
  //   //   this.isVerificationCodeValid = true;
  //   // } else {
  //   //   this.isVerificationCodeValid = false;
  //   // }
  //   if (this.verificationCode.trim().length === 0) {
  //     this.isVerificationCodeValid = true;
  //   } else if (/^\d{5}$/.test(this.verificationCode)) {
  //     this.isVerificationCodeValid = true;
  //   } else {
  //     this.isVerificationCodeValid = false;
  //   }
  // }

//   onComplete() {
//       // Kiểm tra mail hợp lệ và mã xác nhận đúng
//       if (!this.isMailValid) {
//         alert('Vui lòng nhập đúng Email!');
//         return false
//       }
//       else if(this.Mail.trim().length === 0){
//         alert('Vui lòng nhập Email!');
//         return false     
//       }
//     else if(this.isVerificationCodeValid===false){
//       alert('Vui lòng nhập đúng mã xác nhận!');
//       return false;
//       }
//     else if(this.verificationCode.trim().length === 0){
//       alert('Vui lòng nhập mã xác nhận!');
//       return false;
//     }
//     else if(!this.isMailValid || !this.isVerificationCodeValid) {
//       alert('Vui lòng nhập đúng Email và mã xác nhận!');
//       return false;
//     }
//     else {
//       this.accountService.checkMailExist(this.Mail).subscribe({
//     next: (data) => {
//     this.Mails = data;
//     // console.log('Data from service:', this.phoneNumbers); // Log để kiểm tra dữ liệu

//     // Kiểm tra dữ liệu trả về theo cách thích hợp
//     if (this.Mails && this.Mails.Mail === this.Mail) {
//       // alert('Mã xác nhận hợp lê!');
//       this.router.navigate(['/new-pass']);
//     } else {
//       alert('Email không tồn tại!');
//     }
//   },
//   error: (err) => {
//     this.errorMessage = err;
//     alert('Email không tồn tại!');
//   },
// });
//       return
//     }
//   }

onComplete() {
  // Kiểm tra mail hợp lệ và mã xác nhận đúng
  if (!this.isMailValid) {
    alert('Vui lòng nhập đúng Email!');
    return false;
  } else if (this.Mail.trim().length === 0) {
    alert('Vui lòng nhập Email!');
    return false;
  } else if (this.isVerificationCodeValid === false) {
    alert('Vui lòng nhập đúng mã xác nhận!');
    return false;
  } else if (this.verificationCode.trim().length === 0) {
    alert('Vui lòng nhập mã xác nhận!');
    return false;
  } else if (!this.isMailValid || !this.isVerificationCodeValid) {
    alert('Vui lòng nhập đúng Email và mã xác nhận!');
    return false;
  } else {
    this.accountService.checkMailExist(this.Mail).subscribe({
      next: (data) => {
        this.Mails = data;
        // Kiểm tra dữ liệu trả về theo cách thích hợp
        if (this.Mails && this.Mails.Mail === this.Mail && this.Mails.OTP === this.generatedOtp) {
          alert('Mã xác nhận hợp lệ!');
          this.router.navigate(['/new-pass']);
        } else {
          alert('Email hoặc mã xác nhận không đúng!');
        }
      },
      error: (err) => {
        this.errorMessage = err;
        alert('Email không tồn tại!');
      },
    });
    return;
  }
}
}

