import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminCreateBlogComponent } from './admin-create-blog/admin-create-blog.component';
import { AdminDonhangComponent } from './admin-donhang/admin-donhang.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { AdminTongquanComponent } from './admin-tongquan/admin-tongquan.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminCustomersComponent } from './admin-customers/admin-customers.component';
import { ManageBlogComponent } from './manage-blog/manage-blog.component';
import { AdminSanphamComponent } from './admin-sanpham/admin-sanpham.component';
import { AdminMagiamgiaComponent } from './admin-magiamgia/admin-magiamgia.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminCreateBlogComponent,
    AdminDonhangComponent,
    AdminSidebarComponent,
    AdminTongquanComponent,
    AdminCustomersComponent,
    ManageBlogComponent,
    AdminSanphamComponent,
    AdminMagiamgiaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,    
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
