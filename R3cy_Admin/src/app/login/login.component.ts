// // login.component.ts

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class AdminLoginComponent implements OnInit{
  phonenumber: string= '';
  password: string= '';
  rememberMe: boolean =false;

  constructor(
    private authService: AuthService,
    private router:Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    ) {}

  isPhoneNumberValid: boolean = true;

  checkPhoneNumber(): void {
    const phoneNumberRegex = /^(\+84|0)[1-9][0-9]{7,8}$/; //kiểm tra chuỗi đã nhập là số điện thoại hợp lệ không?
    this.isPhoneNumberValid = phoneNumberRegex.test(this.phonenumber);
  }

  ngOnInit(){
          // Nếu cookie "phonenumber" và "password" đã tồn tại thì sử dụng lại thông tin đăng nhập
          const phonenumber = this.authService.getCookie('phonenumber');
          const password = this.authService.getCookie('password');
          if (phonenumber && password) {
            this.phonenumber = phonenumber;
            this.password = password;
          }
  }

  onSubmit() {
    if(!this.isPhoneNumberValid){
      alert('Vui lòng nhập đúng số điện thoại!');
      return false
    }
    else{
      this.authService.login(this.phonenumber, this.password).subscribe(
        (user) => {
          // Kiểm tra vai trò của người dùng
          if (user && user.user.role === 'admin') {
            // Đăng nhập thành công, chuyển hướng người dùng đến trang chính
            this.authService.setCurrentUser(user);
            // Lưu cookie nếu checkbox "Remember me" được chọn
            alert("Đăng nhập thành công!")
            this.router.navigate(['/tongquan'], { relativeTo: this.route });
          } else {
            // Người dùng không có vai trò "admin", có thể thông báo hoặc xử lý khác
            alert('Bạn không có quyền đăng nhập!');
          }
        },
        (error) => {
          // Hiển thị thông báo lỗi
          alert('Đăng nhập không thành công');
        }
      );
      return false
    }
  }
}
