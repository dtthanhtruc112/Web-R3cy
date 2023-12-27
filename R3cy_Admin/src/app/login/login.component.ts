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
  Mail: string= '';
  password: string= '';
  isMailValid: boolean = true;

  constructor(
    private authService: AuthService,
    private router:Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    ) {}

  checkMail(): void {
    const MailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Kiểm tra chuỗi đã nhập là địa chỉ email hợp lệ không?
    this.isMailValid = MailRegex.test(this.Mail);
  }

  ngOnInit(){
          // Nếu cookie "email" và "password" đã tồn tại thì sử dụng lại thông tin đăng nhập
          const Mail = this.authService.getCookie('Mail');
          const password = this.authService.getCookie('password');
          if (Mail && password) {
            this.Mail = Mail;
            this.password = password;
          }
  }

  onSubmit() {
    if(!this.isMailValid){
      alert('Vui lòng nhập đúng email!');
      return false
    }
    else{
      this.authService.login(this.Mail, this.password).subscribe(
        (user) => {
          // Kiểm tra vai trò của người dùng
          if (user.role === 'admin') {
            // Đăng nhập thành công, chuyển hướng người dùng đến trang chính
            this.authService.setCurrentUser(user);
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
