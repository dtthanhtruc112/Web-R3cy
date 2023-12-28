import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCreateBlogComponent } from './admin-create-blog/admin-create-blog.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { AdminTongquanComponent } from './admin-tongquan/admin-tongquan.component';
import { AdminDonhangComponent } from './admin-donhang/admin-donhang.component';
import { AdminCustomersComponent } from './admin-customers/admin-customers.component';
import { ManageBlogComponent } from './manage-blog/manage-blog.component';
import { AdminSanphamComponent } from './admin-sanpham/admin-sanpham.component';
import { AdminMagiamgiaComponent } from './admin-magiamgia/admin-magiamgia.component';
import { AdminCustomProductComponent } from './admin-custom-product/admin-custom-product.component';
import { AdminLoginComponent } from './login/login.component';
import { AdminAccountComponent } from './admin-account/admin-account.component';

import { AuthGuard } from './Service/auth.guard';

const routes: Routes = [  
{ path: '', redirectTo: '/tongquan', pathMatch: 'full' },
{ path: 'tongquan', component: AdminTongquanComponent, canActivate: [AuthGuard]},
{ path: 'login', component: AdminLoginComponent, canActivate: [AuthGuard]},
{ path: 'createblog', component: AdminCreateBlogComponent, canActivate: [AuthGuard]},
{ path: 'sidebar', component: AdminSidebarComponent},
{ path: 'donhang', component: AdminDonhangComponent, canActivate: [AuthGuard]},
{ path: 'donhang/:id', component: AdminDonhangComponent, canActivate: [AuthGuard]},
{ path: 'customers', component: AdminCustomersComponent, canActivate: [AuthGuard]},
{ path: 'blog', component: ManageBlogComponent, canActivate: [AuthGuard]},
{ path: 'sanpham', component: AdminSanphamComponent, canActivate: [AuthGuard]},
{ path: 'magiamgia', component: AdminMagiamgiaComponent, canActivate: [AuthGuard]},
{ path: 'customproduct', component: AdminCustomProductComponent, canActivate: [AuthGuard]},
{ path: 'adminaccount', component: AdminAccountComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const RoutingComponent= [
  AdminCreateBlogComponent,
  AdminTongquanComponent,
  AdminSidebarComponent,
  AdminDonhangComponent,
  AdminCustomersComponent,
  AdminCustomersComponent,
  ManageBlogComponent,
  AdminSanphamComponent,
  AdminCustomProductComponent,
  AdminMagiamgiaComponent,
  AdminLoginComponent,
  AdminAccountComponent
]
