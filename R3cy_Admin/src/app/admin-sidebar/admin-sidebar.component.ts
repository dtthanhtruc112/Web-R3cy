import { Component, OnInit, ElementRef, NgZone, Renderer2 } from '@angular/core';
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css'] // Chú ý ở đây
})
export class AdminSidebarComponent implements OnInit {

  constructor(private renderer: Renderer2, public AuthService: AuthService) {}

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
  }
}