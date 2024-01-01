import { Component, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'R3cy_Admin';
  // constructor() {}

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

  isLoginPage: boolean = false;

  constructor(private router: Router, private renderer: Renderer2) {
    // Subscribe to router events to detect changes in the route
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is 'login'
        this.isLoginPage = this.router.url === '/login';
      }
    });
  }
}
