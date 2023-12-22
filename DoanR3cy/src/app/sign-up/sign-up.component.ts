import { Component } from '@angular/core';
import { AccountCustomer } from '../Interface/AccountCustomer';
import { AccountcustomerService } from '../Service/accountcustomer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
// export class SignUpComponent {
//   signUpForm: FormGroup;
//   account = new AccountCustomer();
//   confirmPassword: string = '';
//   isPhoneNumberValid: boolean = true;
//   isValidEmail: boolean = true;
//   errMessage: string = '';

//   constructor(private fb: FormBuilder, private router: Router, private _service: AccountcustomerService) {
//     this.signUpForm = this.fb.group({
//       textName: ['', Validators.required],
//       textEmail: ['', Validators.required],
//       textPhone: ['', Validators.required],
//       textPass: ['', Validators.required]
//     });
//   }

//   checkPhoneNumber(): void {
//     const phoneNumberRegex = /^(\+84|0)[1-9][0-9]{7,8}$/;
//     if (this.account.phonenumber.trim().length === 0) {
//       this.isPhoneNumberValid = true;
//     } else {
//       this.isPhoneNumberValid = phoneNumberRegex.test(this.account.phonenumber);
//     }
//   }

//   checkMail() {
//     const mailRegex = /\S+@\S+\.\S+/;
//     if (this.account.Mail.trim().length === 0) {
//       this.isValidEmail = true;
//     } else {
//       this.isValidEmail = mailRegex.test(this.account.Mail);
//     }
//   }

//   postAccount() {
//     if (!this.isPhoneNumberValid) {
//       alert('Vui lòng nhập đúng số điện thoại!');
//       return;
//     } else if (!this.isValidEmail) {
//       alert('Vui lòng nhập đúng email!');
//       return;
//     } else if (!this.account.phonenumber || !this.account.Name || !this.account.password) {
//       alert('Vui lòng nhập đủ thông tin bắt buộc');
//       return;
//     } else {
//       this._service.postAccount(this.account).subscribe({
//         next: (data) => {
//           this.account = data;
//           this.router.navigate(['/login']);
//           alert('Đăng ký thành công');
//         },
//         error: (err) => {
//           this.errMessage = err;
//   console.error('Đăng ký không thành công:', err);
//   alert('Đăng ký không thành công');
//         },
//       });
//     }
//   }
  

//   navigateToLogin(): void {
//     this.router.navigate(['/login']);
//   }
// }

// import { Component, ViewChild } from '@angular/core';
// import { AccountCustomer } from '../Interface/AccountCustomer';
// import { AccountcustomerService } from '../Service/accountcustomer.service';
// import { Router } from '@angular/router';


// @Component({
//   selector: 'app-sign-up',
//   templateUrl: './sign-up.component.html',
//   styleUrls: ['./sign-up.component.css']
// })

export class SignUpComponent {
  account = new AccountCustomer();
  errMessage: string = '';
  constructor(
    private _service: AccountcustomerService,
    private router: Router,
    private accountService: AccountcustomerService,
    
  ) {}
  public setAccount(a: AccountCustomer) {
    this.account = a;
  }

  isPhoneNumberValid: boolean = true;
  phoneNumberExist = true;
  phoneNumbers: any;

  checkPhoneNumber(): void {
    const phoneNumberRegex = /^(\+84|0)[1-9][0-9]{7,8}$/; 
    if (this.account.phonenumber.trim().length === 0) {
      this.isPhoneNumberValid = true;
    } else {
      this.isPhoneNumberValid = phoneNumberRegex.test(this.account.phonenumber);
    }
  }

  isValidEmail: boolean =true;
  checkMail(){
    const MailRegex = /\S+@\S+\.\S+/; 
    if (this.account.Mail.trim().length === 0) {
      this.isValidEmail = true;
    } else {
      this.isValidEmail = MailRegex.test(this.account.Mail);
    }
  }

  postAccount() {
    if (!this.isPhoneNumberValid) {
      alert('Vui lòng nhập đúng số điện thoại!');
      return 
    }
    else if (!this.isValidEmail) {
      alert('Vui lòng nhập đúng email!');
      return  
    }else if(this.account.phonenumber.trim().length === 0 || this.account.Name.trim().length === 0 || this.account.password.trim().length === 0){
      alert('Vui lòng nhập đủ thông tin bắt buộc')
      return 
    }
    else {
      this._service.postAccount(this.account).subscribe({
        next: (data) => {
          this.account = data;
          this.router.navigate(['/login']);
          alert('Đăng ký thành công');
        },
        error: (err) => {
          this.errMessage = err;
          alert('Đăng ký không thành công');
        },
      });
    }
    

  }

  // confirmPassword: string= '';
    
  //   @ViewChild('passwordInput') passwordInput: any;

  //   onChecked() {
  //     const passwordInput = this.passwordInput.nativeElement;

  //     if(this.account.password.trim().length === 0){
  //       this.passwordInput.value = true;
  //       return    
  //     }
  //     else{
  //       if (passwordInput.value.length < 6) {
  //         alert('Mật khẩu phải từ 6 kí tự trở lên');
  //       }
  //     }
  
  //   }

    navigateToLogin(): void {
          this.router.navigate(['/login']);
        }

}