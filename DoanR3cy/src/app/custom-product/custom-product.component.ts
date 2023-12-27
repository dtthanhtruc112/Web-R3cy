import { Component } from '@angular/core';
import { CustomProductService } from '../Service/customproduct.service';
import { CustomProduct } from '../Interface/CustomProduct';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-product',
  templateUrl: './custom-product.component.html',
  styleUrls: ['./custom-product.component.css']
})
export class CustomProductComponent {
  custom: CustomProduct = new CustomProduct();
  isValidEmail: boolean = true;
  isPhoneNumberValid: boolean = true;

  constructor(
    private customProductService: CustomProductService,
    private router: Router
  ) { }

  checkMail() {
    const MailRegex = /\S+@\S+\.\S+/;
    if (this.custom.Mail.trim().length === 0) {
      this.isValidEmail = true;
    } else {
      this.isValidEmail = MailRegex.test(this.custom.Mail);
    }
  }

  checkPhoneNumber() {
    const phoneNumberRegex = /^(\+84|0)[1-9][0-9]{7,8}$/;
    if (this.custom.phonenumber.trim().length === 0) {
      this.isPhoneNumberValid = true;
    } else {
      this.isPhoneNumberValid = phoneNumberRegex.test(this.custom.phonenumber);
    }
  }

  // onFileSelected(event: any): void {
  //   const file = event.target.files[0];
  //   this.custom.pfile = file;
  // }

  public setFashion(f: CustomProduct) {
    this.custom = f
  }
  onFileSelected(event: any, custom: CustomProduct) {
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      custom.pfile = reader.result!.toString()
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  postCustom() {
    if (this.isValidEmail && this.isPhoneNumberValid) {
      this.customProductService.postCustom(this.custom).subscribe(
        (response) => {
          console.log('Data saved successfully:', response);
          alert('Gửi yêu cầu custom thành công. R3cy sẽ liên hệ với bạn trong thời gian sớm nhất.');
          this.router.navigate(['/custom-product']);
          // Reload trang chỉ khi dữ liệu được lưu thành công
          location.reload();
        },
        (error) => {
          console.error('Error saving data:', error);
          alert('Có lỗi xảy ra khi lưu dữ liệu.');
        }
      );
    } else {
      alert('Vui lòng nhập thông tin hợp lệ và chọn một file.');
    }
  }
}

