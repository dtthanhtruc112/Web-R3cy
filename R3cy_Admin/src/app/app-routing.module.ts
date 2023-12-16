import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCreateBlogComponent } from './admin-create-blog/admin-create-blog.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { AdminTongquanComponent } from './admin-tongquan/admin-tongquan.component';

const routes: Routes = [  
{ path: 'createblog', component: AdminCreateBlogComponent},
{ path: 'tongquan', component: AdminTongquanComponent},
{ path: 'sidebar', component: AdminSidebarComponent},
{ path: 'donhang', component: AdminTongquanComponent},
{ path: '', redirectTo: '/tongquan', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
