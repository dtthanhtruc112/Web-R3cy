import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SafeHtmlPipe } from './safeHtml.pipe';


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
import { AdminCustomProductComponent } from './admin-custom-product/admin-custom-product.component';
import { AdminLoginComponent } from './login/login.component';
import { AdminAccountComponent } from './admin-account/admin-account.component';

import { AuthGuard } from './Service/auth.guard';
import { AuthService } from './Service/auth.service';
import { AdminSanphamchitietComponent } from './admin-sanphamchitiet/admin-sanphamchitiet.component';
import { AdminCreateMggComponent } from './admin-create-mgg/admin-create-mgg.component';
import { AdminCreateSpComponent } from './admin-create-sp/admin-create-sp.component';
import { AdminChitietmggComponent } from './admin-chitietmgg/admin-chitietmgg.component';
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
    AdminCustomProductComponent,
    AdminLoginComponent,
    AdminAccountComponent,
    SafeHtmlPipe,
    AdminSanphamchitietComponent,
    AdminCreateMggComponent,
    AdminCreateSpComponent,
    AdminChitietmggComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,    
    HttpClientModule,
    AngularEditorModule,
  ],
  providers: [AuthGuard, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
