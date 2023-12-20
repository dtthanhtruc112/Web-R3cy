import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-chinhsach',
  templateUrl: './chinhsach.component.html',
  styleUrl: './chinhsach.component.css'
})
export class ChinhsachComponent implements OnInit {
  selectedContent: string | null = 'chinh-sach-ban-hang';

  showContent(contentId: string): void {
    this.selectedContent = contentId;
  }

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.selectedContent = params['id'] || 'chinh-sach-ban-hang'; // Set a default value if 'id' is not present
    });
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
