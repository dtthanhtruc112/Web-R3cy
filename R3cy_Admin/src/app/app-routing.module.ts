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

const routes: Routes = [  
{ path: 'createblog', component: AdminCreateBlogComponent},
{ path: 'tongquan', component: AdminTongquanComponent},
{ path: 'sidebar', component: AdminSidebarComponent},
{ path: 'donhang', component: AdminDonhangComponent},
{ path: 'donhang/:id', component: AdminDonhangComponent},
{ path: 'customer', component: AdminCustomersComponent},
{ path: 'blog', component: ManageBlogComponent},
{ path: 'sanpham', component: AdminSanphamComponent},
{ path: 'magiamgia', component: AdminMagiamgiaComponent},
{ path: '', redirectTo: '/tongquan', pathMatch: 'full' }
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
  ManageBlogComponent,
  AdminSanphamComponent,
  AdminMagiamgiaComponent
]
