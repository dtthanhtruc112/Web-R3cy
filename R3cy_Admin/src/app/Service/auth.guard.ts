import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {
    }

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean> {
        if (this.authService.isLoggedIn()) {
            // Nếu đã đăng nhập, chuyển hướng đến trang Dashboard nếu truy cập trang đăng nhập
            if (state.url === '/login') {
                setTimeout(() => {
                    this.router.navigate(['/tongquan']);
                }, 0);
            }
        } else {
            // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
            setTimeout(() => {
                this.router.navigate(['/login']);
            }, 0);
        }
        return true;
    }
}