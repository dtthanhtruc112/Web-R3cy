import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './Service/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  title = 'DoanR3cy';


  mobileMenu: HTMLElement | null = null;
  navMenu: HTMLElement | null = null;

  ngOnInit() {

    document.addEventListener('DOMContentLoaded', () => {
      const h4Elements = document.querySelectorAll('footer h4');

      h4Elements.forEach((h4Element) => {
        h4Element.addEventListener('click', () => {
          h4Element.classList.toggle('active');
        });
      });
    });
    
    this.mobileMenu = document.getElementById("mobile-menu");
    this.navMenu = document.getElementById("nav");

    if (this.mobileMenu && this.navMenu) {
      this.mobileMenu.addEventListener("click", () => {
        if (this.mobileMenu?.classList && this.navMenu?.classList) {
          this.mobileMenu.classList.toggle("active");
          this.navMenu.classList.toggle("active");
        }
      });
    }
  }

  userLink(): string[] {
    // Lấy giá trị userid từ AuthService
    const userId = this.authService.getUserId();

    // Nếu userid tồn tại, chuyển hướng tới trang tài khoản, ngược lại chuyển hướng tới trang đăng nhập
    return userId ? ['/trangtaikhoan'] : ['/login'];
  }

  cartLink(): string[] {
    // Lấy giá trị userid từ AuthService
    const userId = this.authService.getUserId();

    // Nếu userid tồn tại, chuyển hướng tới trang tài khoản, ngược lại chuyển hướng tới trang đăng nhập
    return userId ? ['/cart'] : ['/login'];
  }

  constructor(private router: Router, private authService: AuthService,) {}

  // navigateToOtherPage(destination: string): void {
  //   // Sử dụng tham số để xác định trang đích cần chuyển hướng
  //   this.router.navigate([`/${destination}`]);
  // }

  // navigateToForgotPass(): void {
  //   // Chuyển hướng đến trang forgot-pass khi người dùng bấm "Quên mật khẩu?"
  //   this.router.navigate(['/QnA']);
  // }

  // isSearchVisible: boolean = false;
  // searchTerm: string = '';

  // toggleSearchInput() {
  //   this.isSearchVisible = !this.isSearchVisible;
  // }

  // performSearch() {
  //   // Thực hiện xử lý tìm kiếm, ví dụ: gửi request đến server, lọc dữ liệu, ...
  //   console.log('Đang tìm kiếm: ', this.searchTerm);
  //   // Đóng ô tìm kiếm sau khi thực hiện tìm kiếm
  //   this.isSearchVisible = false;
  // }
  
}
