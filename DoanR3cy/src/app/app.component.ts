import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


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

  constructor(private router: Router) {}

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
