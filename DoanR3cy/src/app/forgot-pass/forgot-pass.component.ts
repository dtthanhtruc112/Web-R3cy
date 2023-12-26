import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountcustomerService } from '../Service/accountcustomer.service';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../Service/auth.service';

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
    private accountService: AccountcustomerService,
    private AuthService: AuthService,
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
            // Lưu thông tin người dùng vào sessionStorage
            const user = {
              Mail: this.Mails.Mail,
              // Các thông tin khác nếu có
            };
            this.AuthService.setCurrentUser(user);

            console.log('this.Mails:', this.Mails);
            console.log('this.generatedOtp:', this.generatedOtp);
          }
        },
        error: (err) => {
          this.errorMessage = err;
          alert('Email không tồn tại!');
        }
      });
    }
  }

  resend() {
    if (!this.isMailValid) {
      alert('Vui lòng nhập đúng Email!');
    } else if (this.Mail.trim().length === 0) {
      alert('Vui lòng nhập Email!');
    } else {
      // Gửi lại mã OTP mới
      this.generatedOtp = this.generateRandomOtp(); // Cập nhật giá trị mới ở đây
  
      // Gọi service để kiểm tra Email và gửi lại mã OTP
      this.accountService.checkMailExist(this.Mail).subscribe({
        next: (data) => {
          this.Mails = data;
          if (this.Mails.Mail == this.Mail) {
            // Hiển thị mã OTP mới trong cửa sổ thông báo
            alert('Đã gửi lại mã xác nhận!');
            alert('Mã OTP mới đã được gửi đến email của bạn.\nMã OTP mới: ' + this.generatedOtp);
            // Gọi service để gửi mã OTP mới
            // this.sendCode();
            console.log('this.Mails:', this.Mails);
            console.log('this.generatedOtp:', this.generatedOtp);
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

  generateRandomOtp(): string {
    // Tạo mã OTP ngẫu nhiên có 5 chữ số
    return Math.floor(10000 + Math.random() * 90000).toString();
  }


onComplete() {

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
        if (this.Mails && this.Mails.Mail === this.Mail && this.verificationCode === this.generatedOtp) {
          // console.log('this.Mail:', this.Mail);
          // console.log('this.generatedOtp:', this.generatedOtp);
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

