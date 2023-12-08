import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-chinhsach',
  templateUrl: './chinhsach.component.html',
  styleUrl: './chinhsach.component.css'
})
export class ChinhsachComponent {
  selectedContent: string | null = 'chinh-sach-ban-hang';

  showContent(contentId: string): void {
    this.selectedContent = contentId;
  }

  // showSidebar = true;
  // isSmallScreen = false;

  // @HostListener('window:resize', ['$event'])
  // onResize(event: Event): void {
  //   this.checkScreenSize();
  // }

  // checkScreenSize(): void {
  //   this.isSmallScreen = window.innerWidth <= 480;

  //   // Nếu màn hình nhỏ, ẩn sidebar
  //   if (this.isSmallScreen) {
  //     this.showSidebar = false;
  //   } else {
  //     this.showSidebar = true;
  //   }
  // }

  // toggleSidebar(): void {
  //   if (this.isSmallScreen) {
  //     // Nếu màn hình nhỏ, chuyển đổi trạng thái hiển thị của sidebar
  //     this.showSidebar = !this.showSidebar;
  //   }
  // }
}
