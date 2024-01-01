import { Component, OnInit, ElementRef, NgZone, Renderer2 } from '@angular/core';
import { AuthService } from '../Service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css'] // Chú ý ở đây
})
export class AdminSidebarComponent implements OnInit {
  isLoggedIn = false;
    currentUser: any;
  [x: string]: any;

  constructor(private renderer: Renderer2, public AuthService: AuthService,  private router: Router,) {
    this.isLoggedIn = this.AuthService.isLoggedIn();
    this.currentUser = this.AuthService.getCurrentUser();
  }
  Name:any
  ngOnInit(): void {
    document.addEventListener('DOMContentLoaded', () => {
      const sidebar = document.getElementById('sidebar');
      const toggleIcon = document.getElementById('toggle-icon');
      const containerFunc = document.getElementById('containerFunc');

      if (toggleIcon && sidebar && containerFunc) {
        this.renderer.listen(toggleIcon, 'click', () => {
          sidebar.classList.toggle('active');
          containerFunc.classList.toggle('active');
        });
      }

      const h4Elements = document.querySelectorAll('#sidebar .menuActive');

      h4Elements.forEach((h4Element) => {
        h4Element.addEventListener('click', () => {
          h4Element.classList.toggle('active');
        });
      });
    });

    const user = JSON.parse(sessionStorage.getItem('CurrentUser')!);
      if (user) {
        this.Name = user.Name;
    }

  }

  logOut() {
    try {
      const confirmed = confirm('Bạn có muốn đăng xuất không?');
      if (confirmed) {
        sessionStorage.removeItem('CurrentUser');
        this.router.navigate(['/login']);
        // window.location.reload(); // Xem xét việc sử dụng định tuyến thay vì tải lại
      }
    } catch (error) {
      console.error('Lỗi trong quá trình đăng xuất:', error);
    }
  }
}