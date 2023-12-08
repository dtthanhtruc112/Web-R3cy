import { Component, OnInit } from '@angular/core';

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
